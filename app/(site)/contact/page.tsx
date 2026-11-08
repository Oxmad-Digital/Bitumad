"use client";
import { useState } from "react";
import Link from "next/link";
import "./contact.css";
import { useReveal } from "@/hooks/useReveal";

type Tab = "message" | "partenariat";

const FAQ_ITEMS = [
  {
    q: "Quel est le délai de traitement d'un devis ?",
    a: "Notre équipe analyse votre demande et vous envoie une proposition détaillée sous 48 heures ouvrées. Pour les commandes urgentes, n'hésitez pas à nous appeler directement au +261 34 07 00 205.",
  },
  {
    q: "Livrez-vous partout à Madagascar ?",
    a: "Oui. Nous organisons la logistique et assurons la livraison sur l'ensemble du territoire malgache, y compris dans les zones éloignées. Le délai et le coût de transport sont précisés dans le devis en fonction de votre localisation.",
  },
  {
    q: "Quelle est la quantité minimale de commande ?",
    a: "Nous acceptons des commandes à partir d'un fût et nous adressons aussi bien aux particuliers qu'aux grandes entreprises de BTP ou aux institutions publiques. Contactez-nous pour discuter de vos besoins spécifiques.",
  },
  {
    q: "Le bitume est-il fourni avec un certificat d'analyse ?",
    a: "Oui, chaque livraison est accompagnée d'un certificat d'analyse (CoA) attestant la conformité du lot aux normes ASTM. Tous les paramètres clés — pénétrabilité, point de ramollissement, ductilité, point éclair — y sont détaillés.",
  },
  {
    q: "Sous quel conditionnement est livré le bitume ?",
    a: "Le bitume de pénétration 60/70 est conditionné en fûts de 180 kg, facilitant la manutention et le stockage sur chantier. Des conditionnements spécifiques peuvent être envisagés pour des volumes importants — précisez vos besoins dans le formulaire de devis.",
  },
  {
    q: "Quelles sont les conditions de paiement ?",
    a: "Les conditions de paiement sont précisées dans le devis et adaptées à chaque situation : institutions publiques, entreprises et particuliers. N'hésitez pas à nous contacter pour discuter des modalités adaptées à votre contexte.",
  },
];

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M22 12L2 5l5 7-5 7 20-7z" />
    <line x1="7" y1="12" x2="14" y2="12" />
  </svg>
);

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<Tab>("message");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [msgForm, setMsgForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [partForm, setPartForm] = useState({ nom: "", poste: "", org: "", email: "", nature: "", message: "" });

  const [sentMsg, setSentMsg] = useState(false);
  const [sentPart, setSentPart] = useState(false);
  const [sending, setSending] = useState(false);

  useReveal({ heroSelector: ".page-hero" });

  const submitMsg = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "message", ...msgForm }),
      });
      if (res.ok) {
        setSentMsg(true);
        setTimeout(() => {
          setSentMsg(false);
          setMsgForm({ nom: "", email: "", sujet: "", message: "" });
        }, 3000);
      }
    } catch { /* noop */ }
    setSending(false);
  };

  const submitPart = async () => {
    setSending(true);
    try {
      const { nature, ...rest } = partForm;
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "partenariat", naturePartenariat: nature, ...rest }),
      });
      if (res.ok) {
        setSentPart(true);
        setTimeout(() => {
          setSentPart(false);
          setPartForm({ nom: "", poste: "", org: "", email: "", nature: "", message: "" });
        }, 3000);
      }
    } catch { /* noop */ }
    setSending(false);
  };

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero">
        <video className="page-hero-video" src="https://res.cloudinary.com/uuiwf5lx/video/upload/q_auto/f_auto/v1779650745/Bitumad_vid%C3%A9o_bitume_coulant_ejc7u8.mp4" autoPlay muted loop playsInline aria-label="Vidéo décorative — bitume en cours de coulage" />
        <div className="page-hero-grid" />
        <div className="page-hero-content">
