import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <Link href="/" className="footer-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.bitumad.mg/bitumad_logo_remove_rectangle_dark_qguxh1.webp"
          alt="Bitumad"
          className="footer-logo-img footer-logo-img--dark"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.bitumad.mg/bitumad_logo_remove_rectangle_light_xxbtnx.webp"
          alt="Bitumad"
          className="footer-logo-img footer-logo-img--light"
        />
      </Link>
      <span className="footer-credit">
        Réalisé par{" "}
        <a href="https://oxmad-digital.mg" target="_blank" rel="nofollow noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          Oxmad Digital
        </a>
      </span>
      <span className="footer-copy">
        © 2025 BITUMAD &nbsp;·&nbsp; <a href="/mentions-legales" style={{ color: 'inherit', textDecoration: 'none' }}>Mentions légales</a>
        &nbsp;·&nbsp; <a href="/admin/login" rel="nofollow" style={{ color: 'inherit', textDecoration: 'none' }}>Espace admin</a>
      </span>
    </footer>
  );
}
