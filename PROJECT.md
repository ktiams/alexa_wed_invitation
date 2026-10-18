# Invitación de Boda — Anthony & Alexandra

**Documento vivo.** Actualizar cada vez que se agregue una feature, se cambie la arquitectura, o se resuelva un bug importante.

---

## El evento

| Campo | Valor |
|---|---|
| Pareja | Anthony Ugarte & Alexandra Vargas |
| Fecha | 5 de diciembre, 2026 |
| Hora | 4:00 PM (Hora Estándar del Atlántico, UTC-4) |
| Lugar | Hacienda El Mabú, Barrio Pozas, San Sebastián, Puerto Rico (00586). Datos y enlaces de Maps en `lib/venue.ts` |
| Código de vestimenta | Casual elegante. **Solamente blanco, crema o rosa**: ningún otro color y nada de brillos (cambio del 17 oct 2026; antes era solo blanco). Referencia visual oficial en `public/images/dress-code/` (ver "Imágenes del código de vestimenta"). |
| Tipo de evento | Solo adultos. Cada invitación permite al invitado y un acompañante. |

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Next.js | 16.2.4 | Framework full-stack (App Router + Server Actions) |
| React | 19.2.4 | UI, `useActionState`, Transitions |
| TypeScript | ^5 | Tipado estático |
| Tailwind CSS | ^4 | Estilos (`@theme inline` en `globals.css`) |
| Supabase | JS ^2.104, SSR ^0.10 | Base de datos (Postgres) + Auth |
| Zod | ^4.3.6 | Validación de formularios server-side |

### Comandos de desarrollo

```bash
npm run dev      # Turbopack dev server → http://localhost:3000
npm run build    # Build de producción
npm run lint     # ESLint
```

---

## Arquitectura

### Route groups (App Router)

```
app/
├── page.tsx                        # Landing page pública (/)
├── layout.tsx                      # Root layout (fuentes, metadata global)
├── globals.css                     # Tokens de diseño (@theme inline)
│
├── (public)/                       # Layout público (sin sidebar)
│   ├── rsvp/page.tsx               # /rsvp — formulario RSVP independiente
│   └── gift/page.tsx               # /gift?guestId=... — post-RSVP
│
└── (admin)/
    └── admin/
        ├── layout.tsx              # force-dynamic, título y noindex (sin navegación)
        ├── login/page.tsx          # /admin/login — foto de los novios + formulario
        └── (panel)/                # Panel de los novios (desde el 18 oct 2026)
            ├── layout.tsx          # Pestañas (AdminNav) + destellos de fondo
            ├── page.tsx            # /admin — Invitados
            ├── autorizaciones/     # /admin/autorizaciones — fotos por aprobar
            └── fotos/              # /admin/fotos — QR y álbum (?estado=rejected)
        ├── tarjeta-qr/page.tsx     # /admin/tarjeta-qr — tarjeta de mesa para imprimir
        └── qr-album/route.ts       # /admin/qr-album — PNG del QR (descarga)
```

El grupo `(panel)` existe para que el login no lleve las pestañas ni los destellos. Ya no hay Resumen, Mensajes, Regalos, detalle de invitado ni Configuración: los novios no pueden cambiar datos de la invitación.

### Flujo de datos

```
Guest visita / → RSVPForm (Server Action submitRSVP)
  → INSERT guests + guest_messages → redirect /gift?guestId=...
  → GiftSubmissionForm (Server Action submitGift)
  → INSERT gift_transactions

Novios visitan /admin → proxy.ts verifica sesión Supabase
  → las páginas leen con service role (bypass RLS); la única acción es aprobar o rechazar fotos
```

### Dos superficies

| Superficie | Audiencia | Auth | Datos |
|---|---|---|---|
| Página pública `/` | Invitados | Anon | Solo lectura de settings. INSERT en guests, gifts, messages |
| Panel `/admin` | Los novios | Supabase Auth (email+password) | Lectura de invitados, mensajes y avisos de regalo; aprobar fotos del álbum |

---

## Autenticación y seguridad

### `proxy.ts` (raíz del proyecto)

Next.js 16 renombró `middleware.ts` → `proxy.ts`, y la función exportada debe llamarse `proxy` (no `middleware`). Protege todas las rutas `/admin/*`:

