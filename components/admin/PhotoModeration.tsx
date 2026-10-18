"use client";

import { useState, useTransition } from "react";
import { setPhotoStatus } from "@/lib/actions/album";
import { PearlButton } from "@/components/ui/pearl-button";

export interface ModerationPhoto {
  id: string;
  thumbUrl: string;
  url: string;
  by: string;
  at: string;
}

type Status = "pending" | "approved" | "rejected";

const btn = "flex min-h-10 items-center justify-center rounded-full px-2 font-body text-sm font-semibold transition-colors disabled:opacity-50";
const main = `${btn} bg-espresso text-ivory hover:bg-cacao-deep`;
const soft = `${btn} border border-champagne bg-champagne-light text-charcoal hover:bg-champagne`;

// Cuadrícula de fotos del panel. En Autorizaciones (pending) se aprueban o rechazan una a
// una, o todas juntas; en Fotos se quitan del álbum o se devuelven a él.
// En celular va a 2 columnas, para que los novios revisen desde el teléfono.
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
      <p className="rounded-3xl border border-silver-light bg-card/85 px-4 py-10 text-center font-body text-sm text-muted">
        {status === "pending" ? "No hay fotos por revisar." : status === "approved" ? "Todavía no hay fotos en el álbum." : "No hay fotos rechazadas."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {status === "pending" && visible.length > 1 && (
        <PearlButton
          disabled={pending}
          onClick={() => move(visible.map((p) => p.id), "approved")}
          label={`Aprobar las ${visible.length} fotos`}
          className="w-full sm:w-auto sm:self-start"
        />
      )}
      {error && <p className="font-body text-sm text-red-700">{error}</p>}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((photo) => (
          <li key={photo.id} className="flex flex-col overflow-hidden rounded-2xl border border-silver-light bg-card/90">
            <a href={photo.url} target="_blank" rel="noopener noreferrer" className="block aspect-square bg-parchment">
              {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada de Supabase */}
              <img src={photo.thumbUrl} alt={`Foto de ${photo.by}`} loading="lazy" className="h-full w-full object-cover" />
            </a>
            <div className="px-3 pt-2 font-body text-xs leading-snug text-muted">
              <b className="block truncate text-sm text-charcoal">{photo.by}</b>
              {photo.at}
            </div>
            <div className={`grid gap-1.5 p-2 ${status === "pending" ? "grid-cols-2" : "grid-cols-1"}`}>
              {status === "pending" && (
                <>
                  <button type="button" disabled={pending} onClick={() => move([photo.id], "approved")} className={main}>
                    Aprobar
                  </button>
                  <button type="button" disabled={pending} onClick={() => move([photo.id], "rejected")} className={soft}>
                    Rechazar
                  </button>
                </>
              )}
              {status === "approved" && (
                <button type="button" disabled={pending} onClick={() => move([photo.id], "rejected")} className={soft}>
                  Quitar del álbum
                </button>
              )}
              {status === "rejected" && (
                <button type="button" disabled={pending} onClick={() => move([photo.id], "approved")} className={soft}>
                  Devolver al álbum
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
