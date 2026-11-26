/** Vercel supplies these headers for requests to the deployment. */
export function clientIp(headers: Headers) {
  return (headers.get("x-real-ip") || headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
}