- Si visita `/admin/*` sin sesión → redirige a `/admin/login`
- Si visita `/admin/login` con sesión activa → redirige a `/admin`

### Clientes Supabase

| Archivo | Tipo | Uso |
|---|---|---|
| `lib/supabase/client.ts` | Browser client | Componentes `"use client"` (sidebar sign-out, login form) |
| `lib/supabase/server.ts` | SSR client (cookies) | Server components y Server Actions públicas |
| `lib/supabase/admin.ts` | Service role client | Server Actions de admin — bypass completo de RLS |

> El admin usa `createAdminClient()` para todas sus mutations. Nunca exponer `SUPABASE_SERVICE_ROLE_KEY` al cliente.

### Row Level Security

| Tabla | anon | authenticated |
|---|---|---|
| `guests` | INSERT | ALL |
| `gift_transactions` | INSERT | ALL |
| `guest_messages` | INSERT + SELECT (aprobados y públicos) | ALL |
| `wedding_settings` | SELECT | ALL |

---

## Base de datos

### Tablas

**`guests`**
```
id uuid PK, full_name text, phone text, email text,
attendance_status text CHECK('attending','not_attending','pending') DEFAULT 'pending',
has_plus_one bool, plus_one_name text,
adults_only_acknowledged bool, dress_code_acknowledged bool,
admin_notes text, created_at, updated_at
```

**`gift_transactions`**
```
id uuid PK, guest_id uuid FK→guests,
amount numeric(10,2), method text, reference_note text, screenshot_url text,
status text CHECK('pending','verified','rejected') DEFAULT 'pending',
created_at, updated_at
```

**`guest_messages`**
```
id uuid PK, guest_id uuid FK→guests (nullable, SET NULL on delete),
guest_name text, message text,
is_approved bool DEFAULT false, is_public bool DEFAULT false,
created_at, updated_at
```

**`wedding_settings`** (una sola fila)
```
id uuid PK, couple_name, bride_name, groom_name, wedding_date timestamptz,
venue_name, venue_city, venue_country, dress_code,
gift_qr_url text nullable, gift_instructions text nullable,
created_at, updated_at
```

Todas las tablas tienen trigger `set_updated_at()` automático.

### Migración

Archivo: `supabase/migrations/001_initial_schema.sql`
Incluye: creación de tablas, triggers, RLS policies, seed de `wedding_settings`.

### Evitar que Supabase pause el proyecto

El plan gratis de Supabase pausa el proyecto tras 7 días sin actividad. Un **Vercel Cron** (`vercel.json`) llama `/api/keepalive` todos los días a las 14:00 UTC (10:00 a. m. en Puerto Rico); la ruta hace una lectura mínima de `wedding_settings` con la llave pública y responde `{ ok: true }`. El usuario pidió "al menos cada 3 días": diario deja margen si alguna corrida falla.

- Solo corre en producción (después del deploy de `master`). Las corridas se ven en Vercel → proyecto → Settings → Cron Jobs, y los errores en los logs ("keepalive: Supabase no respondió").
- En el plan Hobby de Vercel un cron puede correr como máximo una vez al día y la hora exacta varía dentro de esa hora.
- Opcional: definir `CRON_SECRET` en las variables de entorno de Vercel. Con ella, la ruta solo responde a Vercel Cron; sin ella cualquiera puede llamarla, lo que no expone datos.

---

## Variables de entorno

Archivo: `.env.local` (no commitear)

```env
NEXT_PUBLIC_SUPABASE_URL=https://pjyaqjjpmjesjwbbmifz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
# Opcional, solo en Vercel: protege /api/keepalive (ver "Evitar que Supabase pause el proyecto")
CRON_SECRET=...
```

---

## Sistema de diseño

### Paleta "boda nude elegante" (desde el 17 oct 2026)

Sale de dos moodboards de la novia (ivory, beige, nude rosado, champán y dorado) más dos tonos de apoyo: cacao para textos y botones, y taupe para texto secundario. Se aplica a la invitación y al panel. Propuesta aprobada: https://claude.ai/artifact/TFMdLGmxxn6H6XFvJdMTNi

Los nombres viejos de los tokens se conservaron para no tocar cada componente; cambió su valor:

