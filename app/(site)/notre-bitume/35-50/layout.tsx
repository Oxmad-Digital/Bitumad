import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bitume 35/50 Madagascar — Fiche technique",
  description:
    "Bitume 35/50 conforme ASTM pour zones côtières de Madagascar — Toamasina, Mahajanga, Toliary. Résistance maximale à l'orniérage. Pénétrabilité 35–50.",
  keywords:
    "bitume 35/50 Madagascar, bitume zones côtières, ASTM D5, routes côtières, fiche technique bitume, Toamasina, Mahajanga",
  alternates: { canonical: "/notre-bitume/35-50" },
  openGraph: {
    title: "Bitume de pénétration 35/50 — Fiche technique Bitumad",
    description:
      "Grade spécialement conçu pour les zones côtières de Madagascar. Ports, voiries littorales, zones industrielles. Résistance à l'orniérage maximale.",
    url: "https://www.bitumad.mg/notre-bitume/35-50",
  },
};

export default function Bitume3550Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
