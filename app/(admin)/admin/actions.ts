"use server";

import { revalidatePath, updateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authenticate, endSession, normalizeEmail, requireAdmin, startSession, type AdminRow } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { hashPassword, MIN_PASSWORD_LENGTH, verifyPassword } from "@/lib/password";
import { clientIp, rateLimit, TOO_MANY } from "@/lib/rate-limit";
import { EMAIL_RE } from "@/lib/site";
import { MESSAGE_STATUSES, QUOTE_STATUSES } from "@/lib/admin-stats";
import { MAINTENANCE_TAG } from "@/lib/maintenance";


type FormState = { error?: string; ok?: string };

/** The `id` of a form, or null when it isn't a row id (forged form). */
function rowId(formData: FormData) {
  const id = String(formData.get("id"));
  return /^\d+$/.test(id) ? id : null;
}

export async function login(_state: FormState, formData: FormData): Promise<FormState> {
  const email = normalizeEmail(String(formData.get("email") || ""));
  // Per address and per account: guessing one password from many addresses is capped too.
  const allowed = (await rateLimit(`login:ip:${clientIp(await headers())}`, 10, 900))
    && (await rateLimit(`login:email:${email}`, 10, 900));
  if (!allowed) return { error: TOO_MANY };

  const user = await authenticate(email, String(formData.get("password") || ""));
  if (!user) {
    // Slows down password guessing without any state to keep.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "Email ou mot de passe incorrect." };
  }
  await startSession(user);
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

function sql() {
  const client = db();
  if (!client) throw new Error("DATABASE_URL is not configured");
  return client;
}

/** Status change of a quote request or a message; only the statuses of its kind are accepted. */
export async function setInquiryStatus(formData: FormData) {
  await requireAdmin();
  const status = String(formData.get("status"));
  const id = rowId(formData);
  if (!id) return;
  const allowed: readonly string[] = formData.get("kind") === "devis" ? QUOTE_STATUSES : MESSAGE_STATUSES;
  if (!allowed.includes(status)) return;
  await sql()`UPDATE inquiries SET status = ${status}, updated_at = now()
    WHERE id = ${id} AND (kind = 'devis') = ${formData.get("kind") === "devis"}`;
  revalidatePath("/admin", "layout");
}

/** Internal follow-up note (price quoted, call made…), never shown to the requester. */
export async function saveInquiryNote(formData: FormData) {
  await requireAdmin();
  const id = rowId(formData);
  if (!id) return;
  const note = String(formData.get("note") || "").trim().slice(0, 5000);
  await sql()`UPDATE inquiries SET note = ${note || null}, updated_at = now() WHERE id = ${id}`;
  revalidatePath("/admin", "layout");
}

export async function deleteInquiry(formData: FormData) {
  await requireAdmin();
  const id = rowId(formData);
  if (!id) return;
  await sql()`DELETE FROM inquiries WHERE id = ${id}`;
  revalidatePath("/admin", "layout");
}

export async function createAdmin(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") || "").trim();
  const email = normalizeEmail(String(formData.get("email") || ""));
  const password = String(formData.get("password") || "");
  if (!name || !EMAIL_RE.test(email)) return { error: "Nom et email valides requis." };
  if (password.length < MIN_PASSWORD_LENGTH) return { error: `Mot de passe : ${MIN_PASSWORD_LENGTH} caractères minimum.` };

  const created = await sql()`INSERT INTO admin_users (email, name, password_hash)
    VALUES (${email}, ${name}, ${await hashPassword(password)}) ON CONFLICT (email) DO NOTHING RETURNING id`;
  if (created.length === 0) return { error: "Un compte existe déjà avec cet email." };
  revalidatePath("/admin/comptes");
  return { ok: `Compte créé pour ${email}.` };
}

export async function deleteAdmin(formData: FormData) {
  const admin = await requireAdmin();
  const id = rowId(formData);
  if (!id || id === admin.id) return;
  await sql()`DELETE FROM admin_users WHERE id = ${id}`;
  revalidatePath("/admin/comptes");
}

/** Turns the public maintenance screen on or off; the static site pages are re-rendered on their next visit. */
export async function setMaintenance(_state: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const enabled = formData.get("enabled") === "on";
  const message = String(formData.get("message") || "").trim().slice(0, 1000);
  await sql()`INSERT INTO site_settings (key, value, updated_at)
    VALUES ('maintenance', ${JSON.stringify({ enabled, message })}::jsonb, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`;
  updateTag(MAINTENANCE_TAG);
  revalidatePath("/", "layout");
  return { ok: enabled ? "Écran de maintenance activé." : "Site remis en ligne." };
}

export async function changePassword(_state: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const current = String(formData.get("current") || "");
  const next = String(formData.get("next") || "");
  if (next.length < MIN_PASSWORD_LENGTH) return { error: `Nouveau mot de passe : ${MIN_PASSWORD_LENGTH} caractères minimum.` };
  if (next !== String(formData.get("confirm") || "")) return { error: "Les deux mots de passe ne correspondent pas." };

  if (!(await rateLimit(`password:${admin.id}`, 5, 600))) return { error: TOO_MANY };

  const [row] = await sql()`SELECT password_hash FROM admin_users WHERE id = ${admin.id}`;
  // A stolen session alone can't lock the owner out: the current password is required.
  if (!row || !(await verifyPassword(current, row.password_hash))) return { error: "Mot de passe actuel incorrect." };

  const [updated] = await sql()`UPDATE admin_users SET password_hash = ${await hashPassword(next)}
    WHERE id = ${admin.id} RETURNING id, email, name, password_hash, session_key`;
  // Other sessions of this account are now invalid; keep this one signed in.
  await startSession(updated as AdminRow);
  return { ok: "Mot de passe modifié." };
}
