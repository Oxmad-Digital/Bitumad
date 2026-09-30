import type { Metadata } from "next";
import "./mentions-legales.css";

export const metadata: Metadata = {
  title: "Mentions légales – Bitumad",
  description: "Mentions légales du site Bitumad — éditeur, hébergement, propriété intellectuelle, politique de confidentialité et conditions d'utilisation.",
  alternates: { canonical: "/mentions-legales" },
  openGraph: {
    title: "Mentions légales – Bitumad",
    description: "Mentions légales du site Bitumad — informations légales, éditeur et politique de confidentialité.",
    url: "https://www.bitumad.mg/mentions-legales",
  },
};

export default function MentionsLegalesPage() {
  return (
    <>
      {/* PAGE HERO */}
      <div className="ml-page-hero">
        <div className="ml-page-hero-grid" />
        <div className="ml-page-hero-content">

          <div className="ml-eyebrow">Informations légales</div>
          <h1 className="ml-page-title">MENTIONS LÉGALES</h1>
        </div>
      </div>

      {/* CONTENU */}
      <div className="ml-section">

        <div className="ml-block">
          <div className="ml-block-num">01</div>
          <h2>ÉDITEUR DU SITE</h2>
          <p><strong>Nom de l&apos;entreprise :</strong> BITUMAD</p>
          <p><strong>Forme juridique :</strong> Société à Responsabilité Limitée Unipersonnelle (SARL U)</p>
          <p><strong>Siège social :</strong> Propriété dite « KAIZ » TN°605, Tanjombato, Antananarivo Tanjombato Iraitsimivaky, Antananarivo Atsimondrano — Analamanga, 10216 Tanjombato-andafiatsimo, Madagascar</p>
          <p><strong>NIF :</strong> 6019309885</p>
          <p><strong>STAT :</strong> 47110 11 2025 0 10848</p>
          <p><strong>RCS :</strong> 2025 B 00831</p>
          <p><strong>Téléphone :</strong> 038 81 202 93</p>
          <p><strong>Email :</strong> <a href="mailto:bitumadoffice@gmail.com">bitumadoffice@gmail.com</a></p>
          <p><strong>Directeur de publication :</strong> GALIB ABASSE Razaly Hederaly Daya</p>
        </div>

        <div className="ml-block">
          <div className="ml-block-num">02</div>
          <h2>HÉBERGEMENT</h2>
          <p>Le site est conçu et hébergé par <strong>Vercel Inc.</strong></p>
          <p>Adresse : 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis</p>
          <p>Site web : <a href="https://www.vercel.com" target="_blank" rel="noopener noreferrer">www.vercel.com</a></p>
        </div>

        <div className="ml-block">
          <div className="ml-block-num">03</div>
          <h2>PROPRIÉTÉ INTELLECTUELLE</h2>
          <p>L&apos;ensemble des contenus présents sur ce site (textes, images originales, photographies, logos, éléments graphiques, etc.) est la propriété exclusive de BITUMAD, sauf mention contraire.</p>
          <p><strong>Exceptions :</strong></p>
          <ul>
            <li>Certaines images ou ressources graphiques proviennent de Freepik et sont utilisées conformément à leur licence d&apos;utilisation.</li>
            <li>Certaines images ont été générées par intelligence artificielle.</li>
          </ul>
          <p>Toute reproduction, représentation ou diffusion, même partielle, des contenus protégés est interdite sans autorisation préalable.</p>
        </div>

        <div className="ml-block">
          <div className="ml-block-num">04</div>
          <h2>CONDITIONS GÉNÉRALES D&apos;UTILISATION</h2>
          <p>L&apos;accès et l&apos;utilisation du site impliquent l&apos;acceptation pleine et entière des présentes CGU.</p>
          <p><strong>L&apos;utilisateur s&apos;engage à :</strong></p>
          <ul>
            <li>Utiliser le site uniquement à des fins légales et personnelles.</li>
            <li>Ne pas tenter d&apos;accéder illégalement au serveur, ni perturber son fonctionnement.</li>
            <li>Ne pas collecter ni utiliser les données personnelles d&apos;autres utilisateurs.</li>
          </ul>
        </div>

        <div className="ml-block">
          <div className="ml-block-num">05</div>
          <h2>POLITIQUE DE CONFIDENTIALITÉ</h2>
          <p>Les données personnelles collectées (formulaires, email, téléphone, cookies) sont utilisées uniquement pour traiter les demandes clients et répondre aux messages.</p>
          <p>Elles ne sont jamais vendues ni partagées à des tiers sans consentement.</p>
          <p>Pour exercer vos droits : <a href="mailto:bitumadoffice@gmail.com">bitumadoffice@gmail.com</a></p>
        </div>

        <div className="ml-block">
          <div className="ml-block-num">06</div>
          <h2>COOKIES</h2>
          <p>Le site peut utiliser des cookies pour améliorer la navigation, mesurer l&apos;audience ou enregistrer les préférences utilisateur. L&apos;utilisateur peut à tout moment accepter, refuser ou supprimer les cookies via les paramètres de son navigateur.</p>
        </div>

        <div className="ml-block">
          <div className="ml-block-num">07</div>
          <h2>RESPONSABILITÉ</h2>
          <p>L&apos;éditeur met tout en œuvre pour assurer l&apos;exactitude des informations publiées. Cependant, il ne saurait être tenu responsable des erreurs, omissions ou dysfonctionnements techniques.</p>
          <p>Ce site a été conçu et développé par <strong>Oxmad Digital</strong>.</p>
        </div>
      </div>
    </>
  );
}
