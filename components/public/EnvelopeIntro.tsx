"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EVENT } from "@/lib/event";

// Pantalla de bienvenida: el invitado "abre" un sobre antes de ver la invitación.
// Se basa en la del Sweet 16 de Cathyanis (sello que se parte, solapa que se abre,
// luz y destello), pero con CSS en vez de framer-motion y con la forma del pin de
// referencia: sobre vertical de dos solapas con encaje festoneado y flores en relieve.
// Los estilos y la línea de tiempo están en app/globals.css (.env-*).
//
// - Toca el sello (o cualquier parte) para abrir; si nadie toca, se abre solo a los 3 s.
// - La apertura dura ~5 s. Solo se muestra una vez por sesión del navegador.
// - Con prefers-reduced-motion se desvanece sin animación.

type Stage = "closed" | "opening" | "closing" | "gone";

const STORAGE_KEY = "aa-sobre-abierto";
const AUTO_OPEN_MS = 3000;
const OPENING_MS = 4100; // sello + solapas + tarjeta a la vista
const CLOSING_MS = 900; // zoom y destello de salida

// Motivo floral en relieve para el papel: el mismo trazo dos veces, claro arriba-izquierda
// y oscuro abajo-derecha, para que parezca estampado en seco.
const FLORAL = `
  <circle cx='40' cy='42' r='8'/><circle cx='40' cy='31' r='7'/><circle cx='50.5' cy='38.5' r='7'/>
  <circle cx='46.5' cy='51' r='7'/><circle cx='33.5' cy='51' r='7'/><circle cx='29.5' cy='38.5' r='7'/>
  <circle cx='40' cy='42' r='3'/>
  <path d='M40 58 C44 84 30 104 38 136 S46 170 40 190'/>
  <path d='M37 92 C46 82 58 84 62 92 C54 98 44 98 37 92Z'/>
  <path d='M38 118 C28 108 16 110 12 118 C20 124 30 124 38 118Z'/>
  <circle cx='108' cy='118' r='5'/><circle cx='108' cy='110' r='4.5'/><circle cx='115.5' cy='115.5' r='4.5'/>
  <circle cx='113' cy='124.5' r='4.5'/><circle cx='103' cy='124.5' r='4.5'/><circle cx='100.5' cy='115.5' r='4.5'/>
  <path d='M108 128 C112 146 100 160 106 182'/>
  <path d='M106 150 C114 142 124 144 128 150 C120 156 112 156 106 150Z'/>
  <path d='M96 40 C100 30 108 26 114 28 M104 30 C102 22 104 16 110 12'/>
  <circle cx='115' cy='27' r='3'/><circle cx='111' cy='11' r='2.5'/>
`;

const PATTERN_SVG = `<svg xmlns='http://www.w3.org/2000/svg' width='150' height='190' viewBox='0 0 150 190'><g fill='none' stroke-width='1.3' stroke-linecap='round'><g stroke='rgba(255,255,255,0.6)' transform='translate(-0.7 -0.7)'>${FLORAL}</g><g stroke='rgba(122,86,66,0.24)' transform='translate(0.7 0.7)'>${FLORAL}</g></g></svg>`;

const PAPER_STYLE = {
  backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(PATTERN_SVG)}"), linear-gradient(160deg, #f0dacd 0%, #e6c9bb 55%, #dcbcab 100%)`,
};

// Contorno orgánico del sello y grieta en zigzag (igual que en Cathyanis).
const WAX_BLOB =
  "M50 6.5 C60 6 67 15 72.5 22.5 C78 30 90.5 33 91 45.5 C91.5 57 82 63 79.5 73 C77 83 62 89.5 50.5 90.5 C39.5 91.5 31 87 24.5 79.5 C17.5 71.5 8.5 64.5 9 52 C9.5 40 18.5 34 23.5 25.5 C29 16.5 39.5 7 50 6.5 Z";
const CRACK_LEFT =
  "polygon(0% 0%, 50% 0%, 45% 13%, 53% 27%, 46% 43%, 54% 58%, 45% 72%, 52% 87%, 48% 100%, 0% 100%)";
const CRACK_RIGHT =
  "polygon(50% 0%, 100% 0%, 100% 100%, 48% 100%, 52% 87%, 45% 72%, 54% 58%, 46% 43%, 53% 27%, 45% 13%)";

