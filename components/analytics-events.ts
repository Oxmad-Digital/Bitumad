const events: object[] = [];
let timer: ReturnType<typeof setTimeout> | undefined;

export function flushAnalytics() {
  clearTimeout(timer);
  timer = undefined;
  if (!events.length) return;

  const payload = JSON.stringify(events.splice(0));
  if (!navigator.sendBeacon?.("/api/track", new Blob([payload], { type: "application/json" }))) {
    fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
  }
}

export function queueAnalytics(event: object) {
  events.push({ ...event, at: Date.now() });
  if (events.length >= 10 || document.visibilityState === "hidden") flushAnalytics();
  else timer ??= setTimeout(flushAnalytics, 10_000);
}
