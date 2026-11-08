import { readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";

// Applies db/schema.sql to the database in DATABASE_URL (loaded from .env.local by the npm script).
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
const schema = await readFile(path.join(process.cwd(), "db/schema.sql"), "utf8");
const statements = schema
  .split(/;\s*$/m)
  .map((s) => s.replace(/^\s*--.*$/gm, "").trim())
  .filter(Boolean);

for (const statement of statements) await sql.query(statement);
console.log(`Schema applied (${statements.length} statements).`);
