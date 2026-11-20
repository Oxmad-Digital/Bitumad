import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { syncPendingToErp } from "@/lib/erp";

export const maxDuration = 60;

/**
 * Called once a day by Vercel cron (vercel.json), with `Authorization: Bearer $CRON_SECRET`: the backstop
 * that sends the ERP the requests it missed, even on a day with no form, visit or admin session.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const given = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (!secret || given.length !== expected.length || !timingSafeEqual(Buffer.from(given), Buffer.from(expected))) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const sent = await syncPendingToErp(100);
  return NextResponse.json({ sent });
}
