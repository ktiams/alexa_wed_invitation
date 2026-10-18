import Image from "next/image";
import { VENUE } from "@/lib/venue";
import { EVENT } from "@/lib/event";
import { CalendarButton } from "@/components/public/CalendarButton";
import { DaysLeft } from "@/components/public/DaysLeft";
import { PearlButton } from "@/components/ui/pearl-button";

const HERO_IMAGE = "/images/hero.jpeg";

// Portada "foto protagonista" (elegida el 18 oct 2026): la foto llena la parte de arriba,
// centrada en la pareja, con un velo oscuro cálido; título y nombres van ENCIMA de la foto,
// sobre la zona oscura del auto, y la foto se funde en el ivory, donde siguen la fecha,
// el lugar y los botones. Tipografía de la tarjeta de referencia y flores encima.
//
// En celular toda la portada cabe en la pantalla visible (100svh): la foto ocupa el alto
// que sobra (flex-1), así en teléfonos más altos se ve más foto. En escritorio, la foto
// ocupa el 86 % del alto y la fecha y los botones quedan debajo.
export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip bg-ivory text-charcoal lg:min-h-0"
    >
      <div className="relative flex flex-1 flex-col lg:block lg:flex-none">
        {/* Foto: se extiende por debajo del bloque de texto y ahí se funde en el ivory.
            En celular, tamaños y espacios usan min(vw, svh): se ajustan al ancho Y al alto
            visible de cada teléfono, para que la portada completa quepa en una pantalla. */}
        <div className="absolute inset-x-0 top-0 bottom-[calc(-1*clamp(52px,10svh,84px))] lg:-bottom-[150px]">
          <Image
            src={HERO_IMAGE}
            alt="Anthony y Alexandra al atardecer, junto al auto"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[43%_10%] lg:object-[50%_30%]"
          />
          <div className="hero-veil-dark absolute inset-0 lg:hidden" />
          <div className="hero-melt absolute inset-x-0 bottom-0 h-[clamp(92px,17svh,126px)] lg:hidden" />
          <div className="hero-veil absolute inset-0 hidden lg:block" />
        </div>

        <div className="relative z-10 flex justify-center pt-[clamp(1.1rem,4.5svh,2.25rem)] lg:hidden">
          <DaysLeft variant="chip" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-end px-6 pb-[clamp(0.25rem,1.5svh,0.75rem)] pt-3 text-center lg:min-h-[86vh] lg:px-8 lg:pb-10 lg:pt-[24svh]">
          <p className="text-[0.62rem] uppercase tracking-[0.32em] text-ivory/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] lg:text-xs">
            Acompáñanos en la
          </p>
          <p className="gold-foil -mb-1 mt-0.5 px-3 font-script text-[length:clamp(2.8rem,min(16vw,9svh),4.6rem)] leading-[1.1] lg:mt-1 lg:text-[6.5rem] lg:leading-[1.15]">
            Boda
          </p>
          <p className="text-[0.62rem] uppercase tracking-[0.32em] text-ivory/85 [text-shadow:0_1px_8px_rgba(0,0,0,0.5)] lg:text-xs">
            de
          </p>

          <h1 className="names-3d-light mt-1.5 font-display text-[length:clamp(1.05rem,min(5.6vw,3.3svh),2.6rem)] font-medium uppercase leading-tight tracking-[0.13em] lg:mt-2 lg:text-[length:clamp(1.4rem,3vw,2.6rem)]">
            <span className="block">{EVENT.groomFullName}</span>
            <span className="gold-foil block px-2 font-script text-[length:clamp(1.6rem,5svh,2.6rem)] normal-case leading-[1.1] tracking-normal lg:my-0.5 lg:text-5xl">
              y
            </span>
            <span className="block">{EVENT.brideFullName}</span>
          </h1>
        </div>
      </div>

      <div className="relative pt-[clamp(1.5rem,5.5svh,2.75rem)] lg:pt-20">
        <Image
          src="/images/flores/flores-sup-der.webp"
          alt=""
          aria-hidden="true"
          width={268}
          height={570}
          sizes="(min-width: 1024px) 160px, 92px"
          className="pointer-events-none absolute -right-1 -top-8 z-10 w-[23vw] max-w-[160px] select-none lg:-top-24 lg:right-6"
        />
        <Image
          src="/images/flores/flores-inf-izq.webp"
          alt=""
          aria-hidden="true"
          width={280}
          height={728}
          sizes="(min-width: 1024px) 140px, 84px"
          className="pointer-events-none absolute -bottom-4 -left-1 z-0 w-[21vw] max-w-[140px] select-none lg:-bottom-8 lg:left-6"
        />

        <div className="hero-actions relative z-10 flex flex-col items-center px-8 pb-[clamp(1rem,3.6svh,1.75rem)] text-center lg:pb-12">
          {/* Fecha y lugar con la misma jerarquía de la tarjeta: serif grande + mayúsculas pequeñas */}
          <div className="flex flex-col items-center">
            <div className="mb-[clamp(0.3rem,1.2svh,0.5rem)] flex items-center gap-3 lg:mb-3" aria-hidden="true">
              <span className="h-px w-10 bg-gradient-to-r from-transparent via-gold to-transparent" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
              <span className="h-px w-10 bg-gradient-to-r from-transparent via-gold to-transparent" />
            </div>
            <p className="font-display text-[length:clamp(1.2rem,3.6svh,1.6rem)] leading-tight text-charcoal lg:text-3xl">
              {EVENT.dateLong.replace(" de 2026", "")}
            </p>
            <p className="mt-0.5 text-[0.68rem] font-medium uppercase tracking-[0.3em] text-gold-dark lg:mt-1 lg:text-xs">
              2026 · {EVENT.time}
            </p>
            <span className="my-[clamp(0.35rem,1.2svh,0.5rem)] h-px w-12 bg-gold/50 lg:my-3" aria-hidden="true" />
            <p className="font-display text-[length:clamp(1.1rem,3.2svh,1.4rem)] italic leading-tight text-charcoal lg:text-[1.7rem]">
              {VENUE.name}
            </p>
            <p className="mt-0.5 text-[0.68rem] uppercase tracking-[0.24em] text-muted lg:mt-1 lg:text-xs">
              {VENUE.city}, {VENUE.country}
            </p>
          </div>

          <div className="mt-[clamp(0.75rem,2.6svh,1.25rem)] flex w-full max-w-sm flex-col gap-2.5 lg:mt-7 lg:w-auto lg:max-w-none lg:flex-row lg:gap-3">
            <PearlButton href="#rsvp" label="Confirmar asistencia" className="w-full lg:w-auto" />
            <CalendarButton />
          </div>

          <div className="mt-4 hidden lg:block">
            <DaysLeft />
          </div>
        </div>
      </div>

      {/* Marco fino dorado, como el filo de la tarjeta */}
      <div className="pointer-events-none absolute inset-3 z-20 border border-gold/45 lg:inset-6" aria-hidden="true" />
    </section>
  );
}
