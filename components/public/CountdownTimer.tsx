"use client";

import { useEffect, useState } from "react";
import { WEDDING_DATE, getCountdown } from "@/lib/utils/date";

export function CountdownTimer() {
  const [countdown, setCountdown] = useState(getCountdown(WEDDING_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(getCountdown(WEDDING_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (countdown.isPast) {
    return (
      <section className="px-6 py-20">
        <div className="premium-card mx-auto max-w-3xl px-8 py-12 text-center">
          <p className="font-display text-3xl italic text-charcoal sm:text-4xl">Hoy es el dia</p>
        </div>
      </section>
    );
  }

  const units = [
    { label: "Dias", value: countdown.days },
    { label: "Horas", value: countdown.hours },
    { label: "Minutos", value: countdown.minutes },
    { label: "Segundos", value: countdown.seconds },
  ];

  return (
    <section className="px-6 py-20">
      <div className="premium-card mx-auto max-w-5xl px-8 py-10 sm:px-12 sm:py-14">
        <div className="mb-10 text-center">
          <p className="text-[0.72rem] uppercase tracking-[0.38em] text-silver-dark">La cuenta regresiva</p>
          <div className="mx-auto mt-4 h-px w-20 bg-gradient-to-r from-transparent via-silver to-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {units.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-[1.75rem] border border-silver-light/70 bg-white/35 px-4 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] backdrop-blur-sm"
            >
              <span className="block font-display text-5xl font-light leading-none text-charcoal sm:text-6xl">
                {String(value).padStart(2, "0")}
              </span>
              <span className="mt-3 block text-[0.68rem] uppercase tracking-[0.3em] text-silver-dark">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
