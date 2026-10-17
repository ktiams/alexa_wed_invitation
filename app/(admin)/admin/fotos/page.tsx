import Link from "next/link";
import QRCode from "qrcode";
import { SITE_URL } from "@/lib/event";
import { countByStatus, getAlbumSettings, listPhotos, withSignedUrls, type PhotoStatus } from "@/lib/album";
import { AlbumSwitches } from "@/components/admin/AlbumSwitches";
import { PhotoModeration } from "@/components/admin/PhotoModeration";

const UPLOAD_URL = `${SITE_URL}/album/subir`;

const tabs: { status: PhotoStatus; label: string }[] = [
  { status: "pending", label: "Por revisar" },
  { status: "approved", label: "Aprobadas" },
  { status: "rejected", label: "Rechazadas" },
];

const dateFormat = new Intl.DateTimeFormat("es-PR", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Puerto_Rico",
});

export default async function PhotosAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string }>;
}) {
  const { estado } = await searchParams;
  const status: PhotoStatus = tabs.some((t) => t.status === estado) ? (estado as PhotoStatus) : "pending";
  const settings = await getAlbumSettings();

  if (!settings.ready) {
    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <h1 className="font-display text-3xl font-light text-charcoal">Fotos</h1>
        <div className="rounded-2xl border border-gold/50 bg-nude-light px-5 py-5 font-body text-sm text-charcoal">
          <p className="font-semibold">Falta preparar la base de datos para el álbum.</p>
          <p className="mt-2 text-muted">
            En Supabase → SQL Editor, ejecuta completo el archivo <code>supabase/migrations/002_album.sql</code>. Crea la
            tabla de fotos, el espacio de almacenamiento privado y los interruptores. No toca datos existentes.
          </p>
        </div>
      </div>
    );
  }

  const [counts, photos, qrSvg] = await Promise.all([
    countByStatus(),
    listPhotos(status).then(withSignedUrls),
    QRCode.toString(UPLOAD_URL, { type: "svg", margin: 1, width: 600, color: { dark: "#4a3830", light: "#ffffff" } }),
  ]);
  const qrHref = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg)}`;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-1 font-display text-3xl font-light text-charcoal">Fotos</h1>
        <p className="font-body text-sm text-muted">
          {counts.pending} por revisar · {counts.approved} aprobadas · {counts.rejected} rechazadas
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]">
        <AlbumSwitches uploadEnabled={settings.uploadEnabled} published={settings.published} />

        <div className="flex items-center gap-4 rounded-2xl border border-silver-light bg-card p-4">
          <div
            className="h-24 w-24 shrink-0 overflow-hidden rounded-lg border border-silver-light bg-white [&>svg]:h-full [&>svg]:w-full"
            dangerouslySetInnerHTML={{ __html: qrSvg }}
          />
          <div className="min-w-0 font-body text-sm">
            <p className="font-semibold text-charcoal">Código QR para las mesas</p>
            <p className="mt-0.5 break-all text-xs text-muted">{UPLOAD_URL}</p>
            <a
              href={qrHref}
              download="qr-album-anthony-alexandra.svg"
              className="mt-2 inline-flex min-h-10 items-center rounded-full border border-charcoal/40 px-4 text-sm font-semibold text-charcoal"
            >
              Descargar QR
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <nav className="flex gap-2 overflow-x-auto" aria-label="Estado de las fotos">
          {tabs.map((tab) => (
            <Link
              key={tab.status}
              href={`/admin/fotos?estado=${tab.status}`}
              aria-current={tab.status === status ? "page" : undefined}
              className={[
                "shrink-0 rounded-full border px-4 py-2 font-body text-sm font-medium",
                tab.status === status ? "border-espresso bg-espresso text-ivory" : "border-silver-light bg-card text-charcoal",
              ].join(" ")}
            >
              {tab.label} · {counts[tab.status]}
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
            at: dateFormat.format(new Date(p.created_at)),
          }))}
        />
      </div>
    </div>
  );
}
