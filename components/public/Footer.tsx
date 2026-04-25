export function Footer() {
  return (
    <footer className="py-16 px-6 bg-cream border-t border-silver-light">
      <div className="max-w-xl mx-auto text-center">
        <p className="font-display text-2xl font-light italic text-charcoal mb-3">
          Anthony &amp; Alexandra
        </p>
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans">
          5 de diciembre, 2026
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <div className="h-px w-12 bg-silver/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-silver" />
          <div className="h-px w-12 bg-silver/40" />
        </div>
        <p className="text-xs text-silver-dark font-sans mt-6 tracking-wider">
          Finca Amada · San Sebastián, Puerto Rico
        </p>
      </div>
    </footer>
  );
}
