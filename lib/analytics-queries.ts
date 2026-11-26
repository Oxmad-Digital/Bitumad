import "server-only";
import type { db } from "./db";
import { TIMEZONE } from "./site";

type Sql = NonNullable<ReturnType<typeof db>>;

/** Starts a session after 30 minutes of inactivity and skips views without engagement instrumentation. */
export function sessionTotals(sql: Sql, rows: ReturnType<Sql>) {
  return sql`(SELECT day, count(*) AS sessions, sum(seconds) AS duration FROM (
      SELECT day, visitor, session, sum(duration) AS seconds FROM (
        SELECT day, visitor, duration, sum(starts) OVER (PARTITION BY day, visitor ORDER BY created_at) AS session FROM (
          SELECT day, visitor, created_at, duration,
            CASE WHEN created_at - lag(created_at + make_interval(secs => coalesce(duration, 0)))
              OVER (PARTITION BY day, visitor ORDER BY created_at) <= interval '30 minutes' THEN 0 ELSE 1 END AS starts
          FROM ${rows} r
        ) flagged
      ) numbered
      GROUP BY 1, 2, 3 HAVING count(duration) > 0
    ) sessions GROUP BY day)`;
}

/** Moves closed days to the daily tables. The outer transaction also covers imported R2 records. */
export function rollupPageViews(sql: Sql, today: string) {
  return sql`WITH moved AS (
      DELETE FROM page_views
      WHERE created_at < ${today}::date::timestamp AT TIME ZONE ${TIMEZONE}
      RETURNING (created_at AT TIME ZONE ${TIMEZONE})::date AS day, path, coalesce(utm_source, referrer, '') AS source,
        visitor, coalesce(country, '') AS country, coalesce(device, '') AS device, coalesce(browser, '') AS browser,
        created_at, duration
    ), pages AS (
      INSERT INTO page_views_daily (day, path, source, views)
      SELECT day, path, source, count(*) FROM moved GROUP BY 1, 2, 3
      ON CONFLICT (day, path, source) DO UPDATE SET views = page_views_daily.views + EXCLUDED.views
    ), visitors AS (
      INSERT INTO visitors_daily (day, country, device, browser, visitors)
      SELECT day, country, device, browser, count(DISTINCT visitor) FROM moved GROUP BY 1, 2, 3, 4
      ON CONFLICT (day, country, device, browser) DO UPDATE SET visitors = visitors_daily.visitors + EXCLUDED.visitors
    )
    INSERT INTO sessions_daily (day, sessions, duration)
    SELECT day, sessions, duration FROM ${sessionTotals(sql, sql`moved`)} s
    ON CONFLICT (day) DO UPDATE SET sessions = sessions_daily.sessions + EXCLUDED.sessions,
      duration = sessions_daily.duration + EXCLUDED.duration`;
}
