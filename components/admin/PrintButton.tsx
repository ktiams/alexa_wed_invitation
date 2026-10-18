"use client";

import { PearlButton } from "@/components/ui/pearl-button";

// Abre el diálogo de impresión del navegador (en el iPhone, el menú de imprimir/compartir).
export function PrintButton({ label = "Imprimir" }: { label?: string }) {
  return <PearlButton label={label} onClick={() => window.print()} className="pearl-compact" />;
}
