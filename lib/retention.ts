import "server-only";

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
