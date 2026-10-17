import Image from "next/image";
import { VENUE } from "@/lib/venue";
import { EVENT } from "@/lib/event";
import { CalendarButton } from "@/components/public/CalendarButton";
import { DaysLeft } from "@/components/public/DaysLeft";
import { PearlButton } from "@/components/ui/pearl-button";

const HERO_IMAGE = "/images/hero.jpeg";

const smallCaps = "text-[0.7rem] uppercase tracking-[0.32em] text-muted lg:text-xs";

// Portada clara: la foto siempre completa (object-contain). En móvil va arriba y el texto
// debajo; en escritorio, foto a la izquierda y texto a la derecha.
// Tipografía como la tarjeta de referencia: caligrafía dorada ("Boda", "y") y nombres en
// mayúsculas serif espaciadas. Flores de la imagen del código de vestimenta encima,
// arriba a la derecha y abajo a la izquierda del bloque de texto.
export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip bg-ivory text-charcoal lg:grid lg:min-h-[92vh] lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-12 lg:px-16 lg:py-16 xl:px-24"
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

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-8 pb-12 pt-8 text-center lg:px-10 lg:py-14">
        <Image
          src="/images/flores/flores-sup-der.webp"
          alt=""
          aria-hidden="true"
          width={268}
          height={570}
          sizes="(min-width: 1024px) 150px, 100px"
          className="pointer-events-none absolute -right-1 -top-16 -z-10 w-[25vw] max-w-[150px] select-none lg:-right-6 lg:-top-10"
        />
        <Image
          src="/images/flores/flores-inf-izq.webp"
          alt=""
          aria-hidden="true"
          width={280}
          height={728}
          sizes="(min-width: 1024px) 140px, 96px"
          className="pointer-events-none absolute -bottom-6 -left-1 -z-10 w-[24vw] max-w-[140px] select-none lg:-bottom-10 lg:-left-8"
        />

        <p className={smallCaps}>Acompáñanos en la</p>
        <p className="gold-foil -mb-1 mt-1 px-3 font-script text-[4.6rem] leading-[1.15] lg:text-[6rem]">Boda</p>
        <p className={smallCaps}>de</p>

        <h1 className="names-3d mt-2 font-display text-[clamp(1.35rem,6.2vw,2.4rem)] font-medium uppercase leading-tight tracking-[0.13em]">
          <span className="block">{EVENT.groomFullName}</span>
          <span className="gold-foil my-0.5 block px-2 font-script text-[2.6rem] normal-case leading-[1.1] tracking-normal lg:text-5xl">
            y
          </span>
          <span className="block">{EVENT.brideFullName}</span>
        </h1>

        <div className="mt-5 flex flex-col gap-1 text-[0.78rem] uppercase tracking-[0.2em] text-charcoal/85 lg:text-sm">
          <p>
            {EVENT.dateLong.replace(" de 2026", "")} · {EVENT.time}
          </p>
          <p>{VENUE.name}</p>
          <p className="text-muted">
            {VENUE.city}, {VENUE.country}
          </p>
        </div>

        <div className="mt-7 flex w-full max-w-sm flex-col gap-3 lg:w-auto lg:max-w-none lg:flex-row">
          <PearlButton href="#rsvp" label="Confirmar asistencia" className="w-full lg:w-auto" />
          <CalendarButton />
        </div>

        <div className="mt-4">
          <DaysLeft />
        </div>
      </div>

      {/* Marco fino dorado, como el filo de la tarjeta */}
      <div className="pointer-events-none absolute inset-3 z-20 border border-gold/45 lg:inset-6" aria-hidden="true" />
    </section>
  );
}
