import Image from "next/image";

const DRESS_CODE_IMAGE = { src: "/images/dress-code/codigo-vestimenta.webp", width: 1039, height: 696 };

const looks = [
  { src: "/images/dress-code/look-1.webp", caption: "Blanco y crema", alt: "Ejemplo: traje beige con camisa blanca y conjunto blanco" },
  { src: "/images/dress-code/look-2.webp", caption: "Rosa y crema", alt: "Ejemplo: traje rosa con camisa blanca y vestido crema" },
  { src: "/images/dress-code/look-3.webp", caption: "Crema y rosa", alt: "Ejemplo: traje crema con camisa rosa y vestido rosa" },
];

// Colores tomados de la imagen oficial del código de vestimenta.
const colors = [
  { name: "Blanco", hex: "#f7f5f4" },
  { name: "Crema", hex: "#e7d5c6" },
  { name: "Rosa", hex: "#eec1be" },
];

// "Lo que debes saber": código de vestimenta y celebración para adultos.
// Escritorio: la imagen oficial completa. Móvil: cada pareja en grande y el texto como texto real,
// porque dentro de la imagen las letras medirían unos 5 px.
export function GuestGuidelines() {
  return (
    <section id="vestimenta" className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-5 sm:gap-6">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Lo que debes saber</p>
          <h2 className="mt-3 font-display text-4xl font-light text-charcoal lg:hidden">Código de vestimenta</h2>
          <p className="mt-1 text-muted lg:hidden">Casual elegante</p>
        </div>

        <Image
          src={DRESS_CODE_IMAGE.src}
          width={DRESS_CODE_IMAGE.width}
          height={DRESS_CODE_IMAGE.height}
          sizes="(min-width: 1024px) 1024px, 100vw"
          alt="Código de vestimenta: casual elegante. Tres parejas de ejemplo. Colores exclusivos: blanco, crema y rosa. Solamente estos colores, ningún otro color y nada de brillos."
          className="hidden h-auto w-full rounded-2xl shadow-warm-lg lg:block"
        />

        <div className="flex flex-col gap-5 lg:hidden">
          <div className="snap-row -mx-4 px-4" tabIndex={0} aria-label="Ejemplos de looks">
            {looks.map((look) => (
              <figure
                key={look.src}
                className="relative m-0 aspect-[2/3] w-[74%] max-w-xs overflow-hidden rounded-2xl border border-silver-light bg-[#efe6dd]"
              >
                <Image src={look.src} alt={look.alt} fill sizes="74vw" className="object-cover" />
                <figcaption className="absolute bottom-2.5 left-2.5 rounded-full bg-card/90 px-3 py-1 text-xs font-medium text-charcoal">
                  {look.caption}
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="-mt-2 text-center text-xs text-muted">Desliza para ver los 3 ejemplos</p>

          <p className="text-center text-xs uppercase tracking-[0.3em] text-gold-dark">Colores exclusivos</p>
          <ul className="grid grid-cols-3 gap-2 text-center">
            {colors.map((color) => (
              <li key={color.name} className="flex flex-col items-center gap-2 text-sm font-medium text-charcoal">
                <span className="h-14 w-14 rounded-full border border-silver-light" style={{ background: color.hex }} aria-hidden="true" />
                {color.name}
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-2 text-sm font-medium text-charcoal">
            <li className="flex min-h-12 items-center gap-3 rounded-2xl bg-nude-light px-4 py-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-[1.5px] border-charcoal" aria-hidden="true">✓</span>
              Solamente estos colores
            </li>
            <li className="flex min-h-12 items-center gap-3 rounded-2xl border border-silver-light bg-card px-4 py-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-parchment" aria-hidden="true">✕</span>
              Ningún otro color
            </li>
            <li className="flex min-h-12 items-center gap-3 rounded-2xl border border-silver-light bg-card px-4 py-2">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-parchment" aria-hidden="true">✕</span>
              Nada de brillos
            </li>
          </ul>
        </div>

        <div className="mx-auto grid w-full max-w-2xl grid-cols-[3rem_minmax(0,1fr)] items-start gap-4 rounded-2xl border border-nude bg-nude-light px-5 py-5">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-gold text-sm font-semibold text-gold-dark" aria-hidden="true">
            18+
          </span>
          <p className="text-sm leading-relaxed text-muted">
            <strong className="mb-0.5 block text-base font-semibold text-charcoal">Una noche para adultos</strong>
            Queremos mucho a sus pequeños, pero esta noche la celebraremos solo entre adultos. Cada invitación incluye al
            invitado y un acompañante.
          </p>
        </div>
      </div>
    </section>
  );
}
