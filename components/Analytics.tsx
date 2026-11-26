"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { flushAnalytics, queueAnalytics } from "./analytics-events";
import WebVitals from "./WebVitals";

/** Nothing is measured from localhost, nor when the browser sends an opt-out signal (Global Privacy Control or Do Not Track), as the privacy policy promises. */
function trackingDisabled() {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || navigator.doNotTrack === "1";
}

// The browser exposes these preferences as properties without a change event.
const subscribeToTrackingPreference = () => () => {};

/**
 * First-party page-view tracking with no cookies. Events share a batch with Core Web Vitals.
 * Time spent with the tab visible is measured whenever the tab is hidden or the route changes.
 */
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);
  // Web Vitals start at hydration, not after load: web-vitals only discards a page loaded in a
  // background tab (its LCP is when the tab was shown, not when it loaded) if it sees the tab hidden.
  const disableVitals = useSyncExternalStore(subscribeToTrackingPreference, trackingDisabled, () => true);

  useEffect(() => {
    if (trackingDisabled()) return;
    const path = pathname.slice(0, 300);
    const viewId = crypto.randomUUID?.();
    queueAnalytics({
      path,
      viewId,
      // Only the landing view carries the external referrer and campaign.
      referrer: first.current ? document.referrer.slice(0, 350) : "",
      utm: first.current ? new URLSearchParams(location.search).get("utm_source")?.slice(0, 100) : null,
      // The country is derived from it server-side (lib/geo.ts).
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    first.current = false;

    let visibleSince = document.visibilityState === "visible" ? performance.now() : null;
    const reportDuration = () => {
      if (visibleSince === null) return;
      const seconds = (performance.now() - visibleSince) / 1000;
      visibleSince = null;
      if (seconds >= 1) queueAnalytics({ path, viewId, seconds });
    };
    const onExit = () => {
      reportDuration();
      flushAnalytics();
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") onExit();
      else visibleSince ??= performance.now();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", onExit);
    return () => {
      reportDuration();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onExit);
    };
  }, [pathname]);

  return disableVitals ? null : <WebVitals />;
}
