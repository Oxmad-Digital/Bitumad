import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// No Next.js imports: also used by scripts/create-admin.ts.
const KEY_LENGTH = 64;
export const MIN_PASSWORD_LENGTH = 10;

function derive(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password.normalize("NFKC"), salt, KEY_LENGTH, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

/** "scrypt$<salt>$<hash>", both base64url. */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString("base64url")}$${(await derive(password, salt)).toString("base64url")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const actual = await derive(password, Buffer.from(salt, "base64url"));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** Verifies against this when the email is unknown, so response time doesn't reveal which accounts exist. */
export const DUMMY_HASH = "scrypt$AAAAAAAAAAAAAAAAAAAAAA$" + "A".repeat(86);
