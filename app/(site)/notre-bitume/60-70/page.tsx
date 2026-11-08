"use client";

import { useEffect } from "react";
import "../notre-bitume.css";

const COMP_BARS = [
  { name: "Résistance thermique", val: "Élevée", width: "88%", desc: "Stable jusqu'à 250 °C — point éclair ASTM D92" },
  { name: "Flexibilité", val: "≥ 100 cm", width: "75%", desc: "Ductilité à 25 °C — ASTM D113" },
  { name: "Pureté", val: "≥ 99%", width: "99%", desc: "Solubilité dans le trichloréthylène — ASTM D2042" },
  { name: "Stabilité au vieillissement", val: "≤ 20%", width: "82%", desc: "Baisse de pénétrabilité après chauffage — ASTM D5" },
  { name: "Densité", val: "1.01–1.06 kg/m³", width: "60%", desc: "Gravité spécifique à 25 °C — ASTM D70" },
];

const SPEC_ROWS = [
  { label: "Gravité spécifique à 25 °C", method: "ASTM D70", unit: "kg/m³", min: "1.01", max: "1.06" },
  { label: "Pénétrabilité à 25 °C, 100g, 5s", method: "ASTM D5", unit: "0.1 mm", min: "60", max: "70" },
  { label: "Point de ramollissement", method: "ASTM D36", unit: "°C", min: "49", max: "56" },
  { label: "Ductilité à 25 °C", method: "ASTM D113", unit: "cm", min: "100", max: null },
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
    category: "Infrastructure principale",
    title: "ROUTES NATIONALES & RÉGIONALES",
    desc: "Le bitume 60/70 constitue la couche de roulement et les couches de base des routes nationales soumises à des charges lourdes et à un trafic intense. Sa résistance à l'orniérage et sa durabilité en font le choix de référence pour les grands axes malgaches.",
    tags: ["Couche de roulement", "Trafic lourd", "Longue durée"],
    delay: "reveal-delay-2",
  },
  {
    num: "02",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" /><path d="M7 8h.01" /><path d="M12 8h.01" /><path d="M17 8h.01" />
      </svg>
    ),
    category: "Milieu urbain",
    title: "VOIRIES URBAINES & AXES DE VILLE",
    desc: "En milieu urbain, le bitume 60/70 est utilisé pour la réfection et la construction de chaussées urbaines, de boulevards et d'artères à fort passage. Sa capacité à supporter les cycles thermiques journaliers et les sollicitations fréquentes en fait un choix optimal pour les villes malgaches.",
    tags: ["Réfection", "Chaussée urbaine", "Cycles thermiques"],
    delay: "reveal-delay-3",
  },
  {
    num: "03",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 2c-2-2-4-2-5.5-.5L10 5 1.8 6.2c-1.1.2-1.3 1.6-.3 2.3L6 11l-2 3.5c-.5.8-.1 1.9.8 2.2l3.9.9.9 3.9c.3.9 1.4 1.3 2.2.8L15 20l2.5 4.5c.7 1 2.1.8 2.3-.3L17.8 19.2z" />
      </svg>
    ),
    category: "Infrastructures aéroportuaires",
    title: "PISTES D'AÉROPORT & AIRES DE TRAFIC",
    desc: "Les pistes aéroportuaires exigent des performances exceptionnelles en matière de résistance aux charges statiques et dynamiques ainsi qu'aux variations de température. Le bitume 60/70 répond à ces exigences strictes, garantissant la planéité et la durabilité des surfaces de roulement des aéronefs.",
    tags: ["Haute résistance", "Charges statiques", "Planéité"],
    delay: "reveal-delay-2",
  },
  {
    num: "04",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="M9 12h4a2 2 0 1 0 0-4H9v8" />
      </svg>
    ),
    category: "Surfaces commerciales & industrielles",
    title: "PARKINGS & ZONES INDUSTRIELLES",
    desc: "Les parkings et les zones logistiques soumis à des charges ponctuelles importantes — poids lourds, conteneurs, engins de chantier — nécessitent un bitume à forte résistance à l'orniérage. Le grade 60/70, plus rigide, convient particulièrement à ces surfaces exposées à des charges statiques prolongées.",
    tags: ["Zones logistiques", "Anti-orniérage", "Charges statiques"],
    delay: "reveal-delay-3",
  },
];

