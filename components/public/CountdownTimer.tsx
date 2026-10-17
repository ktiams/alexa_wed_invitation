"use client";

import { useCountdown } from "@/lib/hooks/useCountdown";

// Cuenta regresiva compacta, en una fila, para "Cuándo y dónde".
export function CountdownTimer() {
  const countdown = useCountdown();

  if (countdown.isPast) {
    return <p className="text-center font-display text-3xl italic text-charcoal">¡Hoy es el día!</p>;
  }

  const units = [
    { label: "días", value: countdown.days },
    { label: "horas", value: countdown.hours },
    { label: "min", value: countdown.minutes },
    { label: "seg", value: countdown.seconds },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label="Cuenta regresiva para la boda">
      {units.map(({ label, value }) => (
        <div key={label} className="soft-card px-1 py-3 text-center sm:py-4">
          <span suppressHydrationWarning className="block font-display text-3xl leading-none tabular-nums text-charcoal sm:text-4xl">
            {String(value).padStart(2, "0")}
          </span>
          <span className="mt-1.5 block text-xs text-muted">{label}</span>
        </div>
      ))}
    </div>
  );
}
