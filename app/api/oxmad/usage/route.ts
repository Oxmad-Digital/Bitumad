import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { analyticsBucket } from "@/lib/analytics-buffer";

export const dynamic = "force-dynamic";

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

function authorized(request: Request) {
  const token = process.env.OXMAD_USAGE_TOKEN ?? "";
  if (token.length < 20) return false;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${token}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/** Read by the Oxmad ERP. The nightly import publishes daily unique visitors summed by month. */
export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const month = new URL(request.url).searchParams.get("month") ?? "";
  if (!MONTH_RE.test(month)) return NextResponse.json({ error: "Paramètre month invalide (AAAA-MM)" }, { status: 400 });
  try {
    const usage = await analyticsBucket()?.readUsage();
    if (usage) return NextResponse.json({ month, visits: usage[month] ?? 0 }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Analytics usage snapshot unavailable:", error);
  }
  return NextResponse.json({ error: "Relevé des visites indisponible" }, { status: 503, headers: { "Cache-Control": "no-store" } });
}
