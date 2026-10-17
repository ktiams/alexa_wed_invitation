"use client";

import { useEffect, useId, useRef, useState } from "react";
import { googleCalendarUrl } from "@/lib/event";
import { PearlButton } from "@/components/ui/pearl-button";

interface CalendarButtonProps {
  /** "outline": botón perla champán de la portada. "tile": recuadro con ícono de "Cuándo y dónde". */
  variant?: "outline" | "tile";
}

export function CalendarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" className={className}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </svg>
  );
}

/** Abre un menú con Google Calendar y el archivo .ics (Apple Calendar y Outlook). */
export function CalendarButton({ variant = "outline" }: CalendarButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    function onPointer(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const item = "flex min-h-12 items-center rounded-xl px-4 text-sm font-medium text-charcoal hover:bg-nude-light";

  return (
    <div ref={ref} className={variant === "tile" ? "relative w-full" : "relative w-full lg:w-auto"}>
      {variant === "tile" ? (
        <button
          type="button"
          className="flex min-h-[4.5rem] w-full flex-col items-center justify-center gap-1.5 rounded-2xl border border-silver-light bg-cream text-sm font-medium text-charcoal hover:border-gold"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          <CalendarIcon className="h-5 w-5 text-gold" />
          Calendario
        </button>
      ) : (
        <PearlButton
          tone="champan"
          label="Agregar al calendario"
          className="w-full lg:w-auto"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        />
      )}

      {open && (
        <div
          id={menuId}
          className={[
            "absolute top-full z-30 mt-2 w-60 rounded-2xl border border-silver-light bg-card p-1.5 text-left shadow-warm-lg",
            variant === "tile" ? "right-0" : "left-1/2 -translate-x-1/2",
          ].join(" ")}
        >
          <a className={item} href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            Google Calendar
          </a>
          <a className={item} href="/calendario" onClick={() => setOpen(false)}>
            Apple Calendar u Outlook
          </a>
        </div>
      )}
    </div>
  );
}
