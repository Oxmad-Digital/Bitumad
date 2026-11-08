import "server-only";
import timezones from "./timezone-countries.json";

const ZONES: Record<string, string> = timezones;

/**
 * Visitor country: the browser's time zone first (right even behind a VPN, and tells Réunion from
 * Mauritius), then Vercel's IP country header. The IP itself is never stored.
 */
export function visitorCountry(timeZone: unknown, fallback: string | null) {
  const fromZone = typeof timeZone === "string" ? ZONES[timeZone] : undefined;
  return fromZone ?? fallback;
}
