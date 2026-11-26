import "server-only";
import { db, type NewInquiry } from "@/lib/db";

/**
 * Hands the form submissions to the Bitumad ERP, where they wait in "Demandes du site" until someone
 * files them on a fiche. Optional: without ERP_INBOUND_URL / ERP_INBOUND_SECRET (local, preview) nothing
 * is sent, and nothing is marked as sent. Never throws: the email and the admin copy already carry the
 * request.
 *
 * Each stored request keeps `erp_synced_at` null until the ERP confirms it. One the ERP couldn't take
 * (down, cold start timing out...) is sent again by syncPendingToErp, which runs after forms,
 * when the admin opens, and once a day (vercel.json). The ERP stores a
 * request once per `externalId`, so sending it twice is harmless.
 */

/** Only the last week is retried: older requests are in the admin and the mailbox anyway. */
const RETRY_WINDOW_DAYS = 7;
/** A request the ERP keeps refusing (invalid data) stops being sent after this many tries. */
const MAX_ATTEMPTS = 20;

type Outcome = "ok" | "failed";

function erpConfig() {
  const url = process.env.ERP_INBOUND_URL;
  const secret = process.env.ERP_INBOUND_SECRET;
  return url && secret ? { url, secret } : null;
}

async function postToErp(externalId: string, inquiry: NewInquiry, receivedAt: Date): Promise<Outcome> {
  const config = erpConfig();
  if (!config) return "failed";
  try {
    const res = await fetch(config.url, {
      method: "POST",
      headers: { authorization: `Bearer ${config.secret}`, "content-type": "application/json" },
      body: JSON.stringify({
        externalId,
        kind: inquiry.kind,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || null,
        organisation: inquiry.organisation || null,
        subject: inquiry.subject || null,
        message: inquiry.message,
        details: inquiry.details,
        receivedAt: receivedAt.toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) return "ok";
    console.error(`forwardToErp: ERP answered ${res.status} for ${externalId}`);
  } catch (error) {
    console.error(`forwardToErp failed for ${externalId}:`, error);
  }
  return "failed";
}

const externalIdOf = (id: string) => `inquiry-${id}`;

async function recordOutcome(id: string, outcome: Outcome) {
  const sql = db();
  if (!sql) return;
  try {
    if (outcome === "ok") await sql`UPDATE inquiries SET erp_synced_at = now() WHERE id = ${id}`;
    else await sql`UPDATE inquiries SET erp_sync_attempts = erp_sync_attempts + 1 WHERE id = ${id}`;
  } catch (error) {
    console.error("forwardToErp: could not record the outcome:", error);
  }
}

/** Sends one new request. `id` is its row here (null when it couldn't be stored: then it is sent once, untracked). */
export async function forwardToErp(id: string | null, inquiry: NewInquiry, receivedAt: Date) {
  if (!erpConfig()) return;
  if (id === null) {
    await postToErp(`uuid-${crypto.randomUUID()}`, inquiry, receivedAt);
    return;
  }
  await recordOutcome(id, await postToErp(externalIdOf(id), inquiry, receivedAt));
}

type PendingRow = {
  id: string;
  created_at: Date;
  kind: NewInquiry["kind"];
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  subject: string | null;
  message: string;
  details: Record<string, string>;
};

/**
 * Sends again the recent requests the ERP hasn't confirmed, oldest first. Cheap when there are none (a
 * partial index), so it can run often. Requests younger than a minute are left to their own first send.
 * Returns how many got through.
 */
export async function syncPendingToErp(limit = 20): Promise<number> {
  const sql = db();
  if (!sql || !erpConfig()) return 0;
  let rows: PendingRow[];
  try {
    rows = (await sql`SELECT id, created_at, kind, name, email, phone, organisation, subject, message, details
      FROM inquiries
      WHERE erp_synced_at IS NULL
        AND erp_sync_attempts < ${MAX_ATTEMPTS}
        AND created_at > now() - make_interval(days => ${RETRY_WINDOW_DAYS})
        AND created_at < now() - interval '1 minute'
      ORDER BY created_at
      LIMIT ${limit}`) as PendingRow[];
  } catch (error) {
    console.error("syncPendingToErp failed:", error);
    return 0;
  }

  let sent = 0;
  for (const row of rows) {
    const id = String(row.id);
    const outcome = await postToErp(externalIdOf(id), row, new Date(row.created_at));
    await recordOutcome(id, outcome);
    if (outcome === "ok") sent++;
    // The ERP is down: no point hammering it with the rest of the batch now.
    else break;
  }
  return sent;
}

/** Requests of the retry window not yet confirmed by the ERP, for the admin's warning. 0 when the ERP isn't set up. */
export async function countPendingErp(): Promise<number> {
  const sql = db();
  if (!sql || !erpConfig()) return 0;
  try {
    const [row] = await sql`SELECT count(*) AS n FROM inquiries
      WHERE erp_synced_at IS NULL AND created_at > now() - make_interval(days => ${RETRY_WINDOW_DAYS})
        AND created_at < now() - interval '1 minute'`;
    return Number(row.n);
  } catch {
    return 0;
  }
}
