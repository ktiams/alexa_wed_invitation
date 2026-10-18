import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Panel de los novios",
  robots: { index: false, follow: false },
};

// El login (/admin/login) usa solo este layout; las pestañas y los destellos del panel
// están en (panel)/layout.tsx para que no aparezcan antes de entrar.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
