"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { finishAlbumUpload, startAlbumUpload } from "@/lib/actions/album";
import { PearlButton } from "@/components/ui/pearl-button";

const NAME_KEY = "aa-album-nombre";
const BUCKET = "album";

type ItemState = "listo" | "reduciendo" | "subiendo" | "subida" | "error";

interface Item {
  file: File;
  preview: string;
  state: ItemState;
}

/** Reduce la foto en el celular (para que suba rápido con datos móviles y sin metadata). */
async function shrink(file: File, maxSide: number, quality: number) {
  let source: CanvasImageSource;
  let width: number;
  let height: number;
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    source = bitmap;
    width = bitmap.width;
    height = bitmap.height;
  } catch {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    URL.revokeObjectURL(url);
    source = img;
    width = img.naturalWidth;
    height = img.naturalHeight;
  }
  const scale = Math.min(1, maxSide / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  canvas.getContext("2d")!.drawImage(source, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo procesar la foto"))), "image/jpeg", quality)
  );
  return { blob, width: canvas.width, height: canvas.height };
}

interface PhotoUploaderProps {
  max: number;
  used: number;
}

// Página /album/subir: el invitado escribe su nombre, elige hasta las fotos que le quedan y
// las sube. Todas quedan en revisión hasta que los novios las aprueban.
export function PhotoUploader({ max, used: initialUsed }: PhotoUploaderProps) {
  const [name, setName] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [used, setUsed] = useState(initialUsed);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const remaining = Math.max(0, max - used);
  const pendingItems = items.filter((i) => i.state !== "subida");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(NAME_KEY);
      if (saved) requestAnimationFrame(() => setName(saved));
    } catch {
      // sin localStorage
    }
  }, []);

  // Libera las vistas previas al salir de la página.
  const itemsRef = useRef<Item[]>([]);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview)), []);

  function pick(files: FileList | null) {
    if (!files) return;
    setMessage(null);
    const room = remaining - pendingItems.length;
    const chosen = Array.from(files)
      .filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name))
      .slice(0, Math.max(0, room));
    if (files.length > chosen.length) {
      setMessage({ tone: "error", text: `Solo puedes subir ${max} fotos en total. Elegimos las primeras ${chosen.length}.` });
    }
    items.filter((i) => i.state === "subida").forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([
      ...items.filter((i) => i.state !== "subida"),
      ...chosen.map((file) => ({ file, preview: URL.createObjectURL(file), state: "listo" as ItemState })),
    ]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function update(index: number, state: ItemState) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, state } : item)));
  }

  async function upload() {
    const cleanName = name.trim();
    if (cleanName.length < 2) {
      setMessage({ tone: "error", text: "Escribe tu nombre para saber de quién son las fotos." });
      return;
    }
    const queue = items.map((item, index) => ({ item, index })).filter(({ item }) => item.state !== "subida");
    if (queue.length === 0) return;

    setBusy(true);
    setMessage(null);
    try {
      localStorage.setItem(NAME_KEY, cleanName);
    } catch {
      // sin localStorage
    }

    const start = await startAlbumUpload({ name: cleanName, count: queue.length });
    if (!start.ok) {
      setBusy(false);
      setMessage({ tone: "error", text: start.error });
      return;
    }

    const supabase = createClient();
    const done: { id: string; width: number; height: number }[] = [];
    for (let k = 0; k < queue.length; k++) {
      const { item, index } = queue[k];
      const slot = start.slots[k];
      try {
        update(index, "reduciendo");
        const [full, thumb] = await Promise.all([shrink(item.file, 1600, 0.82), shrink(item.file, 480, 0.72)]);
        update(index, "subiendo");
        const [a, b] = await Promise.all([
          supabase.storage.from(BUCKET).uploadToSignedUrl(slot.path, slot.token, full.blob, { contentType: "image/jpeg" }),
          supabase.storage.from(BUCKET).uploadToSignedUrl(slot.thumbPath, slot.thumbToken, thumb.blob, { contentType: "image/jpeg" }),
        ]);
        if (a.error || b.error) throw new Error("upload");
        done.push({ id: slot.id, width: full.width, height: full.height });
        update(index, "subida");
      } catch {
        update(index, "error");
      }
    }

    if (done.length > 0) {
      const finish = await finishAlbumUpload({ name: cleanName, items: done });
      if (finish.ok) {
        setUsed(max - finish.remaining);
        const failed = queue.length - finish.saved;
        setMessage({
          tone: failed > 0 ? "error" : "ok",
          text:
            failed > 0
              ? `Subimos ${finish.saved} foto${finish.saved === 1 ? "" : "s"}; ${failed} no se pudo${failed === 1 ? "" : "ieron"} subir. Inténtalo de nuevo con esa${failed === 1 ? "" : "s"}.`
              : `¡Gracias! Subimos ${finish.saved} foto${finish.saved === 1 ? "" : "s"}. Los novios las verán antes de publicarlas.`,
        });
      } else {
        setMessage({ tone: "error", text: finish.error });
      }
    } else {
      setMessage({ tone: "error", text: "No se pudo subir ninguna foto. Revisa tu conexión e inténtalo de nuevo." });
    }
    setBusy(false);
  }

  const label = (state: ItemState) =>
    ({ listo: "", reduciendo: "Preparando…", subiendo: "Subiendo…", subida: "✓", error: "Reintentar" })[state];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="album-name" className="text-sm font-medium text-silver-dark">
          Tu nombre *
        </label>
        <input
          id="album-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          placeholder="Nombre y apellido"
          className="w-full rounded-xl border border-silver-light bg-card px-4 py-3.5 text-base text-charcoal outline-none placeholder:text-taupe focus:border-gold-dark focus:ring-2 focus:ring-gold/20"
        />
      </div>

      <div>
        <div className="flex items-baseline justify-between text-sm text-muted">
          <span>Fotos subidas</span>
          <span>
            <b className="font-display text-2xl font-medium tabular-nums text-charcoal">{used}</b> de {max}
          </span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-parchment" aria-hidden="true">
          <div className="h-full rounded-full bg-gold transition-all duration-500" style={{ width: `${(used / max) * 100}%` }} />
        </div>
      </div>

      {items.length > 0 && (
        <ul className="grid grid-cols-4 gap-2">
          {items.map((item) => (
            <li key={item.preview} className="relative aspect-square overflow-hidden rounded-xl bg-parchment">
              {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local (blob:) */}
              <img src={item.preview} alt="" className="h-full w-full object-cover" />
              {item.state !== "listo" && (
                <span
                  className={[
                    "absolute inset-x-1 bottom-1 rounded-md px-1 py-0.5 text-center text-[0.65rem] font-semibold",
                    item.state === "subida" ? "bg-espresso text-ivory" : item.state === "error" ? "bg-red-700 text-white" : "bg-card/90 text-charcoal",
                  ].join(" ")}
                >
                  {label(item.state)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 ? (
        <>
          <label
            className={`flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-[1.5px] border-dashed border-beige bg-card px-4 text-center ${busy ? "pointer-events-none opacity-60" : ""}`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="h-8 w-8 text-gold">
              <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
              <circle cx="12" cy="13" r="3.5" />
            </svg>
            <span className="font-semibold text-charcoal">Elegir fotos</span>
            <span className="text-sm text-muted">
              Te quedan {remaining - pendingItems.length < 0 ? 0 : remaining - pendingItems.length} de {max}
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              disabled={busy}
              onChange={(e) => pick(e.target.files)}
            />
          </label>

          {pendingItems.length > 0 && (
            <PearlButton
              onClick={upload}
              disabled={busy}
              className="w-full"
              label={busy ? "Subiendo…" : `Subir ${pendingItems.length} foto${pendingItems.length === 1 ? "" : "s"}`}
            />
          )}
        </>
      ) : (
        <p className="rounded-2xl bg-nude-light px-4 py-4 text-center text-sm text-charcoal">
          Ya subiste tus {max} fotos. ¡Gracias por compartir la noche con nosotros!
        </p>
      )}

      {message && (
        <p role="status" className={`text-center text-sm ${message.tone === "ok" ? "text-charcoal" : "text-red-700"}`}>
          {message.text}
        </p>
      )}

      <p className="text-center text-xs text-muted">
        Las fotos se reducen en tu celular antes de subir. Los novios las revisan antes de publicarlas en el{" "}
        <Link href="/album" className="underline decoration-gold underline-offset-2">
          álbum
        </Link>
        .
      </p>
    </div>
  );
}
