"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/guests", label: "Invitados" },
  { href: "/admin/messages", label: "Mensajes" },
  { href: "/admin/gifts", label: "Regalos" },
  { href: "/admin/fotos", label: "Fotos" },
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
    <aside className="border-b border-silver-light bg-card md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <div className="flex items-center justify-between gap-4 border-b border-silver-light px-4 py-4 sm:px-6 md:block md:px-6 md:py-8">
        <div>
          <p className="font-display text-xl font-light italic leading-tight text-charcoal">A &amp; A</p>
          <p className="mt-0.5 text-xs uppercase tracking-widest text-silver-dark">Admin</p>
        </div>
        <button
          onClick={handleSignOut}
          className="rounded-full border border-silver-light px-3 py-2 text-[0.68rem] uppercase tracking-[0.24em] text-muted transition-colors hover:text-charcoal md:hidden"
        >
          Salir
        </button>
      </div>

      <nav className="overflow-x-auto px-3 py-3 md:px-3 md:py-6">
        <ul className="flex min-w-max gap-2 md:min-w-0 md:flex-col md:gap-0.5">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    "flex items-center rounded-full px-4 py-2.5 text-[0.68rem] uppercase tracking-[0.24em] transition-colors md:rounded-none md:px-3",
                    isActive ? "bg-charcoal text-ivory" : "bg-cream/40 text-muted hover:bg-nude-light hover:text-charcoal",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="hidden border-t border-silver-light p-4 md:block">
        <button
          onClick={handleSignOut}
          className="w-full px-3 py-2 text-left text-xs uppercase tracking-widest text-muted transition-colors hover:text-charcoal"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
