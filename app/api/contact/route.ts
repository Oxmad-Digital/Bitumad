import { Resend } from "resend";
import { NextResponse } from "next/server";
import { saveInquiry, type NewInquiry } from "@/lib/db";
import { clientIp, rateLimit, TOO_MANY } from "@/lib/rate-limit";
import { EMAIL_RE } from "@/lib/site";

// Created on first use: without RESEND_API_KEY (local build, preview) requests are still stored for the admin.
let resend: Resend | null = null;

const LOGO_URL =
  "https://res.cloudinary.com/uuiwf5lx/image/upload/q_auto/f_auto/v1779650741/bitumad_logo_cercle_remove_v2_zcpvnc.webp";

function escapeHtml(value: unknown): string {
  const str = value === null || value === undefined || value === "" ? "—" : String(value);
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br/>");
}

function renderRow(label: string, value: unknown) {
  return `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #e5e2d8;vertical-align:top;width:180px;">
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#1D9E75;text-transform:uppercase;letter-spacing:.04em;">${label}</span>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #e5e2d8;vertical-align:top;">
        <span style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#161614;">${escapeHtml(value)}</span>
      </td>
    </tr>`;
}

function renderEmailTemplate(heading: string, tag: string, rows: string) {
  return `
  <div style="background-color:#f5f2eb;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e2d8;">
      <tr>
        <td style="background-color:#1D9E75;padding:24px 28px;text-align:left;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="vertical-align:middle;">
                <img src="${LOGO_URL}" alt="Bitumad" width="40" height="40" style="display:block;border-radius:50%;background:#ffffff;" />
              </td>
              <td style="vertical-align:middle;padding-left:12px;">
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:700;color:#ffffff;">Bitumad</span><br/>
                <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:700;color:#ffffff;letter-spacing:.06em;text-transform:uppercase;">${tag}</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:28px;">
          <h2 style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:20px;color:#161614;">${heading}</h2>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${rows}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:20px 28px;background-color:#f5f2eb;">
          <span style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#7a776c;">Notification automatique — bitumad.mg</span>
        </td>
      </tr>
    </table>
  </div>`;
}

/** Trimmed string field, capped so a forged request can't store megabytes. */
function field(body: Record<string, unknown>, key: string, max = 300) {
  const value = body[key];
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(req: Request) {
  if (!(await rateLimit(`contact:${clientIp(req.headers)}`, 5, 600))) {
    return NextResponse.json({ error: TOO_MANY }, { status: 429 });
  }

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  const type = body.type;
  const nom = field(body, "nom");
  const email = field(body, "email");
  const message = field(body, "message", 5000);

  if (!nom || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Nom et email valide requis." }, { status: 400 });
  }

  let subject = "";
  let html = "";
  let inquiry: NewInquiry;

  if (type === "devis") {
    const org = field(body, "org");
    const tel = field(body, "tel", 40);
    const typeProjet = field(body, "typeProjet");
    const quantite = field(body, "quantite", 100);
    const region = field(body, "region", 100);
    subject = `Demande de devis — ${nom}${org ? ` (${org})` : ""}`;
    html = renderEmailTemplate(
      "Nouvelle demande de devis",
      "Formulaire devis",
      renderRow("Nom", nom) +
        renderRow("Organisation", org) +
        renderRow("Téléphone", tel) +
        renderRow("Email", email) +
        renderRow("Type de projet", typeProjet) +
        renderRow("Quantité estimée", quantite) +
        renderRow("Région de livraison", region) +
        renderRow("Détails du chantier", message)
    );
    inquiry = { kind: "devis", name: nom, email, phone: tel, organisation: org, subject: typeProjet, message, details: { typeProjet, quantite, region } };
  } else if (type === "message") {
    const sujet = field(body, "sujet");
    if (!message) return NextResponse.json({ error: "Message requis." }, { status: 400 });
    subject = `Message — ${sujet || "Sans sujet"} (${nom})`;
    html = renderEmailTemplate(
      "Nouveau message de contact",
      "Formulaire contact",
      renderRow("Nom", nom) +
        renderRow("Email", email) +
        renderRow("Sujet", sujet) +
        renderRow("Message", message)
    );
    inquiry = { kind: "message", name: nom, email, phone: null, organisation: null, subject: sujet, message, details: {} };
  } else if (type === "partenariat") {
    const poste = field(body, "poste");
    const org = field(body, "org");
    const naturePartenariat = field(body, "naturePartenariat");
    subject = `Proposition de partenariat — ${org || nom}`;
    html = renderEmailTemplate(
      "Nouvelle proposition de partenariat",
      "Formulaire partenariat",
      renderRow("Nom", nom) +
        renderRow("Poste", poste) +
        renderRow("Organisation", org) +
        renderRow("Email", email) +
        renderRow("Nature du partenariat", naturePartenariat) +
        renderRow("Proposition", message)
    );
    inquiry = { kind: "partenariat", name: nom, email, phone: null, organisation: org, subject: naturePartenariat, message, details: { poste, naturePartenariat } };
  } else {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  // Stored for the admin, then emailed: the request is lost only if both fail.
  const saved = await saveInquiry(inquiry);
  let emailed = false;
  try {
    if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
    resend ??= new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "Bitumad <info@bitumad.mg>",
      to: "info@bitumad.mg",
      replyTo: email,
      subject,
      html,
    });
    emailed = !error;
    if (error) console.error("contact email failed:", error);
  } catch (error) {
    console.error("contact email failed:", error);
  }

  if (!saved && !emailed) {
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
