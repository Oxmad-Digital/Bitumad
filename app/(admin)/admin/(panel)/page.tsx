import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getDashboard, PERIODS, type Breakdown, type Period } from "@/lib/admin-stats";
import DailyChart from "./DailyChart";
import WorldMap from "./WorldMap";

const countryNames = new Intl.DisplayNames(["fr"], { type: "region" });
const nf = new Intl.NumberFormat("fr-FR");
const formatDuration = (s: number) => (s < 60 ? `${s} s` : `${Math.floor(s / 60)} min ${String(s % 60).padStart(2, "0")} s`);
const periodLabel = (p: Period) => (p === 0 ? "Tout" : p === 365 ? "1 an" : `${p} j`);
/** Below this, one outlier (e.g. a tab opened in the background) is enough to skew the p75. */
const MIN_VITAL_SAMPLES = 10;
const vitalLabel = { LCP: "Chargement (LCP)", INP: "Réactivité (INP)", CLS: "Stabilité (CLS)" } as const;

function formatVital(name: "LCP" | "INP" | "CLS", value: number | null) {
  if (value === null) return "—";
  if (name === "CLS") return value.toFixed(3);
  return value >= 1000 ? `${(value / 1000).toFixed(2)} s` : `${Math.round(value)} ms`;
}

function countryLabel(code: string) {
  try {
    return code.length === 2 ? countryNames.of(code) ?? code : code;
  } catch {
    return code;
  }
}

function Delta({ now, before }: { now: number; before: number }) {
  if (!before) return <span className="adm-delta">—</span>;
  const pct = Math.round(((now - before) / before) * 100);
  return (
    <span className={`adm-delta ${pct > 0 ? "is-up" : pct < 0 ? "is-down" : ""}`}>
      {pct > 0 ? "▲" : pct < 0 ? "▼" : "="} {Math.abs(pct)} % <span className="adm-muted">vs période précédente</span>
    </span>
  );
}

function BreakdownList({ title, rows, unit, format = (l) => l, scroll = false }: {
  title: string;
  rows: Breakdown;
  unit: string;
  format?: (label: string) => string;
  /** Lets the list scroll inside the card instead of growing it (full country list under the map). */
  scroll?: boolean;
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <section className={`adm-card${scroll ? " adm-card-scroll" : ""}`}>
      <h2>{title}</h2>
      {rows.length === 0 ? (
        <p className="adm-empty">Pas encore de données.</p>
      ) : (
        <div className="adm-breakdown-wrap"><table className="adm-breakdown">
          <thead><tr><th>{title}</th><th>{unit}</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label}>
                <td>
                  <span className="adm-bar" style={{ width: `${(r.count / max) * 100}%` }} aria-hidden />
                  <span className="adm-bar-label">{format(r.label)}</span>
                </td>
                <td>{nf.format(r.count)}</td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}
    </section>
  );
}

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  await requireAdmin();
  const requested = Number((await searchParams).p);
  const period: Period = PERIODS.find((p) => p === requested) ?? 30;
  const stats = await getDashboard(period);

  return (
    <>
      <div className="adm-title-row">
        <h1>Statistiques</h1>
        <div className="adm-segmented" role="group" aria-label="Période">
          {PERIODS.map((p) => (
            <Link key={p} href={`/admin?p=${p}`} aria-current={p === period ? "true" : undefined}>{periodLabel(p)}</Link>
          ))}
        </div>
      </div>

      <div className="adm-kpis">
        <div className="adm-card adm-kpi">
          <p className="adm-kpi-label">Visiteurs</p>
          <p className="adm-kpi-value">{nf.format(stats.visitors)}</p>
          <Delta now={stats.visitors} before={stats.previousVisitors} />
        </div>
        <div className="adm-card adm-kpi">
          <p className="adm-kpi-label">Pages vues</p>
          <p className="adm-kpi-value">{nf.format(stats.views)}</p>
          <Delta now={stats.views} before={stats.previousViews} />
        </div>
        <div className="adm-card adm-kpi">
          <p className="adm-kpi-label">Durée moyenne / session</p>
          <p className="adm-kpi-value">{formatDuration(stats.sessionDuration)}</p>
          <Delta now={stats.sessionDuration} before={stats.previousSessionDuration} />
        </div>
        <Link href="/admin/devis" className="adm-card adm-kpi">
          <p className="adm-kpi-label">Demandes de devis</p>
          <p className="adm-kpi-value">{nf.format(stats.quotes)}</p>
          <span className="adm-muted">{stats.newQuotes} à traiter · {stats.wonQuotes} gagnée{stats.wonQuotes > 1 ? "s" : ""}</span>
        </Link>
        <Link href="/admin/messages" className="adm-card adm-kpi">
          <p className="adm-kpi-label">Messages reçus</p>
          <p className="adm-kpi-value">{nf.format(stats.messages)}</p>
          <span className="adm-muted">{stats.unread} non lu{stats.unread > 1 ? "s" : ""}</span>
        </Link>
      </div>

      <section className="adm-card">
        <DailyChart data={stats.daily} monthly={stats.monthly} title={`Pages vues par ${stats.monthly ? "mois" : "jour"}`} />
      </section>

      <section className="adm-card">
        <h2>Performance réelle — p75</h2>
        <div className="adm-kpis">
          {stats.vitals.map((vital) => (
            <div className="adm-card adm-kpi" key={vital.name}>
              <p className="adm-kpi-label">{vitalLabel[vital.name]}</p>
              <p className="adm-kpi-value">{vital.samples >= MIN_VITAL_SAMPLES ? formatVital(vital.name, vital.p75) : "—"}</p>
              <span className="adm-muted">
                {vital.samples >= MIN_VITAL_SAMPLES
                  ? `${vital.samples} échantillons`
                  : `Pas assez de données (${vital.samples}/${MIN_VITAL_SAMPLES})`}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="adm-grid adm-grid-2">
        <BreakdownList title="Pages" rows={stats.pages} unit="Vues" />
        <BreakdownList title="Provenance" rows={stats.referrers} unit="Vues" />
        <BreakdownList title="Appareils" rows={stats.devices} unit="Visiteurs" />
        <BreakdownList title="Navigateurs" rows={stats.browsers} unit="Visiteurs" />
      </div>

      <div className="adm-geo">
        <section className="adm-card">
          <h2>Visiteurs par pays</h2>
          <WorldMap rows={stats.countries} />
        </section>
        <BreakdownList title="Pays" rows={stats.countries} unit="Visiteurs" format={countryLabel} scroll />
      </div>

      <p className="adm-footnote">
        Mesure interne sans cookie : un visiteur est compté une fois par jour (empreinte pseudonyme renouvelée chaque jour, ignorée si le navigateur envoie Global Privacy Control ou Do Not Track).
        Une session regroupe les pages vues d&apos;un visiteur sans 30 min d&apos;inactivité ; sa durée ne compte que le temps onglet visible.
        Les robots, l&apos;admin et le développement local ne sont pas comptés.
        L&apos;historique est conservé sans limite sous forme de totaux quotidiens anonymes. Les demandes (devis, messages, partenariats) sont supprimées automatiquement après 3 ans.
        Le pays vient du fuseau horaire du navigateur, à défaut de l&apos;adresse IP (jamais conservée).
        Carte : <a href="https://github.com/VictorCazanave/svg-maps" target="_blank" rel="noreferrer">svg-maps</a> (CC BY 4.0).
      </p>
    </>
  );
}
