"use client";

import { useEffect } from "react";
import "../notre-bitume.css";

const COMP_BARS = [
  { name: "Résistance thermique", val: "Très élevée", width: "95%", desc: "Stable jusqu'à 250 °C — tenue exceptionnelle en zone côtière" },
  { name: "Résistance à l'orniérage", val: "Maximale", width: "92%", desc: "Grade plus dur — idéal sous charges lourdes et forte chaleur" },
  { name: "Pureté", val: "≥ 99%", width: "99%", desc: "Solubilité dans le trichloréthylène — ASTM D2042" },
  { name: "Stabilité au vieillissement", val: "≤ 20%", width: "82%", desc: "Baisse de pénétrabilité après chauffage — ASTM D5" },
  { name: "Densité", val: "1.01–1.06 kg/m³", width: "60%", desc: "Gravité spécifique à 25 °C — ASTM D70" },
];

const SPEC_ROWS = [
  { label: "Gravité spécifique à 25 °C", method: "ASTM D70", unit: "kg/m³", min: "1.01", max: "1.06" },
  { label: "Pénétrabilité à 25 °C, 100g, 5s", method: "ASTM D5", unit: "0.1 mm", min: "35", max: "50" },
  { label: "Point de ramollissement", method: "ASTM D36", unit: "°C", min: "52", max: "60" },
  { label: "Ductilité à 25 °C", method: "ASTM D113", unit: "cm", min: "50", max: null },
  { label: "Perte au chauffage", method: "ASTM D6", unit: "% wt", min: null, max: "0.2" },
  { label: "Baisse de pénétrabilité après chauffage", method: "ASTM D5", unit: "%", min: null, max: "20" },
  { label: "Point éclair", method: "ASTM D92", unit: "°C", min: "250", max: null },
  { label: "Solubilité dans le trichloréthylène", method: "ASTM D2042", unit: "% wt", min: "99", max: null },
];

const APP_CARDS = [
  {
    num: "01",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17l3-10h12l3 10" /><path d="M3 17h18" /><path d="M12 7V3" /><path d="M8 17v2" /><path d="M16 17v2" />
      </svg>
    ),
    category: "Axe littoral",
    title: "ROUTES CÔTIÈRES À FORT ENSOLEILLEMENT",
    desc: "Les routes longeant le littoral malgache subissent des températures de surface pouvant dépasser 70 °C. Le bitume 35/50, plus dur, résiste mieux à l'orniérage et conserve sa géométrie sous la chaleur côtière intense, là où un grade 60/70 tendrait à fluenter.",
    tags: ["Anti-orniérage", "Forte chaleur", "Littoral"],
    delay: "reveal-delay-2",
  },
  {
    num: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><path d="M9 22V12h6v10" />
      </svg>
    ),
    category: "Infrastructure portuaire",
    title: "ZONES PORTUAIRES & QUAIS",
    desc: "Les quais, aires de manœuvre et voies portuaires combinent charges statiques élevées (conteneurs, portiques) et exposition permanente au soleil côtier. Le 35/50 maintient sa rigidité sous ces contraintes simultanées, garantissant la planéité des surfaces et la sécurité des opérations.",
    tags: ["Charges statiques", "Port", "Haute durabilité"],
    delay: "reveal-delay-3",
  },
  {
    num: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 8h.01" /><path d="M12 8h.01" /><path d="M17 8h.01" />
      </svg>
    ),
    category: "Villes côtières",
    title: "VOIRIES URBAINES CÔTIÈRES",
    desc: "Dans les villes côtières de Madagascar — Toamasina, Mahajanga, Toliary, Nosy Be — la combinaison d'un trafic dense et d'une chaleur ambiante élevée sollicite fortement les chaussées. Le bitume 35/50 offre une résistance à la déformation supérieure, prolongeant la durée de vie des voiries urbaines côtières.",
    tags: ["Toamasina", "Mahajanga", "Trafic urbain"],
    delay: "reveal-delay-2",
  },
  {
    num: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M9 12h4a2 2 0 1 0 0-4H9v8" />
      </svg>
    ),
    category: "Logistique littorale",
    title: "ZONES INDUSTRIELLES & LOGISTIQUES CÔTIÈRES",
    desc: "Les plateformes logistiques, zones d'activité et dépôts en bord de mer nécessitent un revêtement à forte résistance aux charges ponctuelles et aux déformations permanentes. Le 35/50 assure la stabilité des dalles sous les engins de levage et les véhicules lourds en contexte littoral.",
    tags: ["Logistique côtière", "Engins lourds", "Stabilité"],
    delay: "reveal-delay-3",
  },
];

