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
    <section className="py-20 bg-card border-y border-silver-light/50 overflow-hidden" id="messages">
      <div className="text-center mb-10 px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-4">
          Deseos
        </p>
        <div className="h-px w-16 bg-silver mx-auto" />
      </div>

      <div className="relative">
        {/* Fade edges — match section background */}
        <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-card to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-card to-transparent z-10 pointer-events-none" />

        <div
          ref={trackRef}
          className="flex gap-5 animate-slide-left"
          style={{ width: "max-content" }}
          aria-label="Guest wishes"
        >
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
    <div className="w-72 shrink-0 border border-silver-light bg-cream p-6 shadow-warm-sm">
      <p className="font-display text-lg font-light italic text-charcoal mb-4 leading-relaxed line-clamp-4">
        &ldquo;{message.message}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div className="h-px w-6 bg-silver/60" />
        <p className="text-xs uppercase tracking-widest font-sans text-silver-dark">
          {message.guest_name}
        </p>
      </div>
    </div>
  );
}
