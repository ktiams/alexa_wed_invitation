"use client";

import { useCountdown } from "@/lib/hooks/useCountdown";

interface DaysLeftProps {
  /** "pill": "Faltan 49 días" en la portada. "stacked": número grande arriba, para la barra fija. */
  variant?: "pill" | "stacked";
}

export function DaysLeft({ variant = "pill" }: DaysLeftProps) {
  const { days, isPast } = useCountdown(60_000);
  if (isPast) return null;

  const unit = days === 1 ? "día" : "días";

  if (variant === "stacked") {
    return (
      <span className="text-xs leading-tight text-muted">
        <b suppressHydrationWarning className="block font-display text-2xl font-medium tabular-nums text-charcoal">
          {days}
        </b>
        {unit} para la boda
      </span>
    );
  }

  return (
    <p className="inline-flex items-baseline gap-1.5 rounded-full bg-champagne-light px-4 py-1.5 text-sm text-muted">
      {days === 1 ? "Falta" : "Faltan"}
      <b suppressHydrationWarning className="font-display text-xl font-medium tabular-nums text-charcoal">
        {days}
      </b>
      {unit}
    </p>
  );
}
