import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/** Neon SQL client (HTTP, one query per call). Null when DATABASE_URL is missing, so forms keep working by email alone. */
export function db() {
  if (!process.env.DATABASE_URL) return null;
  client ??= neon(process.env.DATABASE_URL);
  return client;
}

export type InquiryKind = "devis" | "message" | "partenariat";
export type InquiryStatus = "new" | "read" | "in_progress" | "quoted" | "won" | "lost" | "archived";

export type Inquiry = {
  id: string;
  created_at: Date;
  updated_at: Date;
  kind: InquiryKind;
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  subject: string | null;
  message: string;
  details: Record<string, string>;
  status: InquiryStatus;
  note: string | null;
};

export type NewInquiry = Pick<Inquiry, "kind" | "name" | "email" | "phone" | "organisation" | "subject" | "message" | "details">;

/** Stores a form submission; never throws, so a database outage doesn't block the email. */
export async function saveInquiry(i: NewInquiry) {
  const sql = db();
  if (!sql) return false;
  try {
    await sql`INSERT INTO inquiries (kind, name, email, phone, organisation, subject, message, details)
      VALUES (${i.kind}, ${i.name}, ${i.email}, ${i.phone || null}, ${i.organisation || null}, ${i.subject || null},
        ${i.message}, ${JSON.stringify(i.details)}::jsonb)`;
    return true;
  } catch (error) {
    console.error("saveInquiry failed:", error);
    return false;
  }
}
