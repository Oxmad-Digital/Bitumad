import Image from "next/image";
import "./Maintenance.css";

const PHONE = "+261 38 81 202 93";

/** Replaces the whole public site while the maintenance mode is on (toggle in /admin/comptes). */
export default function Maintenance({ message }: { message: string }) {
  return (
    <main id="main-content" className="mnt">
      <div className="mnt-card">
        <Image
          src="https://res.cloudinary.com/uuiwf5lx/image/upload/q_auto/f_auto/v1779650741/bitumad_logo_cercle_remove_v2_zcpvnc.webp"
          alt="Bitumad"
          width={96}
          height={96}
          className="mnt-logo"
        />
        <p className="mnt-eyebrow">Maintenance en cours</p>
        <h1>Le site revient très vite</h1>
        <p className="mnt-text">
          {message || "Nous effectuons une mise à jour du site. Merci de votre patience."}
        </p>
        <p className="mnt-contact">
          Besoin de bitume dès maintenant ? <a href={`tel:${PHONE.replace(/\s/g, "")}`}>{PHONE}</a>
        </p>
      </div>
    </main>
  );
}
