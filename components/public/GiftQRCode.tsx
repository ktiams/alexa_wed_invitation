import type { WeddingSettings } from "@/lib/types/database";
import Image from "next/image";

interface GiftQRCodeProps {
  settings: WeddingSettings;
}

export function GiftQRCode({ settings }: GiftQRCodeProps) {
  return (
    <section id="gift" className="bg-cream px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <div className="premium-card grid gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="text-center lg:text-left">
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-silver-dark">Regalo</p>
            <div className="mb-8 h-px w-16 bg-silver lg:mx-0" />

            <p className="font-display text-3xl font-light italic text-charcoal sm:text-4xl">
              Tu presencia es nuestro mayor regalo
            </p>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
              Si deseas dar un regalo monetario, puedes hacerlo mediante las opciones a continuacion.
              Escanea el codigo QR o usa los detalles proporcionados.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              {["ATH Movil", "PayPal", "Zelle"].map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-silver-light bg-card px-4 py-2 text-xs uppercase tracking-widest text-silver-dark"
                >
                  {method}
                </span>
              ))}
            </div>

            {settings.gift_instructions && (
              <p className="mt-6 max-w-lg text-sm leading-relaxed text-muted">{settings.gift_instructions}</p>
            )}
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-[320px] border border-silver-light bg-card p-5 shadow-warm-sm sm:p-6">
              {settings.gift_qr_url ? (
                <Image
                  src={settings.gift_qr_url}
                  alt="Gift QR Code"
                  width={240}
                  height={240}
                  className="mx-auto h-auto w-full max-w-[240px]"
                />
              ) : (
                <div className="mx-auto flex aspect-square w-full max-w-[240px] items-center justify-center bg-parchment">
                  <p className="text-center text-xs leading-relaxed text-silver-dark">
                    El codigo QR se
                    <br />
                    anadira proximamente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
