"use client";

import { useRef } from "react";
import type { GuestMessage } from "@/lib/types/database";

interface MessageCarouselProps {
  messages: GuestMessage[];
}

export function MessageCarousel({ messages }: MessageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (messages.length === 0) return null;

  const doubled = [...messages, ...messages];

  return (
    <section className="overflow-hidden border-y border-silver-light/50 bg-card py-16 sm:py-20" id="messages">
      <div className="mb-10 px-4 text-center sm:px-6">
        <p className="mb-4 text-sm uppercase tracking-[0.2em] text-silver-dark">Deseos</p>
        <div className="mx-auto h-px w-16 bg-silver" />
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-card to-transparent sm:w-20" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-card to-transparent sm:w-20" />

        <div ref={trackRef} className="flex w-max gap-4 animate-slide-left sm:gap-5" aria-label="Deseos de los invitados">
          {doubled.map((msg, i) => (
            <MessageCard key={`${msg.id}-${i}`} message={msg} />
          ))}
        </div>
      </div>
    </section>
  );
}

function MessageCard({ message }: { message: GuestMessage }) {
  return (
    <div className="w-[82vw] max-w-[20rem] shrink-0 border border-silver-light bg-cream p-5 shadow-warm-sm sm:w-72 sm:p-6">
      <p className="mb-4 font-display text-lg font-light italic leading-relaxed text-charcoal line-clamp-5">
        &ldquo;{message.message}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="h-px w-6 bg-silver/60" />
        <p className="truncate text-xs uppercase tracking-widest text-silver-dark">{message.guest_name}</p>
      </div>
    </div>
  );
}
