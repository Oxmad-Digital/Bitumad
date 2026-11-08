import { createHash } from "node:crypto";
import { after } from "next/server";
import { db } from "@/lib/db";
import { visitorCountry } from "@/lib/geo";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { purgeExpiredData } from "@/lib/retention";
import { deriveKey } from "@/lib/keys";
import { SITE_URL, TIMEZONE } from "@/lib/site";

const BOT_RE = /bot|crawl|spider|slurp|preview|lighthouse|headless|curl|wget|python|axios|node-fetch/i;
// Never hash without a salt: without ANALYTICS_SALT, one is derived from the admin session secret.
const SALT = process.env.ANALYTICS_SALT || (process.env.ADMIN_SESSION_SECRET ? deriveKey("analytics", process.env.ADMIN_SESSION_SECRET).toString("hex") : "");
const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");

function device(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "Tablette";
  if (/mobi|iphone|android/i.test(ua)) return "Mobile";
  return "Ordinateur";
}

function browser(ua: string) {
  if (/edg\//i.test(ua)) return "Edge";
  if (/opr\/|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/chrome|crios/i.test(ua)) return "Chrome";
  if (/safari/i.test(ua)) return "Safari";
  return "Autre";
}

/** External referrer reduced to its host; internal and empty referrers are dropped. */
function referrerHost(value: unknown) {
  try {
    const host = new URL(String(value)).hostname.replace(/^www\./, "");
    return host && host !== SITE_HOST && host !== "localhost" ? host : null;
  } catch {
    return null;
  }
}

/** Cookieless page-view beacon (or, with `seconds`, the time spent on it). The visitor id is a daily salted hash: unique visitors per day, nothing more. */
export async function POST(request: Request) {
  const sql = db();
  const ua = request.headers.get("user-agent") || "";
  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 300) : "";

  if (!sql || !SALT || !path.startsWith("/") || path.startsWith("/admin") || BOT_RE.test(ua)) {
    return new Response(null, { status: 204 });
  }
  if (!(await rateLimit(`track:${clientIp(request.headers)}`, 120, 60))) return new Response(null, { status: 204 });
  // Retention purge now and then, so expired data goes even on weeks without a visit to the admin.
  if (Math.random() < 0.02) after(purgeExpiredData);

  const vital = body?.vital;
  const vitalName = typeof vital?.name === "string" ? vital.name : "";
  const vitalValue = Number(vital?.value);
  if (["LCP", "INP", "CLS"].includes(vitalName) && Number.isFinite(vitalValue) && vitalValue >= 0) {
    const id = typeof vital.id === "string" ? vital.id.slice(0, 100) : "";
    if (!id) return new Response(null, { status: 204 });
    const rating = ["good", "needs-improvement", "poor"].includes(vital.rating) ? vital.rating : null;
    const navigation = typeof vital.navigationType === "string" ? vital.navigationType.slice(0, 32) : null;
    try {
      await sql`INSERT INTO web_vitals (metric_id, path, name, value, rating, navigation_type, device)
        VALUES (${id}, ${path}, ${vitalName}, ${vitalValue}, ${rating}, ${navigation}, ${device(ua)})
        ON CONFLICT (metric_id) DO UPDATE SET value = EXCLUDED.value, rating = EXCLUDED.rating`;
    } catch (error) {
      console.error("web vital tracking failed:", error);
    }
    return new Response(null, { status: 204 });
  }

  const ip = clientIp(request.headers);
  const day = new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  const visitor = createHash("sha256")
    .update(`${SALT}|${day}|${ip}|${ua}`)
    .digest("base64url")
    .slice(0, 22);
  const utm = typeof body?.utm === "string" ? body.utm.slice(0, 100) : null;
  const seconds = Number(body?.seconds);

  try {
    if (Number.isFinite(seconds)) {
      // Engaged-time beacon: credited to this visitor's latest view of the page, capped at 30 min per view.
      if (seconds > 0) {
        await sql`UPDATE page_views SET duration = least(coalesce(duration, 0) + ${Math.round(seconds)}, 1800)
          WHERE id = (SELECT id FROM page_views WHERE visitor = ${visitor} AND path = ${path} ORDER BY id DESC LIMIT 1)`;
      }
    } else {
      await sql`INSERT INTO page_views (path, referrer, utm_source, visitor, country, device, browser, duration)
        VALUES (${path}, ${referrerHost(body?.referrer)}, ${utm || null}, ${visitor},
          ${visitorCountry(body?.tz, request.headers.get("x-vercel-ip-country"))}, ${device(ua)}, ${browser(ua)}, 0)`;
    }
  } catch (error) {
    console.error("track failed:", error);
  }
  return new Response(null, { status: 204 });
}