<div className="c-eyebrow reveal reveal-delay-1">Contactez-nous</div>
          <h1 className="page-title reveal reveal-delay-2">
            PARLONS DE VOTRE<br /><em>PROJET</em>
          </h1>
          <p className="page-lead reveal reveal-delay-3">
            Une question sur nos produits, une demande de devis ou un partenariat à envisager — notre équipe est disponible et vous répond sous 48 heures.
          </p>
        </div>
      </div>

      {/* CONTACT MAIN */}
      <section id="contact-main">
        <div className="contact-master-grid">

          {/* LEFT: coordonnées */}
          <div className="contact-info-col reveal reveal-delay-1">
            <div className="info-card">
              <div className="info-card-header">Nos coordonnées</div>
              <div className="info-card-body">
                <div className="info-row">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.8a16 16 0 0 0 6.29 6.29l.98-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  </div>
                  <div>
                    <div className="info-label">Téléphone</div>
                    <div className="info-value"><a href="tel:+261340700205">+261 34 07 00 205</a></div>
                    <div className="info-sub">Appels &amp; WhatsApp</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  </div>
                  <div>
                    <div className="info-label">Email</div>
                    <div className="info-value"><a href="mailto:info@bitumad.mg">info@bitumad.mg</a></div>
                    <div className="info-sub">Réponse sous 48h</div>
                  </div>
                </div>
                <div className="info-row">
                  <div className="info-icon">
                    <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  </div>
                  <div>
                    <div className="info-label">Adresse</div>
                    <div className="info-value">Antananarivo</div>
                    <div className="info-sub">Madagascar</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="map-card">
              <iframe
                src="https://maps.google.com/maps?q=2GVG%2BFVJ&z=15&output=embed"
                allowFullScreen
                loading="lazy"
                title="Localisation Bitumad"
              />
            </div>

            <div className="hours-card">
              <div className="hours-card-header">Disponibilité</div>
              <div className="hours-row">
                <span className="hours-day">Lundi – Vendredi</span>
                <span className="hours-time">08h00 – 17h00</span>
              </div>
              <div className="hours-row">
                <span className="hours-day">Samedi</span>
                <span className="hours-time">08h00 – 12h00</span>
              </div>
              <div className="hours-row">
                <span className="hours-day">Dimanche</span>
                <span className="hours-time closed">Fermé</span>
              </div>
            </div>
          </div>

          {/* RIGHT: formulaires à onglets */}
          <div className="contact-form-col reveal reveal-delay-2">
            <div className="form-tabs" role="tablist">
              <button
                className={`form-tab${activeTab === "message" ? " active" : ""}`}
                onClick={() => setActiveTab("message")}
                role="tab"
                aria-selected={activeTab === "message"}
                aria-controls="panel-message"
                id="tab-message"
              >
                Message général
              </button>
              <button
                className={`form-tab${activeTab === "partenariat" ? " active" : ""}`}
                onClick={() => setActiveTab("partenariat")}
                role="tab"
                aria-selected={activeTab === "partenariat"}
                aria-controls="panel-partenariat"
                id="tab-partenariat"
              >
                Partenariat
              </button>
            </div>

            {/* Panel Message */}
            {activeTab === "message" && (
              <div className="form-panel active" role="tabpanel" id="panel-message" aria-labelledby="tab-message">
                <div className="form-panel-body">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="m-nom">Nom complet</label>
                      <input type="text" id="m-nom" placeholder="Jean Rakoto" value={msgForm.nom} onChange={(e) => setMsgForm({ ...msgForm, nom: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="m-email">Email</label>
                      <input type="email" id="m-email" placeholder="jean@exemple.com" value={msgForm.email} onChange={(e) => setMsgForm({ ...msgForm, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="m-sujet">Sujet</label>
                    <div className="select-wrap">
                      <select id="m-sujet" value={msgForm.sujet} onChange={(e) => setMsgForm({ ...msgForm, sujet: e.target.value })}>
                        <option value="">Choisir un sujet…</option>
                        <option>Question sur le produit</option>
                        <option>Délais et livraison</option>
                        <option>Certification / documentation</option>
                        <option>Facturation</option>
                        <option>Autre</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="m-msg">Message</label>
                    <textarea id="m-msg" style={{ height: "160px" }} placeholder="Décrivez votre question ou demande…" value={msgForm.message} onChange={(e) => setMsgForm({ ...msgForm, message: e.target.value })} />
                  </div>
                </div>
                <div className="form-panel-footer">
                  <p className="form-note">Notre équipe traite les messages dans l&apos;ordre de réception. Réponse garantie sous 48h ouvrées.</p>
                  {sentMsg ? (
                    <div className="sent-confirm">✓ Message envoyé !</div>
                  ) : (
                    <button className="btn-submit" onClick={submitMsg} disabled={sending}>
                      Envoyer le message <ArrowIcon />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Panel Partenariat */}
            {activeTab === "partenariat" && (
              <div className="form-panel active" role="tabpanel" id="panel-partenariat" aria-labelledby="tab-partenariat">
                <div className="form-panel-body">
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="p-nom">Nom &amp; prénom</label>
                      <input type="text" id="p-nom" placeholder="Jean Rakoto" value={partForm.nom} onChange={(e) => setPartForm({ ...partForm, nom: e.target.value })} aria-required="true" />
                    </div>
                    <div className="form-field">
                      <label htmlFor="p-poste">Poste / Fonction</label>
                      <input type="text" id="p-poste" placeholder="Directeur commercial" value={partForm.poste} onChange={(e) => setPartForm({ ...partForm, poste: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-field">
                      <label htmlFor="p-org">Organisation</label>
                      <input type="text" id="p-org" placeholder="Nom de votre entreprise" value={partForm.org} onChange={(e) => setPartForm({ ...partForm, org: e.target.value })} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="p-email">Email professionnel</label>
                      <input type="email" id="p-email" placeholder="jean@entreprise.com" value={partForm.email} onChange={(e) => setPartForm({ ...partForm, email: e.target.value })} aria-required="true" />
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="p-nature">Nature du partenariat envisagé</label>
                    <input
                      type="text"
                      id="p-nature"
                      placeholder="Ex : Distribution régionale, logistique & transport…"
                      value={partForm.nature}
                      onChange={(e) => setPartForm({ ...partForm, nature: e.target.value })}
                      aria-required="true"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="p-msg">Décrivez votre proposition</label>
                    <textarea id="p-msg" style={{ height: "120px" }} placeholder="Contexte, objectifs et modalités envisagées…" value={partForm.message} onChange={(e) => setPartForm({ ...partForm, message: e.target.value })} />
                  </div>
                </div>
                <div className="form-panel-footer">
                  <p className="form-note">Les demandes de partenariat sont examinées par notre direction. Retour sous 48–72h ouvrées.</p>
                  {sentPart ? (
                    <div className="sent-confirm">✓ Proposition envoyée !</div>
                  ) : (
                    <button className="btn-submit" onClick={submitPart} disabled={sending}>
                      Soumettre ma proposition <ArrowIcon />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="c-faq">
        <div className="faq-grid">
          <div>
            <div className="c-eyebrow reveal">Questions fréquentes</div>
            <h2 className="faq-title reveal reveal-delay-1">VOUS AVEZ<br />DES QUESTIONS ?</h2>
            <p className="faq-intro reveal reveal-delay-2">
              Les réponses aux interrogations les plus fréquentes. Si vous ne trouvez pas votre réponse, contactez-nous directement.
            </p>
          </div>
          <div className="faq-list reveal reveal-delay-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="faq-item">
                <button
                  className={`faq-q${openFaq === i ? " open" : ""}`}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  aria-controls={`faq-answer-${i}`}
                >
                  {item.q}
                  <div className="faq-icon" aria-hidden="true">
                    <svg viewBox="0 0 12 12"><line x1="6" y1="2" x2="6" y2="10" /><line x1="2" y1="6" x2="10" y2="6" /></svg>
                  </div>
                </button>
                <div id={`faq-answer-${i}`} className={`faq-a${openFaq === i ? " open" : ""}`}>{item.a}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="c-cta-banner reveal">
        <div className="cta-banner-text">
          <h2>PRÊT À DÉMARRER<br />VOTRE PROJET ?</h2>
          <p>Demandez votre devis personnalisé dès maintenant.</p>
        </div>
        <a href="/#devis" className="cta-banner-btn">
          Obtenir un devis
        </a>
      </div>
    </>
  );
}
