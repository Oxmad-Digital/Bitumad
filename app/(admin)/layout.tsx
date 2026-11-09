import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin — Bitumad",
  robots: { index: false, follow: false },
  icons: { icon: "https://res.cloudinary.com/uuiwf5lx/image/upload/v1784664047/bitumad_logo_carr%C3%A9_spjwlw.webp" },
};

export const viewport: Viewport = {
  themeColor: "#0c0c0b",
};

/** Separate root layout: the admin skips the site chrome (navbar, footer, theme toggle, tracking). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="adm">{children}</body>
    </html>
  );
}
