"use client";

import { useEffect, useState } from "react";
import { DaysLeft } from "@/components/public/DaysLeft";
import { PearlButton } from "@/components/ui/pearl-button";

// Barra fija para confirmar asistencia. Aparece al pasar la portada (#inicio)
// y se esconde mientras el formulario (#rsvp) está en pantalla.
export function StickyRSVPBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("inicio");
    const rsvp = document.getElementById("rsvp");
    let heroOnScreen = true;
    let rsvpOnScreen = false;

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroOnScreen = entry.isIntersecting;
        if (entry.target === rsvp) rsvpOnScreen = entry.isIntersecting;
      }
      setVisible(!heroOnScreen && !rsvpOnScreen);
    });

    if (hero) observer.observe(hero);
    if (rsvp) observer.observe(rsvp);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      inert={!visible}
      className={[
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out lg:bottom-5",
        visible ? "translate-y-0" : "translate-y-[150%]",
      ].join(" ")}
    >
      <div
        className="mx-auto flex max-w-xl items-center justify-between gap-4 border-t border-silver-light bg-ivory/95 py-3 pl-5 pr-3 shadow-[0_-12px_30px_rgba(74,56,48,0.12)] backdrop-blur-md lg:rounded-full lg:border lg:pl-7"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <DaysLeft variant="stacked" />
        <PearlButton href="#rsvp" label="Confirmar asistencia" className="shrink-0" />
      </div>
    </div>
  );
}
