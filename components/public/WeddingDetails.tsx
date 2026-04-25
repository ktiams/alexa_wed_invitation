import type { WeddingSettings } from "@/lib/types/database";

interface WeddingDetailsProps {
  settings: WeddingSettings;
}

export function WeddingDetails({ settings }: WeddingDetailsProps) {
  return (
    <section className="py-20 px-6 bg-cream" id="details">
      <div className="max-w-xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-14">
          <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-4">
            Los Detalles
          </p>
          <div className="h-px w-16 bg-silver mx-auto" />
        </div>

        {/* Details grid */}
        <div className="grid sm:grid-cols-3 gap-10 text-center">
          {/* Date */}
          <div>
            <p className="text-sm uppercase tracking-wider text-silver-dark font-sans mb-3">
              Fecha
            </p>
            <p className="font-display text-2xl font-light text-charcoal">
              5 de diciembre
            </p>
            <p className="font-display text-lg font-light text-muted italic">
              2026
            </p>
          </div>

          {/* Column divider */}
          <div className="hidden sm:flex flex-col items-center justify-center">
            <div className="h-16 w-px bg-silver-light" />
          </div>
          <div className="sm:hidden h-px w-full bg-silver-light" />

          {/* Time */}
          <div className="sm:col-start-3">
            <p className="text-sm uppercase tracking-wider text-silver-dark font-sans mb-3">
              Hora
            </p>
            <p className="font-display text-2xl font-light text-charcoal">
              4:00 PM
            </p>
            <p className="font-display text-lg font-light text-muted italic">
              Hora Estándar del Atlántico
            </p>
          </div>
        </div>

        {/* Venue */}
        <div className="mt-14 text-center border-t border-silver-light pt-14">
          <p className="text-sm uppercase tracking-wider text-silver-dark font-sans mb-4">
            Lugar
          </p>
          <p className="font-display text-3xl sm:text-4xl font-light text-charcoal mb-2">
            {settings.venue_name}
          </p>
          <p className="text-sm font-sans text-muted">
            {settings.venue_city}, {settings.venue_country}
          </p>
        </div>
      </div>
    </section>
  );
}
