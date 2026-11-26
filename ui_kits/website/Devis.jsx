/* Bitumad website — Devis (quote) section with interactive form */

const RADIO_OPTIONS = [
  { value: "route", label: "Route nationale / régionale", sub: "Infrastructure" },
  { value: "voirie", label: "Voirie urbaine", sub: "Milieu urbain" },
  { value: "aeroport", label: "Aéroport / parking / zone industrielle", sub: "Spécialisé" },
  { value: "autre", label: "Autre projet", sub: "À préciser" },
];

const IconClock = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>);
const IconPin = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="15" height="15"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>);
const IconPhone = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="13" height="13"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.98-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>);
const IconSend = () => (<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="8" x2="14" y2="8"/><polyline points="10,4 14,8 10,12"/></svg>);
const IconCheck = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>);

function Devis() {
  const [projet, setProjet] = React.useState("route");
  const [sent, setSent] = React.useState(false);
  const [nom, setNom] = React.useState("");

  const submit = (e) => { e.preventDefault(); setSent(true); };

  return (
    <section className="section section--black" id="devis">
      <div className="eyebrow reveal">Demande de devis</div>
      <h2 className="section-title reveal reveal-delay-1">OBTENEZ VOTRE DEVIS GRATUIT</h2>
      <p className="section-lead reveal reveal-delay-2">
        Remplissez ce formulaire et notre équipe vous répond sous 24h avec une proposition adaptée à votre chantier.
      </p>

      <div className="devis-layout">
        <div className="devis-left reveal reveal-delay-2">
          <div className="devis-promise">
            <div className="devis-promise-item">
              <div className="devis-promise-icon"><IconClock /></div>
              <div>
                <div className="devis-promise-title">Réponse sous 24h</div>
                <div className="devis-promise-desc">Notre équipe traite chaque demande rapidement et vous envoie une proposition claire.</div>
              </div>
            </div>
            <div className="devis-promise-item">
              <div className="devis-promise-icon"><IconPin /></div>
              <div>
                <div className="devis-promise-title">Livraison sur site</div>
                <div className="devis-promise-desc">Transport organisé directement jusqu&apos;à votre chantier, partout à Madagascar.</div>
              </div>
            </div>
          </div>
          <div className="devis-contact-direct">
            <div className="devis-contact-label">Préférez appeler ?</div>
            <div className="devis-phone"><div className="devis-phone-icon"><IconPhone /></div>+261 38 81 202 93</div>
            <div className="devis-hours">Disponible du lundi au vendredi</div>
          </div>
        </div>

        <div className="devis-form reveal reveal-delay-3">
          {sent ? (
            <div className="form-success">
              <div className="form-success-icon"><IconCheck /></div>
              <h3>DEMANDE ENVOYÉE</h3>
              <p>Merci{nom ? `, ${nom.split(" ")[0]}` : ""} — votre demande de devis est bien reçue. Notre équipe vous répond sous 24h.</p>
              <button className="btn-ghost" onClick={() => setSent(false)}>Envoyer une autre demande</button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="devis-form-header">
                <span className="devis-form-title">Informations pour votre devis</span>
                <span className="devis-form-step">Tous les champs sont requis</span>
              </div>
              <div className="devis-form-body">
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="dv-nom">Nom complet</label>
                    <input type="text" id="dv-nom" placeholder="Jean Rakoto" value={nom} onChange={(e) => setNom(e.target.value)} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="dv-org">Entreprise / Organisation</label>
                    <input type="text" id="dv-org" placeholder="BTP Madagascar SARL" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field"><label htmlFor="dv-tel">Téléphone</label><input type="tel" id="dv-tel" placeholder="+261 XX XX XXX XX" /></div>
                  <div className="form-field"><label htmlFor="dv-email">Email</label><input type="email" id="dv-email" placeholder="jean@exemple.com" /></div>
                </div>
                <div className="form-field">
                  <label>Type de projet</label>
                  <div className="radio-group">
                    {RADIO_OPTIONS.map((opt) => (
                      <label key={opt.value} className={"radio-option" + (projet === opt.value ? " selected" : "")} onClick={() => setProjet(opt.value)}>
                        <span className="radio-dot" />
                        <span className="radio-label">{opt.label}</span>
                        <span className="radio-sub">{opt.sub}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="dv-qte">Quantité estimée</label>
                    <div className="select-wrap">
                      <select id="dv-qte" defaultValue="">
                        <option value="" disabled>Sélectionner…</option>
                        <option>Moins de 5 tonnes</option>
                        <option>5 – 20 tonnes</option>
                        <option>20 – 50 tonnes</option>
                        <option>50 – 100 tonnes</option>
                        <option>Plus de 100 tonnes</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-field"><label htmlFor="dv-region">Région de livraison</label><input type="text" id="dv-region" placeholder="Ex : Antananarivo, Toamasina…" /></div>
                </div>
                <div className="form-field">
                  <label htmlFor="dv-msg">Détails supplémentaires</label>
                  <textarea id="dv-msg" placeholder="Décrivez votre chantier, le calendrier souhaité, ou toute information utile…" />
                </div>
              </div>
              <div className="devis-form-footer">
                <p className="devis-form-note">Vos données sont utilisées uniquement pour traiter votre demande. Aucune divulgation à des tiers.</p>
                <button className="form-submit" type="submit">Envoyer ma demande <IconSend /></button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Devis });
