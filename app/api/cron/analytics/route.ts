import { timingSafeEqual } from "node:crypto";
import { importAnalytics } from "@/lib/analytics-import";

export const maxDuration = 300;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (!secret || given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    return Response.json(await importAnalytics(), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Nightly analytics import failed:", error);
    return Response.json({ error: "Import des statistiques indisponible" }, { status: 503 });
  }
}