| Token | Hex | Nombre en la paleta | Uso |
|---|---|---|---|
| `cream` / `ivory` | `#faf5ef` | Ivory | Fondo principal |
| `card` | `#fffdf9` | | Superficie de tarjetas y formularios |
| `parchment` / `champagne-light` | `#f1e5d5` | Champán claro | Secciones alternas ("Cuándo y dónde", cierre) |
| `champagne` | `#e2cdb2` | Champán | Detalles |
| `beige` | `#d8c3a6` | Beige | Bordes marcados |
| `nude` / `nude-light` | `#ebcfc3` / `#f6e6de` | Nude rosado | Sección RSVP, aviso de adultos |
| `blush` | `#e2ada5` | Rosa | Acento suave |
| `silver` / `gold` | `#c49a4e` | Dorado | Líneas, íconos, el "&". Nunca para texto pequeño (2.4:1) |
| `gold-dark` | `#8a6a2f` | Dorado oscuro | Etiquetas pequeñas en dorado y foco (4.6:1) |
| `silver-light` | `#e6d7c6` | | Bordes |
| `charcoal` / `espresso` / `cacao` | `#4a3830` | Cacao | Texto principal y botones (10.2:1 sobre ivory) |
| `cacao-deep` | `#3a2b24` | | Hover de botones |
| `muted` / `silver-dark` | `#6f5c50` | Taupe | Texto secundario y etiquetas |
| `taupe` | `#9c8a7d` | | Placeholders |
| `night` | `#1f1a17` | | Fondo oscuro de la galería Love Story (se queda oscura a propósito) |

Tokens definidos en `app/globals.css` vía `@theme inline {}`. `tailwind.config.ts` **no lo carga Tailwind v4** (no hay `@config`); solo sirve de referencia para el IDE. Por eso `shadow-warm*` y `animate-slide-left` también se definen en `globals.css`.

Clases propias en `globals.css`: `premium-card` (tarjeta con doble borde; hoy sin uso), `soft-card` (tarjeta de un solo borde para la invitación), `snap-row` (carrusel horizontal nativo) y `names-3d` (nombres de la portada con borde dorado, relieve dorado hacia abajo y sombra suave).

### Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `font-display` / `font-sans` | Cormorant Garamond | Nombres, títulos, headings display |
| `font-body` | Inter | UI, labels, body text, formularios |

Ojo: `font-sans` es Cormorant, no una sans-serif. Para texto de interfaz usar `font-body`. Los campos de formulario usan Inter a 16 px como mínimo (con menos, Safari en iPhone hace zoom al tocarlos).

### Sombras personalizadas

```
shadow-warm    → 0 4px 24px rgba(42,37,33,0.07)
shadow-warm-sm → 0 2px 12px rgba(42,37,33,0.05)
shadow-warm-lg → 0 8px 40px rgba(42,37,33,0.10)
```

### Convención de labels

Todos los labels de sección y UI usan `text-sm uppercase tracking-wider text-silver-dark`.

---

## Componentes

### Públicos (`components/public/`)

Orden en la home (diseño mobile first, unas 6.5 pantallas en un iPhone): portada → galería → cuándo y dónde → lo que debes saber → RSVP → regalo → álbum → cierre, más la barra fija. La sección pública de deseos (`MessageCarousel`) se quitó el 18 oct 2026: el campo del RSVP dice "Mensaje para los novios", así que los mensajes son privados y solo se leen en el panel.

