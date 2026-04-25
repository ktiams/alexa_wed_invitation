import type { WeddingSettings } from "@/lib/types/database";

interface WeddingDetailsProps {
  settings: WeddingSettings;
}

export function WeddingDetails({ settings }: WeddingDetailsProps) {
  return (
    <section className="px-6 py-20" id="details">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-silver-dark">Los detalles</p>
          <p className="mx-auto mt-5 max-w-2xl font-display text-3xl font-light leading-tight text-charcoal sm:text-4xl">
            Una tarde de celebracion, naturaleza y elegancia serena
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="premium-card px-8 py-10 sm:px-10">
            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Fecha</p>
                <p className="mt-3 font-display text-4xl font-light text-charcoal">5 diciembre</p>
                <p className="mt-1 text-sm uppercase tracking-[0.25em] text-muted">2026</p>
              </div>
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Hora</p>
                <p className="mt-3 font-display text-4xl font-light text-charcoal">4:00 PM</p>
                <p className="mt-1 text-sm uppercase tracking-[0.18em] text-muted">Hora estandar del Atlantico</p>
              </div>
            </div>

            <div className="mt-8 border-t border-silver-light/80 pt-8">
              <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Lugar</p>
              <p className="mt-3 font-display text-4xl font-light text-charcoal sm:text-5xl">{settings.venue_name}</p>
              <p className="mt-2 max-w-xl text-base leading-relaxed text-muted">
                {settings.venue_city}, {settings.venue_country}
              </p>
            </div>
          </div>

          <div className="premium-card flex flex-col justify-between px-8 py-10">
            <div>
              <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Ambiente</p>
              <p className="mt-4 font-display text-3xl font-light leading-tight text-charcoal">
                Jardines, luz dorada y una cena bajo el cielo
              </p>
            </div>
            <div className="mt-8 border-t border-silver-light/80 pt-6">
              <p className="text-sm leading-relaxed text-muted">
                Queremos que cada rincón se sienta cálido, refinado y memorable desde el primer vistazo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
