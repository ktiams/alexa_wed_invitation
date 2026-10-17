import Image from "next/image";
import { getAlbumSettings, listPhotos, withSignedUrls, MAX_PHOTOS_PER_GUEST } from "@/lib/album";
import { PearlButton } from "@/components/ui/pearl-button";

const steps = [
  "Escanea el código QR de las mesas con la cámara de tu celular.",
  `Sube hasta ${MAX_PHOTOS_PER_GUEST} de tus fotos favoritas de la noche.`,
  "Los novios las revisan y las suman al álbum.",
];

// "Álbum de fotos" en la invitación. Cambia según lo que activen los novios en /admin/fotos:
// antes de la boda explica cómo funcionará; el día de la boda invita a subir fotos;
// con el álbum publicado muestra una vista previa y el enlace al álbum.
export async function AlbumSection() {
  const settings = await getAlbumSettings();
  const preview = settings.published ? await withSignedUrls(await listPhotos("approved", 6)) : [];

  return (
    <section id="album" className="bg-parchment px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-xl flex-col gap-5 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Álbum de fotos</p>

        {preview.length > 0 ? (
          <ul className="grid grid-cols-3 gap-2">
            {preview.map((photo) => (
              <li key={photo.id} className="aspect-square overflow-hidden rounded-xl bg-cream">
                {/* eslint-disable-next-line @next/next/no-img-element -- URL firmada de Supabase */}
                <img src={photo.thumbUrl} alt={`Foto de ${photo.uploader_name}`} loading="lazy" className="h-full w-full object-cover" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="relative mx-auto h-44 w-64" aria-hidden="true">
            {[
              { src: "/images/love-story/love-04.jpeg", className: "-translate-x-[3.4rem] -rotate-[8deg]" },
              { src: "/images/love-story/love-10.jpeg", className: "translate-x-[3.4rem] rotate-[6deg]" },
              { src: "/images/love-story/love-02.jpeg", className: "-rotate-1" },
            ].map((p) => (
              <div key={p.src} className={`absolute left-1/2 top-1 -ml-[3.9rem] w-[7.8rem] bg-card p-1.5 pb-6 shadow-warm-lg ${p.className}`}>
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <Image src={p.src} alt="" fill sizes="125px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        )}

        <h2 className="font-display text-4xl font-light leading-tight text-charcoal sm:text-5xl">
          Comparte la noche con nosotros
        </h2>

        {settings.uploadEnabled ? (
          <p className="text-muted">
            ¡Ya puedes subir tus fotos! Cada invitado puede compartir hasta {MAX_PHOTOS_PER_GUEST}. Todas pasan por la
            aprobación de los novios antes de aparecer en el álbum.
          </p>
        ) : (
          <p className="text-muted">
            El día de la boda encontrarás un código QR para subir tus fotos. Lo activaremos durante la celebración.
          </p>
        )}

        {!settings.published && (
          <ol className="flex flex-col gap-2 text-left">
            {steps.map((step, i) => (
              <li key={step} className="soft-card grid grid-cols-[2.25rem_minmax(0,1fr)] items-center gap-3 px-4 py-3 text-sm text-charcoal">
                <span className="grid h-9 w-9 place-items-center rounded-full border border-gold font-display text-lg text-gold-dark">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}

        <div className="flex flex-col gap-3">
          {settings.uploadEnabled && <PearlButton href="/album/subir" label="Subir mis fotos" className="w-full" />}
          {settings.published && (
            <PearlButton href="/album" tone={settings.uploadEnabled ? "champan" : "cacao"} label="Ver el álbum" className="w-full" />
          )}
        </div>

        {!settings.published && (
          <>
            <p className="text-sm text-muted">
              Después de la celebración, el álbum estará disponible aquí en cuanto Anthony y Alexandra aprueben las fotos.
            </p>
            {!settings.uploadEnabled && (
              <p className="mx-auto rounded-full border border-dashed border-gold bg-card px-4 py-2 text-sm font-medium text-gold-dark">
                Se activa el 5 de diciembre
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
