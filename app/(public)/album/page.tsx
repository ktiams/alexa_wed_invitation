import Link from "next/link";
import { EVENT } from "@/lib/event";
import { getAlbumSettings, listPhotos, withSignedUrls } from "@/lib/album";
import { AlbumGallery } from "@/components/public/AlbumGallery";
import { PearlButton } from "@/components/ui/pearl-button";

export const metadata = {
  title: `Álbum · ${EVENT.couple}`,
  robots: { index: false },
};

export const dynamic = "force-dynamic";

// Álbum con las fotos de los invitados que los novios aprobaron.
export default async function AlbumPage() {
  const settings = await getAlbumSettings();
  const photos = settings.published ? await withSignedUrls(await listPhotos("approved", 500)) : [];

  return (
    <main className="min-h-screen bg-cream">
      <div className="border-b border-silver-light bg-card px-4 py-7 text-center">
        <Link href="/" className="font-display text-2xl font-light italic text-charcoal">
          Anthony &amp; Alexandra
        </Link>
        <p className="mt-1 text-xs uppercase tracking-[0.24em] text-gold-dark">Álbum de la boda · {EVENT.dateShort}</p>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-3 py-8 sm:px-6">
        {settings.published && photos.length > 0 ? (
          <>
            <p className="text-center text-muted">
              {photos.length} foto{photos.length === 1 ? "" : "s"} de nuestros invitados. Toca una para verla en grande.
            </p>
            <AlbumGallery
              photos={photos.map((p) => ({
                id: p.id,
                url: p.url,
                thumbUrl: p.thumbUrl,
                by: p.uploader_name,
                width: p.width,
                height: p.height,
              }))}
            />
          </>
        ) : (
          <div className="soft-card mx-auto flex max-w-md flex-col gap-3 px-5 py-8 text-center">
            <h1 className="font-display text-3xl font-light text-charcoal">El álbum estará listo muy pronto</h1>
            <p className="text-muted">
              Después de la celebración, aquí verás las fotos de los invitados en cuanto Anthony y Alexandra las aprueben.
            </p>
            {settings.uploadEnabled && (
              <PearlButton href="/album/subir" label="Subir mis fotos" className="mx-auto mt-2 w-full" />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
