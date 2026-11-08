import { randomBytes } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import { hashPassword, MIN_PASSWORD_LENGTH } from "../lib/password.ts";

// Creates an admin account, or resets the password of an existing one (forgotten password).
// Usage: npm run admin:create -- <email> "<Nom>" [mot de passe]   (generated when omitted)
const [email, name, given] = process.argv.slice(2);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}
if (!email || !name) {
  console.error('Usage: npm run admin:create -- <email> "<Nom>" [mot de passe]');
  process.exit(1);
}
if (given && given.length < MIN_PASSWORD_LENGTH) {
  console.error(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  process.exit(1);
}

const password = given || randomBytes(12).toString("base64url");
const sql = neon(process.env.DATABASE_URL);
const [row] = await sql`INSERT INTO admin_users (email, name, password_hash)
  VALUES (${email.trim().toLowerCase()}, ${name}, ${await hashPassword(password)})
  ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name
  RETURNING (xmax = 0) AS created`;

console.log(`${row.created ? "Compte créé" : "Mot de passe réinitialisé"} : ${email}`);
if (!given) console.log(`Mot de passe : ${password}`);
