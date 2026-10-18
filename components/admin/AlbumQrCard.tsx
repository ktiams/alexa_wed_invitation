import { ALBUM_UPLOAD_URL, MAX_PHOTOS_PER_GUEST, albumQrSvg } from "@/lib/album";
import { PearlButton } from "@/components/ui/pearl-button";
import { ShareAlbumLink } from "@/components/admin/ShareAlbumLink";

// QR del álbum en la pestaña Fotos: imprimir la tarjeta de mesa, compartir el enlace o
// guardar la imagen. No depende de la base de datos, así que se ve aunque falte la migración.
export async function AlbumQrCard() {
  const qrSvg = await albumQrSvg();

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-silver-light bg-card/85 p-4 backdrop-blur-[2px] sm:p-5">
      <div className="flex items-center gap-4">
        <div
          className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-silver-light bg-white p-1.5 [&>svg]:h-full [&>svg]:w-full sm:h-36 sm:w-36"
          role="img"
          aria-label="Código QR para subir fotos al álbum"
          dangerouslySetInnerHTML={{ __html: qrSvg }}
        />
        <div className="min-w-0 font-body text-sm">
          <h2 className="font-display text-2xl font-medium leading-tight text-charcoal">QR del álbum</h2>
          <p className="mt-1 text-muted">
            Los invitados lo escanean con la cámara y suben hasta {MAX_PHOTOS_PER_GUEST} fotos.
          </p>
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <PearlButton href="/admin/tarjeta-qr" label="Imprimir para las mesas" className="pearl-compact w-full" />
        <ShareAlbumLink url={ALBUM_UPLOAD_URL} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-body text-xs text-muted">
        <span className="break-all">{ALBUM_UPLOAD_URL.replace("https://", "")}</span>
        <a href="/admin/qr-album" download className="font-semibold text-gold-dark underline underline-offset-4">
          Guardar imagen del QR
        </a>
      </div>
    </section>
  );
}
