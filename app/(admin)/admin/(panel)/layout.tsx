import AdminShell from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
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

  return (
    <AdminShell
      userName={admin.name}
      userEmail={admin.email}
      navigation={<AdminNav quotes={Number(counts.quotes)} messages={Number(counts.messages)} />}
      accountAction={<form action={logout}><button type="submit" className="adm-btn adm-btn-ghost">Déconnexion</button></form>}
    >
      {!sql && <p className="adm-error">DATABASE_URL n&apos;est pas configurée : aucune donnée disponible.</p>}
      {children}
    </AdminShell>
  );
}
