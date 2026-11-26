import ConfirmButton from "@/components/admin/ConfirmButton";
import type { Inquiry, InquiryStatus } from "@/lib/db";
import { TIMEZONE } from "@/lib/site";
import { deleteInquiry, markQuoteViewed, saveInquiryNote, setMessageStatus, setQuoteArchived } from "../actions";

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: TIMEZONE });

const MESSAGE_STATUS = {
  new: { label: "Nouveau", action: "Marquer non lu" },
  read: { label: "Lu", action: "Marquer comme lu" },
  archived: { label: "Archivé", action: "Archiver" },
};

const KIND_LABEL = { devis: "Devis", message: "Message", partenariat: "Partenariat" } as const;

function nextMessageStatuses(status: InquiryStatus): (keyof typeof MESSAGE_STATUS)[] {
  if (status === "new") return ["read", "archived"];
  if (status === "read") return ["new", "archived"];
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
  const isQuote = i.kind === "devis";
  const isNew = i.status === "new";
  const isArchived = i.status === "archived";
  const replySubject = isQuote ? "Votre demande de devis — Bitumad" : `Re: ${i.subject || "votre message"} — Bitumad`;
  const emailLink = `mailto:${i.email}`;
  const replyLink = `${emailLink}?subject=${encodeURIComponent(replySubject)}`;
  const created = new Date(i.created_at);
  const messageStatus = isNew ? "new" : isArchived ? "archived" : "read";
  // Quote statuses other than "new" represent requests already handled in the admin.
  const statusLabel = isQuote ? (isNew ? "Non vue" : "Vue") : MESSAGE_STATUS[messageStatus].label;
  const tone = isNew ? "is-new" : !isQuote && isArchived ? "is-muted" : "";

  return (
    <li className={`adm-card adm-item ${tone}`}>
      <div className="adm-item-head">
        <div>
          <p className="adm-kind">{KIND_LABEL[i.kind]}{!isQuote && i.subject ? ` · ${i.subject}` : ""}</p>
          <p className="adm-item-title">
            <span className={isNew ? "adm-pill adm-pill-accent" : "adm-pill"}>{statusLabel}</span>
            {i.name}
            {i.organisation && <span className="adm-muted">— {i.organisation}</span>}
          </p>
          <p className="adm-item-meta">
            <a href={isQuote ? replyLink : emailLink}>{i.email}</a>
            {i.phone && <> · <a href={`tel:${i.phone.replace(/\s/g, "")}`}>{i.phone}</a> · <a href={whatsappLink(i.phone)} target="_blank" rel="noreferrer">WhatsApp</a></>}
          </p>
        </div>
        <time className="adm-muted" dateTime={created.toISOString()}>{dateFormat.format(created)}</time>
      </div>

      {isQuote && (
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
        {isQuote ? (
          <>
            {isNew && (
              <form action={markQuoteViewed}>
                <input type="hidden" name="id" value={i.id} />
                <button type="submit" className="adm-btn adm-btn-primary">Marquer comme vue</button>
              </form>
            )}
            <form action={setQuoteArchived.bind(null, !isArchived)}>
              <input type="hidden" name="id" value={i.id} />
              <button type="submit" className="adm-btn">{isArchived ? "Désarchiver" : "Archiver"}</button>
            </form>
          </>
        ) : (
          <>
            <a className="adm-btn adm-btn-primary" href={replyLink}>Répondre</a>
            <form action={setMessageStatus} className="adm-status-form">
              <input type="hidden" name="id" value={i.id} />
              {nextMessageStatuses(i.status).map((s) => (
                <button key={s} className="adm-btn" name="status" value={s}>
                  {isArchived ? "Désarchiver" : MESSAGE_STATUS[s].action}
                </button>
              ))}
            </form>
          </>
        )}
        <ConfirmButton action={deleteInquiry.bind(null, isQuote)} fields={{ id: String(i.id) }} />
      </div>
    </li>
  );
}
