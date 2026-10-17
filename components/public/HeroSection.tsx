import Image from "next/image";
import { VENUE } from "@/lib/venue";
import { EVENT } from "@/lib/event";
import { CalendarButton } from "@/components/public/CalendarButton";
import { DaysLeft } from "@/components/public/DaysLeft";
import { PearlButton } from "@/components/ui/pearl-button";

const HERO_IMAGE = "/images/hero.jpeg";

// Portada clara: la foto siempre completa (object-contain). En móvil va arriba y el texto
// debajo; en escritorio, foto a la izquierda y texto a la derecha.
export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] flex-col bg-ivory text-charcoal lg:grid lg:min-h-[90vh] lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14 lg:px-16 lg:py-20 xl:px-24"
    >
      <figure className="relative aspect-[3/2] w-full bg-champagne-light lg:overflow-hidden lg:rounded-md lg:shadow-warm-lg">
        <Image
          src={HERO_IMAGE}
          alt="Anthony y Alexandra al atardecer, junto al auto"
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 100vw"
          className="object-contain"
        />
      </figure>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-3 px-8 pb-12 pt-6 text-center lg:items-start lg:px-0 lg:py-0 lg:text-left">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Están cordialmente invitados</p>

        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="h-px w-12 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        <p className="font-display text-lg italic text-muted sm:text-xl">Una celebración íntima en Puerto Rico</p>

        <h1 className="names-3d font-display text-[3.4rem] font-light leading-[0.92] tracking-[-0.01em] sm:text-7xl lg:text-8xl">
          <span className="block">Anthony</span>
          <span className="block text-3xl italic leading-tight text-gold sm:text-4xl lg:text-5xl">&amp;</span>
          <span className="block">Alexandra</span>
        </h1>

        <p className="mt-1 font-display text-2xl leading-tight lg:text-3xl">{EVENT.dateLong}</p>
        <p className="text-sm text-muted lg:text-base">
          {EVENT.time} · {VENUE.name}, {VENUE.city}
        </p>

        <div className="mt-2 flex w-full max-w-sm flex-col gap-3 lg:w-auto lg:max-w-none lg:flex-row">
          <PearlButton href="#rsvp" label="Confirmar asistencia" className="w-full lg:w-auto" />
          <CalendarButton />
        </div>

        <div className="mt-1">
          <DaysLeft />
        </div>
      </div>

      {/* Marco fino dorado, como en el resto del diseño */}
      <div className="pointer-events-none absolute inset-3 z-20 border border-gold/45 lg:inset-6" aria-hidden="true" />
    </section>
  );
}
