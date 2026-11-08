import ConfirmButton from "@/components/admin/ConfirmButton";
import type { Inquiry, InquiryStatus } from "@/lib/db";
import { TIMEZONE } from "@/lib/site";
import { deleteInquiry, saveInquiryNote, setInquiryStatus } from "../actions";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: TIMEZONE });

/** Label, pill style and the action wording that moves an inquiry to this status. */
export const STATUS: Record<InquiryStatus, { label: string; action: string; className: string }> = {
  new: { label: "Nouveau", action: "Marquer non lu", className: "adm-pill-accent" },
  read: { label: "Lu", action: "Marquer comme lu", className: "" },
  in_progress: { label: "En cours", action: "Prendre en charge", className: "adm-pill-warn" },
  quoted: { label: "Devis envoyé", action: "Devis envoyé", className: "adm-pill-warn" },
  won: { label: "Gagné", action: "Gagné", className: "adm-pill-good" },
  lost: { label: "Perdu", action: "Perdu", className: "adm-pill-bad" },
  archived: { label: "Archivé", action: "Archiver", className: "" },
};

const KIND_LABEL = { devis: "Devis", message: "Message", partenariat: "Partenariat" } as const;

/** Statuses offered as buttons from the current one. */
function nextStatuses(inquiry: Inquiry): InquiryStatus[] {
  if (inquiry.kind === "devis") {
    const flow: Record<InquiryStatus, InquiryStatus[]> = {
      new: ["in_progress", "quoted", "lost", "archived"],
      in_progress: ["quoted", "lost", "archived"],
      quoted: ["won", "lost", "archived"],
      won: ["archived"],
      lost: ["in_progress", "archived"],
      archived: ["in_progress"],
      read: ["in_progress"],
    };
    return flow[inquiry.status];
  }
  if (inquiry.status === "new") return ["read", "archived"];
  if (inquiry.status === "read") return ["new", "archived"];
  return ["read"];
}

/** wa.me wants digits only, with the country code (Madagascar by default for local numbers). */
function whatsappLink(phone: string) {
  let digits = phone.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) digits = `261${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

function Fact({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return <div><dt>{label}</dt><dd>{value}</dd></div>;
}

export default function InquiryCard({ inquiry: i }: { inquiry: Inquiry }) {
  const d = i.details ?? {};
  const replySubject = i.kind === "devis" ? "Votre demande de devis — Bitumad" : `Re: ${i.subject || "votre message"} — Bitumad`;
  const created = new Date(i.created_at);
  const status = STATUS[i.status];
  // Archived and closed quotes fade out; unread items get the accent edge.
  const tone = i.status === "new" ? "is-new" : i.status === "archived" || i.status === "lost" ? "is-muted" : "";

  return (
    <li className={`adm-card adm-item ${tone}`}>
      <div className="adm-item-head">
        <div>
          <p className="adm-kind">{KIND_LABEL[i.kind]}{i.kind !== "devis" && i.subject ? ` · ${i.subject}` : ""}</p>
          <p className="adm-item-title">
            <span className={`adm-pill ${status.className}`}>{status.label}</span>
            {i.name}
            {i.organisation && <span className="adm-muted">— {i.organisation}</span>}
          </p>
          <p className="adm-item-meta">
            <a href={`mailto:${i.email}`}>{i.email}</a>
            {i.phone && <> · <a href={`tel:${i.phone.replace(/\s/g, "")}`}>{i.phone}</a> · <a href={whatsappLink(i.phone)} target="_blank" rel="noreferrer">WhatsApp</a></>}
          </p>
        </div>
        <time className="adm-muted" dateTime={created.toISOString()}>{dateFormat.format(created)}</time>
      </div>

      {i.kind === "devis" && (
        <dl className="adm-facts">
          <Fact label="Type de projet" value={d.typeProjet} />
          <Fact label="Quantité estimée" value={d.quantite} />
          <Fact label="Région de livraison" value={d.region} />
        </dl>
      )}
      {i.kind === "partenariat" && (d.poste || d.naturePartenariat) && (
        <dl className="adm-facts">
          <Fact label="Poste" value={d.poste} />
          <Fact label="Nature du partenariat" value={d.naturePartenariat} />
        </dl>
      )}

      {i.message && <p className="adm-item-body">{i.message}</p>}

      {i.note && <p className="adm-note-text">{i.note}</p>}
      <details className="adm-note">
        <summary>{i.note ? "Modifier la note interne" : "Ajouter une note interne"}</summary>
        <form action={saveInquiryNote}>
          <input type="hidden" name="id" value={i.id} />
          <label className="adm-sr-only" htmlFor={`note-${i.id}`}>Note interne</label>
          <textarea id={`note-${i.id}`} name="note" defaultValue={i.note ?? ""} placeholder="Prix proposé, appel passé, prochaine relance…" maxLength={5000} />
          <button className="adm-btn">Enregistrer la note</button>
        </form>
      </details>

      <div className="adm-item-actions">
        <a className="adm-btn adm-btn-primary" href={`mailto:${i.email}?subject=${encodeURIComponent(replySubject)}`}>Répondre</a>
        <form action={setInquiryStatus} className="adm-status-form">
          <input type="hidden" name="id" value={i.id} />
          <input type="hidden" name="kind" value={i.kind} />
          {nextStatuses(i).map((s) => (
            <button key={s} className="adm-btn" name="status" value={s}>
              {i.status === "archived" && s !== "archived" ? "Désarchiver" : STATUS[s].action}
            </button>
          ))}
        </form>
        <ConfirmButton action={deleteInquiry} fields={{ id: String(i.id) }} />
      </div>
    </li>
  );
}
