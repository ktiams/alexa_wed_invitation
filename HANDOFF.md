# Traspaso del proyecto — estado al 16 de octubre de 2026

Invitación digital de boda de **Anthony Ugarte y Alexandra Vargas** (5 de diciembre de 2026, 4:00 PM, Hacienda El Mabú, San Sebastián, PR).
Este archivo resume dónde está todo y qué falta. La arquitectura, base de datos y diseño están en `PROJECT.md`.

---

## 1. Dónde está cada cosa

| Pieza | Dónde | Estado |
|---|---|---|
| Código | GitHub `ktiams/alexa_wed_invitation`, rama `master` | Al día. Es la versión Next.js 16 + Supabase. |
| Rama `claude/en-que-te-quedaste-c5b005` | Mismo contenido que `master` | Se puede borrar. |
| PR #1 "nueva invitación Luxe" (ramas `feature/luxe-*`) | Reescritura en Vinext/Vite hecha en agosto | **Descartada.** La galería Love Story ya se portó a `master`. Cerrar el PR sin merge. |
| Base de datos | Supabase, proyecto ref **`pjyaqjjpmjesjwbbmifz`** | Esquema `001_initial_schema.sql` aplicado. `wedding_settings` ya dice Hacienda El Mabú. |
| Hosting | Vercel, proyecto `alexa-wed-invitation` en el scope **`ktiams-projects`** | Despliega solo con cada push a `master`. Producción: https://alexa-wed-invitation.vercel.app |

### Cuentas (importante, hay varias parecidas)

- **GitHub `ktiams`**: dueña del repo. `cheloman04` todavía **no** tiene acceso; está pendiente decidir si se transfiere el repo o se añade como colaborador.
- **Vercel**: el proyecto está en la cuenta de Vercel que entra con "Continue with GitHub" como `ktiams`. La cuenta `ktiams-16@hotmail.com` es otra (scope `ktiams-16-6676s-projects`) y no ve el proyecto.
- **Supabase**: el proyecto `pjyaqjjpmjesjwbbmifz` está en una cuenta distinta a `senzaiautomations@gmail.com`. El proyecto viejo `ldyhqalsbjlqkttnxcwq` ya no existe.

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

Sin ellas la home muestra solo "Proximamente" (es el fallback cuando no puede leer `wedding_settings`).

```bash
npm run dev      # http://localhost:3000
npm run lint
npm run build    # correr antes de dar una feature por terminada
```

El panel `/admin` usa Supabase Auth (email + contraseña). Si no existe usuario, crearlo en Supabase → Authentication → Users.

---

## 3. Pendiente inmediato (en orden)

1. **Vercel → Settings → Environment Variables**: poner las tres variables de arriba (Production, Preview y Development) y hacer **Redeploy** del último despliegue de `master`. Hoy producción muestra "Proximamente" porque las variables apuntan al proyecto Supabase viejo o faltan.
2. Verificar producción: hero con la foto completa, galería Love Story, venue Hacienda El Mabú con los enlaces de Maps, y enviar un RSVP de prueba para confirmar que llega a Supabase.
3. Crear el usuario admin de Alexa en Supabase Auth y probar `/admin`.
4. Decidir cuenta de GitHub (transferir a `cheloman04` o añadirlo como colaborador) y, si se transfiere, reconectar Vercel al repo nuevo.
5. Lo de la lista "Pendiente" de `PROJECT.md`: QR real de pago, mapa embebido del venue, confirmación por email tras RSVP, subida de comprobante de regalo, aprobación de la selección y orden de fotos con la novia.

---

## 4. Cómo se trabaja en este repo

- **Next.js 16**: las APIs cambiaron respecto a versiones anteriores. Leer la guía correspondiente en `node_modules/next/dist/docs/` antes de usar una API (ver `AGENTS.md`). Ejemplo: `proxy.ts` reemplaza a `middleware.ts`.
- **Diseño**: tokens de Tailwind v4 en `app/globals.css` (`@theme inline`). Fuentes Cormorant Garamond (`font-display`) e Inter (`font-body`). Las secciones públicas están en `components/public/`.
- **Datos del venue**: solo en `lib/venue.ts` (nombre, barrio, coordenadas, enlaces de Google Maps). `wedding_settings` en Supabase guarda también `venue_name` y `venue_city` para el admin; si cambia el venue, actualizar ambos.
- **Fotos**: `public/images/hero.jpeg` (hero, se muestra completa con `object-contain`) y `public/images/love-story/love-01..16.jpeg` (galería; el número de fotos está en `PHOTO_COUNT` dentro de `LoveStorySection.tsx`).
- **Migraciones de base de datos**: crear `supabase/migrations/NNN_nombre.sql` y aplicarla con `scripts/supabase-migrate.ps1 -File supabase\migrations\NNN_nombre.sql`. El script pide un Personal Access Token de Supabase (Account → Access Tokens); crearlo para la ocasión y borrarlo después. Alternativa: pegar el SQL en el SQL Editor del dashboard.
- **Finales de línea**: en la PC de escritorio git usa `core.autocrlf=true`, así que el repo guarda LF y la copia de trabajo CRLF. No mezclar a mano.
- **Git worktrees**: `next.config.ts` fija `turbopack.root` al directorio del proyecto; sin eso, dentro de un worktree bajo `.claude/` el watcher no recompilaba el CSS. Si un cambio de CSS no aparece, reiniciar `next dev`.
- **PC de escritorio (16 GB de RAM)**: un solo servidor de desarrollo a la vez; no correr `build` ni `tsc` con el servidor encendido. El 16 de octubre `next dev` murió al arrancar con "JavaScript heap out of memory" con el heap en apenas 5 MB, lo que apunta a un `NODE_OPTIONS` mal formado a nivel de usuario en esa máquina. Revisarlo si se repite; en la laptop no aplica.

---

## 5. Decisiones tomadas

- Se continúa sobre `master` (Next.js + Supabase). La reescritura Luxe en Vinext se descartó porque eliminaba RSVP, regalos, mensajes y admin.
- De Luxe se portó solo la galería Love Story (14 fotos) más 3 fotos nuevas de WhatsApp; una de las 14 estaba duplicada, por eso son 16.
- Hero: la foto de la pareja en el auto al atardecer, mostrada entera (sin recorte) sobre un fondo difuminado de la misma foto. En pantallas grandes el texto va en una franja inferior; en móvil y tablet la foto va arriba y el texto debajo.
- Venue cambiado de Finca Amada a **Hacienda El Mabú**, Barrio Pozas, San Sebastián, PR 00586 (18.3229211, -67.0164977). No queda ninguna referencia al anterior.

---

## 6. Prompt sugerido para retomar con Codex

> Lee `AGENTS.md`, `HANDOFF.md` y `PROJECT.md`. Confirma que `npm run build` pasa. Luego empieza por el punto 2 de "Pendiente inmediato" en `HANDOFF.md` y actualiza `HANDOFF.md` y `PROJECT.md` con lo que cambies.
