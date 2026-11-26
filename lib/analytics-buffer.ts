import "server-only";
import {
  DeleteObjectsCommand, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, S3Client,
} from "@aws-sdk/client-s3";
import { createHash, randomUUID } from "node:crypto";
import { TIMEZONE } from "./site";

const PENDING = "analytics/pending/";
const USAGE = "analytics/monthly-usage.json";
const dayFormat = new Intl.DateTimeFormat("sv-SE", {
  timeZone: TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit",
});

export function analyticsDay(date: Date) {
  return dayFormat.format(date);
}

type PageEvent = { at: string; path: string; visitor: string; viewId: string | null };

export type AnalyticsEvent =
  | (PageEvent & { type: "view"; referrer: string | null; utm: string | null; country: string | null; device: string; browser: string })
  | (PageEvent & { type: "duration"; seconds: number })
  | { type: "vital"; at: string; path: string; id: string; name: string; value: number; rating: string | null; navigation: string | null; device: string };

let client: S3Client | undefined;

export function analyticsBucket() {
  const bucket = process.env.R2_ANALYTICS_BUCKET;
  const endpoint = process.env.R2_ENDPOINT;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  if (!bucket || !endpoint || !accessKeyId || !secretAccessKey) return null;

  client ??= new S3Client({
    endpoint, region: "auto", forcePathStyle: true, maxAttempts: 2,
    credentials: { accessKeyId, secretAccessKey },
    requestChecksumCalculation: "WHEN_REQUIRED", responseChecksumValidation: "WHEN_REQUIRED",
  });
  const storage = client;

  async function put(key: string, value: unknown) {
    await storage.send(new PutObjectCommand({
      Bucket: bucket, Key: key, Body: JSON.stringify(value), ContentType: "application/json",
    }), { abortSignal: AbortSignal.timeout(8_000) });
  }

  async function get(key: string) {
    try {
      const { Body } = await storage.send(new GetObjectCommand({ Bucket: bucket, Key: key }), {
        abortSignal: AbortSignal.timeout(10_000),
      });
      if (!Body) throw new Error("Empty analytics object response");
      return JSON.parse(await Body.transformToString()) as unknown;
    } catch (error) {
      if (error instanceof Error && error.name === "NoSuchKey") return null;
      throw error;
    }
  }

  return {
    write: (day: string, events: AnalyticsEvent[]) => put(`${PENDING}${day}/${randomUUID()}.json`, events),
    async listClosed(today: string) {
      const keys: string[] = [];
      let token: string | undefined;
      do {
        const page = await storage.send(new ListObjectsV2Command({
          Bucket: bucket, Prefix: PENDING, ContinuationToken: token,
        }), { abortSignal: AbortSignal.timeout(10_000) });
        for (const { Key } of page.Contents ?? []) {
          if (!Key) continue;
          const day = Key.slice(PENDING.length, PENDING.length + 10);
          if (/^\d{4}-\d{2}-\d{2}$/.test(day) && day < today) keys.push(Key);
        }
        token = page.NextContinuationToken;
      } while (token);
      return keys;
    },
    dayOf: (key: string) => key.slice(PENDING.length, PENDING.length + 10),
    async readEvents(key: string) {
      const result = await get(key);
      // Another cron may already have committed and removed this object.
      if (result === null) return [];
      if (!Array.isArray(result)) throw new Error("Invalid analytics object");
      return result as AnalyticsEvent[];
    },
    async remove(keys: string[]) {
      for (let offset = 0; offset < keys.length; offset += 1_000) {
        const command = new DeleteObjectsCommand({
          Bucket: bucket, Delete: { Objects: keys.slice(offset, offset + 1_000).map((Key) => ({ Key })), Quiet: true },
        });
        // Include the S3 multi-object delete digest before the request is signed.
        command.middlewareStack.add((next) => async (args) => {
          const request = args.request as { body: string; headers: Record<string, string> };
          request.headers["content-md5"] = createHash("md5").update(request.body).digest("base64");
          return next(args);
        }, { step: "build", name: "analyticsDeleteDigest" });
        const result = await storage.send(command, { abortSignal: AbortSignal.timeout(10_000) });
        if (result.Errors?.length) throw new Error(`R2 could not remove ${result.Errors.length} imported analytics objects`);
      }
    },
    publishUsage: (months: Record<string, number>) => put(USAGE, months),
    readUsage: () => get(USAGE) as Promise<Record<string, number> | null>,
  };
}
