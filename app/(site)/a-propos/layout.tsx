import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fournisseur de bitume Madagascar — Notre histoire",
  description:
    "Fondée en 2024 à Antananarivo, Bitumad livre du bitume ASTM aux chantiers de Madagascar. Approvisionnement certifié, livraison sur tout le territoire.",
  alternates: { canonical: "/a-propos" },
  openGraph: {
    title: "L'histoire de Bitumad — Fournisseur de bitume depuis 2024",
    description:
      "Fondée en 2024, Bitumad fournit un bitume ASTM 60/70 & 35/50 aux routes, voiries et infrastructures de Madagascar. Découvrez notre histoire.",
    url: "https://www.bitumad.mg/a-propos",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
