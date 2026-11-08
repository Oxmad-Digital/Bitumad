"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChartNoAxesCombined, FileText, Mail, Settings } from "lucide-react";

export default function AdminNav({ quotes, messages }: { quotes: number; messages: number }) {
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: "Statistiques", count: 0, icon: ChartNoAxesCombined },
    { href: "/admin/devis", label: "Demandes de devis", count: quotes, icon: FileText },
    { href: "/admin/messages", label: "Messages", count: messages, icon: Mail },
    { href: "/admin/comptes", label: "Comptes", count: 0, icon: Settings },
  ];
  const current = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <nav className="adm-nav" aria-label="Admin">
      {items.map((item) => (
        <Link key={item.href} href={item.href} aria-current={current(item.href) ? "page" : undefined}>
          <item.icon size={18} strokeWidth={1.7} aria-hidden="true" />
          <span>{item.label}</span>
          {item.count > 0 && <span className="adm-badge" aria-label={`${item.count} nouveau${item.count > 1 ? "x" : ""}`}>{item.count}</span>}
        </Link>
      ))}
    </nav>
  );
}
