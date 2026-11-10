"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import WebVitals from "./WebVitals";

function send(data: object) {
  const payload = JSON.stringify(data);
  const blob = new Blob([payload], { type: "application/json" });
  if (!navigator.sendBeacon?.("/api/track", blob)) {
    fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
  }
}

/** Nothing is measured from localhost, nor when the browser sends an opt-out signal (Global Privacy Control or Do Not Track), as the privacy policy promises. */
function trackingDisabled() {
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return true;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
  return nav.globalPrivacyControl === true || navigator.doNotTrack === "1";
}

/**
 * First-party page-view tracking (see app/api/track): one beacon per route, no cookie, nothing sent from localhost or on an opt-out signal.
 * Time spent with the tab visible is sent whenever the tab is hidden or the route changes.
 */
export default function Analytics() {
  const pathname = usePathname();
  const first = useRef(true);
  const [reportVitals, setReportVitals] = useState(false);

  // Web Vitals start at hydration, not after load: web-vitals only discards a page loaded in a
  // background tab (its LCP is when the tab was shown, not when it loaded) if it sees the tab hidden.
  useEffect(() => {
    setReportVitals(!trackingDisabled());
  }, []);

  useEffect(() => {
    if (trackingDisabled()) return;
    send({
      path: pathname,
      // Only the landing view carries the external referrer and campaign.
      referrer: first.current ? document.referrer : "",
      utm: first.current ? new URLSearchParams(location.search).get("utm_source") : null,
      // The country is derived from it server-side (lib/geo.ts).
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    first.current = false;

    let visibleSince = document.visibilityState === "visible" ? performance.now() : null;
    const flush = () => {
      if (visibleSince === null) return;
      const seconds = (performance.now() - visibleSince) / 1000;
      visibleSince = null;
      if (seconds >= 1) send({ path: pathname, seconds });
    };
    const onVisibility = () => {
      if (document.visibilityState === "hidden") flush();
      else visibleSince ??= performance.now();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", flush);
    return () => {
      flush();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", flush);
    };
  }, [pathname]);

  return reportVitals ? <WebVitals /> : null;
}