const USAGE_STEPS = [
  { num: "01", title: "Chauffage", desc: "Le bitume 35/50 est chauffé entre 155 et 185 °C — légèrement plus que le 60/70 en raison de sa consistance plus élevée." },
  { num: "02", title: "Enrobage", desc: "Les agrégats sont enrobés au bitume chaud dans un malaxeur ou une centrale d'enrobage, à température adaptée." },
  { num: "03", title: "Répandage", desc: "L'enrobé est répandu sur la chaussée à l'aide d'un finisseur, à la température optimale pour ce grade." },
  { num: "04", title: "Compactage", desc: "Un compacteur à rouleau assure la densification finale et la planéité de la surface." },
];

const STORAGE_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" /><path d="M5 21V10l7-6 7 6v11" /><path d="M9 21v-6h6v6" />
      </svg>
    ),
    title: "Entreposage sécurisé",
    desc: "Fûts stockés sur surfaces stables et planes, protégés des chocs et des manipulations répétées.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Protection contre les éléments",
    desc: "À l'abri d'une exposition directe et prolongée à l'eau, aux embruns salins ou au soleil, pour préserver l'intégrité du produit.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: "Traçabilité stricte des lots",
    desc: "Suivi de chaque lot du départ usine jusqu'au chantier, pour garantir la qualité de livraison.",
  },
];

