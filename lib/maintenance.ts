import "server-only";
import { unstable_cache } from "next/cache";
import { db } from "./db";

export type Maintenance = { enabled: boolean; message: string };

export const MAINTENANCE_TAG = "maintenance";
const OFF: Maintenance = { enabled: false, message: "" };

/**
 * Maintenance setting, cached so the site pages stay static: the admin action invalidates the tag.
 * Any database problem (missing URL, table not created yet, outage) keeps the site online.
 */
export const getMaintenance = unstable_cache(
  async (): Promise<Maintenance> => {
    const sql = db();
    if (!sql) return OFF;
    try {
      const [row] = await sql`SELECT value FROM site_settings WHERE key = 'maintenance'`;
      const value = (row?.value ?? {}) as Partial<Maintenance>;
      return { enabled: value.enabled === true, message: typeof value.message === "string" ? value.message : "" };
    } catch (error) {
      console.error("getMaintenance failed:", error);
      return OFF;
    }
  },
  ["site-maintenance"],
  { tags: [MAINTENANCE_TAG] },
);
