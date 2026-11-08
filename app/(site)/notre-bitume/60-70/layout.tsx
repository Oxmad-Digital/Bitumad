import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitume 60/70 Madagascar — Fiche technique",
  description:
    "Bitume 60/70 conforme ASTM pour routes nationales, voiries et aéroports à Madagascar. Pénétrabilité 60–70, ramollissement 49–56 °C, ductilité ≥ 100 cm.",
  keywords:
    "bitume 60/70 Madagascar, bitume pénétration, ASTM D5, routes hauts plateaux, fiche technique bitume",
  alternates: { canonical: "/notre-bitume/60-70" },
  openGraph: {
    title: "Bitume de pénétration 60/70 — Fiche technique Bitumad",
    description:
      "Grade de référence pour les conditions climatiques intérieures de Madagascar. Routes nationales, voiries, aéroports. Conforme ASTM D5.",
    url: "https://www.bitumad.mg/notre-bitume/60-70",
  },
};

export default function Bitume6070Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
