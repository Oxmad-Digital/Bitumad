/* Bitumad website — Navbar (with mobile menu) */
/* eslint @next/next/no-img-element: off -- This standalone demo runs without Next.js. */
const { useState } = React;

const LOGO_SIMPLE = "../../assets/bitumad-logo-simple.webp";

const NAV_LINKS = [
  { label: "Accueil", href: "hero" },
  { label: "À propos", href: "apropos" },
  { label: "Notre bitume", href: "notreproduit" },
  { label: "Commander", href: "commander" },
];

function IconMenu() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>);
}
function IconX() {
  return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>);
}

function Navbar({ onNav }) {
  const [open, setOpen] = useState(false);
  const go = (id) => { setOpen(false); onNav(id); };
  return (
    <nav className="nav">
      <a className="nav-logo" onClick={() => go("hero")} style={{ cursor: "pointer" }}>
        <img src={LOGO_SIMPLE} alt="Bitumad" />
      </a>
      <ul className="nav-links">
        {NAV_LINKS.map((l) => (
          <li key={l.href}><a onClick={() => go(l.href)}>{l.label}</a></li>
        ))}
        <li><a className="nav-cta" onClick={() => go("devis")}>Contact</a></li>
      </ul>
      <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="Menu">
        {open ? <IconX /> : <IconMenu />}
      </button>
      {open && (
        <div className="nav-mobile">
          {NAV_LINKS.map((l) => <a key={l.href} onClick={() => go(l.href)}>{l.label}</a>)}
          <a onClick={() => go("devis")}>Contact</a>
        </div>
      )}
    </nav>
  );
}

function SiteFooter({ onNav }) {
  return (
    <footer className="site-footer">
      <a className="footer-logo" onClick={() => onNav("hero")} style={{ cursor: "pointer" }}>
        <img src={LOGO_SIMPLE} alt="Bitumad" />
      </a>
      <ul className="footer-links">
        <li><a onClick={() => onNav("hero")}>Accueil</a></li>
        <li><a onClick={() => onNav("apropos")}>À propos</a></li>
        <li><a onClick={() => onNav("notreproduit")}>Notre bitume</a></li>
        <li><a onClick={() => onNav("commander")}>Commander</a></li>
        <li><a onClick={() => onNav("devis")}>Contact</a></li>
      </ul>
      <span className="footer-copy">© 2025 BITUMAD</span>
    </footer>
  );
}

Object.assign(window, { Navbar, SiteFooter });
