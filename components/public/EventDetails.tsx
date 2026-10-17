import Image from "next/image";
import { VENUE } from "@/lib/venue";
import { EVENT } from "@/lib/event";
import { CalendarButton } from "@/components/public/CalendarButton";
import { CountdownTimer } from "@/components/public/CountdownTimer";
import { SparklesCore } from "@/components/ui/sparkles";
import { LIGHT_SPARKLES } from "@/lib/sparkles";

const tile =
  "flex min-h-[4.5rem] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-silver-light bg-cream text-sm font-medium text-charcoal hover:border-gold";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="h-5 w-5 text-gold">
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.3" />
    </svg>
  );
}

function RouteIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className="h-5 w-5 text-gold">
      <path d="M4 12l16-8-6 16-2.5-6.5z" />
    </svg>
  );
}

// "Cuándo y dónde": fecha, hora y lugar una sola vez, con mapas, calendario y cuenta regresiva.
export function EventDetails() {
  const rows = [
    { label: "Fecha", value: EVENT.dateLong.replace(" de 2026", ""), note: "2026" },
    { label: "Hora", value: EVENT.time, note: EVENT.timeNote },
    { label: "Lugar", value: VENUE.name, note: `${VENUE.neighborhood}, ${VENUE.city}, PR ${VENUE.postalCode}` },
  ];

  return (
    <section id="detalles" className="relative isolate bg-parchment px-4 py-14 sm:px-6 sm:py-20">
      <SparklesCore {...LIGHT_SPARKLES} className="absolute inset-0 -z-10 h-full w-full" />
      <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:gap-6">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-gold-dark">Cuándo y dónde</p>

        <div className="soft-card">
          {VENUE.photo && (
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[1.25rem] sm:aspect-[21/9]">
              <Image
                src={VENUE.photo.src}
                alt={`${VENUE.name}, vista aérea`}
                fill
                sizes="(min-width: 1024px) 1024px, 100vw"
                className="object-cover"
              />
            </div>
          )}

          <dl className="px-5 sm:px-8 lg:grid lg:grid-cols-3 lg:px-0">
            {rows.map((row) => (
              <div
                key={row.label}
                className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-3 border-b border-silver-light py-4 lg:flex lg:flex-col lg:gap-2 lg:border-b-0 lg:border-r lg:px-8 lg:py-8 lg:last:border-r-0"
              >
                <dt className="pt-1 text-xs font-medium uppercase tracking-[0.14em] text-gold-dark">{row.label}</dt>
                <dd className="font-display text-2xl leading-tight text-charcoal lg:text-3xl">
                  {row.value}
                  <span className="mt-1 block font-body text-sm leading-snug text-muted">{row.note}</span>
                </dd>
              </div>
            ))}
          </dl>

          <div className="grid grid-cols-3 gap-2 px-5 pb-5 pt-4 sm:px-8 lg:border-t lg:border-silver-light lg:py-6">
            <a className={tile} href={VENUE.directionsUrl} target="_blank" rel="noopener noreferrer">
              <PinIcon />
              Google Maps
            </a>
            <a className={tile} href={VENUE.wazeUrl} target="_blank" rel="noopener noreferrer">
              <RouteIcon />
              Waze
            </a>
            <CalendarButton variant="tile" />
          </div>
        </div>

        <CountdownTimer />
      </div>
    </section>
  );
}
