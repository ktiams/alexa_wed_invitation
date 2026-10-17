"use client";

import { useState, useTransition } from "react";
import { setPhotoStatus } from "@/lib/actions/album";

export interface ModerationPhoto {
  id: string;
  thumbUrl: string;
  url: string;
  by: string;
  at: string;
}

type Status = "pending" | "approved" | "rejected";

const btn = "flex min-h-10 items-center justify-center rounded-xl px-2 font-body text-sm font-semibold disabled:opacity-50";

// Cuadrícula de moderación: aprobar o rechazar una a una, o todas las de la pestaña.
// En celular va a 2 columnas, para que Alexa pueda revisar desde el teléfono.
export function PhotoModeration({ photos, status }: { photos: ModerationPhoto[]; status: Status }) {
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const visible = photos.filter((p) => !hidden.has(p.id));

  function move(ids: string[], to: Status) {
    setError("");
    setHidden((prev) => new Set([...prev, ...ids]));
    startTransition(async () => {
      try {
        await setPhotoStatus(ids, to);
      } catch {
        setHidden((prev) => {
          const next = new Set(prev);
          ids.forEach((id) => next.delete(id));
          return next;
        });
        setError("No se pudo guardar. Inténtalo de nuevo.");
      }
    });
  }

  if (visible.length === 0) {
    return (
      <p className="rounded-2xl border border-silver-light bg-card px-4 py-10 text-center font-body text-sm text-muted">
        {status === "pending" ? "No hay fotos por revisar." : status === "approved" ? "Todavía no hay fotos aprobadas." : "No hay fotos rechazadas."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {status === "pending" && visible.length > 1 && (
        <button
          type="button"
          disabled={pending}
          onClick={() => move(visible.map((p) => p.id), "approved")}
          className="self-start rounded-full bg-espresso px-5 py-2.5 font-body text-sm font-semibold text-ivory disabled:opacity-50"
        >
          Aprobar las {visible.length} fotos
        </button>
      )}
      {error && <p className="font-body text-sm text-red-700">{error}</p>}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((photo) => (
          <li key={photo.id} className="flex flex-col overflow-hidden rounded-2xl border border-silver-light bg-card">
            <a href={photo.url} target="_blank" rel="noopener noreferrer" className="block aspect-square bg-parchment">
              {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada de Supabase */}
              <img src={photo.thumbUrl} alt={`Foto de ${photo.by}`} loading="lazy" className="h-full w-full object-cover" />
            </a>
            <div className="px-3 pt-2 font-body text-xs leading-snug text-muted">
              <b className="block truncate text-sm text-charcoal">{photo.by}</b>
              {photo.at}
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-2">
              {status !== "approved" && (
                <button type="button" disabled={pending} onClick={() => move([photo.id], "approved")} className={`${btn} bg-espresso text-ivory`}>
                  Aprobar
                </button>
              )}
              {status !== "rejected" && (
                <button type="button" disabled={pending} onClick={() => move([photo.id], "rejected")} className={`${btn} border border-silver-light text-muted`}>
                  {status === "approved" ? "Quitar" : "Rechazar"}
                </button>
              )}
              {status === "rejected" && (
                <button type="button" disabled={pending} onClick={() => move([photo.id], "pending")} className={`${btn} border border-silver-light text-muted`}>
                  A revisión
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
