# Traspaso del proyecto — estado al 17 de octubre de 2026

Invitación digital de boda de **Anthony Ugarte y Alexandra Vargas** (5 de diciembre de 2026, 4:00 PM, Hacienda El Mabú, San Sebastián, PR).
Este archivo resume dónde está todo y qué falta. La arquitectura, base de datos y diseño están en `PROJECT.md`.
Desde el 17 de octubre se trabaja con Claude Code.

---

## 1. Dónde está cada cosa

| Pieza | Dónde | Estado |
|---|---|---|
| Código | GitHub `ktiams/alexa_wed_invitation`, rama `master` | Producción. Next.js 16 + Supabase. |
| Rama `rediseno-movil` | Mismo repo | Rediseño mobile first + paleta nude (ver sección 3). Fusionada en `master` (fast-forward) y en producción desde el 18 oct 2026. |
| Rama `claude/en-que-te-quedaste-c5b005` | Mismo contenido que un `master` viejo | Se puede borrar. |
| PR #1 "nueva invitación Luxe" (ramas `feature/luxe-*`) | Reescritura en Vinext/Vite de agosto | **Descartada.** Cerrar el PR sin merge. |
| Base de datos | Supabase, proyecto ref **`pjyaqjjpmjesjwbbmifz`** ("Alexas Wedding Invite's Project", org "Senzai- Katia's Department") | Esquema `001_initial_schema.sql` aplicado. Tablas sin datos al 17 oct. |
| Hosting | Vercel, proyecto `alexa-wed-invitation` en el scope **`ktiams-projects`** | Despliega solo con cada push a `master`; cada rama empujada genera un preview. Producción: https://alexa-wed-invitation.vercel.app |

### Cuentas

- **GitHub**: dueña del repo `ktiams`. Desde el 17 oct **`cheloman04`** es colaborador con permiso de push. En la laptop, git firma como `cheloman04` / `bizdev4uai@gmail.com` (solo en este repo).
- **Vercel**: el proyecto está en la cuenta que entra con "Continue with GitHub" como `ktiams`. La cuenta `ktiams-16@hotmail.com` es otra y no ve el proyecto.
- **Supabase**: el dashboard del proyecto abre en el Chrome de la laptop.
- No hay `gh`, `vercel` ni `supabase` CLI instalados.

---

## 2. Arrancar en una máquina nueva

```bash
git clone https://github.com/ktiams/alexa_wed_invitation.git
cd alexa_wed_invitation
npm install          # Node 22 o superior
```

Crear `.env.local` en la raíz (no se commitea) con estas tres variables. Los valores salen de Supabase → Project Settings → API del proyecto `pjyaqjjpmjesjwbbmifz`:

```
NEXT_PUBLIC_SUPABASE_URL=https://pjyaqjjpmjesjwbbmifz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Sin ellas la home muestra solo "Próximamente" (es el fallback cuando no puede leer `wedding_settings`).

```bash
npm run dev      # http://localhost:3000 (en Claude Code: preview "next-dev" de .claude/launch.json)
npm run lint
npm run build    # correr antes de dar una feature por terminada
```

El panel `/admin` usa Supabase Auth (email + contraseña). Usuarios existentes: `bizdev4uai@gmail.com` y `kmatos_santana@gmail.com`.

---

## 3. Pendiente inmediato (en orden)

### Rediseño mobile first (17–18 oct 2026, en producción)

Hecho y verificado en local (lint, TypeScript y build pasan; capturas en tamaño iPhone y escritorio):

- Paleta nude (ivory, beige, nude rosado, champán, dorado + cacao y taupe) en la invitación y en el panel.
- Portada "foto protagonista" con "Confirmar asistencia", "Agregar al calendario" (Google o `.ics` en `/calendario`, sin hora de fin; el menú abre hacia arriba) y días que faltan. En el celular cabe completa en una pantalla y se ajusta al alto de cada teléfono.
- Barra fija para confirmar.
- "Cuándo y dónde" (fecha, hora, lugar, Google Maps, Waze, calendario, cuenta regresiva) y "Lo que debes saber" (código de vestimenta nuevo y aviso para adultos con un texto cálido).
- RSVP: Sí/No primero, máximo un acompañante con nombre obligatorio, confirmaciones solo para quien asiste, campos de 16 px. Corregido el guardado (RLS impedía el `.insert().select()`).
- Regalo: número de ATH Móvil de Alexa con botón "Copiar número" (cuenta personal; ver `PROJECT.md` → "Regalo por ATH Móvil").
- Español en toda la página, `lang="es"`, foto y textos para compartir el enlace.
- La galería Love Story queda igual y oscura, por decisión de los novios.
- Destellos dorados de fondo con profundidad (`components/ui/sparkles.tsx`, sin dependencias nuevas) en "Cuándo y dónde" y en el RSVP; los nombres de la portada llevan borde dorado y relieve (`names-3d`).
- Botones perla (`components/ui/pearl-button.tsx`): cacao para los principales y champán para "Agregar al calendario".
- Sobre de bienvenida (`EnvelopeIntro`), portada con caligrafía dorada y flores, carrusel automático de looks.
- Álbum de fotos completo (`/album/subir`, `/album`, `/admin/fotos`, sección `#album`). **Falta aplicar `supabase/migrations/002_album.sql`** en el SQL Editor de Supabase; hasta entonces todo muestra "se activa el día de la boda".
- Todas las Server Actions del panel exigen sesión (`requireAdmin`); antes cualquiera podía llamarlas.
- La página bajó de 10.3 a unas 6.5 pantallas en un iPhone.

