"use client";

import { useCallback, useEffect, useState } from "react";

export interface GalleryPhoto {
  id: string;
  url: string;
  thumbUrl: string;
  by: string;
  width: number | null;
  height: number | null;
}

// Cuadrícula de fotos aprobadas con visor a pantalla completa (flechas, deslizar y Esc).
export function AlbumGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const [touchX, setTouchX] = useState<number | null>(null);

  const step = useCallback(
    (delta: number) => setOpen((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, step]);

  const current = open === null ? null : photos[open];

  return (
    <>
      <ul className="columns-2 gap-2 sm:columns-3 lg:columns-4 [&>li]:mb-2">
        {photos.map((photo, i) => (
          <li key={photo.id} className="break-inside-avoid">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="block w-full overflow-hidden rounded-xl bg-parchment"
              aria-label={`Ver foto de ${photo.by}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada de Supabase, cambia en cada visita */}
              <img
                src={photo.thumbUrl}
                alt={`Foto de ${photo.by}`}
                loading="lazy"
                width={photo.width ?? undefined}
                height={photo.height ?? undefined}
                className="h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto de ${current.by}`}
          className="fixed inset-0 z-50 flex flex-col bg-night/95"
          onClick={() => setOpen(null)}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
            setTouchX(null);
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 text-sm text-champagne" style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}>
            <span>
              {open! + 1} / {photos.length} · {current.by}
            </span>
            <button type="button" onClick={() => setOpen(null)} className="min-h-11 rounded-full px-4 text-ivory" aria-label="Cerrar">
              Cerrar ✕
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center px-2 pb-6">
            {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada de Supabase */}
            <img src={current.url} alt={`Foto de ${current.by}`} className="max-h-full max-w-full rounded-md object-contain" onClick={(e) => e.stopPropagation()} />
          </div>
          {photos.length > 1 && (
            <div className="flex justify-between px-4 pb-6" onClick={(e) => e.stopPropagation()}>
              <button type="button" onClick={() => step(-1)} className="min-h-12 rounded-full border border-champagne/40 px-5 text-ivory">
                ← Anterior
              </button>
              <button type="button" onClick={() => step(1)} className="min-h-12 rounded-full border border-champagne/40 px-5 text-ivory">
                Siguiente →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