| Componente | Sección | Descripción |
|---|---|---|
| `HeroSection` | `#inicio` | Portada "foto protagonista" (elegida el 18 oct 2026): la foto (`public/images/hero.jpeg`, `object-cover` centrado en la pareja) llena la parte de arriba; título y nombres van encima, sobre la zona oscura del auto; el velo `.hero-veil` la lleva por cacao y nude hasta el ivory, donde siguen fecha, lugar, botones "Confirmar asistencia" (#rsvp) y "Agregar al calendario", y días que faltan. En el celular la portada mide `100svh` y cabe completa en una pantalla: los tamaños usan `clamp()` con `svh` para encogerse en teléfonos bajos (iPhone SE) y crecer en los altos, y con menos de 700 px de alto los botones se compactan (`.hero-actions` en `globals.css`). En escritorio la foto ocupa el ancho con el título encima, y fecha, lugar y botones siguen debajo (no está pensada para caber en una pantalla). |
| `StickyRSVPBar` | fija abajo | Barra con días que faltan y "Confirmar asistencia". Aparece al pasar la portada y se oculta mientras el RSVP está en pantalla (IntersectionObserver). En escritorio es una píldora centrada. |
| `CalendarButton` | portada y detalles | Menú con Google Calendar y el `.ics` de `/calendario` (Apple/Outlook). Sin hora de fin a propósito. El menú se abre hacia arriba: hacia abajo lo tapaba la sección siguiente (la galería). |
| `DaysLeft` | portada y barra | "Faltan N días" (client). |
| `LoveStorySection` | `#historia` | Galería "Love Story": túnel 3D con 16 fotos en `public/images/love-story/` (client). **Se queda igual y oscura** por decisión de los novios. |
| `EventDetails` | `#detalles` | "Cuándo y dónde": fecha, hora y lugar una sola vez, botones de Google Maps, Waze y calendario, y `CountdownTimer` compacto. Destellos de fondo. Tiene espacio para la foto del lugar (`VENUE.photo` en `lib/venue.ts`, hoy `null`). |
| `EnvelopeIntro` | pantalla completa al entrar | Sobre vertical de dos solapas (encaje festoneado y flores en relieve, como el pin de Pinterest de referencia) con sello de cera dorado "A&A". Al tocar, o solo a los 3 s: el sello se parte, las solapas se abren en 3D, se ve la tarjeta y sale con zoom y destello (~5 s). Una vez por sesión (`sessionStorage`). Basado en el `WelcomeScreen` del Sweet 16 de Cathyanis, pero en CSS (`.env-*` en `globals.css`), sin framer-motion. |
| `LooksCarousel` | `#vestimenta` (móvil) | Looks del código de vestimenta: cada uno se queda 2 s centrado y avanza solo 1 → 2 → 3 → 1. Se pausa 6 s si el invitado lo toca, fuera de pantalla y con `prefers-reduced-motion`. |
| `AlbumSection` | `#album` | "Álbum de fotos": antes de la boda explica el QR y los pasos; con la subida abierta, botón "Subir mis fotos"; con el álbum publicado, 6 miniaturas y "Ver el álbum". |
| `PhotoUploader` | `/album/subir` | Nombre, elegir fotos, reducción en el celular (1600 px y miniatura de 480 px, JPEG sin metadata) y subida directa a Storage con URLs firmadas. Máximo 8 por celular. |
| `AlbumGallery` | `/album` | Cuadrícula de fotos aprobadas con visor a pantalla completa (flechas, deslizar, Esc). |
| `PearlButton` (`components/ui/pearl-button.tsx`) | toda la invitación | Botón perla (componente de 21st.dev) con colores de la paleta: `tone="cacao"` para acciones principales (Confirmar asistencia en portada, barra y formulario; Copiar número; Avisar de mi regalo) y `tone="champan"` para secundarias (Agregar al calendario). Con `href` es un enlace. Estilos en `.pearl-button` de `globals.css`, a 16 px para celular; el hover solo en dispositivos con puntero. Contraste mejorado (18 oct 2026): texto sólido (ivory sobre cacao 10.2:1, cacao sobre champán 7.2:1), peso 600, por encima del brillo y sin la máscara que lo desvanecía. En el panel: "Entrar", "Aprobar las N fotos" y "Descargar QR" (champán, con la clase `pearl-compact` más chica). |
| `SparklesCore` (`components/ui/sparkles.tsx`) | `#detalles`, `#rsvp` y fondo fijo del panel | Destellos de fondo con profundidad, en canvas propio (sin tsparticles ni framer-motion): capas lejos/medio/cerca (puntos nítidos, estrellas ✦ y bokeh), suben a 8–60 px/s con vaivén y hacen parallax al hacer scroll. Sprites pre-dibujados, pausa fuera de pantalla, sin interacción, quieto con `prefers-reduced-motion`, 60 % de densidad en pantallas < 640 px. Ajustes para fondos claros en `lib/sparkles.ts`. Por decisión de los novios va solo en esas dos secciones; no ponerlo en "Lo que debes saber" (dice "nada de brillos"). |
| `CountdownTimer` | `#detalles` | Cuenta regresiva en una fila de 4 (client). |
| `GuestGuidelines` | `#vestimenta` | "Lo que debes saber": código de vestimenta (escritorio: imagen oficial completa; móvil: carrusel de 3 looks + colores y reglas como texto) y aviso "Una noche para adultos". |
| `RSVPForm` | `#rsvp` | Primero Sí/No. Si asiste: interruptor de acompañante (máximo uno, nombre obligatorio) y dos confirmaciones (solo adultos, vestimenta). Si no asiste, no se piden. |
| `GiftSection` | `#regalo` y `/gift` | Regalo por ATH Móvil: número de Alexa, botón "Copiar número" y pasos. Ver "Regalo por ATH Móvil". |
| `GiftSubmissionForm` | `/gift` | Aviso de regalo enviado (ATH Móvil u Otro). Nadie lo verifica: los novios lo ven en Invitados. |
| `Footer` | `/` | Nombres y fecha. |

### Portada y tipografía

Combinación tomada de una tarjeta de referencia: caligrafía **Great Vibes** (`font-script`, vía `next/font`) en dorado foil (`.gold-foil`) para "Boda" e "y", y nombres completos en mayúsculas de Cormorant con tracking y `.names-3d` (borde dorado y relieve, en `em`). Las flores (`public/images/flores/*.webp`) salen de las esquinas de la imagen oficial del código de vestimenta, con el fondo crema quitado; no se copiaron las de la referencia, que es diseño de un tercero.

### Álbum de fotos de los invitados

- **Dónde**: sección `#album` en la invitación (después de Regalo); QR en las mesas que lleva a `/album/subir`; álbum en `/album`; aprobación en `/admin/autorizaciones` y álbum en `/admin/fotos`.
- **Datos**: migración `supabase/migrations/002_album.sql` → tabla `album_photos`, bucket **privado** `album` y columnas `photo_upload_enabled` / `album_published` en `wedding_settings`. Mientras no se aplique, todo muestra el estado "se activa el día de la boda" y el panel avisa que falta la migración.
- **Se abre solo por fecha** (`getAlbumSettings` en `lib/album.ts`, hora de Puerto Rico): la subida desde el 5 de diciembre de 2026 y el álbum en la invitación desde el 6 de diciembre, solo con fotos aprobadas. Los novios no tienen interruptores. Las dos columnas de `wedding_settings` siguen sirviendo para abrirlo antes a mano desde Supabase (por ejemplo, para probar una subida).
- **Subida**: `startAlbumUpload` (Server Action) valida que la subida esté abierta y el límite de 8 por celular (cookie anónima `aa_album_uid`) y devuelve URLs firmadas de subida; el navegador sube foto + miniatura directo a Storage (no pasa por Vercel, que limita el tamaño de las peticiones); `finishAlbumUpload` registra solo lo que de verdad está en Storage, en estado `pending`.
- **Ver**: el servidor firma URLs de 1 hora para las fotos aprobadas (bucket privado: las pendientes nunca son públicas).
- **Panel**: Autorizaciones muestra las fotos por revisar (aprobar, rechazar o aprobar todas; el número sale en la pestaña). Fotos tiene las pestañas En el álbum / Rechazadas, con "Quitar del álbum" y "Devolver al álbum".
- **QR del álbum** (paquete `qrcode`, apunta a `ALBUM_UPLOAD_URL` de `lib/album.ts`): tarjeta `AlbumQrCard` arriba de Fotos, visible aunque falte la migración, con tres acciones:
  - "Imprimir para las mesas" → `/admin/tarjeta-qr`: tarjeta de mesa de 5 × 7 in (una por hoja carta) con flores, nombres, fecha y el QR; botón que abre el diálogo de impresión. Fuera del grupo `(panel)` para imprimir sin pestañas.
  - "Compartir enlace" (`ShareAlbumLink`): menú de compartir del teléfono; en computadora copia el enlace.
  - "Guardar imagen del QR" → `/admin/qr-album`: PNG de 1200 px para guardar o mandar a imprimir.

### Seguridad del panel

Las Server Actions son endpoints públicos aunque `proxy.ts` proteja las páginas. La única acción del panel, `setPhotoStatus` (`lib/actions/album.ts`), llama primero a `requireAdmin()` (`lib/auth/requireAdmin.ts`), que exige sesión de Supabase Auth. Toda acción nueva de administración debe hacer lo mismo.

### Regalo por ATH Móvil

La cuenta de Alexa (939-224-8043) es **personal**. ATH Móvil no tiene botón web para cuentas personales: el botón oficial (`github.com/evertec/athmovil-javascript-api`) exige una cuenta **ATH Business** y su token público, y el cobro llega a esa cuenta de negocio. Por eso hoy la sección muestra el número con "Copiar número" y los pasos ("Enviar dinero" en la app). Si abren ATH Business, se llena `businessPublicToken` en `lib/gift.ts` y se integra el botón oficial (el invitado escribe su teléfono y recibe la solicitud de pago en la app).

### Datos del evento

`lib/event.ts` concentra título, fecha larga, hora, dirección, `SITE_URL`, el enlace de Google Calendar y el `.ics`. `lib/venue.ts` sigue siendo el único lugar del venue (incluye `wazeUrl`).

### Imágenes del código de vestimenta

Referencia oficial entregada el 17 de octubre de 2026 (1046 × 707 px). El original, con un borde negro de captura, está en `docs/referencias/codigo-vestimenta-original.webp`.

| Archivo | Uso |
|---|---|
| `public/images/dress-code/codigo-vestimenta.webp` | Escritorio: la imagen completa sin el borde negro (1039 × 696). |
| `public/images/dress-code/look-1.webp` … `look-3.webp` | Móvil: un recorte por pareja (≈ 2:3) para un carrusel. El título, los colores y las reglas van como texto HTML porque dentro de la imagen medirían unos 5 px en un teléfono. |

Colores tomados de la imagen: blanco `#f7f5f4`, crema `#e7d5c6`, rosa `#eec1be`. Conviene pedir el archivo original en mayor resolución: en móvil cada pareja se amplía ~2×.

### Admin (`components/admin/`)

| Componente | Descripción |
|---|---|
| `AdminNav` | Tres pestañas (Invitados, Autorizaciones con el número de fotos por revisar, Fotos) y "Salir". En el celular, barra fija abajo; en la computadora, arriba junto al monograma. |
| `PhotoModeration` | Cuadrícula de fotos (2 columnas en el celular) con aprobar/rechazar, "Aprobar las N fotos" (botón perla), "Quitar del álbum" y "Devolver al álbum". |
| `AlbumSetupNotice` | Aviso mientras falte la migración 002. |
| `AlbumQrCard` / `ShareAlbumLink` / `PrintButton` | QR del álbum en Fotos: imprimir, compartir enlace y guardar imagen. |

La lista de Invitados (`app/(admin)/admin/(panel)/page.tsx`) no tiene botones: arriba cuántas personas vienen (invitados que dijeron que sí + acompañantes) y cuántos mensajes y regalos avisados hay; abajo un `<details>` por invitado. El mensaje privado (hasta 3 líneas, completo al abrir) y el regalo avisado se ven en la misma fila; al tocarla aparecen teléfono, correo y fecha de respuesta. Al final, los avisos de regalo que llegaron sin RSVP.

### UI primitivos (`components/ui/`)

| Componente | Descripción |
|---|---|
| `Input` / `Textarea` | Label + input + error inline. Focus ring gold. |
| `Spinner` | Indicador de carga SVG animado. |
| `Modal` | Overlay genérico (disponible, aún no en uso activo). |

---

## Server Actions

### Públicas

| Archivo | Función | Efecto |
|---|---|---|
| `lib/actions/rsvp.ts` | `submitRSVP` | INSERT en `guests` + `guest_messages`. El `id` se genera en el servidor (`crypto.randomUUID()`) porque RLS no deja a `anon` leer `guests` y `.insert().select()` fallaría. Retorna `guestId`. |
| `lib/actions/gifts.ts` | `submitGift` | INSERT en `gift_transactions`. |

Ambas usan la firma `(prevState: State, formData: FormData)` requerida por `useActionState` de React 19.

### Panel

| Archivo | Funciones |
|---|---|
| `lib/actions/album.ts` | `setPhotoStatus` (aprobar, rechazar o devolver fotos; exige `requireAdmin()`) |

Usa `createAdminClient()` (service role). Las acciones de mensajes, regalos, notas y configuración se borraron el 18 oct 2026 junto con sus páginas.

---

## Validación (`lib/utils/validation.ts`)

Usa Zod v4. Diferencias críticas vs Zod v3:

- Los errores están en `parsed.error.issues` (no `.errors`)
- Los booleans required usan `.boolean().refine((v) => v === true, { message })` (no `z.literal(true, { errorMap })`)

---

## Gotchas técnicos

| Problema | Causa | Solución |
|---|---|---|
| `middleware.ts` vs `proxy.ts` | Next.js 16 cambió la convención | Usar solo `proxy.ts` con función `proxy` en la raíz |
| Admin crash en build | `createAdminClient()` se llama con env vars vacías en prerender | `export const dynamic = "force-dynamic"` en `app/(admin)/admin/layout.tsx` |
| `useActionState` type error | React 19 exige `(prevState, formData)` | Primer parámetro `_prevState: State` en todas las server actions |
| Conflicto de rutas en `/` | `app/(public)/page.tsx` y `app/page.tsx` ambas mapean a `/` | Solo usar `app/page.tsx` para la home |
| Zod v4 error shape | API cambió | `.issues` en lugar de `.errors` |
| RSVP fallaba al guardar | `.insert().select("id")` necesita SELECT y RLS solo da INSERT a `anon` | Generar el `id` en el servidor e insertar sin `.select()` |
| Fondo en franjas cada pantalla | Sin color en `html`, el degradado del `body` se pinta en el lienzo con el alto de la ventana y se repite | `html { background-color }` en `globals.css` |
| Clases de `tailwind.config.ts` no existen | Tailwind v4 no carga ese archivo sin `@config` | Definir tokens, sombras y animaciones en `@theme` de `globals.css` |
| Zoom al escribir en iPhone | Campos con letra menor de 16 px | `Input` usa `text-base` (16 px) y `font-body` |

---

## Flujo del invitado

```
1. Visita / → ve la landing page completa
2. Llena RSVPForm → submitRSVP() → redirige a /gift?guestId=UUID
3. Ve GiftQRCode (QR + métodos de pago)
4. Opcionalmente llena GiftSubmissionForm → submitGift()
```

## Flujo del panel (los novios)

```
1. Visita /admin → proxy.ts redirige a /admin/login si no hay sesión
2. Login con email+password de Supabase Auth (foto de los novios, botón perla "Entrar")
3. Invitados → cuántas personas vienen; tocar un nombre para ver contacto, mensaje y regalo
4. Autorizaciones → aprobar o rechazar las fotos que suben los invitados
5. Fotos → descargar el QR de las mesas; ver el álbum y las rechazadas
```

---

## Pendiente / Ideas futuras

- [ ] **Aplicar `supabase/migrations/002_album.sql`** en Supabase (SQL Editor) para activar el álbum; después probar una subida real y borrarla
- [ ] Imprimir el QR del álbum (desde `/admin/fotos`). La subida y el álbum se abren solos por fecha; después de la boda, aprobar las fotos en Autorizaciones
- [ ] Foto del venue para "Cuándo y dónde": guardarla en `public/images/venue/` y llenar `VENUE.photo`
- [x] Probar un RSVP real de punta a punta: hecho el 18 oct 2026 en producción; se guardaron invitado, acompañante y mensaje, y se borraron
- [ ] Probar los inicios de sesión del panel (`bizdev4uai@gmail.com`, `kmatos_santana@gmail.com`); hoy cualquier usuario autenticado es admin
- [ ] Opcional: pasar a español `wedding_settings.dress_code` ("White, casual elegant…") y `gift_instructions` (habla de un QR). Ni la invitación ni el panel los muestran ya
- [ ] Opcional: cuenta ATH Business para el botón de pago oficial (ver "Regalo por ATH Móvil")
- [ ] Conseguir la imagen del código de vestimenta en mayor resolución
- [ ] Aprobar con la novia la selección y el orden de las 16 fotos de la galería Love Story
- [ ] Confirmación por email al invitado tras RSVP (Supabase Edge Function + Resend)
- [ ] Paginación o búsqueda en la lista de invitados (cuando supere ~100 registros)
