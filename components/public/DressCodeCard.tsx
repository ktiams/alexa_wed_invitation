export function DressCodeCard() {
  return (
    <section className="py-20 px-6 bg-card border-y border-silver-light/50" id="dress-code">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-4">
            Código de Vestimenta
          </p>
          <div className="h-px w-16 bg-silver mx-auto" />
        </div>

        <div className="border border-silver-light bg-cream p-8 sm:p-12 text-center shadow-warm-sm">
          <p className="font-display text-4xl sm:text-5xl font-light italic text-charcoal mb-5">
            Blanco
          </p>
          <p className="text-sm font-sans text-muted mb-8 leading-relaxed">
            Vestimenta casual elegante en tonos blancos.
            <br />
            Les pedimos respetuosamente que respeten nuestra paleta de colores.
          </p>

          {/* Allowed */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {["Blanco & Marfil", "Casual Elegante"].map((item) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="text-gold text-base font-sans">✓</span>
                <span className="text-sm uppercase tracking-wider font-sans text-charcoal">
                  {item}
                </span>
              </div>
            ))}
          </div>

          {/* Prohibited */}
          <div className="mt-6 pt-6 border-t border-silver-light">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {["Sin Brillantina", "Sin Glitter", "Sin Brillo"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <span className="text-red-500 text-sm">✕</span>
                  <span className="text-sm uppercase tracking-wider font-sans text-silver-dark">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
