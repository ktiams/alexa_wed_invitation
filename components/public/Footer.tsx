import { EVENT } from "@/lib/event";

export function Footer() {
  return (
    <footer className="bg-parchment px-6 py-14 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>
        <p className="font-display text-4xl font-light italic text-charcoal">Anthony &amp; Alexandra</p>
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">{EVENT.dateShort}</p>
      </div>
    </footer>
  );
}
