import Link from "next/link";
import { countByStatus, getAlbumSettings, listPhotos, withSignedUrls } from "@/lib/album";
import { photoDate } from "@/lib/utils/date";
import { AlbumQrCard } from "@/components/admin/AlbumQrCard";
import { AlbumSetupNotice } from "@/components/admin/AlbumSetupNotice";
import { PhotoModeration } from "@/components/admin/PhotoModeration";

// Fotos: el QR para las mesas (imprimir, compartir o guardar) y el álbum (fotos aprobadas).
// Las rechazadas quedan en su propia pestaña por si quieren devolver alguna. Las nuevas se
// aprueban en Autorizaciones. La subida y el álbum se abren solos por fecha (lib/album.ts).

const tabs = [
  { status: "approved", label: "En el álbum" },
  { status: "rejected", label: "Rechazadas" },
] as const;

type Shown = (typeof tabs)[number]["status"];

export default async function PhotosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const status: Shown = estado === "rejected" ? "rejected" : "approved";
  const settings = await getAlbumSettings();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="font-display text-4xl font-light text-charcoal">Fotos</h1>
        {settings.ready && (
          <p className="mt-1 font-body text-sm text-muted">
            {settings.uploadEnabled ? "La subida está abierta." : "La subida abre sola el 5 de diciembre."}{" "}
            {settings.published ? "El álbum ya se ve en la invitación." : "El álbum aparece en la invitación desde el 6 de diciembre."}
          </p>
        )}
      </div>

      <AlbumQrCard />

      {settings.ready ? <Album status={status} /> : <AlbumSetupNotice />}
    </div>
  );
}

async function Album({ status }: { status: Shown }) {
  const [counts, photos] = await Promise.all([countByStatus(), listPhotos(status).then(withSignedUrls)]);

  return (
    <>
      <nav className="grid grid-cols-2 gap-2" aria-label="Fotos del álbum">
        {tabs.map((tab) => (
          <Link
            key={tab.status}
            href={tab.status === "approved" ? "/admin/fotos" : "/admin/fotos?estado=rejected"}
            aria-current={tab.status === status ? "page" : undefined}
            className={[
              "flex items-center justify-center gap-1.5 rounded-full border px-3 py-2 font-body text-sm font-semibold transition-colors",
              tab.status === status
                ? "border-espresso bg-espresso text-ivory"
                : "border-silver-light bg-card/85 text-charcoal hover:bg-nude-light",
            ].join(" ")}
          >
            {tab.label}
            <span className="tabular-nums opacity-75">{counts[tab.status]}</span>
          </Link>
        ))}
      </nav>

      <PhotoModeration
        key={status}
        status={status}
        photos={photos.map((p) => ({
          id: p.id,
          url: p.url,
          thumbUrl: p.thumbUrl,
          by: p.uploader_name,
          at: photoDate(p.created_at),
        }))}
      />
    </>
  );
}
