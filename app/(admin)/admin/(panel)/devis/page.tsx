import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getInquiries, getQuoteCounts } from "@/lib/admin-stats";
import type { InquiryStatus } from "@/lib/db";
import InquiryCard from "../InquiryCard";
import SearchForm from "../SearchForm";

const FILTERS: { value: InquiryStatus | "open"; label: string }[] = [
  { value: "open", label: "Toutes" },
  { value: "new", label: "À traiter" },
  { value: "in_progress", label: "En cours" },
  { value: "quoted", label: "Devis envoyé" },
  { value: "won", label: "Gagnées" },
  { value: "lost", label: "Perdues" },
  { value: "archived", label: "Archivées" },
];

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const filter = FILTERS.find((f) => f.value === params.f)?.value ?? "open";
  const query = typeof params.q === "string" ? params.q : "";
  const [quotes, counts] = await Promise.all([getInquiries(["devis"], filter, query), getQuoteCounts()]);
  const openCount = Object.entries(counts).reduce((sum, [status, n]) => (status === "archived" ? sum : sum + (n ?? 0)), 0);
  const href = (f: string) => `/admin/devis?f=${f}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

  return (
    <>
      <div className="adm-title-row">
        <h1>Demandes de devis</h1>
      </div>

      <div className="adm-toolbar">
        <div className="adm-segmented" role="group" aria-label="Statut">
          {FILTERS.map((f) => {
            const count = f.value === "open" ? openCount : counts[f.value] ?? 0;
            return (
              <Link key={f.value} href={href(f.value)} aria-current={f.value === filter ? "true" : undefined}>
                {f.label}<span className="adm-count">{count}</span>
              </Link>
            );
          })}
        </div>
        <SearchForm action="/admin/devis" query={query} hidden={{ f: filter }} />
      </div>

      {quotes.length === 0 && (
        <p className="adm-card adm-empty">{query ? `Aucune demande ne correspond à « ${query} ».` : "Aucune demande de devis ici."}</p>
      )}

      <ul className="adm-list">
        {quotes.map((q) => <InquiryCard key={q.id} inquiry={q} />)}
      </ul>
    </>
  );
}
