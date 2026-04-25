export function HeroSection() {
  return (
    <section className="premium-shell relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.72),transparent_34%),linear-gradient(180deg,rgba(255,253,248,0.58),rgba(247,241,232,0.28))]" />
      <div className="absolute left-[8%] top-24 h-48 w-48 rounded-full bg-gold/15 blur-3xl" />
      <div className="absolute bottom-20 right-[10%] h-56 w-56 rounded-full bg-olive/10 blur-3xl" />
      <div className="absolute left-8 top-12 hidden h-[72vh] w-28 text-olive/45 md:block">
        <svg viewBox="0 0 140 780" className="h-full w-full">
          <path d="M72 760C54 626 100 524 66 398C42 310 18 204 68 48" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M58 340C4 318 -12 266 20 228C64 252 80 294 58 340Z" fill="currentColor" opacity="0.85" />
          <path d="M72 454C130 420 148 350 106 304C62 348 48 404 72 454Z" fill="currentColor" opacity="0.72" />
          <path d="M60 590C6 566 -10 512 24 470C66 498 84 548 60 590Z" fill="currentColor" opacity="0.82" />
        </svg>
      </div>
      <div className="absolute bottom-12 right-8 hidden h-[68vh] w-28 scale-x-[-1] text-olive/35 md:block">
        <svg viewBox="0 0 140 780" className="h-full w-full">
          <path d="M72 760C54 626 100 524 66 398C42 310 18 204 68 48" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M58 340C4 318 -12 266 20 228C64 252 80 294 58 340Z" fill="currentColor" opacity="0.85" />
          <path d="M72 454C130 420 148 350 106 304C62 348 48 404 72 454Z" fill="currentColor" opacity="0.72" />
          <path d="M60 590C6 566 -10 512 24 470C66 498 84 548 60 590Z" fill="currentColor" opacity="0.82" />
        </svg>
      </div>

      <div className="premium-card relative z-10 mx-auto w-full max-w-4xl px-8 py-14 text-center sm:px-12 sm:py-20">
        <p className="mb-6 text-[0.72rem] uppercase tracking-[0.45em] text-silver-dark">
          Estan cordialmente invitados
        </p>

        <div className="mb-8 flex items-center justify-center gap-4">
          <span className="h-px w-14 bg-gradient-to-r from-transparent via-silver to-transparent" />
          <span className="h-2 w-2 rounded-full bg-gold/80 shadow-[0_0_14px_rgba(185,155,107,0.45)]" />
          <span className="h-px w-14 bg-gradient-to-r from-transparent via-silver to-transparent" />
        </div>

        <p className="mb-4 font-display text-lg italic text-silver-dark sm:text-xl">
          Una celebracion intima en Puerto Rico
        </p>

        <h1 className="text-6xl font-light leading-none tracking-[-0.04em] text-charcoal sm:text-7xl md:text-8xl">
          Anthony
        </h1>
        <p className="my-3 font-display text-2xl italic text-gold sm:text-3xl">&amp;</p>
        <h1 className="text-6xl font-light leading-none tracking-[-0.04em] text-charcoal sm:text-7xl md:text-8xl">
          Alexandra
        </h1>

        <div className="mx-auto mt-8 h-px w-32 bg-gradient-to-r from-transparent via-silver to-transparent" />

        <div className="mt-10 grid gap-5 text-center sm:grid-cols-3">
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Fecha</p>
            <p className="mt-2 font-display text-2xl font-light text-charcoal">5 de diciembre</p>
            <p className="text-sm uppercase tracking-[0.25em] text-muted">2026</p>
          </div>
          <div className="sm:border-x sm:border-silver-light/60">
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Ceremonia</p>
            <p className="mt-2 font-display text-2xl font-light text-charcoal">4:00 PM</p>
            <p className="text-sm uppercase tracking-[0.25em] text-muted">Hora local</p>
          </div>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Lugar</p>
            <p className="mt-2 font-display text-2xl font-light text-charcoal">Finca Amada</p>
            <p className="text-sm uppercase tracking-[0.18em] text-muted">San Sebastian, Puerto Rico</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2">
          <span className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Desliza</span>
          <span className="h-10 w-px bg-gradient-to-b from-gold/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
