import { VENUE } from "@/lib/venue";

export function VenueSection() {
  return (
    <section className="px-6 py-20" id="venue">
      <div className="mx-auto max-w-5xl">
        <div className="premium-card grid gap-8 px-8 py-10 sm:px-12 sm:py-14 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.38em] text-silver-dark">Como llegar</p>
            <p className="mt-5 font-display text-4xl font-light text-charcoal sm:text-5xl">{VENUE.name}</p>
            <p className="mt-2 text-base text-muted">
              {VENUE.neighborhood}, {VENUE.city}, {VENUE.country}
            </p>

            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted">
              Hemos elegido un lugar rodeado de vegetación y luz natural para que la experiencia se sienta íntima, cálida y especial desde la llegada.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href={VENUE.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full border border-silver px-6 py-3 text-[0.72rem] uppercase tracking-[0.32em] text-charcoal hover:bg-white/45"
              >
                Ver ruta
                <span className="h-px w-6 bg-silver" />
              </a>
              <a
                href={VENUE.mapsPlaceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[0.68rem] uppercase tracking-[0.28em] text-silver-dark underline-offset-4 hover:text-charcoal hover:underline"
              >
                Abrir en Google Maps
              </a>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-silver-light/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.62),rgba(239,228,211,0.82))] p-5 shadow-[0_18px_40px_rgba(42,37,33,0.08)]">
            <div className="absolute inset-4 rounded-[1.5rem] border border-silver-light/70" />
            <div className="relative flex h-[320px] items-end rounded-[1.5rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.7),transparent_35%),linear-gradient(180deg,rgba(111,125,100,0.14),rgba(185,155,107,0.22))] p-8">
              <div>
                <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-dark">Destino</p>
                <p className="mt-3 font-display text-3xl font-light text-charcoal">{VENUE.name}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-muted">{VENUE.cityShort}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
