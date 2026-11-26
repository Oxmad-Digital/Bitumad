import { createHash } from "node:crypto";
import { analyticsBucket, analyticsDay, type AnalyticsEvent } from "@/lib/analytics-buffer";
import { clientIp } from "@/lib/client-ip";
import { visitorCountry } from "@/lib/geo";
import { deriveKey } from "@/lib/keys";
import { SITE_URL } from "@/lib/site";

const BOT_RE = /bot|crawl|spider|slurp|preview|lighthouse|headless|curl|wget|python|axios|node-fetch/i;
// Never hash without a salt: without ANALYTICS_SALT, one is derived from the admin session secret.
const SALT = process.env.ANALYTICS_SALT || (process.env.ADMIN_SESSION_SECRET ? deriveKey("analytics", process.env.ADMIN_SESSION_SECRET).toString("hex") : "");
const SITE_HOST = new URL(SITE_URL).hostname.replace(/^www\./, "");
const VIEW_ID_RE = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i;
const MAX_PAYLOAD_BYTES = 24 * 1024;
const MAX_EVENTS = 20;
const requestCounts = new Map<string, number>();
let currentMinute = 0;

function allowBatch(ip: string, now: number) {
  const minute = Math.floor(now / 60_000);
  if (minute !== currentMinute) {
    requestCounts.clear();
    currentMinute = minute;
  }
  const count = requestCounts.get(ip) ?? 0;
  if (count >= 120 || (count === 0 && requestCounts.size >= 10_000)) return false;
  requestCounts.set(ip, count + 1);
  return true;
}

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

function cleanString(value: string, limit: number) {
  return value.replaceAll("\0", "").slice(0, limit).toWellFormed();
}

function cleanEvent(input: unknown, now: Date, day: string, visitor: string, ua: string, ipCountry: string | null): AnalyticsEvent | null {
  if (!input || typeof input !== "object") return null;
  const body = input as Record<string, unknown>;
  const path = typeof body.path === "string" ? cleanString(body.path, 300) : "";
  if (!path.startsWith("/") || path.startsWith("/admin")) return null;

  const timestamp = typeof body.at === "number" ? body.at : NaN;
  const reportedAt = timestamp >= now.getTime() - 30_000 && timestamp <= now.getTime() ? new Date(timestamp) : now;
  const at = (analyticsDay(reportedAt) === day ? reportedAt : now).toISOString();
  if (body.vital !== undefined) {
    if (!body.vital || typeof body.vital !== "object") return null;
    const { id, name, value, rating, navigationType } = body.vital as Record<string, unknown>;
    if (typeof id !== "string" || typeof name !== "string" || !["LCP", "INP", "CLS"].includes(name)
      || typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
    const metricId = cleanString(id, 100);
    if (!metricId) return null;
    return {
      type: "vital", at, path, id: metricId, name, value, device: device(ua),
      rating: rating === "good" || rating === "needs-improvement" || rating === "poor" ? rating : null,
      navigation: typeof navigationType === "string" ? cleanString(navigationType, 32) : null,
    };
  }

  const viewId = typeof body.viewId === "string" && VIEW_ID_RE.test(body.viewId) ? body.viewId : null;
  if (body.seconds !== undefined) {
    if (typeof body.seconds !== "number" || !Number.isFinite(body.seconds) || body.seconds < 1) return null;
    return { type: "duration", at, path, visitor, viewId, seconds: Math.min(Math.round(body.seconds), 1_800) };
  }
  const country = visitorCountry(body.tz, ipCountry);
  return {
    type: "view", at, path, visitor, viewId, referrer: referrerHost(body.referrer),
    utm: typeof body.utm === "string" ? cleanString(body.utm, 100) || null : null,
    country: typeof country === "string" && /^[A-Z]{2}$/.test(country) ? country : null,
    device: device(ua), browser: browser(ua),
  };
}

/** Stores browser batches in the private R2 buffer. Also accepts beacons from already-open tabs. */
export async function POST(request: Request) {
  const ua = request.headers.get("user-agent") || "";
  const fetchSite = request.headers.get("sec-fetch-site");
  if (!SALT || BOT_RE.test(ua) || request.headers.get("sec-gpc") === "1" || request.headers.get("dnt") === "1"
    || fetchSite === "cross-site" || fetchSite === "same-site") return new Response(null, { status: 204 });

  const ip = clientIp(request.headers);
  if (!allowBatch(ip, Date.now())) return new Response(null, { status: 429 });
  if (Number(request.headers.get("content-length")) > MAX_PAYLOAD_BYTES) return new Response(null, { status: 413 });
  const raw = await request.text().catch(() => "");
  if (Buffer.byteLength(raw) > MAX_PAYLOAD_BYTES) return new Response(null, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response(null, { status: 400 });
  }
  if (Array.isArray(body) && body.length > MAX_EVENTS) return new Response(null, { status: 413 });

  const now = new Date();
  const day = analyticsDay(now);
  const visitor = createHash("sha256").update(`${SALT}|${day}|${ip}|${ua}`).digest("base64url").slice(0, 22);
  const country = request.headers.get("x-vercel-ip-country");
  const events = (Array.isArray(body) ? body : [body]).flatMap((input) => {
    const event = cleanEvent(input, now, day, visitor, ua, country);
    return event ? [event] : [];
  });
  if (!events.length) return new Response(null, { status: 204 });

  const bucket = analyticsBucket();
  if (!bucket) return new Response(null, { status: 503 });
  try {
    await bucket.write(day, events);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Analytics buffer write failed:", error);
    return new Response(null, { status: 503 });
  }
}
