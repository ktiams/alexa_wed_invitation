"use client";

import { useState } from "react";
import { PearlButton } from "@/components/ui/pearl-button";

// Comparte el enlace para subir fotos (WhatsApp, mensajes…) con el menú de compartir del
// teléfono. Donde no existe ese menú (computadora), copia el enlace.
export function ShareAlbumLink({ url }: { url: string }) {
  const [note, setNote] = useState("");

  async function share() {
    setNote("");
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Álbum de Anthony y Alexandra",
          text: "Sube tus fotos de nuestra boda al álbum:",
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setNote("Enlace copiado.");
    } catch {
      setNote(url);
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <PearlButton tone="champan" label="Compartir enlace" onClick={share} className="pearl-compact w-full" />
      {note && (
        <p role="status" className="break-all text-center font-body text-xs text-muted">
          {note}
        </p>
      )}
    </div>
  );
}
