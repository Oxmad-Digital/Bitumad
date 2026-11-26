import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TIMEZONE } from "@/lib/site";

export const dynamic = "force-dynamic";

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function authorized(request: Request) {
  const token = process.env.OXMAD_USAGE_TOKEN ?? "";
  if (token.length < 20) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${token}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Read by the Oxmad ERP (maintenance usage): unique visitors per day, summed over the month
 * "YYYY-MM" (Madagascar days). Totals only, no personal data. Past days come from visitors_daily
 * (a visitor has a single country / device / browser per day, so the sum is exact); days not yet
 * rolled up are counted from page_views, the same way as the admin dashboard (lib/admin-stats.ts).
 */
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!MONTH_RE.test(month)) return NextResponse.json({ error: "Paramètre month invalide (AAAA-MM)" }, { status: 400 });
  const sql = db();
  if (!sql) return NextResponse.json({ error: "Base indisponible" }, { status: 503 });

  const start = `${month}-01`;
  const [row] = await sql`
    WITH days AS (
      SELECT day, visitors FROM visitors_daily
      WHERE day >= ${start}::date AND day < ${start}::date + interval '1 month'
      UNION ALL
      SELECT (created_at AT TIME ZONE ${TIMEZONE})::date, count(DISTINCT visitor)
      FROM page_views
      WHERE created_at >= ${start}::date::timestamp AT TIME ZONE ${TIMEZONE}
        AND created_at < (${start}::date + interval '1 month') AT TIME ZONE ${TIMEZONE}
      GROUP BY 1
    )
    SELECT coalesce(sum(visitors), 0)::int AS visits FROM days`;

  return NextResponse.json({ month, visits: Number(row?.visits ?? 0) }, { headers: { "Cache-Control": "no-store" } });
}
