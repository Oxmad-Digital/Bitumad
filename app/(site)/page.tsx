"use client";
import "./page.css";
import { useState, useRef } from "react";
import Image from "next/image";
import { useReveal } from "@/hooks/useReveal";

type ProjetType = "route" | "voirie" | "aeroport" | "autre";
type GradeType = "6070" | "3550" | "both";

const TICKER_ITEMS = [
  "DURABILITÉ ÉPROUVÉE",
  "PERFORMANCE OPTIMALE",
  "SÉCURITÉ RENFORCÉE",
  "QUALITÉ CERTIFIÉE ASTM",
  "LIVRAISON PARTOUT À MADAGASCAR",
  "BITUME 60/70",
  "BITUME 35/50",
  "ZONES CÔTIÈRES",
];

const RADIO_OPTIONS: { value: ProjetType; label: string; sub: string }[] = [
  { value: "route", label: "Route nationale / régionale", sub: "Infrastructure" },
  { value: "voirie", label: "Voirie urbaine", sub: "Milieu urbain" },
  { value: "aeroport", label: "Aéroport / parking / zone industrielle", sub: "Spécialisé" },
  { value: "autre", label: "Autre projet", sub: "À préciser" },
];

const GRADE_OPTIONS: { value: GradeType; label: string; sub: string }[] = [
  { value: "6070", label: "Bitume 60/70", sub: "Zones intérieures" },
  { value: "3550", label: "Bitume 35/50", sub: "Zones côtières" },
  { value: "both", label: "Les deux grades", sub: "À préciser" },
];

