import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EVENT } from "@/lib/event";
import { ALBUM_UPLOAD_URL, MAX_PHOTOS_PER_GUEST, albumQrSvg } from "@/lib/album";
import { PrintButton } from "@/components/admin/PrintButton";

export const metadata: Metadata = { title: "Tarjeta del álbum" };

// Tarjeta de mesa con el QR del álbum, 5 × 7 in (una por hoja carta). Fuera del grupo
// (panel) para imprimir sin pestañas ni destellos; proxy.ts la protege como el resto de /admin.
// Las medidas internas van en cqw (ancho de la tarjeta), así la vista previa en el celular
// y la hoja impresa guardan las mismas proporciones.
export default async function QrCardPage() {
  const qrSvg = await albumQrSvg();

  return (
    <main className="min-h-[100svh] bg-cream px-4 pb-10 pt-4 print:min-h-0 print:bg-white print:p-0">
      <style>{`
        @page { size: letter portrait; margin: 0.5in; }
        @media print {
          html, body { background: #fff !important; }
          .qr-card { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
        }
      `}</style>

      <div className="mx-auto mb-5 flex max-w-[5in] flex-col gap-3 print:hidden">
        <div className="flex items-center justify-between gap-3">
          <Link href="/admin/fotos" className="font-body text-sm font-semibold text-muted underline-offset-4 hover:underline">
            ← Volver a Fotos
          </Link>
          <PrintButton />
        </div>
        <p className="font-body text-sm text-muted">
          Sale una tarjeta de 5 × 7 pulgadas por hoja. Imprime las copias que necesites para las mesas.
        </p>
      </div>

      <article className="qr-card @container relative mx-auto flex aspect-[5/7] w-full max-w-[5in] flex-col items-center justify-center overflow-hidden bg-ivory text-center shadow-warm-lg print:w-[5in] print:max-w-none print:shadow-none">
        <div className="pointer-events-none absolute inset-[3.5cqw] border border-gold/60" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-[4.8cqw] border border-gold/30" aria-hidden="true" />
        <Image
          src="/images/flores/flores-sup-der.webp"
          alt=""
          width={268}
          height={570}
          className="pointer-events-none absolute right-0 top-0 w-[21cqw]"
        />
        <Image
          src="/images/flores/flores-inf-izq.webp"
          alt=""
          width={280}
          height={728}
          className="pointer-events-none absolute bottom-0 left-0 w-[21cqw]"
        />

        <p className="font-body text-[length:3cqw] font-semibold uppercase tracking-[0.32em] text-gold-dark">
          Comparte tus fotos
        </p>
        <p className="mt-[2.5cqw] font-script text-[length:11cqw] leading-[1.1] text-gold-dark">
          Anthony &amp; Alexandra
        </p>
        <p className="mt-[1.5cqw] font-display text-[length:3.4cqw] uppercase tracking-[0.25em] text-charcoal">
          {EVENT.dateShort}
        </p>
        <div className="mt-[4cqw] flex items-center gap-[2cqw] text-gold" aria-hidden="true">
          <span className="h-px w-[10cqw] bg-gold/70" />
          <span className="text-[length:2.6cqw]">✦</span>
          <span className="h-px w-[10cqw] bg-gold/70" />
        </div>

        <div
          className="mt-[4.5cqw] aspect-square w-[50cqw] rounded-[2cqw] border border-gold/40 bg-white p-[1.8cqw] [&>svg]:h-full [&>svg]:w-full"
          role="img"
          aria-label="Código QR para subir fotos al álbum"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />

        <p className="mt-[5cqw] max-w-[68cqw] font-display text-[length:4.6cqw] italic leading-snug text-charcoal">
          Escanea el código con la cámara de tu celular y sube hasta {MAX_PHOTOS_PER_GUEST} fotos de la noche.
        </p>
        <p className="mt-[2cqw] font-body text-[length:2.4cqw] text-muted">{ALBUM_UPLOAD_URL.replace("https://", "")}</p>
      </article>
    </main>
  );
}