function WaxHalf({ side }: { side: "left" | "right" }) {
  const clip = side === "left" ? CRACK_LEFT : CRACK_RIGHT;
  const id = `wax-${side}`;
  return (
    <span className={`env-seal-half env-seal-half--${side}`} style={{ clipPath: clip, WebkitClipPath: clip }}>
      <svg viewBox="0 0 100 100" className="h-full w-full" style={{ filter: "drop-shadow(0 5px 7px rgba(74,56,48,.45))" }}>
        <defs>
          <radialGradient id={`${id}-fill`} cx="36%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#f6e4ad" />
            <stop offset="45%" stopColor="#c99f52" />
            <stop offset="100%" stopColor="#8a6a2f" />
          </radialGradient>
          <radialGradient id={`${id}-hi`} cx="32%" cy="24%" r="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,.55)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        <path d={WAX_BLOB} fill={`url(#${id}-fill)`} stroke="#b8903f" strokeWidth="1.6" />
        <circle cx="50" cy="48.5" r="27" fill="none" stroke="rgba(122,86,40,.45)" strokeWidth="1.4" />
        <circle cx="50" cy="48.5" r="27" fill="none" stroke="rgba(255,244,214,.5)" strokeWidth="0.8" transform="translate(-0.6 -0.6)" />
        <path d={WAX_BLOB} fill={`url(#${id}-hi)`} />
        {/* Monograma hundido: sombra + dorado claro encima */}
        <text x="50.8" y="51.8" textAnchor="middle" dominantBaseline="central" fontSize="25" fill="rgba(90,64,26,.55)" style={{ fontFamily: "var(--font-great-vibes), cursive" }}>
          A&amp;A
        </text>
        <text x="50" y="50.6" textAnchor="middle" dominantBaseline="central" fontSize="25" fill="#fbecc0" style={{ fontFamily: "var(--font-great-vibes), cursive" }}>
          A&amp;A
        </text>
      </svg>
    </span>
  );
}

function Flap({ side }: { side: "left" | "right" }) {
  return (
    <div className={`env-flap env-flap--${side}`} aria-hidden="true">
      <div className="env-face">
        <div className="env-paper" style={PAPER_STYLE}>
          <span className="env-stitch" />
        </div>
      </div>
      <div className="env-lining" />
    </div>
  );
}

export function EnvelopeIntro() {
  const [stage, setStage] = useState<Stage>("closed");
  const stageRef = useRef<Stage>("closed");
  const timers = useRef<number[]>([]);
  const sealRef = useRef<HTMLButtonElement>(null);

  const go = useCallback((next: Stage) => {
    stageRef.current = next;
    setStage(next);
  }, []);

  const finish = useCallback(() => {
    go("gone");
    document.documentElement.style.overflow = "";
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Sin sessionStorage (modo privado): se volverá a mostrar, no pasa nada.
    }
  }, [go]);

  const open = useCallback(() => {
    if (stageRef.current !== "closed") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const opening = reduce ? 0 : OPENING_MS;
    const closing = reduce ? 300 : CLOSING_MS;
    go(reduce ? "closing" : "opening");
    timers.current.push(window.setTimeout(() => go("closing"), opening));
    timers.current.push(window.setTimeout(finish, opening + closing));
  }, [finish, go]);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    const pending = timers.current;
    if (seen) {
      // Ya la abrió en esta sesión (por ejemplo, volvió desde /gift): no se repite.
      // Se difiere al siguiente cuadro para no actualizar el estado dentro del efecto.
      const frame = requestAnimationFrame(() => go("gone"));
      return () => cancelAnimationFrame(frame);
    }
    document.documentElement.style.overflow = "hidden";
    sealRef.current?.focus({ preventScroll: true });
    pending.push(window.setTimeout(open, AUTO_OPEN_MS));
    return () => {
      pending.forEach((t) => window.clearTimeout(t));
      document.documentElement.style.overflow = "";
    };
  }, [open, go]);

  if (stage === "gone") return null;

  return (
    <div
      className="env-intro"
      data-state={stage}
      role="dialog"
      aria-modal="true"
      aria-label={`Invitación de ${EVENT.couple}`}
      onClick={open}
    >
      <div className="env-glow" aria-hidden="true" />

      <div className="env-card" aria-hidden={stage === "closed"}>
        <Image
          src="/images/flores/flores-sup-der.webp"
          alt=""
          width={268}
          height={570}
          sizes="90px"
          className="pointer-events-none absolute -right-2 -top-6 w-[26%] select-none"
        />
        <Image
          src="/images/flores/flores-inf-izq.webp"
          alt=""
          width={280}
          height={728}
          sizes="80px"
          className="pointer-events-none absolute -bottom-6 -left-2 w-[22%] select-none"
        />
        <p className="text-[0.62rem] uppercase tracking-[0.32em] text-muted">Acompáñanos en la</p>
        <p className="gold-foil px-2 font-script text-6xl leading-[1.15]">Boda</p>
        <p className="text-[0.62rem] uppercase tracking-[0.32em] text-muted">de</p>
        <p className="names-3d font-display text-lg font-medium uppercase leading-snug tracking-[0.14em]">
          {EVENT.groomFullName}
          <span className="gold-foil block px-2 font-script text-3xl normal-case leading-tight tracking-normal">y</span>
          {EVENT.brideFullName}
        </p>
        <p className="mt-2 text-[0.68rem] uppercase tracking-[0.24em] text-charcoal/80">05 · 12 · 2026</p>
      </div>

      <Flap side="left" />
      <Flap side="right" />

      <button
        ref={sealRef}
        type="button"
        className="env-seal"
        aria-label="Abrir la invitación"
        onClick={(e) => {
          e.stopPropagation();
          open();
        }}
      >
        <span className="env-spark" aria-hidden="true" />
        <WaxHalf side="left" />
        <WaxHalf side="right" />
      </button>
      <p className="env-hint">Toca el sello para abrir</p>

      <div className="env-flash" aria-hidden="true" />
    </div>
  );
}
