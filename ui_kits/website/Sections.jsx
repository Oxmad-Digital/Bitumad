/* Bitumad website — Hero, Ticker, Video strip, About, Spec sheet, Process */

const TICKER_ITEMS = [
  "DURABILITÉ ÉPROUVÉE", "PERFORMANCE OPTIMALE", "SÉCURITÉ RENFORCÉE",
  "QUALITÉ CERTIFIÉE ASTM", "LIVRAISON PARTOUT À MADAGASCAR", "BITUME 60/70",
];

const ArrowR = () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>);

function Hero({ onNav }) {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t); }, []);
  return (
    <div className="hero" id="hero">
      <div className={"hero-bg" + (loaded ? " loaded" : "")} />
      <div className="hero-grid" />
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="eyebrow reveal">Fournisseur de bitume · Madagascar</div>
        <h1 className="hero-title reveal reveal-delay-2">DES ROUTES <em>SOLIDES</em><br />COMMENCENT ICI</h1>
        <p className="hero-sub reveal reveal-delay-3">
          Bitumad est votre partenaire de confiance pour des routes durables à Madagascar.
          Bitume haute qualité conforme aux normes internationales ASTM.
        </p>
        <div className="hero-actions reveal reveal-delay-4">
          <button className="btn-primary" onClick={() => onNav("devis")}>Commander maintenant <ArrowR /></button>
          <button className="btn-ghost" onClick={() => onNav("notreproduit")}>Voir la fiche technique</button>
        </div>
      </div>
      <div className="ticker-wrap">
        <div className="ticker-track" aria-hidden="true">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span className="ticker-item" key={i}>{item} <span className="ticker-dot" /></span>
          ))}
        </div>
      </div>
    </div>
  );
}

function VideoStrip() {
  return (
    <div className="video-strip">
      <video src="https://media.bitumad.mg/Bitumad_vid%C3%A9o_bitume_coulant_ejc7u8.mp4" autoPlay muted loop playsInline />
      <div className="video-strip-overlay" />
      <span className="video-label">Bitumad · Application sur chantier</span>
    </div>
  );
}

const FEATURES = [
  { title: "Durabilité éprouvée", desc: "Excellente résistance au vieillissement et grande stabilité pour la longévité des routes.",
    icon: (<svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>) },
  { title: "Performance optimale", desc: "Pénétrabilité contrôlée (60/70) et point de ramollissement adapté au climat.",
    icon: (<svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>) },
  { title: "Sécurité renforcée", desc: "Point éclair élevé (≥ 250 °C) minimisant les risques au transport et à l'application.",
    icon: (<svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>) },
  { title: "Qualité certifiée", desc: "Conforme aux normes ASTM internationales, garantissant un produit fiable.",
    icon: (<svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>) },
];

function About() {
  return (
    <section className="section section--dark" id="apropos">
      <div className="eyebrow reveal">À propos</div>
      <h2 className="section-title reveal reveal-delay-1">VOTRE PARTENAIRE<br />EN BITUME</h2>
      <div className="about-grid">
        <div className="about-body reveal reveal-delay-2">
          <p>Bitumad est une entreprise spécialisée dans la fourniture de bitume à Madagascar. Nous proposons un bitume de pénétration 60/70, conforme aux normes internationales, idéal pour la construction et l&apos;entretien des routes.</p>
          <p>Nos produits s&apos;adressent aussi bien aux institutions publiques, aux entreprises de BTP qu&apos;aux particuliers, garantissant qualité, durabilité et performance pour vos projets.</p>
        </div>
        <div className="features-grid reveal reveal-delay-3">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const SPECS = [
  { name: "Gravité spécifique à 25 °C", method: "ASTM D70", unit: "kg/m³", min: "1.01", max: "1.06" },
  { name: "Pénétrabilité à 25 °C, 100g, 5s", method: "ASTM D5", unit: "0.1 mm", min: "60", max: "70" },
  { name: "Point de ramollissement", method: "ASTM D36", unit: "°C", min: "49", max: "56" },
  { name: "Ductilité à 25 °C", method: "ASTM D113", unit: "cm", min: "100", max: null },
  { name: "Perte au chauffage", method: "ASTM D6", unit: "% wt", min: null, max: "0.2" },
  { name: "Baisse de pénétrabilité après chauffage", method: "ASTM D5", unit: "%", min: null, max: "20" },
  { name: "Point éclair", method: "ASTM D92", unit: "°C", min: "250", max: null },
  { name: "Solubilité dans le trichloréthylène", method: "ASTM D2042", unit: "% wt", min: "99", max: null },
];

function SpecSheet() {
  return (
    <section className="section section--black" id="notreproduit">
      <div className="product-header">
        <div>
          <div className="eyebrow reveal">Notre bitume</div>
          <h2 className="section-title reveal reveal-delay-1">FICHE TECHNIQUE<br />BITUME 60/70</h2>
        </div>
        <p className="section-lead reveal reveal-delay-2" style={{ maxWidth: "340px", textAlign: "right" }}>
          Caractéristiques conformes aux normes ASTM pour la construction et l&apos;entretien des routes à Madagascar.
        </p>
      </div>
      <div className="reveal reveal-delay-2">
        <table className="spec-table">
          <thead><tr><th>Intitulé</th><th>Méthode</th><th>Unité</th><th>Min.</th><th>Max.</th></tr></thead>
          <tbody>
            {SPECS.map((s) => (
              <tr key={s.name}>
                <td>{s.name}</td>
                <td className="method">{s.method}</td>
                <td className="unit">{s.unit}</td>
                <td>{s.min ? <span className="val-badge val-min">{s.min}</span> : <span className="val-dash">—</span>}</td>
                <td>{s.max ? <span className="val-badge val-max">{s.max}</span> : <span className="val-dash">—</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", title: "Demande de devis", desc: "Remplissez notre formulaire ou appelez-nous pour communiquer vos besoins. Notre équipe analyse votre demande et prépare une proposition adaptée." },
  { n: "02", title: "Confirmation de commande", desc: "Après validation du devis, nous confirmons ensemble les quantités, modalités de paiement et le calendrier de livraison." },
  { n: "03", title: "Livraison sur site", desc: "Nous organisons la logistique et assurons le transport directement jusqu'à votre chantier, partout à Madagascar." },
];

function Process() {
  return (
    <section className="section section--dark" id="commander">
      <div className="eyebrow reveal">Commander</div>
      <h2 className="section-title reveal reveal-delay-1">PROCESSUS<br />DE COMMANDE</h2>
      <p className="section-lead reveal reveal-delay-2">Un parcours simple et rapide — de la demande de devis à la livraison sur site.</p>
      <div className="process-grid">
        {STEPS.map((s, i) => (
          <div className={"process-step reveal reveal-delay-" + (i + 2)} key={s.n}>
            <div className="process-number">{s.n}</div>
            <div className="process-step-num">ÉTAPE {s.n}</div>
            <div className="process-title">{s.title}</div>
            <div className="process-desc">{s.desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

Object.assign(window, { Hero, VideoStrip, About, SpecSheet, Process });
