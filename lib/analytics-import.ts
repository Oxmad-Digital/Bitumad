import "server-only";
import { analyticsBucket, analyticsDay, type AnalyticsEvent } from "./analytics-buffer";
import { rollupPageViews } from "./analytics-queries";
import { db } from "./db";
import { RETENTION } from "./retention";

type View = Extract<AnalyticsEvent, { type: "view" }> & { day: string; duration: number };
type Vital = Extract<AnalyticsEvent, { type: "vital" }> & { day: string };
type Duration = Extract<AnalyticsEvent, { type: "duration" }>;

function prepareDay(day: string, events: AnalyticsEvent[]) {
  const views: View[] = [];
  const vitals: Vital[] = [];
  const byId = new Map<string, View>();
  const latest = new Map<string, View>();
  const durations: Duration[] = [];
  const legacyDurations: (Duration & { day: string })[] = [];

  events.sort((a, b) => a.at.localeCompare(b.at));
  for (const event of events) {
    if (event.type === "vital") {
      vitals.push({ ...event, day });
      continue;
    }
    const page = `${event.visitor}:${event.path}`;
    if (event.type === "view") {
      const view = { ...event, day, duration: 0 };
      views.push(view);
      latest.set(page, view);
      if (event.viewId) byId.set(`${page}:${event.viewId}`, view);
    } else if (event.viewId) {
      // A duration batch may arrive before its view batch.
      durations.push(event);
    } else {
      const view = latest.get(page);
      if (view) view.duration = Math.min(view.duration + event.seconds, 1_800);
      else legacyDurations.push({ ...event, day });
    }
  }
  for (const { visitor, path, viewId, seconds } of durations) {
    const view = byId.get(`${visitor}:${path}:${viewId}`);
    if (view) view.duration = Math.min(view.duration + seconds, 1_800);
  }
  return { views, vitals, legacyDurations };
}

export async function importAnalytics() {
  const bucket = analyticsBucket();
  const sql = db();
  if (!bucket || !sql) throw new Error("Analytics R2 or Neon configuration is missing");

  // Leave a minute for in-flight R2 writes, including when the cron is triggered manually at midnight.
  const today = analyticsDay(new Date(Date.now() - 60_000));
  const keys = await bucket.listClosed(today);
  const days = new Map<string, AnalyticsEvent[]>();
  for (let offset = 0; offset < keys.length; offset += 32) {
    const chunk = keys.slice(offset, offset + 32);
    const batches = await Promise.all(chunk.map((key) => bucket.readEvents(key)));
    for (const [index, events] of batches.entries()) {
      if (!events.length) continue;
      const day = bucket.dayOf(chunk[index]);
      const pending = days.get(day);
      if (pending) pending.push(...events);
      else days.set(day, events);
    }
  }
  const views: View[] = [];
  const vitals: Vital[] = [];
  const legacyDurations: (Duration & { day: string })[] = [];
  for (const [day, events] of days) {
    const rows = prepareDay(day, events);
    for (const view of rows.views) views.push(view);
    for (const vital of rows.vitals) vitals.push(vital);
    for (const duration of rows.legacyDurations) legacyDurations.push(duration);
  }

  // The day marker, inserts, rollup and purges commit together. A failed R2 cleanup can
  // be retried without importing a day twice. No objects are removed before the commit.
  const [, , , , months] = await sql.transaction([
    sql`WITH accepted AS (
        INSERT INTO analytics_import_days (day)
        SELECT day FROM unnest(${[...days.keys()].sort()}::date[]) AS days(day)
        ON CONFLICT DO NOTHING RETURNING day
      ), legacy_totals AS (
        SELECT page.id, sum(d.seconds) AS seconds
        FROM jsonb_to_recordset(${JSON.stringify(legacyDurations)}::jsonb) AS d(
          day date, at timestamptz, visitor text, path text, seconds integer
        ) JOIN accepted USING (day)
        CROSS JOIN LATERAL (
          SELECT id FROM page_views
          WHERE visitor = d.visitor AND path = d.path AND created_at <= d.at
          ORDER BY id DESC LIMIT 1
        ) page
        GROUP BY page.id
      ), updated_legacy AS (
        UPDATE page_views p SET duration = least(coalesce(p.duration, 0) + t.seconds, 1800)
        FROM legacy_totals t WHERE p.id = t.id
      ), imported_views AS (
        INSERT INTO page_views (created_at, path, referrer, utm_source, visitor, country, device, browser, duration)
        SELECT v.at, v.path, v.referrer, v.utm, v.visitor, v.country, v.device, v.browser, v.duration
        FROM jsonb_to_recordset(${JSON.stringify(views)}::jsonb) AS v(
          day date, at timestamptz, path text, referrer text, utm text, visitor text,
          country text, device text, browser text, duration integer
        ) JOIN accepted USING (day)
      )
      INSERT INTO web_vitals (metric_id, created_at, path, name, value, rating, navigation_type, device)
      SELECT DISTINCT ON (v.id)
        v.id, min(v.at) OVER (PARTITION BY v.id), v.path, v.name, v.value, v.rating, v.navigation, v.device
      FROM jsonb_to_recordset(${JSON.stringify(vitals)}::jsonb) AS v(
        day date, at timestamptz, id text, path text, name text, value double precision,
        rating text, navigation text, device text
      ) JOIN accepted USING (day)
      ORDER BY v.id, v.at DESC
      ON CONFLICT (metric_id) DO UPDATE SET value = EXCLUDED.value, rating = EXCLUDED.rating`,
    rollupPageViews(sql, today),
    sql`DELETE FROM inquiries WHERE created_at < now() - make_interval(years => ${RETENTION.inquiryYears})`,
    sql`DELETE FROM web_vitals WHERE created_at < now() - make_interval(months => ${RETENTION.vitalsMonths})`,
    sql`SELECT to_char(day, 'YYYY-MM') AS month, sum(visitors) AS visits
      FROM visitors_daily WHERE day < ${today}::date GROUP BY 1`,
  ]);

  await bucket.publishUsage(Object.fromEntries(months.map(({ month, visits }) => [String(month), Number(visits)])));
  await bucket.remove(keys);
  return { batches: keys.length, days: days.size };
}
