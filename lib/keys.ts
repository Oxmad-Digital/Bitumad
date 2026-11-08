import { hkdfSync } from "node:crypto";

/** Key for one purpose, derived from the app secret: the session key and the analytics salt never coincide. */
export function deriveKey(purpose: string, appSecret: string) {
  return Buffer.from(hkdfSync("sha256", appSecret, "bitumad-admin", purpose, 32));
}
