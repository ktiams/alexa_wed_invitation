import QRCode from "qrcode";
import { createAdminClient } from "@/lib/supabase/admin";
import { SITE_URL } from "@/lib/event";

// Álbum de fotos de los invitados. Ver supabase/migrations/002_album.sql.
// Solo para el servidor: usa la service role.

export const ALBUM_BUCKET = "album";
export const MAX_PHOTOS_PER_GUEST = 8;
export const UPLOADER_COOKIE = "aa_album_uid";
/** A dónde lleva el QR de las mesas. */
export const ALBUM_UPLOAD_URL = `${SITE_URL}/album/subir`;

/** QR del álbum en SVG, color cacao. Para el panel y la tarjeta de mesa. */
export function albumQrSvg(): Promise<string> {
  return QRCode.toString(ALBUM_UPLOAD_URL, {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: "#4a3830", light: "#ffffff" },
  });
}

/** Cuánto duran las URLs firmadas para ver fotos (segundos). */
const VIEW_URL_TTL = 60 * 60;

export type PhotoStatus = "pending" | "approved" | "rejected";

export interface AlbumPhoto {
  id: string;
  uploader_name: string;
  uploader_key: string;
  storage_path: string;
  thumb_path: string;
  width: number | null;
  height: number | null;
  status: PhotoStatus;
  created_at: string;
}

export interface AlbumPhotoWithUrls extends AlbumPhoto {
  url: string;
  thumbUrl: string;
}

export interface AlbumSettings {
  /** false si todavía no se aplicó la migración 002 en Supabase. */
  ready: boolean;
  uploadEnabled: boolean;
  published: boolean;
}

// El álbum se abre solo por fecha (hora de Puerto Rico): los novios no tienen interruptores.
// La subida abre el día de la boda y el álbum se muestra desde el día siguiente, solo con
// las fotos aprobadas. Los campos photo_upload_enabled y album_published de
// wedding_settings siguen sirviendo para abrirlo antes a mano desde Supabase (pruebas).
export const UPLOAD_OPENS_AT = new Date("2026-12-05T00:00:00-04:00");
export const ALBUM_OPENS_AT = new Date("2026-12-06T00:00:00-04:00");

export async function getAlbumSettings(): Promise<AlbumSettings> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("wedding_settings")
    .select("photo_upload_enabled, album_published")
    .limit(1)
    .single();
  if (error || !data) return { ready: false, uploadEnabled: false, published: false };
  const now = Date.now();
  return {
    ready: true,
    uploadEnabled: Boolean(data.photo_upload_enabled) || now >= UPLOAD_OPENS_AT.getTime(),
    published: Boolean(data.album_published) || now >= ALBUM_OPENS_AT.getTime(),
  };
}

export async function countUploads(uploaderKey: string): Promise<number> {
  const supabase = createAdminClient();
  const { count } = await supabase
    .from("album_photos")
    .select("id", { count: "exact", head: true })
    .eq("uploader_key", uploaderKey);
  return count ?? 0;
}

/** Agrega URLs firmadas (foto y miniatura) a cada fila. */
export async function withSignedUrls(photos: AlbumPhoto[]): Promise<AlbumPhotoWithUrls[]> {
  if (photos.length === 0) return [];
  const supabase = createAdminClient();
  const paths = photos.flatMap((p) => [p.storage_path, p.thumb_path]);
  const { data } = await supabase.storage.from(ALBUM_BUCKET).createSignedUrls(paths, VIEW_URL_TTL);
  const byPath = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return photos
    .map((p) => ({ ...p, url: byPath.get(p.storage_path) ?? "", thumbUrl: byPath.get(p.thumb_path) ?? "" }))
    .filter((p) => p.url && p.thumbUrl);
}

export async function listPhotos(status: PhotoStatus, limit = 200): Promise<AlbumPhoto[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("album_photos")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: status !== "approved" })
    .limit(limit);
  return (data ?? []) as AlbumPhoto[];
}

/** Fotos esperando aprobación (número en la pestaña Autorizaciones). 0 si falta la migración. */
export async function countPending(): Promise<number> {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from("album_photos")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");
  return error ? 0 : (count ?? 0);
}

export async function countByStatus(): Promise<Record<PhotoStatus, number>> {
  const supabase = createAdminClient();
  const statuses: PhotoStatus[] = ["pending", "approved", "rejected"];
  const counts = await Promise.all(
    statuses.map((status) =>
      supabase.from("album_photos").select("id", { count: "exact", head: true }).eq("status", status)
    )
  );
  return {
    pending: counts[0].count ?? 0,
    approved: counts[1].count ?? 0,
    rejected: counts[2].count ?? 0,
  };
}
