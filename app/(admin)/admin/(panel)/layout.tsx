import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { after } from "next/server";
import { db } from "@/lib/db";
import { countPendingErp, syncPendingToErp } from "@/lib/erp";
import { logout } from "../actions";
import AdminNav from "./AdminNav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  const sql = db();
  const [counts] = sql
    ? await sql`SELECT
        (SELECT count(*) FROM inquiries WHERE kind = 'devis' AND status = 'new') AS quotes,
        (SELECT count(*) FROM inquiries WHERE kind <> 'devis' AND status = 'new') AS messages`
    : [{ quotes: 0, messages: 0 }];
  const pendingErp = await countPendingErp();
  if (pendingErp > 0) after(() => syncPendingToErp());

  return (
    <AdminShell
      userName={admin.name}
      userEmail={admin.email}
      navigation={<AdminNav quotes={Number(counts.quotes)} messages={Number(counts.messages)} />}
      accountAction={<form action={logout}><button type="submit" className="adm-btn adm-btn-ghost">Déconnexion</button></form>}
    >
      {!sql && <p className="adm-error">DATABASE_URL n&apos;est pas configurée : aucune donnée disponible.</p>}
      {pendingErp > 0 && (
        <p className="adm-error">
          {pendingErp === 1 ? "1 demande n'a pas encore été transmise" : `${pendingErp} demandes n'ont pas encore été transmises`} à
          l&apos;ERP : nouvel essai en cours. Si cela dure, vérifiez que l&apos;ERP est en ligne et que ERP_INBOUND_SECRET est juste.
        </p>
      )}
      {children}
    </AdminShell>
  );
}
