"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import "./Navbar.css";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [bitumesOpen, setBitumesOpen] = useState(false);

  function closeNavigation() {
    setOpen(false);
    setBitumesOpen(false);
  }

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo" onNavigate={closeNavigation}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.bitumad.mg/bitumad_logo_remove_rectangle_dark_qguxh1.webp"
          alt="Bitumad"
          className="nav-logo-img nav-logo-img--dark"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.bitumad.mg/bitumad_logo_remove_rectangle_light_xxbtnx.webp"
          alt="Bitumad"
          className="nav-logo-img nav-logo-img--light"
        />
      </Link>

      <ul className="nav-links">
        <li><Link href="/" onNavigate={closeNavigation}>Accueil</Link></li>
        <li><a href="/a-propos">À propos</a></li>
        <li className="nav-dropdown-item">
          <a href="/notre-bitume" className="nav-dropdown-trigger" aria-haspopup="true">
            Nos bitumes
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-chevron" aria-hidden="true" focusable="false">
              <polyline points="2,4 6,8 10,4" />
            </svg>
          </a>
          <div className="nav-dropdown">
            <a href="/notre-bitume">Catalogue</a>
            <a href="/notre-bitume/60-70">
              <span className="nav-dropdown-grade">60/70</span>
              Zones intérieures
            </a>
            <a href="/notre-bitume/35-50">
              <span className="nav-dropdown-grade nav-dropdown-grade--new">35/50</span>
              Zones côtières
              <span className="nav-dropdown-new">Nouveau</span>
            </a>
          </div>
        </li>
        <li><a href="/contact" className="nav-cta">Contact</a></li>
      </ul>

      <div className="nav-cta-group">
        <ThemeToggle />
        <Link href="/#devis" className="nav-cmd" onNavigate={closeNavigation}>Obtenir un devis</Link>

        <button
          className="nav-hamburger"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="nav-mobile">
          <Link href="/" onNavigate={closeNavigation}>Accueil</Link>
          <a href="/a-propos" onClick={() => setOpen(false)}>À propos</a>
          <button
            className="nav-mobile-group-btn"
            onClick={() => setBitumesOpen(!bitumesOpen)}
            aria-expanded={bitumesOpen}
            aria-controls="nav-mobile-submenu"
          >
            Nos bitumes
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 12, height: 12, transition: "transform 0.2s", transform: bitumesOpen ? "rotate(180deg)" : "none" }} aria-hidden="true" focusable="false">
              <polyline points="2,4 6,8 10,4" />
            </svg>
          </button>
          {bitumesOpen && (
            <div className="nav-mobile-submenu" id="nav-mobile-submenu">
              <a href="/notre-bitume" onClick={() => setOpen(false)}>Catalogue</a>
              <a href="/notre-bitume/60-70" onClick={() => setOpen(false)}>Bitume 60/70 — Zones intérieures</a>
              <a href="/notre-bitume/35-50" onClick={() => setOpen(false)}>
                Bitume 35/50 — Zones côtières <span className="nav-mobile-new">Nouveau</span>
              </a>
            </div>
          )}
          <Link href="/#devis" className="nav-cmd" onNavigate={closeNavigation}>Obtenir un devis</Link>
          <a href="/contact" className="nav-cta" onClick={() => setOpen(false)}>Contact</a>
        </div>
      )}
    </nav>
  );
}
