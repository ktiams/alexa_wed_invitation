"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ATH_MOVIL, formatPhone } from "@/lib/gift";
import { PearlButton } from "@/components/ui/pearl-button";

interface GiftSectionProps {
  /** Muestra el enlace a /gift para avisar que ya se envió el regalo. */
  showNotifyLink?: boolean;
}

// Regalo por ATH Móvil. Como la cuenta es personal, el botón copia el número para
// pegarlo en "Enviar dinero" dentro de la app (ver lib/gift.ts).
export function GiftSection({ showNotifyLink = true }: GiftSectionProps) {
  const [copied, setCopied] = useState(false);
  const numberRef = useRef<HTMLParagraphElement>(null);
  const display = formatPhone(ATH_MOVIL.phone);

  async function copyNumber() {
    try {
      await navigator.clipboard.writeText(ATH_MOVIL.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Sin acceso al portapapeles: se selecciona el número para copiarlo a mano.
      const node = numberRef.current;
      if (node) {
        const range = document.createRange();
        range.selectNodeContents(node);
        window.getSelection()?.removeAllRanges();
        window.getSelection()?.addRange(range);
      }
    }
  }

  return (
    <section id="regalo" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-xl flex-col gap-5 text-center">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Regalo</p>
          <h2 className="mt-3 font-display text-4xl font-light leading-tight text-charcoal sm:text-5xl">
            Tu presencia es nuestro mayor regalo
          </h2>
        </div>

        <div className="soft-card flex flex-col gap-4 px-5 py-6 sm:px-8">
          <p className="text-muted">Si además deseas hacernos un regalo, puedes enviarlo por ATH Móvil.</p>

          <div className="rounded-2xl bg-parchment px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-gold-dark">ATH Móvil · {ATH_MOVIL.recipientName}</p>
            <p ref={numberRef} className="mt-1 font-display text-4xl tabular-nums text-charcoal">
              {display}
            </p>
          </div>

          <PearlButton onClick={copyNumber} className="w-full" label={copied ? "Número copiado" : "Copiar número"} />
          <p className="sr-only" aria-live="polite">
            {copied ? "Número copiado" : ""}
          </p>

          <ol className="flex flex-col gap-2 text-left text-sm text-muted">
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold text-xs text-gold-dark">1</span>
              Abre ATH Móvil y toca &quot;Enviar dinero&quot;.
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold text-xs text-gold-dark">2</span>
              Pega el número {display}.
            </li>
            <li className="flex gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-gold text-xs text-gold-dark">3</span>
              Verás el nombre {ATH_MOVIL.recipientName}. Escribe la cantidad y envía.
            </li>
          </ol>
        </div>

        {showNotifyLink && (
          <Link
            href="/gift"
            className="mx-auto flex min-h-12 items-center text-sm font-medium text-charcoal underline decoration-gold underline-offset-4"
          >
            ¿Ya enviaste tu regalo? Avísanos
          </Link>
        )}
      </div>
    </section>
  );
}