const PDF_INCLUDES = [
  "Tableau complet des spécifications ASTM (8 paramètres)",
  "Méthodes de test et unités de mesure",
  "Conditions de stockage et précautions de sécurité",
  "Domaines d'application côtiers et recommandations de mise en œuvre",
  "Informations de conditionnement et de transport",
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Bitume3550Page() {
  useEffect(() => {
    const reveals = document.querySelectorAll<HTMLElement>(".reveal");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => obs.observe(el));

    document.querySelectorAll<HTMLElement>(".nb-page-hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("visible"), 80 + i * 110);
    });

    const compCard = document.getElementById("compCard");
    if (compCard) {
      const compObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.querySelectorAll<HTMLElement>(".nb-comp-bar").forEach((bar, i) => {
                setTimeout(() => bar.classList.add("animated"), 300 + i * 120);
              });
              compObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      compObs.observe(compCard);
    }

    return () => obs.disconnect();
  }, []);

  return (
    <>
      {/* ─── PAGE HERO ─── */}
      <div className="nb-page-hero">
        <div className="nb-page-hero-bg" />
        <div className="nb-page-hero-grid" />
        <div className="nb-page-hero-accent" aria-hidden="true">35/50</div>
        <div className="nb-page-hero-layout">
          <div className="nb-page-hero-left">

            <div className="nb-eyebrow reveal reveal-delay-1">Description du produit · Zones côtières</div>
            <h1 className="nb-page-title reveal reveal-delay-2">
              QU&apos;EST-CE QUE LE<br /><em>BITUME 35/50 ?</em>
            </h1>

          </div>
        </div>
      </div>

      {/* ─── DESCRIPTION ─── */}
      <section id="nb-description" className="nb-section-description">
        <div className="nb-desc-layout">
          <div>
            <div className="nb-desc-body reveal reveal-delay-2">
              <p>Le <strong>bitume de pénétration 35/50</strong> est un liant hydrocarboné de grade plus dur que le 60/70, issu de la distillation du pétrole brut. Comme son homologue, il se présente sous forme solide à température ambiante et devient fluide sous l'effet de la chaleur pour son application sur les chaussées.</p>
              <p>La désignation <strong>35/50</strong> correspond à l'indice de pénétrabilité du produit : une aiguille standard de 100 grammes ne pénètre qu'entre 35 et 50 dixièmes de millimètre dans le bitume à 25 °C pendant 5 secondes. Ce chiffre plus faible indique un produit plus rigide — son point de ramollissement atteint 52 à 60 °C contre 49-56 °C pour le 60/70.</p>
              <p>Ce grade est particulièrement adapté aux <strong>zones côtières malgaches</strong> — Toamasina, Mahajanga, Toliary, Nosy Be — où les températures de surface des chaussées peuvent dépasser 70 °C en plein ensoleillement. Sa rigidité supérieure lui confère une résistance accrue à l'orniérage dans ces conditions extrêmes.</p>
              <p>Le bitume 35/50 convient aux couches de roulement des routes littorales, aux aires portuaires, aux voiries industrielles côtières et à toute surface soumise à la fois à des <strong>charges élevées et à une chaleur ambiante intense</strong>.</p>
            </div>
          </div>

          <div className="nb-composition-card reveal reveal-delay-3" id="compCard">
            <div className="nb-composition-header">
              <span className="nb-composition-header-title">Propriétés clés</span>
              <span className="nb-composition-astm">ASTM</span>
            </div>
            <div className="nb-composition-body">
              {COMP_BARS.map((row) => (
                <div className="nb-comp-row" key={row.name}>
                  <div className="nb-comp-row-header">
                    <span className="nb-comp-name">{row.name}</span>
                    <span className="nb-comp-val">{row.val}</span>
                  </div>
                  <div className="nb-comp-bar-bg">
                    <div className="nb-comp-bar" style={{ width: row.width }} />
                  </div>
                  <div className="nb-comp-desc">{row.desc}</div>
                </div>
              ))}
            </div>
            <div className="nb-composition-footer">Valeurs conformes au certificat d'analyse lot par lot</div>
          </div>
        </div>
      </section>

      {/* ─── SPECS TABLE ─── */}
      <section id="nb-specs" className="nb-section-specs">
        <div className="product-header">
          <div>
            <div className="eyebrow reveal">Notre bitume</div>
            <h2 className="section-title reveal reveal-delay-1">
              FICHE TECHNIQUE<br />BITUME 35/50
            </h2>
          </div>
          <p className="section-lead reveal reveal-delay-2" style={{ maxWidth: "340px", textAlign: "right" }}>
            Caractéristiques conformes aux normes ASTM, formulées pour les conditions côtières et les zones à fort ensoleillement de Madagascar.
          </p>
        </div>
        <div className="reveal reveal-delay-2">
          <table className="spec-table" role="table" aria-label="Caractéristiques techniques bitume 35/50">
            <thead>
              <tr>
                <th>Intitulé</th>
                <th>Méthode</th>
                <th>Unité</th>
                <th>Min.</th>
                <th>Max.</th>
              </tr>
            </thead>
            <tbody>
              {SPEC_ROWS.map((row) => (
                <tr key={row.label}>
                  <td>{row.label}</td>
                  <td className="method" data-label="Méthode">{row.method}</td>
                  <td className="unit" data-label="Unité">{row.unit}</td>
                  <td data-label="Min.">
                    {row.min
                      ? <span className="val-badge val-min">{row.min}</span>
                      : <span className="val-dash">—</span>}
                  </td>
                  <td data-label="Max.">
                    {row.max
                      ? <span className="val-badge val-max">{row.max}</span>
                      : <span className="val-dash">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="spec-swipe-hint" aria-hidden="true">
            <span>←</span>
            <span>Glisser pour voir plus</span>
            <span>→</span>
          </div>
        </div>
      </section>

      {/* ─── APPLICATIONS ─── */}
      <section id="nb-applications" className="nb-section-applications">
        <div className="nb-eyebrow reveal">Domaines d'application</div>
        <h2 className="nb-section-title reveal reveal-delay-1">POUR QUELS<br />CHANTIERS CÔTIERS ?</h2>
        <p className="nb-section-lead reveal reveal-delay-2">
          Le bitume 35/50 est la solution de référence pour les infrastructures littorales, portuaires et les zones à très forte exposition thermique à Madagascar.
        </p>

        <div className="nb-apps-grid">
          {APP_CARDS.map((card) => (
            <div className={`nb-app-card reveal ${card.delay}`} key={card.num}>
              <div className="nb-app-bg-num">{card.num}</div>
              <div className="nb-app-arrow"><ArrowIcon /></div>
              <div className="nb-app-icon">{card.icon}</div>
              <div className="nb-app-category">{card.category}</div>
              <div className="nb-app-title">{card.title}</div>
              <div className="nb-app-desc">{card.desc}</div>
              <div className="nb-app-tags">
                {card.tags.map((tag) => (
                  <span className="nb-app-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="nb-usage-strip">
          {USAGE_STEPS.map((step, i) => (
            <div className="nb-usage-step" key={step.num}>
              <div className="nb-usage-step-num">{step.num}</div>
              <div className="nb-usage-step-title">{step.title}</div>
              <div className="nb-usage-step-desc">{step.desc}</div>
              {i < USAGE_STEPS.length - 1 && (
                <div className="nb-usage-arrow">
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="2" y1="6" x2="10" y2="6" /><polyline points="7,3 10,6 7,9" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ─── STOCKAGE ─── */}
      <section id="nb-stockage" className="nb-section-stockage">
        <div className="nb-eyebrow reveal">Recommandations</div>
        <h2 className="nb-section-title reveal reveal-delay-1">STOCKAGE & MANUTENTION</h2>
        <p className="nb-section-lead reveal reveal-delay-2">
          Quelques précautions simples pour préserver la qualité du bitume 35/50 entre la livraison et sa mise en œuvre, en environnement côtier.
        </p>
        <div className="nb-storage-grid">
          {STORAGE_ITEMS.map((item, i) => (
            <div className={`nb-storage-card reveal reveal-delay-${i + 2}`} key={item.title}>
              <div className="nb-storage-icon">{item.icon}</div>
              <div className="nb-storage-title">{item.title}</div>
              <div className="nb-storage-desc">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── TÉLÉCHARGEMENT ─── */}
      <section id="nb-telechargement" className="nb-section-download">
        <div className="nb-eyebrow reveal">Documentation technique</div>
        <h2 className="nb-section-title reveal reveal-delay-1">TÉLÉCHARGEZ<br />LA FICHE TECHNIQUE</h2>

        <div className="nb-download-layout">
          <div className="nb-download-left">
            <p className="nb-section-lead reveal reveal-delay-2">
              La fiche technique complète du bitume de pénétration 35/50 regroupe l'ensemble des spécifications ASTM, les recommandations spécifiques aux zones côtières, ainsi que les conditions de transport et de stockage.
            </p>
            <div className="nb-pdf-includes reveal reveal-delay-3">
              <div className="nb-pdf-includes-title">Contenu du document</div>
              <div className="nb-pdf-includes-list">
                {PDF_INCLUDES.map((item) => (
                  <div className="nb-pdf-include-item" key={item}>
                    <div className="nb-pdf-include-check">
                      <svg viewBox="0 0 10 10" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="2,5 4,7 8,3" />
                      </svg>
                    </div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="nb-download-card-wrap reveal reveal-delay-3">
            <div className="nb-pdf-card">
              <div className="nb-pdf-icon-wrap">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="nb-pdf-meta">
                <div className="nb-pdf-type">Fiche technique · PDF</div>
                <div className="nb-pdf-name">Bitume de pénétration 35/50</div>
                <div className="nb-pdf-desc">Spécifications complètes, méthodes ASTM, recommandations pour zones côtières, conditions de stockage et d'application.</div>
                <div className="nb-pdf-details">
                  <span className="nb-pdf-detail">Format PDF</span>
                  <span className="nb-pdf-detail">Version 2025</span>
                  <span className="nb-pdf-detail">Français</span>
                </div>
              </div>
            </div>

            <div className="nb-contact-nudge">
              <div className="nb-contact-nudge-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.98-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="nb-contact-nudge-text">
                Besoin d'un certificat d'analyse pour un lot spécifique ?{" "}
                <a href="/contact">Contactez notre équipe</a> — nous vous le transmettrons sous 48h.
              </div>
            </div>

            <a href="/api/fiche-technique?grade=35-50" target="_blank" rel="noopener noreferrer" className="nb-pdf-download-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="var(--black)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Télécharger la fiche technique
            </a>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <div className="nb-cta-banner nb-cta-banner--3550 reveal">
        <div className="nb-cta-banner-text">
          <h2>PRÊT À PASSER<br />COMMANDE ?</h2>
          <p>Notre équipe vous accompagne du devis à la livraison sur site.</p>
        </div>
        <a href="/#commander" className="nb-cta-banner-btn">
          Commander
        </a>
      </div>
    </>
  );
}
