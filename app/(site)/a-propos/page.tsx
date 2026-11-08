'use client';
import Image from 'next/image';
import './a-propos.css';
import { useReveal } from '@/hooks/useReveal';

const SUPPLY_CHAIN_STEPS = [
  {
    label: 'Fournisseurs internationaux',
    sub: 'Raffinage & négoce',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
    ),
  },
  {
    label: 'Transport maritime',
    sub: 'En fûts 180 kg',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
    ),
  },
  {
    label: 'Arrivée port de Toamasina',
    sub: 'Réception',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
  },
  {
    label: 'Dédouanement',
    sub: 'Conformité douanière',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
    ),
  },
  {
    label: 'Acheminement entrepôt',
    sub: 'Transport routier',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M22 17H2a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h20" /><rect x="2" y="14" width="20" height="8" rx="2" /><path d="M6 6V4" /><path d="M10 6V4" /><path d="M14 6V4" /><path d="M18 6V4" /></svg>
    ),
  },
  {
    label: 'Stockage sécurisé',
    sub: 'Entrepôt Bitumad',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 21h18" /><path d="M5 21V10l7-6 7 6v11" /><path d="M9 21v-6h6v6" /></svg>
    ),
  },
  {
    label: 'Livraison client finale',
    sub: 'Partout à Madagascar',
    icon: (
      <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
  },
];

