import { getAlbumSettings, listPhotos, withSignedUrls } from "@/lib/album";
import { AlbumSetupNotice } from "@/components/admin/AlbumSetupNotice";
import { PhotoModeration } from "@/components/admin/PhotoModeration";
import { photoDate } from "@/lib/utils/date";

// Autorizaciones: las fotos que suben los invitados con el QR esperan aquí. Solo las que
// los novios aprueban salen en el álbum.
export default async function AuthorizationsPage() {
  const settings = await getAlbumSettings();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-4xl font-light text-charcoal">Autorizaciones</h1>
        <p className="mt-1 font-body text-sm text-muted">
          Las fotos que suben los invitados llegan aquí. Solo las que aprueben salen en el álbum.
        </p>
      </div>

      {settings.ready ? <PendingPhotos /> : <AlbumSetupNotice />}
    </div>
  );
}

async function PendingPhotos() {
  const photos = await withSignedUrls(await listPhotos("pending"));
  return (
    <PhotoModeration
      status="pending"
      photos={photos.map((p) => ({
        id: p.id,
        url: p.url,
        thumbUrl: p.thumbUrl,
        by: p.uploader_name,
        at: photoDate(p.created_at),
      }))}
    />
  );
}
