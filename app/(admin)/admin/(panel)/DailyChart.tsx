"use client";

import { useSyncExternalStore } from "react";

type Day = { day: string; views: number; visitors: number };
type View = "bars" | "line";

const STORAGE_KEY = "bm-adm-chart-view";

// Chosen view, remembered in this browser (falls back to memory when storage is blocked).
let memoryView: View = "bars";
const listeners = new Set<() => void>();
function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function readView(): View {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "bars" || saved === "line") return saved;
  } catch {}
  return memoryView;
}

const dayFormat = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" });
const longFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("fr-FR", { month: "short", year: "2-digit", timeZone: "UTC" });
const longMonthFormat = new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric", timeZone: "UTC" });

/** Rounds the axis max up to a readable step (1, 2, 5 × 10ⁿ). */
function niceMax(value: number) {
  if (value <= 4) return 4;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 5, 10].find((s) => s * magnitude >= value)!;
  return step * magnitude;
}

/**
 * Page views per day (or per month), as bars or as a line: responsive without a chart library,
 * tooltip on hover and focus. The chosen view is remembered in this browser.
 */
export default function DailyChart({ data, monthly = false, title }: { data: Day[]; monthly?: boolean; title: string }) {
  const view = useSyncExternalStore(subscribe, readView, () => "bars" as View);

  function choose(next: View) {
    try { localStorage.setItem(STORAGE_KEY, next); } catch {}
    memoryView = next;
    listeners.forEach((l) => l());
  }

  const max = niceMax(Math.max(...data.map((d) => d.views)));
  const ticks = [max, max / 2, 0];
  const labelEvery = Math.ceil(data.length / 6);
  const n = data.length;
  // Line points in a 0–100 box, x at the centre of each column (columns have no gap in line view).
  const points = data.map((d, i) => `${((i + 0.5) / n) * 100},${100 - (d.views / max) * 100}`);
  const line = points.join(" ");
  const area = n ? `${(0.5 / n) * 100},100 ${line} ${((n - 0.5) / n) * 100},100` : "";

  return (
    <>
      <div className="adm-chart-head">
        <h2>{title}</h2>
        <div className="adm-segmented adm-segmented-sm" role="group" aria-label="Type de graphique">
          <button type="button" aria-pressed={view === "bars"} onClick={() => choose("bars")}>Barres</button>
          <button type="button" aria-pressed={view === "line"} onClick={() => choose("line")}>Courbe</button>
        </div>
      </div>
      <div className={`adm-chart${view === "line" ? " is-line" : ""}`}>
        <div className="adm-chart-axis" aria-hidden>
          {ticks.map((t) => <span key={t}>{t}</span>)}
        </div>
        <div className="adm-chart-plot">
          <div className="adm-chart-grid" aria-hidden><span /><span /><span /></div>
          {view === "line" && (
            <svg className="adm-chart-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              <polygon points={area} />
              <polyline points={line} vectorEffect="non-scaling-stroke" />
            </svg>
          )}
          <ol className="adm-chart-bars">
            {data.map((d, i) => {
              const date = new Date(`${d.day}T00:00:00Z`);
              const tip = `${(monthly ? longMonthFormat : longFormat).format(date)} — ${d.views} vue${d.views > 1 ? "s" : ""}, ${d.visitors} visiteur${d.visitors > 1 ? "s" : ""}`;
              const pct = `${(d.views / max) * 100}%`;
              return (
                <li key={d.day} tabIndex={0} aria-label={tip} data-tip={tip}>
                  {view === "bars"
                    ? <span className="adm-chart-bar" style={{ height: pct }} />
                    : <span className="adm-chart-dot" style={{ bottom: pct }} />}
                  {i % labelEvery === 0 && (
                    <span className="adm-chart-x" aria-hidden>{(monthly ? monthFormat : dayFormat).format(date)}</span>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </>
  );
}
