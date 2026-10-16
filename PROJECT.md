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
| Código de vestimenta | Blanco, casual elegante. Sin brillantina, sin glitter, sin brillo. |
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
└── (admin)/                        # Layout admin (con sidebar)
    └── admin/
        ├── layout.tsx              # Sidebar + force-dynamic
        ├── page.tsx                # /admin — Panel principal
        ├── login/page.tsx          # /admin/login — autenticación
        ├── guests/page.tsx         # /admin/guests — tabla de invitados
        ├── guests/[id]/page.tsx    # /admin/guests/:id — perfil de invitado
        ├── messages/page.tsx       # /admin/messages — moderación de mensajes
        ├── gifts/page.tsx          # /admin/gifts — verificación de regalos
        └── settings/page.tsx       # /admin/settings — datos de la boda
```

### Flujo de datos

```
Guest visita / → RSVPForm (Server Action submitRSVP)
  → INSERT guests + guest_messages → redirect /gift?guestId=...
  → GiftSubmissionForm (Server Action submitGift)
  → INSERT gift_transactions

Admin visita /admin → proxy.ts verifica sesión Supabase
  → Admin usa Server Actions para leer/mutar con service role (bypass RLS)
```

### Dos superficies

| Superficie | Audiencia | Auth | Datos |
|---|---|---|---|
| Página pública `/` | Invitados | Anon | Solo lectura de settings + mensajes aprobados/públicos. INSERT en guests, gifts, messages |
| Dashboard `/admin` | Alexa (la novia) | Supabase Auth (email+password) | Full CRUD con service role key |

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

---

## Variables de entorno

Archivo: `.env.local` (no commitear)

```env
NEXT_PUBLIC_SUPABASE_URL=https://pjyaqjjpmjesjwbbmifz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## Sistema de diseño

### Paleta warm luxury

| Token | Hex | Uso |
|---|---|---|
| `cream` | `#f7f1e8` | Fondo principal de página |
| `card` | `#fffdf8` | Superficie de cards y formularios |
| `parchment` | `#efe4d3` | Secciones alternas (RSVP, adults-only) |
| `silver` / `gold` | `#b99b6b` | Champagne — divisores, ornamentos |
| `silver-light` | `#d8c9b8` | Bordes de cards, inputs, separadores |
| `silver-dark` | `#7a6a5b` | Labels, metadata |
| `charcoal` | `#2a2521` | Texto primario, headings |
| `espresso` | `#1f1a17` | Botones primary, acentos fuertes |
| `muted` | `#7a6a5b` | Texto secundario, body |
| `taupe` | `#9a8a7a` | Placeholder de inputs |
| `gold-dark` | `#a98d61` | Focus ring, hover states |

Tokens definidos en `app/globals.css` via `@theme inline {}`. Duplicados en `tailwind.config.ts` para IntelliSense del IDE.

### Tipografía

| Variable | Fuente | Uso |
|---|---|---|
| `font-display` / `font-sans` | Cormorant Garamond | Nombres, títulos, headings display |
| `font-body` | Inter | UI, labels, body text, formularios |

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

| Componente | Sección | Descripción |
|---|---|---|
| `HeroSection` | `/` | Foto de la pareja (`public/images/hero.jpeg`) completa con `object-contain` sobre un fondo difuminado de la misma foto, nunca recortada. Escritorio: texto en franja inferior. Móvil: foto arriba y texto debajo. |
| `CountdownTimer` | `/` | Cuenta regresiva en tiempo real (client). Días/Horas/Minutos/Segundos. |
| `LoveStorySection` | `#historia` | Galería "Love Story": túnel 3D con 16 fotos en `public/images/love-story/` (client). Mantener presionado o el botón acelera; `prefers-reduced-motion` la deja estática. |
| `WeddingDetails` | `#details` | Fecha, hora, lugar en grid de 3 columnas. |
| `DressCodeCard` | `#dress-code` | Blanco/marfil ✓ — brillantina/glitter/brillo ✕ |
| `AdultsOnlyNotice` | `#adults-only` | Aviso 18+ con ícono. |
| `VenueSection` | `#venue` | Mapa placeholder + link a Google Maps. |
| `RSVPForm` | `#rsvp` | Formulario completo con Server Action. Card premium sobre fondo parchment. |
| `GiftQRCode` | `#gift` | QR code + métodos de pago (ATH Móvil, PayPal, Zelle). |
| `GiftSubmissionForm` | `/gift` | Registro post-RSVP del regalo enviado. |
| `MessageCarousel` | `#messages` | Carrusel infinito con mensajes aprobados/públicos. |
| `Footer` | `/` | Nombre de la pareja, fecha, venue. |

