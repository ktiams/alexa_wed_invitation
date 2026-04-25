export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-cream overflow-hidden px-6">
      {/* Decorative border inset — warm champagne */}
      <div className="absolute inset-8 border border-silver-light pointer-events-none hidden sm:block" />
      <div className="absolute inset-10 border border-silver-light/40 pointer-events-none hidden sm:block" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Pre-header */}
        <p className="text-sm uppercase tracking-[0.25em] text-silver-dark font-sans mb-8 animate-fade-in">
          Están cordialmente invitados
        </p>

        {/* Divider — champagne gold */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-silver" />
          <div className="w-1.5 h-1.5 rounded-full bg-silver" />
          <div className="h-px w-16 bg-silver" />
        </div>

        {/* Names */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-charcoal leading-none tracking-tight mb-4 animate-fade-up">
          Anthony
        </h1>
        <p className="font-display text-2xl sm:text-3xl text-gold italic mb-4 animate-fade-up">
          &amp;
        </p>
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-light text-charcoal leading-none tracking-tight mb-10 animate-fade-up">
          Alexandra
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="h-px w-16 bg-silver" />
          <div className="w-1.5 h-1.5 rounded-full bg-silver" />
          <div className="h-px w-16 bg-silver" />
        </div>

        {/* Date & venue */}
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-2 animate-fade-in">
          5 de diciembre, 2026
        </p>
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans animate-fade-in">
          4:00 PM · Finca Amada · San Sebastián, Puerto Rico
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in">
        <span className="text-sm uppercase tracking-wider text-silver-dark font-sans">Desliza</span>
        <div className="w-px h-8 bg-silver/50" />
      </div>
    </section>
  );
}
