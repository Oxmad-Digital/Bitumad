"use client";

import { useReportWebVitals } from "next/web-vitals";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];
const CORE_VITALS = new Set(["LCP", "INP", "CLS"]);

// Stable module-level callback: a new function on each render would make Next report
// already available metrics again. The endpoint also upserts by metric id.
const reportWebVital: ReportWebVitalsCallback = (metric) => {
  if (!CORE_VITALS.has(metric.name)) return;
  const payload = JSON.stringify({
    path: location.pathname,
    vital: {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
    },
  });
  const blob = new Blob([payload], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/track", blob)) {
    fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
  }
};

export default function WebVitals() {
  useReportWebVitals(reportWebVital);
  return null;
}
