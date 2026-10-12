import Image from "next/image";
import { VENUE } from "@/lib/venue";

const HERO_IMAGE = "/images/hero.jpeg";

export function HeroSection() {
  return (
    <section className="relative isolate flex min-h-screen flex-col overflow-hidden bg-espresso text-cream lg:block">
      {/* Fondo: la misma foto difuminada rellena los bordes sin recortar la principal */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <Image src={HERO_IMAGE} alt="" fill sizes="100vw" className="scale-110 object-cover opacity-70 blur-2xl" />
        <div className="absolute inset-0 bg-espresso/50" />
      </div>

      {/* Foto completa: object-contain, nunca se recorta */}
      <div className="relative aspect-[3/2] w-full lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src={HERO_IMAGE}
          alt="Anthony y Alexandra al atardecer, junto al auto"
          fill
          priority
          sizes="100vw"
          className="object-contain object-center"
        />
      </div>

      {/* Degradado inferior para que el texto se lea sobre la foto en escritorio */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[46%] bg-gradient-to-t from-espresso via-espresso/75 to-transparent lg:block"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-10 px-6 py-12 text-center lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-12 lg:pb-12 lg:text-left lg:px-16">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.45em] text-silver-light">Estan cordialmente invitados</p>

          <div className="my-5 flex items-center justify-center gap-4 lg:justify-start">
            <span className="h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="h-2 w-2 rounded-full bg-gold/90 shadow-[0_0_14px_rgba(185,155,107,0.6)]" />
            <span className="h-px w-14 bg-gradient-to-r from-transparent via-gold to-transparent" />
          </div>

          <p className="mb-4 font-display text-lg italic text-silver-light sm:text-xl">Una celebracion intima en Puerto Rico</p>

          <h1 className="font-display text-6xl font-light leading-none tracking-[-0.04em] text-cream sm:text-7xl lg:text-8xl">
            <span className="block lg:inline">Anthony</span>
            <span className="my-2 block font-display text-2xl italic text-gold sm:text-3xl lg:mx-4 lg:inline lg:text-5xl">
              &amp;
            </span>
            <span className="block lg:inline">Alexandra</span>
          </h1>
        </div>

        <div className="grid w-full max-w-md gap-5 text-center sm:grid-cols-3 lg:flex lg:w-auto lg:max-w-none lg:gap-0 lg:text-left">
          <div className="lg:pr-6">
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-light">Fecha</p>
            <p className="mt-2 font-display text-2xl font-light text-cream lg:whitespace-nowrap">5 de diciembre</p>
            <p className="text-sm uppercase tracking-[0.25em] text-silver-light/80 lg:whitespace-nowrap">2026</p>
          </div>
          <div className="sm:border-x sm:border-silver-light/30 lg:border-r-0 lg:px-6">
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-light">Ceremonia</p>
            <p className="mt-2 font-display text-2xl font-light text-cream lg:whitespace-nowrap">4:00 PM</p>
            <p className="text-sm uppercase tracking-[0.25em] text-silver-light/80 lg:whitespace-nowrap">Hora local</p>
          </div>
          <div className="lg:border-l lg:border-silver-light/30 lg:pl-6">
            <p className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-light">Lugar</p>
            <p className="mt-2 font-display text-2xl font-light text-cream lg:whitespace-nowrap">{VENUE.name}</p>
            <p className="text-sm uppercase tracking-[0.18em] text-silver-light/80 lg:whitespace-nowrap">{VENUE.city}, {VENUE.country}</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 lg:hidden">
          <span className="text-[0.68rem] uppercase tracking-[0.35em] text-silver-light">Desliza</span>
          <span className="h-10 w-px bg-gradient-to-b from-gold/80 to-transparent" />
        </div>
      </div>

      {/* Marco fino, en línea con el resto del diseño */}
      <div className="pointer-events-none absolute inset-4 z-20 border border-gold/25 lg:inset-6" aria-hidden="true" />
    </section>
  );
}