const USAGE_STEPS = [
  { num: "01", title: "Chauffage", desc: "Le bitume est chauffé entre 150 et 180 °C pour atteindre la viscosité d'application." },
  { num: "02", title: "Enrobage", desc: "Les agrégats sont enrobés au bitume chaud dans un malaxeur ou une centrale d'enrobage." },
  { num: "03", title: "Répandage", desc: "L'enrobé est répandu sur la chaussée à l'aide d'un finisseur à la température optimale." },
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
    desc: "À l'abri d'une exposition directe et prolongée à l'eau ou au soleil, pour préserver l'intégrité du produit.",
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
  "Domaines d'application et recommandations de mise en œuvre",
  "Informations de conditionnement et de transport",
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

export default function Bitume6070Page() {
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
        <div className="nb-page-hero-accent" aria-hidden="true">60/70</div>
        <div className="nb-page-hero-layout">
          <div className="nb-page-hero-left">

            <div className="nb-eyebrow reveal reveal-delay-1">Description du produit</div>
            <h1 className="nb-page-title reveal reveal-delay-2">
              QU&apos;EST-CE QUE LE<br /><em>BITUME 60/70 ?</em>
            </h1>

          </div>
        </div>
      </div>

      {/* ─── DESCRIPTION ─── */}
      <section id="nb-description" className="nb-section-description">
        <div className="nb-desc-layout">
          <div>
            <div className="nb-desc-body reveal reveal-delay-2">
              <p>Le <strong>bitume de pénétration 60/70</strong> est un liant hydrocarboné visqueux issu de la distillation du pétrole brut. Il se présente sous forme solide à température ambiante et devient fluide sous l'effet de la chaleur, permettant son application sur les chaussées.</p>
              <p>La désignation <strong>60/70</strong> correspond à l'indice de pénétrabilité du produit : une aiguille standard de 100 grammes pénètre entre 60 et 70 dixièmes de millimètre dans le bitume à 25 °C pendant 5 secondes. Cet indice détermine la consistance du produit — plus le chiffre est bas, plus le bitume est dur.</p>
              <p>Ce grade est particulièrement adapté aux <strong>conditions climatiques tropicales</strong> comme celles de Madagascar : il offre une résistance suffisante aux hautes températures estivales pour éviter les ornières, tout en conservant une flexibilité adéquate lors des variations saisonnières pour prévenir la fissuration.</p>
              <p>Le bitume 60/70 est utilisé en enrobage d'agrégats pour constituer les couches de roulement, les couches de liaison et les couches de base des structures de chaussées. Il peut également être employé en <strong>enduit superficiel</strong> pour le traitement de surface des routes à faible trafic.</p>
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
              FICHE TECHNIQUE<br />BITUME 60/70
            </h2>
          </div>
          <p className="section-lead reveal reveal-delay-2" style={{ maxWidth: "600px", textAlign: "right" }}>
            Caractéristiques conformes aux normes ASTM pour la construction et
            l'entretien des routes à Madagascar.
          </p>
        </div>
        <div className="spec-table-wrap reveal reveal-delay-2">
          <table className="spec-table">
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
        <h2 className="nb-section-title reveal reveal-delay-1">OÙ UTILISE-T-ON NOTRE BITUME ?</h2>
        <p className="nb-section-lead reveal reveal-delay-2">
          Le bitume 60/70 est adapté à une large gamme de chantiers, des routes nationales aux surfaces spécialisées, partout à Madagascar.
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
          Quelques précautions simples pour préserver la qualité du bitume 60/70 entre la livraison et sa mise en œuvre.
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
              La fiche technique complète du bitume de pénétration 60/70 regroupe l'ensemble des spécifications ASTM, les conditions de transport, de stockage et les recommandations d'application.
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
                <div className="nb-pdf-name">Bitume de pénétration 60/70</div>
                <div className="nb-pdf-desc">Spécifications complètes, méthodes ASTM, conditions de stockage et recommandations d'application pour le marché malgache.</div>
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

            <a href="/api/fiche-technique?grade=60-70" target="_blank" rel="noopener noreferrer" className="nb-pdf-download-btn">
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
      <div className="nb-cta-banner reveal">
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
