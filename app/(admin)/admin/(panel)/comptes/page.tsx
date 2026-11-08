import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { MIN_PASSWORD_LENGTH } from "@/lib/password";
import { TIMEZONE } from "@/lib/site";
import { deleteAdmin } from "../../actions";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { getMaintenance } from "@/lib/maintenance";
import { ChangePasswordForm, CreateAdminForm, MaintenanceForm } from "./AccountForms";

type Account = { id: string; email: string; name: string; created_at: Date; last_login_at: Date | null };

const dateFormat = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short", timeZone: TIMEZONE });

export default async function AccountsPage() {
  const admin = await requireAdmin();
  const [rows, maintenance] = await Promise.all([
    db()!`SELECT id, email, name, created_at, last_login_at FROM admin_users ORDER BY created_at`,
    getMaintenance(),
  ]);
  const accounts = rows as Account[];

  return (
    <>
      <div className="adm-title-row">
        <h1>Comptes admin</h1>
      </div>

      <ul className="adm-list">
        {accounts.map((a) => (
          <li key={a.id} className="adm-card adm-item">
            <div className="adm-item-head">
              <div>
                <p className="adm-item-title">
                  {a.name}
                  {String(a.id) === admin.id && <span className="adm-pill adm-pill-accent">Vous</span>}
                </p>
                <p className="adm-item-meta">{a.email}</p>
              </div>
              <div className="adm-item-side">
                <span className="adm-muted">
                  {a.last_login_at ? `Dernière connexion : ${dateFormat.format(new Date(a.last_login_at))}` : "Jamais connecté"}
                </span>
                {String(a.id) !== admin.id && <ConfirmButton action={deleteAdmin} fields={{ id: String(a.id) }} />}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="adm-grid">
        <section className="adm-card">
          <h2>Ajouter un compte</h2>
          <CreateAdminForm minLength={MIN_PASSWORD_LENGTH} />
        </section>
        <section className="adm-card">
          <h2>Mon mot de passe</h2>
          <ChangePasswordForm minLength={MIN_PASSWORD_LENGTH} />
        </section>
        <section className="adm-card">
          <h2>
            Maintenance du site{" "}
            {maintenance.enabled
              ? <span className="adm-pill adm-pill-warn">Site masqué</span>
              : <span className="adm-pill adm-pill-good">En ligne</span>}
          </h2>
          <MaintenanceForm enabled={maintenance.enabled} message={maintenance.message} />
        </section>
      </div>
    </>
  );
}
