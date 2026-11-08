import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import "@/app/(admin)/auth.css";

const HERO = "/bitumad_hero_route_madagascar_avce_fux_de_bitume.jpg";

/** Full-screen frame of the admin sign-in steps (password, then two-factor code). */
export default function AuthScreen({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="adm-login client-login">
      <div className="client-login-background" aria-hidden="true">
        <Image src={HERO} alt="" fill sizes="100vw" quality={75} loading="eager" fetchPriority="high" />
      </div>
      <Link href="/" className="adm-btn adm-btn-ghost client-login-back">
        <ChevronLeft size={16} aria-hidden="true" />
        Retour au site
      </Link>
      <div className="client-login-content">
        <div className="adm-login-card">
          <Link href="/" className="adm-brand">BITU<span>MAD</span> <small>Admin</small></Link>
          <h1>{title}</h1>
          {children}
          <a href="/mentions-legales" className="client-login-legal">Mentions légales et confidentialité</a>
        </div>
      </div>
    </div>
  );
}
