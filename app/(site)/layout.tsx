import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { fontVariables } from "@/lib/fonts";
import { getMaintenance } from "@/lib/maintenance";
import Maintenance from "@/components/Maintenance";

export const metadata: Metadata = {
  title: {
    template: "%s | Bitumad",
    default: "Bitumad Madagascar",
  },
  description:
    "Livraison de bitume 60/70 et 35/50 à Madagascar, conforme aux normes ASTM. Bitumad, votre fournisseur fiable pour vos chantiers BTP.",
  keywords:
    "bitume Madagascar, bitume 60/70, bitume 35/50, routes Madagascar, BTP Madagascar, fourniture bitume, ASTM, bitume pénétration",
  authors: [{ name: "Bitumad" }],
  creator: "Bitumad",
  metadataBase: new URL("https://www.bitumad.mg"),
  alternates: { canonical: "/" },
  icons: { icon: "https://res.cloudinary.com/uuiwf5lx/image/upload/v1784664047/bitumad_logo_carr%C3%A9_spjwlw.webp" },
  openGraph: {
    type: "website",
    url: "https://www.bitumad.mg",
    title: "Bitumad Madagascar",
    description:
      "Livraison de bitume 60/70 et 35/50 à Madagascar, conforme aux normes ASTM. Bitumad, votre fournisseur fiable pour vos chantiers BTP.",
    siteName: "Bitumad",
    images: [
      {
        url: "https://res.cloudinary.com/uuiwf5lx/image/upload/q_auto/f_auto/v1779650742/bitumad_hero_route_madagascar_avce_fux_de_bitume_whcflo.jpg",
        width: 1200,
        height: 630,
        alt: "Bitumad — Fournisseur de bitume à Madagascar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bitumad Madagascar",
    description:
      "Livraison de bitume 60/70 et 35/50 à Madagascar, conforme aux normes ASTM. Bitumad, votre fournisseur fiable pour vos chantiers BTP.",
    images: [
      "https://res.cloudinary.com/uuiwf5lx/image/upload/q_auto/f_auto/v1779650742/bitumad_hero_route_madagascar_avce_fux_de_bitume_whcflo.jpg",
    ],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Bitumad",
  url: "https://www.bitumad.mg",
  logo: "https://res.cloudinary.com/uuiwf5lx/image/upload/q_auto/f_auto/v1779650741/bitumad_logo_cercle_remove_v2_zcpvnc.webp",
  description: "Bitumad est le fournisseur de référence en bitume de pénétration 60/70 et 35/50 à Madagascar. Qualité conforme aux normes internationales ASTM.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Propriété dite « KAIZ » TN°605, Tanjombato",
    addressLocality: "Antananarivo",
    postalCode: "10216",
    addressCountry: "MG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+261388120293",
    contactType: "customer service",
    availableLanguage: ["French"],
  },
  sameAs: [],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const maintenance = await getMaintenance();

  return (
    <html
      lang="fr"
      className={fontVariables}
      suppressHydrationWarning
    >
      <body>
        <script
          id="theme-init"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if(localStorage.getItem('theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {maintenance.enabled ? (
          <Maintenance message={maintenance.message} />
        ) : (
          <>
            <a href="#main-content" className="skip-link">Aller au contenu principal</a>
            <Navbar />
            <main id="main-content">{children}</main>
            <Footer />
            <Analytics />
          </>
        )}
      </body>
    </html>
  );
}
