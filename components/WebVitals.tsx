"use client";

import { useReportWebVitals } from "next/web-vitals";
import { queueAnalytics } from "./analytics-events";

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];
const CORE_VITALS = new Set(["LCP", "INP", "CLS"]);

// Stable module-level callback: a new function on each render would make Next report
// already available metrics again. The endpoint also upserts by metric id.
const reportWebVital: ReportWebVitalsCallback = (metric) => {
  if (!CORE_VITALS.has(metric.name)) return;
  queueAnalytics({
    path: location.pathname.slice(0, 300),
    vital: {
      id: metric.id,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      navigationType: metric.navigationType,
    },
  });
};

export default function WebVitals() {
  useReportWebVitals(reportWebVital);
  return null;
}
