import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { DUMMY_HASH, verifyPassword } from "./password";
import { deriveKey } from "./keys";

const COOKIE = "bm_admin";
const SESSION_DAYS = 7;

export type AdminUser = { id: string; email: string; name: string };
export type AdminRow = AdminUser & { password_hash: string; session_key: string };

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("ADMIN_SESSION_SECRET must be set (32+ characters)");
  return deriveKey("admin-session", value);
}

/** Binds the session to the password hash and the session key: changing the password, or signing out, ends the account's sessions. */
function sign(user: AdminRow, expires: number) {
  return createHmac("sha256", secret())
    .update(`session:${user.id}:${expires}:${user.password_hash}:${user.session_key}`)
    .digest("base64url");
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

/** Returns the account when the credentials match; unknown emails cost the same time as wrong passwords. */
export async function authenticate(email: string, password: string) {
  const sql = db();
  if (!sql) return null;
  const [user] = (await sql`SELECT id, email, name, password_hash, session_key FROM admin_users WHERE email = ${normalizeEmail(email)}`) as AdminRow[];
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !valid) return null;
  await sql`UPDATE admin_users SET last_login_at = now() WHERE id = ${user.id}`;
  return user;
}

/** Session cookie = "<user id>.<expiry ms>.<hmac>". */
export async function startSession(user: AdminRow) {
  const expires = Date.now() + SESSION_DAYS * 86_400_000;
  (await cookies()).set(COOKIE, `${user.id}.${expires}.${sign(user, expires)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(expires),
  });
}

/** Signs out for good: the session key changes, so a copied cookie stops working too. */
export async function endSession() {
  const admin = await getAdmin();
  const sql = db();
  if (admin && sql) await sql`UPDATE admin_users SET session_key = gen_random_uuid()::text WHERE id = ${admin.id}`;
  (await cookies()).delete(COOKIE);
}

/** The signed-in admin, or null. Deduplicated per request. */
export const getAdmin = cache(async (): Promise<AdminUser | null> => {
  const value = (await cookies()).get(COOKIE)?.value;
  const sql = db();
  if (!value || !sql) return null;
  const [id, expiresRaw, signature] = value.split(".");
  const expires = Number(expiresRaw);
  if (!/^\d+$/.test(id ?? "") || !signature || !(expires > Date.now())) return null;

  const [user] = (await sql`SELECT id, email, name, password_hash, session_key FROM admin_users WHERE id = ${id}`) as AdminRow[];
  if (!user || !safeEqual(signature, sign(user, expires))) return null;
  return { id: String(user.id), email: user.email, name: user.name };
});

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
