"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

// Navegación del panel de los novios: tres pestañas. En el celular van en una barra fija
// abajo (al alcance del pulgar); en la computadora, arriba junto al monograma.

type Tab = { href: string; label: string; exact?: boolean; icon: React.ReactNode };

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  className: "h-[22px] w-[22px] lg:hidden",
};

const tabs: Tab[] = [
  {
    href: "/admin",
    label: "Invitados",
    exact: true,
    icon: (
      <svg {...iconProps}>
        <circle cx="9" cy="8" r="3.2" />
        <path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M15.5 14.2c2.4-.3 4.4 1.2 5 4.3" />
      </svg>
    ),
  },
  {
    href: "/admin/autorizaciones",
    label: "Autorizaciones",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l2.2 1.6 2.7-.2.9 2.6 2.2 1.6-.8 2.6.8 2.6-2.2 1.6-.9 2.6-2.7-.2L12 21l-2.2-1.6-2.7.2-.9-2.6-2.2-1.6.8-2.6-.8-2.6 2.2-1.6.9-2.6 2.7.2z" />
        <path d="M8.8 12.2l2.2 2.1 4.2-4.4" />
      </svg>
    ),
  },
  {
    href: "/admin/fotos",
    label: "Fotos",
    icon: (
      <svg {...iconProps}>
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
        <circle cx="9" cy="10" r="1.8" />
        <path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4" />
      </svg>
    ),
  },
];

export function AdminNav({ pendingPhotos }: { pendingPhotos: number }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const items = tabs.map((tab) => {
    const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
    const badge = tab.href === "/admin/autorizaciones" && pendingPhotos > 0 ? pendingPhotos : null;
    return (
      <li key={tab.href} className="flex">
        <Link
          href={tab.href}
          aria-current={active ? "page" : undefined}
          className={[
            "relative flex flex-1 flex-col items-center gap-0.5 pt-1 text-[0.7rem] font-semibold transition-colors",
            "lg:flex-row lg:gap-2 lg:rounded-full lg:px-4 lg:py-2 lg:pt-2 lg:text-sm",
            active ? "text-charcoal lg:bg-espresso lg:text-ivory" : "text-muted/80 hover:text-charcoal",
          ].join(" ")}
        >
          {tab.icon}
          {tab.label}
          {badge !== null && (
            <span
              className={[
                "absolute -top-1 left-[calc(50%+4px)] flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.6rem] text-ivory",
                "bg-gold-dark lg:static lg:h-5 lg:min-w-5 lg:text-[0.68rem]",
                active ? "lg:bg-gold" : "",
              ].join(" ")}
              aria-label={`${badge} por revisar`}
            >
              {badge}
            </span>
          )}
          {active && <span className="absolute -bottom-2 h-1 w-1 rounded-full bg-gold lg:hidden" aria-hidden="true" />}
        </Link>
      </li>
    );
  });

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-silver-light/70 bg-cream/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:py-4">
          <Link href="/admin" className="font-display text-2xl italic leading-none text-charcoal">
            A &amp; A
          </Link>
          <nav aria-label="Secciones del panel" className="hidden lg:block">
            <ul className="flex gap-1">{items}</ul>
          </nav>
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full border border-silver-light bg-card/70 px-3.5 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-muted transition-colors hover:text-charcoal"
          >
            Salir
          </button>
        </div>
      </header>

      <nav
        aria-label="Secciones del panel"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-silver-light/80 bg-card/95 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2 backdrop-blur-md lg:hidden"
      >
        <ul className="mx-auto grid max-w-md grid-cols-3">{items}</ul>
      </nav>
    </>
  );
}
