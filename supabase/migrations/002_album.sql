-- ─── ÁLBUM DE FOTOS DE LOS INVITADOS (oct 2026) ─────────────────────────────
-- Los invitados suben hasta 8 fotos cada uno desde /album/subir (QR en las mesas).
-- Todas quedan en revisión; los novios las aprueban en /admin/fotos y solo las
-- aprobadas se ven en /album y en la invitación.
--
-- Los archivos van a un bucket PRIVADO ("album"). La app sube con URLs firmadas
-- y muestra con URLs firmadas, siempre desde el servidor con la service role,
-- así que no hacen falta políticas de Storage para anon.
-- Es aditiva: no toca datos existentes. Se puede ejecutar más de una vez.

-- Interruptores en la configuración de la boda
ALTER TABLE wedding_settings
  ADD COLUMN IF NOT EXISTS photo_upload_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS album_published      BOOLEAN NOT NULL DEFAULT false;

-- Fotos subidas por los invitados
CREATE TABLE IF NOT EXISTS album_photos (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploader_name TEXT NOT NULL CHECK (char_length(uploader_name) BETWEEN 2 AND 80),
  uploader_key  UUID NOT NULL,           -- id anónimo del celular (cookie), para el límite de 8
  storage_path  TEXT NOT NULL UNIQUE,    -- foto reducida (máx. 1600 px)
  thumb_path    TEXT NOT NULL UNIQUE,    -- miniatura (máx. 480 px)
  width         INTEGER,
  height        INTEGER,
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS album_photos_uploader_idx ON album_photos (uploader_key);
CREATE INDEX IF NOT EXISTS album_photos_status_idx   ON album_photos (status, created_at DESC);

DROP TRIGGER IF EXISTS trg_album_photos_updated_at ON album_photos;
CREATE TRIGGER trg_album_photos_updated_at
  BEFORE UPDATE ON album_photos
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS: anon no tiene acceso directo; todo pasa por Server Actions con service role.
ALTER TABLE album_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "album_photos_admin_all" ON album_photos;
CREATE POLICY "album_photos_admin_all"
  ON album_photos FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Bucket privado para las fotos (8 MB por archivo, solo JPEG/WebP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('album', 'album', false, 8388608, ARRAY['image/jpeg', 'image/webp'])
ON CONFLICT (id) DO NOTHING;
