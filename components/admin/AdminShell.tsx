"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ChevronRight, Globe, Menu, X } from "lucide-react";

const LOGO = "https://res.cloudinary.com/uuiwf5lx/image/upload/v1784583472/bitumad_logo_remove_rectangle_dark_qguxh1.webp";

const sectionLabels: Record<string, string> = {
  devis: "Demandes de devis",
  messages: "Messages",
  comptes: "Comptes",
};

/** Sidebar (drawer on mobile) + top bar of the admin. Same structure as the Oxmad Digital admin. */
export default function AdminShell({ userName, userEmail, navigation, accountAction, children }: {
  userName: string;
  userEmail: string;
  navigation: ReactNode;
  accountAction: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const dialogId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const section = pathname.slice("/admin".length).split("/")[1];
  const sectionLabel = sectionLabels[section] ?? "Statistiques";
  const initials = userName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (desktop.matches) dialogRef.current?.close();
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  function closeNavigation() {
    dialogRef.current?.close();
  }

  function sidebarContent(mobile = false) {
    return (
      <div className="adm-sidebar-inner">
        <div className="adm-sidebar-brand-row">
          <Link href="/admin" className="adm-sidebar-brand" onClick={mobile ? closeNavigation : undefined}>
            {/* eslint-disable-next-line @next/next/no-img-element -- same brand asset as the site navbar */}
            <img src={LOGO} width={150} height={40} alt="Bitumad" />
          </Link>
          {mobile && <button type="button" className="adm-menu-button" onClick={closeNavigation} aria-label="Fermer le menu"><X size={20} aria-hidden="true" /></button>}
        </div>
        <div className="adm-workspace">
          <span className="adm-workspace-label">Administration</span>
          <strong>Bitumad Madagascar</strong>
        </div>
        <div className="adm-sidebar-navigation" onClick={mobile ? (event) => {
          if (event.target instanceof Element && event.target.closest("a[href]")) closeNavigation();
        } : undefined}>
          <p className="adm-sidebar-label">Pilotage</p>
          {navigation}
        </div>
        <div className="adm-sidebar-footer">
          <div className="adm-sidebar-account">
            <span className="adm-user-avatar" aria-hidden="true">{initials}</span>
            <span className="adm-user-details"><strong title={userEmail}>{userName}</strong><small>Administrateur</small></span>
          </div>
          <div className="adm-sidebar-actions">{accountAction}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="adm-shell">
      <a href="#admin-content" className="adm-skip-link">Aller au contenu</a>
      <aside className="adm-sidebar" aria-label="Administration">{sidebarContent()}</aside>
      <dialog
        ref={dialogRef}
        id={dialogId}
        className="adm-sidebar-dialog"
        aria-label="Navigation — Administration"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target !== event.currentTarget) return;
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeNavigation();
        }}
      >
        {sidebarContent(true)}
      </dialog>
      <div className="adm-panel">
        <header className="adm-topbar">
          <button type="button" className="adm-menu-button adm-menu-toggle" aria-label="Ouvrir le menu" aria-controls={dialogId} aria-expanded={open} onClick={() => { dialogRef.current?.showModal(); setOpen(true); }}>
            <Menu size={20} aria-hidden="true" />
          </button>
          <div className="adm-location"><span>Administration</span><ChevronRight size={14} aria-hidden="true" /><strong>{sectionLabel}</strong></div>
          <Link href="/" className="adm-link adm-site-link" target="_blank" rel="noreferrer"><Globe size={15} aria-hidden="true" /> Voir le site</Link>
        </header>
        <main id="admin-content" className="adm-wrap">{children}</main>
      </div>
    </div>
  );
}
