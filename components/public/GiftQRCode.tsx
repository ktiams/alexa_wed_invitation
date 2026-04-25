import type { WeddingSettings } from "@/lib/types/database";
import Image from "next/image";

interface GiftQRCodeProps {
  settings: WeddingSettings;
}

export function GiftQRCode({ settings }: GiftQRCodeProps) {
  return (
    <section id="gift" className="py-20 px-6 bg-cream">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-4">
          Regalo
        </p>
        <div className="h-px w-16 bg-silver mx-auto mb-10" />

        <p className="font-display text-3xl sm:text-4xl font-light italic text-charcoal mb-4">
          Tu presencia es nuestro mayor regalo
        </p>
        <p className="text-sm font-sans text-muted mb-10 leading-relaxed max-w-sm mx-auto">
          Si deseas dar un regalo monetario, puedes hacerlo mediante las opciones a continuación.
          Escanea el código QR o usa los detalles proporcionados.
        </p>

        {/* QR Code */}
        <div className="inline-block border border-silver-light bg-card p-6 mb-6 shadow-warm-sm">
          {settings.gift_qr_url ? (
            <Image
              src={settings.gift_qr_url}
              alt="Gift QR Code"
              width={180}
              height={180}
              className="mx-auto"
            />
          ) : (
            <div className="w-44 h-44 bg-parchment flex items-center justify-center mx-auto">
              <p className="text-xs font-sans text-silver-dark text-center leading-relaxed">
                El código QR se<br />añadirá próximamente
              </p>
            </div>
          )}
        </div>

        {/* Payment methods */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {["ATH Móvil", "PayPal", "Zelle"].map((method) => (
            <span
              key={method}
              className="px-4 py-1.5 border border-silver-light bg-card text-xs uppercase tracking-widest font-sans text-silver-dark"
            >
              {method}
            </span>
          ))}
        </div>

        {settings.gift_instructions && (
          <p className="text-xs font-sans text-muted max-w-sm mx-auto leading-relaxed">
            {settings.gift_instructions}
          </p>
        )}
      </div>
    </section>
  );
}