### Admin (`components/admin/`)

| Componente | Descripción |
|---|---|
| `AdminSidebar` | Navegación lateral. Sign out con `supabase.auth.signOut()`. |
| `DashboardStatsGrid` | 9 stat cards: asistencia, regalos, mensajes pendientes. |
| `MessageApprovalCard` | Card con acciones "Aprobar y Publicar" / "Despublicar". |
| `GiftVerificationCard` | Card con acciones "Verificar" / "Rechazar". |
| `GuestProfileActions` | Textarea de notas internas de admin con auto-save. |
| `GiftStatusBadge` | Badge Verificado/Pendiente/Rechazado. |
| `CSVExportButton` | Exporta tabla de invitados a CSV descargable. |
| `SettingsForm` | Edición de todos los campos de `wedding_settings`. |

### UI primitivos (`components/ui/`)

| Componente | Descripción |
|---|---|
| `Button` | Variantes: `primary`, `outline`, `danger`. Prop `loading` con spinner. |
| `Input` / `Textarea` | Label + input + error inline. Focus ring gold. |
| `Badge` | Variantes: `success`, `warning`, `danger`, `muted`. |
| `Card` / `CardTitle` | Contenedor con borde y padding estándar para admin. |
| `Spinner` | Indicador de carga SVG animado. |
| `Modal` | Overlay genérico (disponible, aún no en uso activo). |

---

## Server Actions

### Públicas

| Archivo | Función | Efecto |
|---|---|---|
| `lib/actions/rsvp.ts` | `submitRSVP` | INSERT en `guests` + `guest_messages`. Retorna `guestId`. |
| `lib/actions/gifts.ts` | `submitGift` | INSERT en `gift_transactions`. |

Ambas usan la firma `(prevState: State, formData: FormData)` requerida por `useActionState` de React 19.

### Admin

| Archivo | Funciones |
|---|---|
| `lib/actions/admin/guests.ts` | `addAdminNote` |
| `lib/actions/admin/messages.ts` | `approveMessage`, `hideMessage` |
| `lib/actions/admin/gifts.ts` | `verifyGift`, `rejectGift` |
| `lib/actions/admin/settings.ts` | `updateWeddingSettings` |

Todas usan `createAdminClient()` (service role).

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

---

## Flujo del invitado

```
1. Visita / → ve la landing page completa
2. Llena RSVPForm → submitRSVP() → redirige a /gift?guestId=UUID
3. Ve GiftQRCode (QR + métodos de pago)
4. Opcionalmente llena GiftSubmissionForm → submitGift()
```

## Flujo del admin (Alexa)

```
1. Visita /admin → proxy.ts redirige a /admin/login si no hay sesión
2. Login con email+password de Supabase Auth
3. Panel principal → stats en tiempo real
4. /admin/guests → tabla completa, exportar CSV
5. /admin/guests/:id → perfil, notas, historial de regalos y mensajes
6. /admin/messages → aprobar/publicar/despublicar mensajes para el carrusel
7. /admin/gifts → verificar o rechazar regalos registrados
8. /admin/settings → editar datos de la boda (QR code, instrucciones, etc.)
```

---

## Pendiente / Ideas futuras

- [ ] Configurar las variables de Supabase en Vercel (`ktiams-projects/alexa-wed-invitation`) y redesplegar: producción muestra "Proximamente"
- [ ] Crear el usuario admin de Alexa en Supabase Auth y probar `/admin`
- [ ] Subir QR code real a Supabase Storage y actualizar `gift_qr_url` desde settings
- [ ] Agregar mapa embebido de Hacienda El Mabú en `VenueSection` (hoy hay enlaces a ficha y ruta de Google Maps)
- [ ] Confirmación por email al invitado tras RSVP (Supabase Edge Function + Resend)
- [ ] Paginación en la tabla de invitados (cuando supere ~100 registros)
- [ ] Export detallado de regalos en CSV separado
- [ ] Screenshot upload para comprobante de regalo (`screenshot_url` ya existe en el schema)
- [ ] Aprobar con la novia la selección y el orden de las 16 fotos de la galería Love Story
