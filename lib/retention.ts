import "server-only";
import { db } from "./db";

/**
 * Retention periods stated in the privacy policy (app/(site)/mentions-legales). Changing one here
 * means updating the policy too.
 */
export const RETENTION = {
  /** Messages, quote and partnership requests: 3 years after they were sent (prospects). */
  inquiryYears: 3,
  /** Raw Web Vitals samples (no personal data, only kept for the performance panel). */
  vitalsMonths: 13,
} as const;

/**
 * Deletes the data whose retention period is over. Idempotent and cheap (indexed), so it can run
 * often: from the dashboard and now and then after a page-view beacon. Never throws.
 */
export async function purgeExpiredData() {
  const sql = db();
  if (!sql) return;
  try {
    await sql`DELETE FROM inquiries WHERE created_at < now() - make_interval(years => ${RETENTION.inquiryYears})`;
    await sql`DELETE FROM web_vitals WHERE created_at < now() - make_interval(months => ${RETENTION.vitalsMonths})`;
  } catch (error) {
    console.error("purgeExpiredData failed:", error);
  }
}