Falta:

1. ~~Empujar la rama y fusionar a `master`~~: en producción desde el 18 oct 2026.
2. ~~Probar un RSVP real~~: hecho el 18 oct 2026 en producción (asiste + acompañante + mensaje). Se guardó bien y se borró.
3. Foto del venue: guardarla en `public/images/venue/` y llenar `VENUE.photo` en `lib/venue.ts`.
4. **Álbum de fotos**: código listo. Aplicar `supabase/migrations/002_album.sql` en Supabase → SQL Editor (es aditiva) y probar una subida real.
5. Pasar a español `wedding_settings.dress_code` y `gift_instructions`.
6. Lo demás de la lista "Pendiente" de `PROJECT.md`.

---

## 4. Cómo se trabaja en este repo

- **Next.js 16**: las APIs cambiaron respecto a versiones anteriores. Leer la guía correspondiente en `node_modules/next/dist/docs/` antes de usar una API (ver `AGENTS.md`). Ejemplo: `proxy.ts` reemplaza a `middleware.ts`.
- **Diseño**: tokens de Tailwind v4 en `app/globals.css` (`@theme inline`). `tailwind.config.ts` no lo carga Tailwind v4. Fuentes Cormorant Garamond (`font-display`, y también `font-sans`) e Inter (`font-body`). Las secciones públicas están en `components/public/`.
- **Antes de cambiar el diseño**: los novios quieren ver primero una propuesta visual y aprobarla.
- **Datos del evento y del venue**: `lib/event.ts` (fecha, hora, calendario, `SITE_URL`) y `lib/venue.ts` (nombre, barrio, coordenadas, Google Maps, Waze, foto). `wedding_settings` en Supabase guarda también `venue_name` y `venue_city` para el admin; si cambia el venue, actualizar ambos.
- **Fotos**: `public/images/hero.jpeg` (portada, `object-cover` centrado en la pareja), `public/images/love-story/love-01..16.jpeg` (galería; el número está en `PHOTO_COUNT` dentro de `LoveStorySection.tsx`) y `public/images/dress-code/` (código de vestimenta; original en `docs/referencias/`).
- **Migraciones de base de datos**: crear `supabase/migrations/NNN_nombre.sql` y aplicarla con `scripts/supabase-migrate.ps1 -File supabase\migrations\NNN_nombre.sql` (pide un Personal Access Token de Supabase; crearlo para la ocasión y borrarlo después) o pegando el SQL en el SQL Editor del dashboard.
- **Finales de línea**: git usa `core.autocrlf=true`; el repo guarda LF y la copia de trabajo CRLF. No mezclar a mano.
- **Git worktrees**: `next.config.ts` fija `turbopack.root` al directorio del proyecto; sin eso, dentro de un worktree bajo `.claude/` el watcher no recompilaba el CSS.
- **PC de escritorio (16 GB de RAM)**: un solo servidor de desarrollo a la vez. El 16 de octubre `next dev` murió con "JavaScript heap out of memory", lo que apunta a un `NODE_OPTIONS` mal formado en esa máquina. En la laptop no aplica.
- **Build**: a veces falla una vez al descargar Google Fonts (`next/font/google`); repetirlo.
- **CSS viejo en `next dev`**: si un cambio de `globals.css` no aparece ni reiniciando, la caché de Turbopack quedó vieja. Parar el servidor, borrar `.next/dev` y volver a arrancar.
- **Ver `next dev` en el teléfono**: por la IP de Tailscale (`http://100.122.160.5:3000`). Esa IP está en `allowedDevOrigins` de `next.config.ts`; sin eso Next 16 bloquea los scripts y nada interactivo funciona.

---

## 5. Decisiones tomadas

- Se continúa sobre Next.js + Supabase. La reescritura Luxe en Vinext se descartó porque eliminaba RSVP, regalos, mensajes y admin.
- De Luxe se portó solo la galería Love Story (16 fotos).
- Venue: **Hacienda El Mabú**, Barrio Pozas, San Sebastián, PR 00586 (18.3229211, -67.0164977).
- 17 oct 2026, rediseño mobile first (el 90 % de los invitados entra desde el celular): aprobados portada con botones, barra fija, información junta y español; la galería se queda como está; RSVP con un acompañante como máximo; regalo solo por ATH Móvil.
- Paleta "boda nude elegante" con portada clara, también en el panel.
- Código de vestimenta: casual elegante, solamente blanco, crema o rosa, sin otros colores ni brillos.
- Calendario sin hora de fin hasta que los novios la definan.
- 18 oct 2026: portada "A" (foto protagonista con el texto encima). Lo más importante es que se adapte a cada teléfono: en el celular la portada completa (título, nombres, fecha, lugar y los dos botones) cabe en una pantalla.

---

## 6. Prompt sugerido para retomar

> Lee `AGENTS.md`, `HANDOFF.md` y `PROJECT.md`. Confirma que `npm run build` pasa. Sigue con el punto 1 de "Pendiente inmediato" en `HANDOFF.md` y actualiza `HANDOFF.md` y `PROJECT.md` con lo que cambies.
