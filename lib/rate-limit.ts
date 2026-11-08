import "server-only";
import { db } from "./db";

/** Caller address: Vercel sets these headers itself, so a client can't forge them there. */
export function clientIp(headers: Headers) {
  return (headers.get("x-real-ip") || headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}

/**
 * Fixed-window counter in the database. Returns false once `key` has been hit more than `limit`
 * times in the last `windowSeconds`. Fails open (true) when the database is unavailable, so an
 * outage never blocks the forms.
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number) {
  const sql = db();
  if (!sql) return true;
  try {
    const [row] = await sql`INSERT INTO rate_limits (key, window_start, count) VALUES (${key}, now(), 1)
      ON CONFLICT (key) DO UPDATE SET
        count = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSeconds}) THEN 1 ELSE rate_limits.count + 1 END,
        window_start = CASE WHEN rate_limits.window_start < now() - make_interval(secs => ${windowSeconds}) THEN now() ELSE rate_limits.window_start END
      RETURNING count`;
    // Expired counters are swept now and then, so the table stays small.
    if (Math.random() < 0.02) await sql`DELETE FROM rate_limits WHERE window_start < now() - interval '1 day'`;
    return Number(row.count) <= limit;
  } catch (error) {
    console.error("rateLimit failed:", error);
    return true;
  }
}

export const TOO_MANY = "Trop de tentatives. Merci de réessayer dans quelques minutes.";
