"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export type Look = { src: string; caption: string; alt: string };

const HOLD_MS = 2000; // cada look se queda centrado 2 s antes de pasar al siguiente
const RESUME_MS = 6000; // si el invitado desliza a mano, se espera antes de seguir solo

// Carrusel de looks del código de vestimenta. Avanza solo (1 → 2 → 3 → 1…) para quien
// no se le ocurra deslizar; se detiene fuera de pantalla, mientras el invitado lo toca
// y con prefers-reduced-motion.
export function LooksCarousel({ looks }: { looks: Look[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = ref.current;
    if (!row) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;
    let onScreen = false;
    let pausedUntil = 0;

    const centerOf = (i: number) => {
      const item = row.children[i] as HTMLElement | undefined;
      if (!item) return 0;
      return item.offsetLeft - (row.clientWidth - item.clientWidth) / 2;
    };

    // Índice del look que está más cerca del centro (por si el invitado deslizó a mano).
    const currentIndex = () => {
      let best = 0;
      let bestDistance = Infinity;
      for (let i = 0; i < row.children.length; i++) {
        const distance = Math.abs(centerOf(i) - row.scrollLeft);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = i;
        }
      }
      return best;
    };

    const timer = window.setInterval(() => {
      if (!onScreen || Date.now() < pausedUntil) return;
      index = (currentIndex() + 1) % row.children.length;
      row.scrollTo({ left: centerOf(index), behavior: "smooth" });
    }, HOLD_MS);

    const pause = () => {
      pausedUntil = Date.now() + RESUME_MS;
    };
    row.addEventListener("pointerdown", pause);
    row.addEventListener("touchstart", pause, { passive: true });
    row.addEventListener("wheel", pause, { passive: true });

    const visibility = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
    }, { threshold: 0.5 });
    visibility.observe(row);

    return () => {
      window.clearInterval(timer);
      visibility.disconnect();
      row.removeEventListener("pointerdown", pause);
      row.removeEventListener("touchstart", pause);
      row.removeEventListener("wheel", pause);
    };
  }, []);

  return (
    <div ref={ref} className="snap-row -mx-4 px-[13vw]" tabIndex={0} aria-label="Ejemplos de looks">
      {looks.map((look) => (
        <figure
          key={look.src}
          className="relative m-0 aspect-[2/3] w-[74vw] max-w-xs overflow-hidden rounded-2xl border border-silver-light bg-[#efe6dd]"
        >
          <Image src={look.src} alt={look.alt} fill sizes="74vw" className="object-cover" />
          <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-charcoal">
            {look.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
