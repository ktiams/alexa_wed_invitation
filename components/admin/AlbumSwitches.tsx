"use client";

import { useState, useTransition } from "react";
import { setAlbumPublished, setPhotoUploadEnabled } from "@/lib/actions/album";

interface AlbumSwitchesProps {
  uploadEnabled: boolean;
  published: boolean;
}

function Switch({
  label,
  hint,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  disabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-2xl border border-silver-light bg-card px-4 py-3">
      <span className="min-w-0">
        <span className="block font-body text-sm font-semibold text-charcoal">{label}</span>
        <span className="block font-body text-xs text-muted">{hint}</span>
      </span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="relative h-[1.875rem] w-[3.125rem] shrink-0 cursor-pointer appearance-none rounded-full bg-beige transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-6 after:w-6 after:rounded-full after:bg-card after:shadow after:transition-transform after:content-[''] checked:bg-espresso checked:after:translate-x-5 disabled:opacity-60"
      />
    </label>
  );
}

// Interruptores del álbum en /admin/fotos.
export function AlbumSwitches({ uploadEnabled, published }: AlbumSwitchesProps) {
  const [upload, setUpload] = useState(uploadEnabled);
  const [pub, setPub] = useState(published);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function change(kind: "upload" | "publish", value: boolean) {
    setError("");
    if (kind === "upload") setUpload(value);
    else setPub(value);
    startTransition(async () => {
      try {
        if (kind === "upload") await setPhotoUploadEnabled(value);
        else await setAlbumPublished(value);
      } catch {
        if (kind === "upload") setUpload(!value);
        else setPub(!value);
        setError("No se pudo guardar el cambio. Inténtalo de nuevo.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Switch
        label="Subida de fotos"
        hint={upload ? "Abierta: los invitados pueden subir con el QR" : "Cerrada: el QR muestra un aviso"}
        checked={upload}
        disabled={pending}
        onChange={(v) => change("upload", v)}
      />
      <Switch
        label="Álbum público"
        hint={pub ? "Visible en la invitación y en /album" : "Oculto: nadie ve las fotos aprobadas"}
        checked={pub}
        disabled={pending}
        onChange={(v) => change("publish", v)}
      />
      {error && <p className="font-body text-sm text-red-700">{error}</p>}
    </div>
  );
}
