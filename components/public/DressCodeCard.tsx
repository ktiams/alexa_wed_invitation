export function DressCodeCard() {
  return (
    <section className="px-6 py-20" id="dress-code">
      <div className="mx-auto max-w-5xl">
        <div className="premium-card grid gap-10 px-8 py-10 sm:px-12 sm:py-14 md:grid-cols-[0.9fr_1.1fr]">
          <div className="border-b border-silver-light/70 pb-8 md:border-b-0 md:border-r md:pb-0 md:pr-10">
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-silver-dark">Codigo de vestimenta</p>
            <p className="mt-5 font-display text-5xl font-light italic text-charcoal sm:text-6xl">Blanco</p>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">
              Vestimenta casual elegante en tonos blancos, marfil y texturas suaves que acompañen la estética de la celebración.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-silver-dark">Ideal</p>
              <div className="mt-4 space-y-3">
                {["Blanco o marfil", "Siluetas limpias", "Casual elegante"].map((item) => (
                  <div key={item} className="rounded-2xl border border-silver-light/70 bg-white/35 px-4 py-3 text-sm uppercase tracking-[0.22em] text-charcoal">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.32em] text-silver-dark">Evitar</p>
              <div className="mt-4 space-y-3">
                {["Brillantina", "Glitter", "Brillos intensos"].map((item) => (
                  <div key={item} className="rounded-2xl border border-silver-light/70 bg-parchment/50 px-4 py-3 text-sm uppercase tracking-[0.22em] text-silver-dark">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
