"use client";

import "./notre-bitume.css";
import { useReveal } from "@/hooks/useReveal";

const PRODUCTS = [
  {
    grade: "60/70",
    href: "/notre-bitume/60-70",
    zone: "Zones intérieures · Hauts Plateaux · Grandes villes",
    desc: "Grade de référence pour les conditions climatiques tropicales de l'intérieur de Madagascar. Flexibilité et résistance thermique équilibrées pour les routes nationales, voiries urbaines et aéroports.",
    specs: [
      { val: "60–70", label: "Pénétrabilité (0.1 mm)" },
      { val: "49–56 °C", label: "Point de ramollissement" },
      { val: "≥ 100 cm", label: "Ductilité" },
    ],
    tags: ["Routes nationales", "Voiries urbaines", "Aéroports"],
    accentColor: "var(--green)",
  },
  {
    grade: "35/50",
    href: "/notre-bitume/35-50",
    zone: "Zones côtières · Ports · Fort ensoleillement",
    desc: "Grade plus dur, spécialement adapté aux zones littorales à très forte chaleur. Résistance maximale à l'orniérage pour les infrastructures portuaires, côtières et industrielles en bord de mer.",
    specs: [
      { val: "35–50", label: "Pénétrabilité (0.1 mm)" },
      { val: "52–60 °C", label: "Point de ramollissement" },
      { val: "≥ 50 cm", label: "Ductilité" },
    ],
    tags: ["Routes côtières", "Zones portuaires", "Logistique littorale"],
    accentColor: "var(--green)",
    isNew: true,
  },
];

const GUIDE_ROWS = [
  {
    critere: "Dureté",
    val6070: "Moyenne",
    val3550: "Élevée",
  },
  {
    critere: "Résistance à l'orniérage",
    val6070: "Bonne",
    val3550: "Maximale",
  },
  {
    critere: "Flexibilité",
    val6070: "≥ 100 cm",
    val3550: "≥ 50 cm",
  },
  {
    critere: "Point de ramollissement",
    val6070: "49 – 56 °C",
    val3550: "52 – 60 °C",
  },
  {
    critere: "Zones recommandées",
    val6070: "Hauts Plateaux, grandes villes, intérieur",
    val3550: "Côte, ports, zones à fort ensoleillement",
  },
  {
    critere: "Applications types",
    val6070: "RN, voiries urbaines, aéroports, parkings",
    val3550: "Routes côtières, quais, zones industrielles littorales",
  },
];

export default function NossBitumesPage() {
  useReveal({ heroSelector: ".nb-page-hero", baseDelay: 80, stepDelay: 110 });

  return (
    <>
      {/* ─── PAGE HERO ─── */}
      <div className="nb-page-hero">
        <div className="nb-page-hero-bg" />
        <div className="nb-page-hero-grid" />
        <div className="nb-page-hero-accent" aria-hidden="true">BITUME</div>
        <div className="nb-page-hero-layout">
          <div className="nb-page-hero-left">
            <div className="nb-eyebrow reveal reveal-delay-1">Nos produits</div>
            <h1 className="nb-page-title reveal reveal-delay-2">
              DEUX GRADES <em>DISPONIBLES</em>
            </h1>
            <p className="nb-page-lead reveal reveal-delay-3">
              Chaque grade est adapté à un contexte climatique précis. Choisissez le produit qui correspond à votre zone de chantier.
            </p>
          </div>
        </div>
      </div>

      {/* ─── PRODUCTS GRID ─── */}
      <section className="nb-catalog-section">
        <div className="nb-catalog-grid">
          {PRODUCTS.map((p, idx) => (
            <div
              className={`nb-catalog-card reveal reveal-delay-${idx + 2}`}
              key={p.grade}
            >
              <div className="nb-catalog-card-top">
                <div className="nb-catalog-grade-badge">
                  {p.grade}
                  {p.isNew && <span className="nb-catalog-new-badge">Nouveau</span>}
                </div>
                <div className="nb-catalog-card-zone">{p.zone}</div>
                <div className="nb-catalog-card-name">
                  BITUME DE PÉNÉTRATION <em>{p.grade}</em>
                </div>
                <p className="nb-catalog-card-desc">{p.desc}</p>
              </div>

              <div className="nb-catalog-card-specs">
                {p.specs.map((spec) => (
                  <div className="nb-catalog-spec-item" key={spec.label}>
                    <div className="nb-catalog-spec-val">{spec.val}</div>
                    <div className="nb-catalog-spec-label">{spec.label}</div>
                  </div>
                ))}
              </div>

              <div className="nb-catalog-card-tags">
                {p.tags.map((tag) => (
                  <span className="nb-app-tag" key={tag}>{tag}</span>
                ))}
              </div>

              <a href={p.href} className="nb-catalog-card-link" aria-label={`Voir la fiche technique — Bitume ${p.grade}`}>
                Voir la fiche technique
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true" focusable="false">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ─── GUIDE SECTION ─── */}
      <section className="nb-guide-section">
        <div className="nb-eyebrow reveal">Aide au choix</div>
        <h2 className="nb-section-title reveal reveal-delay-1">QUEL GRADE POUR VOTRE CHANTIER ?</h2>
        <p className="nb-section-lead reveal reveal-delay-2">
          Le choix du grade dépend principalement de la localisation de votre chantier et des températures de surface auxquelles la chaussée sera exposée.
        </p>

        <div className="nb-guide-table-wrap reveal reveal-delay-2">
          <table className="nb-guide-table">
            <caption className="visually-hidden">Comparaison des grades de bitume 60/70 et 35/50 selon les critères techniques</caption>
            <thead>
              <tr>
                <th scope="col">Critère</th>
                <th scope="col">
                  <div className="nb-guide-th-grade">60/70</div>
                  <div className="nb-guide-th-sub">Zones intérieures</div>
                </th>
                <th scope="col">
                  <div className="nb-guide-th-grade nb-guide-th-grade--new">35/50</div>
                  <div className="nb-guide-th-sub">Zones côtières</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {GUIDE_ROWS.map((row, i) => (
                <tr key={row.critere} className={i % 2 === 0 ? "nb-guide-row-alt" : ""}>
                  <th scope="row" className="nb-guide-critere">{row.critere}</th>
                  <td>{row.val6070}</td>
                  <td>{row.val3550}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="nb-guide-tip reveal reveal-delay-3">
          <div className="nb-guide-tip-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p>
            Vous ne savez pas quel grade choisir ? Notre équipe technique peut vous conseiller en fonction de votre zone géographique et des contraintes de votre chantier.{" "}
            <a href="/contact">Contactez-nous</a> — réponse sous 48h.
          </p>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <div className="nb-cta-banner nb-cta-banner--catalog reveal">
        <div className="nb-cta-banner-text">
          <h2>PRÊT À PASSER<br />COMMANDE ?</h2>
          <p>Notre équipe vous accompagne du devis à la livraison sur site.</p>
        </div>
        <a href="/#commander" className="nb-cta-banner-btn">
          Obtenir un devis
        </a>
      </div>
    </>
  );
}
