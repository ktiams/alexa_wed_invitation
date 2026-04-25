export function AdultsOnlyNotice() {
  return (
    <section className="py-10 px-6 bg-cream" id="adults-only">
      <div className="max-w-xl mx-auto">
        <div className="border border-silver-light bg-card p-6 sm:p-8 flex gap-4 items-start shadow-warm-sm">
          <div className="shrink-0 w-9 h-9 flex items-center justify-center border border-silver text-silver-dark text-xs font-sans font-semibold tracking-wider mt-0.5">
            18+
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider font-sans font-semibold text-charcoal mb-2">
              Solo Adultos
            </p>
            <p className="text-sm font-sans text-muted leading-relaxed">
              Les pedimos respetuosamente que hagan arreglos para sus hijos en
              casa. Nuestra celebración es un evento solo para adultos. Cada
              invitación permite al invitado y un acompañante únicamente.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
