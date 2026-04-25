"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/guests", label: "Invitados" },
  { href: "/admin/messages", label: "Mensajes" },
  { href: "/admin/gifts", label: "Regalos" },
  { href: "/admin/settings", label: "Configuración" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex flex-col w-56 shrink-0 bg-white border-r border-silver-light min-h-screen">
      {/* Brand */}
      <div className="px-6 py-8 border-b border-silver-light">
        <p className="font-display text-xl font-light italic text-charcoal leading-tight">
          A &amp; A
        </p>
        <p className="text-xs uppercase tracking-widest text-silver-dark font-sans mt-0.5">
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3">
        <ul className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center px-3 py-2.5 text-xs uppercase tracking-widest font-sans transition-colors",
                    isActive
                      ? "bg-charcoal text-white"
                      : "text-muted hover:text-charcoal hover:bg-cream",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-silver-light">
        <button
          onClick={handleSignOut}
          className="w-full text-xs uppercase tracking-widest font-sans text-muted hover:text-charcoal transition-colors py-2 text-left px-3"
        >
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