export default function HomePage() {
  const [projet, setProjet] = useState<ProjetType>("route");
  const [grade, setGrade] = useState<GradeType>("6070");
  const heroBgRef = useRef<HTMLDivElement>(null);

  const [devisForm, setDevisForm] = useState({
    nom: "",
    org: "",
    tel: "",
    email: "",
    quantite: "",
    quantiteUnit: "tonnes",
    region: "",
    message: "",
  });
  const [sendingDevis, setSendingDevis] = useState(false);
  const [sentDevis, setSentDevis] = useState(false);

  const typeProjetLabel = RADIO_OPTIONS.find((o) => o.value === projet)?.label ?? projet;
  const gradeLabel = GRADE_OPTIONS.find((o) => o.value === grade)?.label ?? grade;

  const submitDevis = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSendingDevis(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "devis",
          nom: devisForm.nom,
          org: devisForm.org,
          tel: devisForm.tel,
          email: devisForm.email,
          typeProjet: `${typeProjetLabel} — ${gradeLabel}`,
          quantite: devisForm.quantite ? `${devisForm.quantite} ${devisForm.quantiteUnit === "futs" ? "fûts" : "tonnes"}` : "",
          region: devisForm.region,
          message: devisForm.message,
        }),
      });
      if (res.ok) {
        setSentDevis(true);
        setTimeout(() => {
          setSentDevis(false);
          setDevisForm({ nom: "", org: "", tel: "", email: "", quantite: "", quantiteUnit: "tonnes", region: "", message: "" });
          setProjet("route");
          setGrade("6070");
        }, 3000);
      }
    } catch { /* noop */ }
    setSendingDevis(false);
  };

  useReveal({ heroSelector: ".hero", baseDelay: 200, stepDelay: 150 });

  return (
    <>
      {/* ─── HERO ─── */}
      <div className="hero">
        <div className="hero-bg-wrap" ref={heroBgRef}>
          <Image
            src="https://res.cloudinary.com/uuiwf5lx/image/upload/q_auto/f_auto/v1779650742/bitumad_hero_route_madagascar_avce_fux_de_bitume_whcflo.jpg"
            alt="Route asphaltée à Madagascar — Bitumad, fournisseur de bitume de pénétration"
            fill
            priority
            sizes="100vw"
            onLoad={() => heroBgRef.current?.classList.add("loaded")}
            style={{
              objectFit: "cover",
              objectPosition: "center 40%",
              filter: "brightness(0.7) saturate(0.8)",
            }}
          />
        </div>
        <div className="hero-grid" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="eyebrow reveal">Fournisseur de bitume · Madagascar</div>
          <h1 className="hero-title reveal reveal-delay-2">
            DES ROUTES <em>SOLIDES</em><br />
            COMMENCENT ICI
          </h1>
          <p className="hero-sub reveal reveal-delay-3">
            Bitumad est votre partenaire de confiance pour des routes durables
            à Madagascar. Bitume haute qualité conforme aux normes
            internationales ASTM.
          </p>

        </div>
        <div className="ticker-wrap">
          <div className="ticker-track" aria-hidden="true">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span className="ticker-item" key={i}>
                {item} <span className="ticker-dot" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── À PROPOS ─── */}
      <section id="apropos">
        <div className="eyebrow reveal">À propos</div>
        <h2 className="section-title reveal reveal-delay-1">
          VOTRE PARTENAIRE<br />EN BITUME
        </h2>
        <div className="about-grid">
          <div className="about-body reveal reveal-delay-2">
            <p>
              Bitumad est une entreprise spécialisée dans la fourniture de
              bitume à Madagascar. Nous proposons deux grades de bitume de
              pénétration — le <strong className="text-white-strong">60/70</strong> pour les zones tropicales de
              l'intérieur, et le <strong className="text-white-strong">35/50</strong> pour les zones côtières à
              fort ensoleillement — conformes aux normes internationales ASTM.
            </p>
            <p>
              Nos produits s'adressent aussi bien aux institutions publiques,
              aux entreprises de BTP qu'aux particuliers, garantissant qualité,
              durabilité et performance pour vos projets d'infrastructure
              partout à Madagascar.
            </p>
          </div>
          <div className="features-grid reveal reveal-delay-3">
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="feature-title">Durabilité éprouvée</div>
              <div className="feature-desc">
                Excellente résistance au vieillissement et grande stabilité
                pour la longévité des routes.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                </svg>
              </div>
              <div className="feature-title">Performance optimale</div>
              <div className="feature-desc">
                Deux grades disponibles — 60/70 pour l'intérieur, 35/50 pour
                la côte — chacun adapté à son contexte climatique.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div className="feature-title">Sécurité renforcée</div>
              <div className="feature-desc">
                Point éclair élevé (≥ 250 °C) minimisant les risques liés au
                transport et à l'application.
              </div>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="8" r="6" />
                  <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
                </svg>
              </div>
              <div className="feature-title">Qualité certifiée</div>
              <div className="feature-desc">
                Conforme aux normes ASTM internationales, garantissant un
                produit fiable et performant.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── NOS PRODUITS ─── */}
      <section id="notreproduit">
        <div className="product-header">
          <div>
            <div className="eyebrow reveal">Nos bitumes</div>
            <h2 className="section-title reveal reveal-delay-1">
              DEUX GRADES<br />DISPONIBLES
            </h2>
          </div>
          <p className="section-lead section-lead--right reveal reveal-delay-2">
            Choisissez le grade adapté à votre zone de chantier.
          </p>
        </div>

        <div className="home-products-grid">
          <div className="home-product-card reveal reveal-delay-2">
            <div className="home-product-grade-row">
              <div className="home-product-grade">60/70</div>
            </div>
            <div className="home-product-zone">Zones intérieures · Hauts Plateaux · Villes</div>
            <div className="home-product-specs">
              <div className="home-product-spec">
                <div className="home-product-spec-val">60–70</div>
                <div className="home-product-spec-label">Pénétrabilité (0.1 mm)</div>
              </div>
              <div className="home-product-spec">
                <div className="home-product-spec-val">49–56°C</div>
                <div className="home-product-spec-label">Point de ramollissement</div>
              </div>
              <div className="home-product-spec">
                <div className="home-product-spec-val">≥100 cm</div>
                <div className="home-product-spec-label">Ductilité</div>
              </div>
            </div>
            <a href="/notre-bitume/60-70" className="home-product-link" aria-label="Voir la fiche technique du bitume 60/70">
              Voir la fiche technique
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true" focusable="false">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>

          <div className="home-product-card reveal reveal-delay-3">
            <div className="home-product-grade-row">
              <div className="home-product-grade">35/50</div>
              <span className="home-product-new">Nouveau</span>
            </div>
            <div className="home-product-zone">Zones côtières · Ports · Fort ensoleillement</div>
            <div className="home-product-specs">
              <div className="home-product-spec">
                <div className="home-product-spec-val">35–50</div>
                <div className="home-product-spec-label">Pénétrabilité (0.1 mm)</div>
              </div>
              <div className="home-product-spec">
                <div className="home-product-spec-val">52–60°C</div>
                <div className="home-product-spec-label">Point de ramollissement</div>
              </div>
              <div className="home-product-spec">
                <div className="home-product-spec-val">≥50 cm</div>
                <div className="home-product-spec-label">Ductilité</div>
              </div>
            </div>
            <a href="/notre-bitume/35-50" className="home-product-link" aria-label="Voir la fiche technique du bitume 35/50">
              Voir la fiche technique
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14" aria-hidden="true" focusable="false">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ─── PROCESSUS DE COMMANDE ─── */}
      <section id="commander">
        <div className="process-layout">
          <div className="process-content">
            <div className="eyebrow reveal">Commander</div>
            <h2 className="section-title reveal reveal-delay-1">
              PROCESSUS DE COMMANDE
            </h2>
            <p className="section-lead reveal reveal-delay-2">
              Un parcours simple et rapide — de la demande de devis à la livraison
              sur site.
            </p>

            <div className="process-grid">
              <div className="process-step reveal reveal-delay-2">
                <div className="process-number">01</div>
                <div className="process-step-num">ÉTAPE 01</div>
                <div className="process-title">Demande de devis</div>
                <div className="process-desc">
                  Remplissez notre formulaire de contact ou appelez-nous pour nous
                  communiquer vos besoins en bitume. Notre équipe analyse votre
                  demande et prépare une proposition claire et adaptée à votre
                  projet.
                </div>
              </div>
              <div className="process-step reveal reveal-delay-3">
                <div className="process-number">02</div>
                <div className="process-step-num">ÉTAPE 02</div>
                <div className="process-title">Confirmation de commande</div>
                <div className="process-desc">
                  Après validation du devis, nous confirmons ensemble les
                  quantités, les modalités de paiement et le calendrier de
                  livraison.
                </div>
              </div>
              <div className="process-step reveal reveal-delay-4">
                <div className="process-number">03</div>
                <div className="process-step-num">ÉTAPE 03</div>
                <div className="process-title">Livraison sur site</div>
                <div className="process-desc">
                  Nous organisons la logistique et assurons le transport du bitume
                  directement jusqu'à votre chantier, partout à Madagascar, avec
                  un suivi rigoureux pour respecter les délais.
                </div>
              </div>
            </div>
          </div>
          <Image
            src="https://res.cloudinary.com/uuiwf5lx/image/upload/v1784582515/bitumad_camion_f%C3%BBts-de-bitume_soir_nw6v3j.webp"
            alt="Zone de chargement de bitume au crépuscule"
            className="process-img reveal reveal-delay-3"
            width={400}
            height={600}
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>
      </section>

      {/* ─── DEVIS ─── */}
      <section id="devis">
        <div className="eyebrow reveal">Demande de devis</div>
        <h2 className="section-title reveal reveal-delay-1">
          OBTENEZ VOTRE DEVIS GRATUIT
        </h2>
        <p className="section-lead reveal reveal-delay-2">
          Remplissez ce formulaire et notre équipe vous répond sous 48h avec
          une proposition adaptée à votre chantier.
        </p>

        <div className="devis-layout">
          {/* Colonne gauche */}
          <div className="devis-left reveal reveal-delay-2">
            <div className="devis-promise">
              <div className="devis-promise-item">
                <div className="devis-promise-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <div>
                  <div className="devis-promise-title">Réponse sous 48h</div>
                  <div className="devis-promise-desc">
                    Notre équipe traite chaque demande rapidement et vous
                    envoie une proposition claire.
                  </div>
                </div>
              </div>
              <div className="devis-promise-item">
                <div className="devis-promise-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div>
                  <div className="devis-promise-title">Livraison sur site</div>
                  <div className="devis-promise-desc">
                    Transport organisé directement jusqu'à votre chantier,
                    partout à Madagascar.
                  </div>
                </div>
              </div>
            </div>

            <div className="devis-contact-direct">
              <div className="devis-contact-label">Préférez appeler ?</div>
              <div className="devis-phone">
                <div className="devis-phone-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.98-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                +261 34 07 00 205
              </div>
              <div className="devis-hours">Disponible du lundi au vendredi</div>
            </div>
          </div>

          {/* Formulaire */}
          <div className="devis-form reveal reveal-delay-3">
            <div className="devis-form-header">
              <span className="devis-form-title">
                Informations pour votre devis
              </span>
              <span className="devis-form-step">Tous les champs sont requis</span>
            </div>

            <form id="devis-quote-form" className="devis-form-body" onSubmit={submitDevis}>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="dv-nom">Nom complet</label>
                  <input type="text" id="dv-nom" placeholder="Jean Rakoto" required aria-required="true" value={devisForm.nom} onChange={(e) => setDevisForm({ ...devisForm, nom: e.target.value })} />
                </div>
                <div className="form-field">
                  <label htmlFor="dv-org">Entreprise / Organisation</label>
                  <input type="text" id="dv-org" placeholder="BTP Madagascar SARL" required aria-required="true" value={devisForm.org} onChange={(e) => setDevisForm({ ...devisForm, org: e.target.value })} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="dv-tel">Téléphone</label>
                  <input type="tel" id="dv-tel" placeholder="+261 XX XX XXX XX" required aria-required="true" value={devisForm.tel} onChange={(e) => setDevisForm({ ...devisForm, tel: e.target.value })} />
                </div>
                <div className="form-field">
                  <label htmlFor="dv-email">Email</label>
                  <input type="email" id="dv-email" placeholder="jean@exemple.com" required aria-required="true" value={devisForm.email} onChange={(e) => setDevisForm({ ...devisForm, email: e.target.value })} />
                </div>
              </div>

              <fieldset className="form-field form-fieldset">
                <legend>Type de projet</legend>
                <div className="radio-group">
                  {RADIO_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`radio-option${projet === opt.value ? " selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="projet"
                        value={opt.value}
                        checked={projet === opt.value}
                        onChange={() => setProjet(opt.value)}
                      />
                      <div className="radio-dot" aria-hidden="true" />
                      <span className="radio-label">{opt.label}</span>
                      <span className="radio-sub">{opt.sub}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="form-field form-fieldset">
                <legend>Grade souhaité</legend>
                <div className="radio-group">
                  {GRADE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`radio-option${grade === opt.value ? " selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="grade"
                        value={opt.value}
                        checked={grade === opt.value}
                        onChange={() => setGrade(opt.value)}
                      />
                      <div className="radio-dot" aria-hidden="true" />
                      <span className="radio-label">{opt.label}</span>
                      <span className="radio-sub">{opt.sub}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="dv-qte">Quantité souhaitée</label>
                  <div className="qte-input-group">
                    <input
                      type="number"
                      id="dv-qte"
                      min="1"
                      inputMode="numeric"
                      placeholder="Ex : 20"
                      required
                      aria-required="true"
                      value={devisForm.quantite}
                      onChange={(e) => setDevisForm({ ...devisForm, quantite: e.target.value })}
                    />
                    <div className="select-wrap qte-unit-wrap">
                      <select id="dv-qte-unit" aria-label="Unité de quantité" value={devisForm.quantiteUnit} onChange={(e) => setDevisForm({ ...devisForm, quantiteUnit: e.target.value })}>
                        <option value="tonnes">Tonnes</option>
                        <option value="futs">Fûts</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="dv-region">Région de livraison</label>
                  <input
                    type="text"
                    id="dv-region"
                    placeholder="Ex : Antananarivo, Toamasina…"
                    required
                    aria-required="true"
                    value={devisForm.region}
                    onChange={(e) => setDevisForm({ ...devisForm, region: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-field">
                <label htmlFor="dv-msg">Détails supplémentaires</label>
                <textarea
                  id="dv-msg"
                  placeholder="Décrivez votre chantier, le calendrier souhaité, ou toute information utile pour préparer votre devis…"
                  required
                  aria-required="true"
                  value={devisForm.message}
                  onChange={(e) => setDevisForm({ ...devisForm, message: e.target.value })}
                />
              </div>
            </form>

            <div className="devis-form-footer">
              <p className="devis-form-note">
                Vos données sont utilisées uniquement pour traiter votre
                demande de devis. Aucune divulgation à des tiers.
              </p>
              {sentDevis ? (
                <div className="sent-confirm">✓ Demande envoyée !</div>
              ) : (
                <button type="submit" form="devis-quote-form" className="form-submit" disabled={sendingDevis}>
                  Envoyer ma demande
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                    <path d="M22 12L2 5l5 7-5 7 20-7z" />
                    <line x1="7" y1="12" x2="14" y2="12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
