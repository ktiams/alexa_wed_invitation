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
      <section className="py-20 px-6 bg-card text-center border-y border-silver-light/50">
        <p className="font-display text-3xl italic text-charcoal">
          ¡Hoy es el día!
        </p>
      </section>
    );
  }

  const units = [
    { label: "Días", value: countdown.days },
    { label: "Horas", value: countdown.hours },
    { label: "Minutos", value: countdown.minutes },
    { label: "Segundos", value: countdown.seconds },
  ];

  return (
    <section className="py-20 px-6 bg-card border-y border-silver-light/50">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-10">
          La cuenta regresiva
        </p>
        <div className="grid grid-cols-4 gap-4 sm:gap-8">
          {units.map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center">
              <span className="font-display text-5xl sm:text-6xl font-light text-charcoal tabular-nums">
                {String(value).padStart(2, "0")}
              </span>
              <span className="text-sm uppercase tracking-wider text-silver-dark font-sans mt-2">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