export default function APropos() {
  useReveal({ heroSelector: '.page-hero' });

  return (
    <>
      {/* PAGE HERO */}
      <div className="page-hero">
        <div className="page-hero-bg page-hero-bg--1" />
        <div className="page-hero-bg page-hero-bg--2" />
        <div className="page-hero-grid" />
        <div className="page-hero-content">
<div className="eyebrow reveal reveal-delay-1">Notre histoire</div>
          <h1 className="page-title reveal reveal-delay-2">
            L&apos;ORIGINE DE BITUMAD
          </h1>
          <p className="page-lead reveal reveal-delay-3">
            Une entreprise fondée sur un constat terrain et une conviction forte : l&apos;accès à un bitume de qualité est un levier direct de développement économique pour Madagascar.
          </p>
        </div>
      </div>

      {/* MOT DU PRÉSIDENT */}
      <section id="president" className="ap-section ap-president">
        <div className="eyebrow reveal">Le mot du Président</div>

        <div className="president-quote-block reveal reveal-delay-2">
          <blockquote className="president-quote">
            « Construire aujourd&apos;hui les routes qui accompagneront le développement de Madagascar demain. »
          </blockquote>
          <div className="president-author">
            <div className="president-author-name">Galib Daya</div>
            <div className="president-author-role">Président, Bitumad</div>
          </div>
        </div>

        <div className="president-pillars reveal reveal-delay-3">
          <div className="president-pillar">
            <div className="president-pillar-title">Pérennité & fiabilité</div>
            <div className="president-pillar-desc">Bâtir une structure solide et durable au service des infrastructures routières malgaches.</div>
          </div>
          <div className="president-pillar">
            <div className="president-pillar-title">Preuve du concept</div>
            <div className="president-pillar-desc">Réussite de notre première opération majeure d&apos;importation : 200 tonnes de bitume réparties en 10 conteneurs.</div>
          </div>
          <div className="president-pillar">
            <div className="president-pillar-title">Ambition</div>
            <div className="president-pillar-desc">Devenir la référence nationale de l&apos;importation et de la distribution de bitume à Madagascar, en maîtrisant toute la chaîne logistique — de l&apos;international jusqu&apos;au client final.</div>
          </div>
        </div>
      </section>

      {/* HISTOIRE */}
      <section id="histoire" className="ap-section ap-histoire">
        <div className="histoire-layout">
          <div className="histoire-left reveal reveal-delay-2">
            <div className="histoire-year">2024</div>
            <div className="histoire-founded-label">Année de fondation</div>
            <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.8, marginBottom: '24px' }}>
              Bitumad voit le jour à Antananarivo, portée par la conviction que l&apos;état des infrastructures routières est un frein majeur au développement de Madagascar.
            </p>
            <Image
              src="https://res.cloudinary.com/uuiwf5lx/image/upload/q_auto/f_auto/v1780760304/bitumad-route-rurale-degradee-laterite-madagascar_lyucox.jpg"
              alt="Route rurale dégradée à Madagascar — latérite rouge"
              className="histoire-photo reveal reveal-delay-3"
              width={560}
              height={360}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div className="histoire-right">
            <div className="timeline-item reveal reveal-delay-2">
              <div className="timeline-dot-col">
                <div className="timeline-dot" />
                <div className="timeline-line" />
              </div>
              <div>
                <span className="timeline-year-tag">2024 — Fondation</span>
                <div className="timeline-title">Naissance de Bitumad</div>
                <div className="timeline-body">
                  Face à une demande non satisfaite en matériaux routiers de qualité à Madagascar, Bitumad naît avec un objectif clair : rendre accessible un bitume de pénétration conforme aux normes internationales, directement importé depuis des fournisseurs certifiés.
                </div>
              </div>
            </div>
            <div className="timeline-item reveal reveal-delay-3">
              <div className="timeline-dot-col">
                <div className="timeline-dot" />
                <div className="timeline-line" />
              </div>
              <div>
                <span className="timeline-year-tag">Le constat</span>
                <div className="timeline-title">Un réseau routier sous pression</div>
                <div className="timeline-body">
                  Plus de 80 % du réseau routier malgache est classifié en mauvais ou très mauvais état selon les données du ministère des travaux publics. Les pluies tropicales, la chaleur et le trafic lourd dégradent rapidement les chaussées. L&apos;accès à un bitume technique adapté aux conditions climatiques locales est devenu une nécessité stratégique.
                </div>
              </div>
            </div>
            <div className="timeline-item reveal reveal-delay-4">
              <div className="timeline-dot-col">
                <div className="timeline-dot" />
                <div className="timeline-line" />
              </div>
              <div>
                <span className="timeline-year-tag">Notre réponse</span>
                <div className="timeline-title">Un bitume pensé pour Madagascar</div>
                <div className="timeline-body">
                  Bitumad sélectionne des bitumes de pénétration spécialement adaptés aux variations climatiques de la Grande Île — résistants aux hautes températures estivales et flexibles lors des saisons fraîches. Nos partenariats avec des fournisseurs internationaux garantissent une traçabilité totale et une conformité ASTM à chaque livraison.
                </div>
              </div>
            </div>
            <div className="timeline-item reveal reveal-delay-4">
              <div className="timeline-dot-col">
                <div className="timeline-dot hollow" />
              </div>
              <div>
                <span className="timeline-year-tag">Aujourd&apos;hui & demain</span>
                <div className="timeline-title">Étendre notre couverture nationale</div>
                <div className="timeline-body">
                  Bitumad s&apos;étend progressivement pour couvrir l&apos;ensemble du territoire malgache, en développant un réseau logistique fiable pour livrer sur les chantiers les plus reculés. Notre ambition : devenir le fournisseur de référence en bitume à Madagascar.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloc contexte */}
        <div className="context-block reveal reveal-delay-2">
          <div>
            <div className="context-block-title">Madagascar et ses infrastructures : un défi urgent</div>
            <div className="context-block-text">
              <p>Madagascar dispose d&apos;un réseau de routes nationales et secondaires couvrant plusieurs dizaines de milliers de kilomètres. Mais une large portion de ce réseau reste non bitumée ou en état de dégradation avancée, pénalisant les échanges économiques, l&apos;accès aux soins et à l&apos;éducation.</p>
            </div>
          </div>
          <div className="context-stat-list">
            <div className="context-stat-item">
              <div className="context-stat-bar-wrap">
                <div className="context-stat-header">
                  <span className="context-stat-name">Routes en mauvais état</span>
                  <span className="context-stat-value">~80%</span>
                </div>
                <div className="context-stat-bar-bg">
                  <div
                    className="context-stat-bar-fill"
                    style={{ width: '80%' }}
                    role="progressbar"
                    aria-valuenow={80}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Routes en mauvais état : 80%"
                  />
                </div>
                <div className="context-stat-sub">Réseau routier malgache classifié dégradé</div>
              </div>
            </div>
            <div className="context-stat-item">
              <div className="context-stat-bar-wrap">
                <div className="context-stat-header">
                  <span className="context-stat-name">Routes non bitumées</span>
                  <span className="context-stat-value">~65%</span>
                </div>
                <div className="context-stat-bar-bg">
                  <div
                    className="context-stat-bar-fill"
                    style={{ width: '65%' }}
                    role="progressbar"
                    aria-valuenow={65}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Routes non bitumées : 65%"
                  />
                </div>
                <div className="context-stat-sub">Part des routes nationales sans revêtement bitumineux</div>
              </div>
            </div>
            <div className="context-stat-item">
              <div className="context-stat-bar-wrap">
                <div className="context-stat-header">
                  <span className="context-stat-name">Croissance des marchés BTP</span>
                  <span className="context-stat-value">+12%/an</span>
                </div>
                <div className="context-stat-bar-bg">
                  <div
                    className="context-stat-bar-fill"
                    style={{ width: '45%' }}
                    role="progressbar"
                    aria-valuenow={12}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Croissance des marchés BTP : +12% par an"
                  />
                </div>
                <div className="context-stat-sub">Hausse de la demande en matériaux routiers à Madagascar</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALEURS */}
      <section id="mission" className="ap-section ap-mission">
        <div className="eyebrow reveal">Mission · Vision · Valeurs</div>
        <h2 className="section-title reveal reveal-delay-1">CE QUI NOUS ANIME</h2>
        <p className="section-lead reveal reveal-delay-2">
          Trois piliers qui guident chacune de nos décisions, du choix de nos fournisseurs jusqu&apos;à la livraison sur votre chantier.
        </p>

        <div className="mvv-grid">
          <div className="mvv-card reveal reveal-delay-2">
            <div className="mvv-icon">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
            <div className="mvv-type">Mission</div>
            <div className="mvv-title">RENDRE LES ROUTES MALGACHES PLUS SOLIDES</div>
            <div className="mvv-text">Fournir aux entreprises de BTP, aux institutions publiques et aux particuliers un bitume de qualité internationale, livré dans les délais, partout à Madagascar.</div>
          </div>
          <div className="mvv-card reveal reveal-delay-3">
            <div className="mvv-icon">
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </div>
            <div className="mvv-type">Vision</div>
            <div className="mvv-title">DEVENIR LE FOURNISSEUR DE RÉFÉRENCE</div>
            <div className="mvv-text">Être reconnu comme le partenaire incontournable en bitume à Madagascar, en bâtissant un réseau logistique national capable de répondre à la demande croissante en infrastructures.</div>
          </div>
          <div className="mvv-card reveal reveal-delay-4">
            <div className="mvv-icon">
              <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <div className="mvv-type">Engagement</div>
            <div className="mvv-title">UN IMPACT LOCAL CONCRET</div>
            <div className="mvv-text">Contribuer activement au développement économique de Madagascar en soutenant des projets d&apos;infrastructure durables, en créant de l&apos;emploi local et en jouant un rôle de partenaire de long terme.</div>
          </div>
        </div>

        <div className="valeurs-title reveal">Nos valeurs</div>
        <div className="valeurs-grid">
          <div className="valeur-item reveal reveal-delay-1">
            <div className="valeur-num">01</div>
            <div className="valeur-name">Intégrité</div>
            <div className="valeur-desc">Transparence, respect strict des contrats et éthique dans toutes nos transactions commerciales.</div>
          </div>
          <div className="valeur-item reveal reveal-delay-2">
            <div className="valeur-num">02</div>
            <div className="valeur-name">Excellence</div>
            <div className="valeur-desc">Sélection rigoureuse de fournisseurs reconnus mondialement et recherche constante de la meilleure qualité.</div>
          </div>
          <div className="valeur-item reveal reveal-delay-3">
            <div className="valeur-num">03</div>
            <div className="valeur-name">Fiabilité</div>
            <div className="valeur-desc">Disponibilité permanente des produits, respect des délais de livraison et stabilité des prix engagés.</div>
          </div>
          <div className="valeur-item reveal reveal-delay-4">
            <div className="valeur-num">04</div>
            <div className="valeur-name">Engagement local</div>
            <div className="valeur-desc">Impact direct sur le développement économique et la réhabilitation du réseau routier malgache.</div>
          </div>
        </div>
      </section>

      {/* PARTENAIRES & CERTIFICATIONS */}
      <section id="partenaires" className="ap-section ap-partenaires">
        <div className="eyebrow reveal">Partenaires & certifications</div>
        <h2 className="section-title reveal reveal-delay-1">NOS SOURCES & GARANTIES</h2>

        <div className="partenaires-intro">
          <div className="partenaires-left reveal reveal-delay-2">
            <div className="partenaires-text">
              <p>Bitumad s&apos;approvisionne auprès de raffineries et négociants internationaux reconnus, en sélectionnant exclusivement un bitume de pénétration 60/70 conforme aux standards ASTM et adapté aux conditions tropicales de Madagascar.</p>
              <p>Chaque lot est accompagné de son certificat d&apos;analyse (CoA) permettant de vérifier la conformité des paramètres clés : pénétrabilité, point de ramollissement, ductilité et point éclair.</p>
            </div>
            <div className="supply-chain">
              <div className="supply-chain-title">Chaîne d&apos;approvisionnement</div>
              {SUPPLY_CHAIN_STEPS.map((step) => (
                <div className="supply-step" key={step.label}>
                  <div className="supply-step-icon">{step.icon}</div>
                  {step.label}
                  <span className="supply-step-sub">{step.sub}</span>
                </div>
              ))}
            </div>
          </div>
          <Image
            src="https://res.cloudinary.com/uuiwf5lx/image/upload/v1784582208/Bitumad_chargement-conteneur-futs_ivyrl8.webp"
            alt="Déchargement de fûts de bitume depuis un camion sur site"
            className="supply-chain-photo reveal reveal-delay-3"
            width={560}
            height={420}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Gestion des risques */}
        <div className="risks-title reveal">Gestion des risques</div>
        <div className="risks-grid">
          <div className="risk-card reveal reveal-delay-2">
            <div className="risk-icon">
              <svg viewBox="0 0 24 24"><path d="M12 2l2.4 6.8L21 9l-5.5 4.6L17 21l-5-3.8L7 21l1.5-7.4L3 9l6.6-.2z" /></svg>
            </div>
            <div className="risk-title">Stabilité des coûts</div>
            <div className="risk-desc">Politique tarifaire ajustée et anticipation des fluctuations de devises (USD/MGA).</div>
          </div>
          <div className="risk-card reveal reveal-delay-3">
            <div className="risk-icon">
              <svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
            </div>
            <div className="risk-title">Continuité de service</div>
            <div className="risk-desc">Réseau multi-armateurs et constitution d&apos;un stock de sécurité pour éviter l&apos;impact des retards maritimes.</div>
          </div>
          <div className="risk-card reveal reveal-delay-4">
            <div className="risk-icon">
              <svg viewBox="0 0 24 24"><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
            </div>
            <div className="risk-title">Gestion de la qualité</div>
            <div className="risk-desc">Veille réglementaire et partenariat avec des transitaires d&apos;expérience.</div>
          </div>
        </div>

        {/* Pays fournisseurs — masqué, réactiver en retirant style={{ display: 'none' }} */}
        <div style={{ display: 'none' }}>
        <div className="eyebrow reveal" style={{ marginBottom: '24px' }}>Pays d&apos;origine du bitume</div>
        <div className="pays-grid">
          <div className="pays-card reveal reveal-delay-2">
            <span className="pays-flag">🇸🇬</span>
            <div className="pays-name">SINGAPOUR</div>
            <div className="pays-role">Hub de raffinage et de négoce international, Singapour est l&apos;un des principaux centres de distribution de bitume en Asie du Sud-Est.</div>
            <div className="pays-tags">
              <span className="pays-tag">Raffinage</span>
              <span className="pays-tag">Négoce</span>
              <span className="pays-tag">Distribution</span>
            </div>
          </div>
          <div className="pays-card reveal reveal-delay-3">
            <span className="pays-flag">🇰🇷</span>
            <div className="pays-name">CORÉE DU SUD</div>
            <div className="pays-role">Les raffineries coréennes produisent un bitume de haute qualité largement exporté vers les marchés en développement en Afrique et en Asie.</div>
            <div className="pays-tags">
              <span className="pays-tag">Production</span>
              <span className="pays-tag">Haute qualité</span>
              <span className="pays-tag">Export</span>
            </div>
          </div>
          <div className="pays-card reveal reveal-delay-4">
            <span className="pays-flag">🇦🇪</span>
            <div className="pays-name">ÉMIRATS ARABES UNIS</div>
            <div className="pays-role">Les raffineries des Émirats, notamment à Dubaï et Abu Dhabi, fournissent un bitume adapté aux climats chauds et reconnu pour sa durabilité.</div>
            <div className="pays-tags">
              <span className="pays-tag">Climat chaud</span>
              <span className="pays-tag">Durabilité</span>
              <span className="pays-tag">ASTM</span>
            </div>
          </div>
        </div>
        </div>

        {/* Normes & certifications */}
        <div className="certs-section-title reveal">Normes & certifications</div>
        <div className="certs-grid">
          <div className="cert-card reveal reveal-delay-2">
            <div className="cert-badge">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div className="cert-name">Conformité ASTM D5</div>
              <div className="cert-desc">Contrôle de la pénétrabilité du bitume à 25 °C. Chaque lot est testé pour garantir une valeur entre 60 et 70 (0,1 mm).</div>
              <span className="cert-standard">ASTM D5 — Pénétrabilité</span>
            </div>
          </div>
          <div className="cert-card reveal reveal-delay-3">
            <div className="cert-badge">
              <svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            </div>
            <div>
              <div className="cert-name">Certificat d&apos;analyse (CoA)</div>
              <div className="cert-desc">Chaque livraison est accompagnée d&apos;un certificat d&apos;analyse détaillant l&apos;ensemble des paramètres ASTM du lot fourni.</div>
              <span className="cert-standard">Traçabilité lot par lot</span>
            </div>
          </div>
          <div className="cert-card reveal reveal-delay-2">
            <div className="cert-badge">
              <svg viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <div className="cert-name">Point éclair ≥ 250 °C</div>
              <div className="cert-desc">Testé selon la norme ASTM D92 pour garantir la sécurité lors du transport, du stockage et de l&apos;application sur chantier.</div>
              <span className="cert-standard">ASTM D92 — Sécurité transport</span>
            </div>
          </div>
          <div className="cert-card reveal reveal-delay-3">
            <div className="cert-badge">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
            </div>
            <div>
              <div className="cert-name">Solubilité ≥ 99 % (ASTM D2042)</div>
              <div className="cert-desc">Garantit la pureté du bitume et l&apos;absence d&apos;impuretés pouvant affecter les performances à long terme de la chaussée.</div>
              <span className="cert-standard">ASTM D2042 — Pureté</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <div className="cta-banner reveal">
        <div className="cta-banner-text">
          <h2>PRÊT À DÉMARRER<br />VOTRE PROJET ?</h2>
          <p>Contactez notre équipe pour un devis personnalisé adapté à vos besoins.</p>
        </div>
        <a href="/contact" className="cta-banner-btn">
          Nous contacter
        </a>
      </div>
    </>
  );
}
