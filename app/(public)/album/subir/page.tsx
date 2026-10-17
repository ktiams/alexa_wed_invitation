import { cookies } from "next/headers";
import Link from "next/link";
import { EVENT } from "@/lib/event";
import { MAX_PHOTOS_PER_GUEST, UPLOADER_COOKIE, countUploads, getAlbumSettings } from "@/lib/album";
import { PhotoUploader } from "@/components/public/PhotoUploader";

export const metadata = {
  title: `Sube tus fotos · ${EVENT.couple}`,
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// Destino del QR de las mesas. Siempre es la misma dirección: antes de que los novios
// activen la subida muestra un aviso, y el día de la boda deja subir fotos.
export default async function UploadPhotosPage() {
  const settings = await getAlbumSettings();
  const key = (await cookies()).get(UPLOADER_COOKIE)?.value;
  const used = settings.ready && key ? await countUploads(key) : 0;

  return (
    <main className="min-h-screen bg-cream">
      <div className="border-b border-silver-light bg-card px-4 py-7 text-center">
        <Link href="/" className="font-display text-2xl font-light italic text-charcoal">
          Anthony &amp; Alexandra
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-gold-dark">Álbum de la boda</p>
      </div>

      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-8">
        {settings.uploadEnabled ? (
          <>
            <div className="text-center">
              <h1 className="font-display text-4xl font-light text-charcoal">Sube tus fotos</h1>
              <p className="mt-2 text-muted">
                Puedes subir hasta {MAX_PHOTOS_PER_GUEST} fotos. Anthony y Alexandra las revisarán antes de publicarlas en el
                álbum.
              </p>
            </div>
            <div className="soft-card px-4 py-5 sm:px-6">
              <PhotoUploader max={MAX_PHOTOS_PER_GUEST} used={used} />
            </div>
          </>
        ) : (
          <div className="soft-card flex flex-col gap-3 px-5 py-8 text-center">
            <h1 className="font-display text-3xl font-light text-charcoal">El álbum se abre el día de la boda</h1>
            <p className="text-muted">
              Vuelve a escanear este código durante la celebración para subir tus fotos favoritas de la noche.
            </p>
            {settings.published && (
              <Link href="/album" className="mx-auto mt-2 text-sm font-medium text-charcoal underline decoration-gold underline-offset-4">
                Ver el álbum
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
