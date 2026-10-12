import { VENUE } from "@/lib/venue";

export function Footer() {
  return (
    <footer className="px-6 py-16">
      <div className="mx-auto max-w-4xl text-center">
        <div className="premium-card px-8 py-10 sm:px-12">
          <p className="font-display text-3xl font-light italic text-charcoal sm:text-4xl">Anthony &amp; Alexandra</p>
          <div className="mx-auto mt-5 h-px w-24 bg-gradient-to-r from-transparent via-silver to-transparent" />
          <p className="mt-5 text-[0.72rem] uppercase tracking-[0.32em] text-silver-dark">5 de diciembre, 2026</p>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-muted">{VENUE.name} · {VENUE.city}, {VENUE.country}</p>
        </div>
      </div>
    </footer>
  );
}
