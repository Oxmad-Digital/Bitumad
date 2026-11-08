import type { Breakdown } from "@/lib/admin-stats";
import map from "@/lib/world-map.json";

const nf = new Intl.NumberFormat("fr-FR");
const countryNames = new Intl.DisplayNames(["fr"], { type: "region" });

/** Opacity of the accent fill, on a square-root scale so a single visitor still shows. */
function shade(count: number, max: number) {
  return 0.2 + 0.8 * Math.sqrt(count / max);
}

function tooltip(id: string, count: number) {
  return `${countryNames.of(id) ?? id} — ${nf.format(count)} visiteur${count > 1 ? "s" : ""}`;
}

/** Visitors per country on a world map (ISO 3166-1 alpha-2 codes, as sent by Vercel). Tooltip on hover. */
export default function WorldMap({ rows }: { rows: Breakdown }) {
  // Visitors without a known country ("—") stay out of the map and its scale.
  const countries = rows.filter((r) => r.label.length === 2);
  const counts = new Map(countries.map((r) => [r.label, r.count]));
  const max = Math.max(1, ...countries.map((r) => r.count));
  const min = Math.min(max, ...countries.map((r) => r.count));
  const located = countries.length;

  return (
    <figure className="adm-map">
      <svg viewBox={map.viewBox} role="img" aria-label={`Visiteurs par pays : ${located} pays`}>
        {map.countries.map(({ id, d }) => {
          const count = counts.get(id);
          return (
            <path key={id} d={d} className={count ? "is-visited" : undefined}
              style={count ? { fillOpacity: shade(count, max) } : undefined}>
              <title>{tooltip(id, count ?? 0)}</title>
            </path>
          );
        })}
        {/* Territories too small to see (Réunion, Maurice…) get a marker once they have visitors, drawn on top. */}
        {map.countries.map(({ id, marker }) => {
          const count = counts.get(id);
          if (!marker || !count) return null;
          return (
            <circle key={`${id}-marker`} cx={marker[0]} cy={marker[1]} r={4} className="adm-map-marker"
              style={{ fillOpacity: shade(count, max) }}>
              <title>{tooltip(id, count)}</title>
            </circle>
          );
        })}
      </svg>
      {located > 0 && (
        <figcaption className="adm-map-legend" aria-hidden>
          <span>{nf.format(min)}</span><span className="adm-map-scale" /><span>{nf.format(max)}</span>
        </figcaption>
      )}
    </figure>
  );
}
