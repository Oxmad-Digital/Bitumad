import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getInquiries } from "@/lib/admin-stats";
import InquiryCard from "../InquiryCard";
import SearchForm from "../SearchForm";

const TABS = [
  { value: "open", label: "Demandes" },
  { value: "archived", label: "Archives" },
] as const;

export default async function QuotesPage({ searchParams }: { searchParams: Promise<{ f?: string; q?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const filter = params.f === "archived" ? "archived" : "open";
  const query = typeof params.q === "string" ? params.q : "";
  const quotes = await getInquiries(["devis"], filter, query);
  const href = (value: typeof filter) => `/admin/devis?f=${value}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

  return (
    <>
      <div className="adm-title-row">
        <h1>Demandes de devis</h1>
      </div>

      <div className="adm-toolbar">
        <div className="adm-segmented" role="group" aria-label="Voir les demandes">
          {TABS.map(({ value, label }) => (
            <Link key={value} href={href(value)} aria-current={value === filter ? "true" : undefined}>{label}</Link>
          ))}
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
