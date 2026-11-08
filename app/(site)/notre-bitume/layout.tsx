import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitume 60/70 & 35/50 à Madagascar — Nos produits",
  description:
    "Deux grades de bitume ASTM disponibles : 60/70 pour l'intérieur de Madagascar et 35/50 pour les zones côtières. Fiches techniques et devis sur demande.",
  alternates: { canonical: "/notre-bitume" },
  openGraph: {
    title: "Nos produits — Bitume 60/70 & 35/50 | Bitumad",
    description:
      "60/70 pour les zones intérieures, 35/50 pour la côte — deux grades ASTM pour tous vos chantiers à Madagascar. Demandez votre devis.",
    url: "https://www.bitumad.mg/notre-bitume",
  },
};

export default function NotreBitumeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
