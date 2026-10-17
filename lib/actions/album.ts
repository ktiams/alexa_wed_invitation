"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import {
  ALBUM_BUCKET,
  MAX_PHOTOS_PER_GUEST,
  UPLOADER_COOKIE,
  countUploads,
  getAlbumSettings,
} from "@/lib/album";

// ─── Invitados ────────────────────────────────────────────────────────────────
// Flujo: startAlbumUpload pide permiso para N fotos y devuelve URLs firmadas de subida;
// el navegador reduce cada foto y la sube directo a Storage; finishAlbumUpload
// registra las que llegaron. El límite de 8 se valida aquí, en el servidor, por celular
// (cookie anónima), no solo en la pantalla.

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export interface UploadSlot {
  id: string;
  path: string;
  token: string;
  thumbPath: string;
  thumbToken: string;
}

export type StartUploadResult =
  | { ok: true; slots: UploadSlot[]; remaining: number }
  | { ok: false; error: string; remaining?: number };

export type FinishUploadResult = { ok: true; saved: number; remaining: number } | { ok: false; error: string };

async function uploaderKey(create: boolean): Promise<string | null> {
  const store = await cookies();
  const existing = store.get(UPLOADER_COOKIE)?.value;
  if (existing && UUID_RE.test(existing)) return existing;
  if (!create) return null;
  const key = crypto.randomUUID();
  store.set(UPLOADER_COOKIE, key, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  return key;
}

function cleanName(name: unknown) {
  return typeof name === "string" ? name.trim().replace(/\s+/g, " ").slice(0, 80) : "";
}

export async function startAlbumUpload(input: { name: string; count: number }): Promise<StartUploadResult> {
  const name = cleanName(input.name);
  if (name.length < 2) return { ok: false, error: "Escribe tu nombre para saber de quién son las fotos." };

  const settings = await getAlbumSettings();
  if (!settings.ready || !settings.uploadEnabled) {
    return { ok: false, error: "La subida de fotos todavía no está abierta. Se activa el día de la boda." };
  }

  const key = (await uploaderKey(true))!;
  const used = await countUploads(key);
  const remaining = Math.max(0, MAX_PHOTOS_PER_GUEST - used);
  const count = Math.floor(Number(input.count));
  if (!Number.isFinite(count) || count < 1) return { ok: false, error: "Elige al menos una foto.", remaining };
  if (count > remaining) {
    return {
      ok: false,
      error: remaining === 0 ? "Ya subiste tus 8 fotos. ¡Gracias!" : `Puedes subir ${remaining} foto${remaining === 1 ? "" : "s"} más.`,
      remaining,
    };
  }

  const supabase = createAdminClient();
  const slots: UploadSlot[] = [];
  for (let i = 0; i < count; i++) {
    const id = crypto.randomUUID();
    const path = `invitados/${key}/${id}.jpg`;
    const thumbPath = `invitados/${key}/${id}-mini.jpg`;
    const [full, thumb] = await Promise.all([
      supabase.storage.from(ALBUM_BUCKET).createSignedUploadUrl(path),
      supabase.storage.from(ALBUM_BUCKET).createSignedUploadUrl(thumbPath),
    ]);
    if (full.error || thumb.error || !full.data || !thumb.data) {
      return { ok: false, error: "No pudimos preparar la subida. Inténtalo de nuevo en un momento.", remaining };
    }
    slots.push({ id, path, token: full.data.token, thumbPath, thumbToken: thumb.data.token });
  }

  return { ok: true, slots, remaining };
}

export async function finishAlbumUpload(input: {
  name: string;
  items: { id: string; width: number; height: number }[];
}): Promise<FinishUploadResult> {
  const name = cleanName(input.name);
  const key = await uploaderKey(false);
  if (!key || name.length < 2) return { ok: false, error: "No pudimos identificar tu subida. Recarga la página." };

  const ids = input.items.map((item) => item.id).filter((id) => UUID_RE.test(id));
  if (ids.length === 0) return { ok: false, error: "No llegó ninguna foto." };

  // Solo se registran las fotos que de verdad están en Storage, en la carpeta de este celular.
  const supabase = createAdminClient();
  const { data: files } = await supabase.storage.from(ALBUM_BUCKET).list(`invitados/${key}`, { limit: 100 });
  const present = new Set((files ?? []).map((f) => f.name));

  const used = await countUploads(key);
  const room = Math.max(0, MAX_PHOTOS_PER_GUEST - used);

  const rows = input.items
    .filter((item) => UUID_RE.test(item.id) && present.has(`${item.id}.jpg`) && present.has(`${item.id}-mini.jpg`))
    .slice(0, room)
    .map((item) => ({
      uploader_name: name,
      uploader_key: key,
      storage_path: `invitados/${key}/${item.id}.jpg`,
      thumb_path: `invitados/${key}/${item.id}-mini.jpg`,
      width: Math.round(item.width) || null,
      height: Math.round(item.height) || null,
      status: "pending" as const,
    }));

  if (rows.length === 0) return { ok: false, error: "No pudimos guardar las fotos. Inténtalo de nuevo." };

  const { error } = await supabase.from("album_photos").insert(rows);
  if (error) return { ok: false, error: "No pudimos guardar las fotos. Inténtalo de nuevo." };

  revalidatePath("/admin/fotos");
  return { ok: true, saved: rows.length, remaining: Math.max(0, room - rows.length) };
}

// ─── Panel de los novios ──────────────────────────────────────────────────────

export async function setPhotoUploadEnabled(enabled: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("wedding_settings")
    .update({ photo_upload_enabled: enabled })
    .not("id", "is", null);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/fotos");
  revalidatePath("/album/subir");
  revalidatePath("/");
}

export async function setAlbumPublished(published: boolean) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("wedding_settings")
    .update({ album_published: published })
    .not("id", "is", null);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/fotos");
  revalidatePath("/album");
  revalidatePath("/");
}

export async function setPhotoStatus(ids: string[], status: "approved" | "rejected" | "pending") {
  await requireAdmin();
  const valid = ids.filter((id) => UUID_RE.test(id));
  if (valid.length === 0) return;
  const supabase = createAdminClient();
  const { error } = await supabase.from("album_photos").update({ status }).in("id", valid);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/fotos");
  revalidatePath("/album");
  revalidatePath("/");
}
