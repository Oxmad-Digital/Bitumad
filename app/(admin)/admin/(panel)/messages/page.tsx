import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getInquiries } from "@/lib/admin-stats";
import type { InquiryKind } from "@/lib/db";
import InquiryCard from "../InquiryCard";
import SearchForm from "../SearchForm";

const FILTERS = [
  { value: "open", label: "Boîte de réception" },
  { value: "new", label: "Non lus" },
  { value: "archived", label: "Archivés" },
] as const;

const KINDS: { value: string; label: string; kinds: InquiryKind[] }[] = [
  { value: "all", label: "Tous", kinds: ["message", "partenariat"] },
  { value: "message", label: "Contact", kinds: ["message"] },
  { value: "partenariat", label: "Partenariats", kinds: ["partenariat"] },
];

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ f?: string; t?: string; q?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const filter = FILTERS.find((f) => f.value === params.f)?.value ?? "open";
  const kind = KINDS.find((k) => k.value === params.t) ?? KINDS[0];
  const query = typeof params.q === "string" ? params.q : "";
  const messages = await getInquiries(kind.kinds, filter, query);
  const href = (f: string, t: string) => `/admin/messages?f=${f}&t=${t}${query ? `&q=${encodeURIComponent(query)}` : ""}`;

  return (
    <>
      <div className="adm-title-row">
        <h1>Messages</h1>
        <div className="adm-segmented" role="group" aria-label="Formulaire">
          {KINDS.map((k) => (
            <Link key={k.value} href={href(filter, k.value)} aria-current={k.value === kind.value ? "true" : undefined}>{k.label}</Link>
          ))}
        </div>
      </div>

      <div className="adm-toolbar">
        <div className="adm-segmented" role="group" aria-label="Filtre">
          {FILTERS.map((f) => (
            <Link key={f.value} href={href(f.value, kind.value)} aria-current={f.value === filter ? "true" : undefined}>{f.label}</Link>
          ))}
        </div>
        <SearchForm action="/admin/messages" query={query} hidden={{ f: filter, t: kind.value }} />
      </div>

      {messages.length === 0 && (
        <p className="adm-card adm-empty">{query ? `Aucun message ne correspond à « ${query} ».` : "Aucun message ici."}</p>
      )}

      <ul className="adm-list">
        {messages.map((m) => <InquiryCard key={m.id} inquiry={m} />)}
      </ul>
    </>
  );
}
