export function VenueSection() {
  return (
    <section className="py-20 px-6 bg-card border-y border-silver-light/50" id="venue">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-4">
          ¿Cómo llegar?
        </p>
        <div className="h-px w-16 bg-silver mx-auto mb-12" />

        <p className="font-display text-4xl sm:text-5xl font-light text-charcoal mb-3">
          Finca Amada
        </p>
        <p className="text-sm font-sans text-muted mb-10">
          San Sebastián, Puerto Rico
        </p>

        {/* Map placeholder */}
        <div className="w-full h-64 bg-parchment border border-silver-light flex items-center justify-center mb-8 shadow-warm-sm">
          <div className="text-center">
            <p className="text-sm uppercase tracking-wider text-silver-dark font-sans mb-2">
              Finca Amada
            </p>
            <p className="text-xs font-sans text-muted">San Sebastián, PR</p>
          </div>
        </div>

        <a
          href="https://maps.google.com/?q=Finca+Amada+San+Sebastian+Puerto+Rico"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans text-charcoal border-b border-silver pb-0.5 hover:text-muted hover:border-muted transition-colors"
        >
          Ver Indicaciones
        </a>
      </div>
    </section>
  );
}
