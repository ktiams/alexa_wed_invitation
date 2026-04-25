-- ─── GUESTS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guests (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name                 TEXT NOT NULL,
  phone                     TEXT,
  email                     TEXT,
  attendance_status         TEXT NOT NULL DEFAULT 'pending'
                            CHECK (attendance_status IN ('attending', 'not_attending', 'pending')),
  has_plus_one              BOOLEAN NOT NULL DEFAULT false,
  plus_one_name             TEXT,
  adults_only_acknowledged  BOOLEAN NOT NULL DEFAULT false,
  dress_code_acknowledged   BOOLEAN NOT NULL DEFAULT false,
  admin_notes               TEXT,
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── GIFT TRANSACTIONS ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gift_transactions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id        UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
  amount          NUMERIC(10, 2),
  method          TEXT NOT NULL,
  reference_note  TEXT,
  screenshot_url  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── GUEST MESSAGES ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS guest_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id    UUID REFERENCES guests(id) ON DELETE SET NULL,
  guest_name  TEXT NOT NULL,
  message     TEXT NOT NULL,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  is_public   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── WEDDING SETTINGS ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS wedding_settings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_name       TEXT NOT NULL DEFAULT 'Anthony & Alexandra',
  bride_name        TEXT NOT NULL DEFAULT 'Alexandra Vargas',
  groom_name        TEXT NOT NULL DEFAULT 'Anthony Ugarte',
  wedding_date      TIMESTAMPTZ NOT NULL DEFAULT '2026-12-05T16:00:00-04:00',
  venue_name        TEXT NOT NULL DEFAULT 'Finca Amada',
  venue_city        TEXT NOT NULL DEFAULT 'San Sebastián',
  venue_country     TEXT NOT NULL DEFAULT 'Puerto Rico',
  dress_code        TEXT NOT NULL DEFAULT 'White, casual elegant. No sparkle, no glitter, no shine.',
  gift_qr_url       TEXT,
  gift_instructions TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── UPDATED_AT TRIGGER ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_guests_updated_at
  BEFORE UPDATE ON guests
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_gift_transactions_updated_at
  BEFORE UPDATE ON gift_transactions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_guest_messages_updated_at
  BEFORE UPDATE ON guest_messages
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_wedding_settings_updated_at
  BEFORE UPDATE ON wedding_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
ALTER TABLE guests            ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_settings  ENABLE ROW LEVEL SECURITY;

-- GUESTS
CREATE POLICY "guests_public_insert"
  ON guests FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "guests_admin_all"
  ON guests FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- GIFT TRANSACTIONS
CREATE POLICY "gifts_public_insert"
  ON gift_transactions FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "gifts_admin_all"
  ON gift_transactions FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- GUEST MESSAGES
CREATE POLICY "messages_public_insert"
  ON guest_messages FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "messages_public_read_approved"
  ON guest_messages FOR SELECT TO anon
  USING (is_approved = true AND is_public = true);

CREATE POLICY "messages_admin_all"
  ON guest_messages FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- WEDDING SETTINGS
CREATE POLICY "settings_public_read"
  ON wedding_settings FOR SELECT TO anon USING (true);

CREATE POLICY "settings_admin_all"
  ON wedding_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ─── SEED WEDDING SETTINGS ────────────────────────────────────────────────────
INSERT INTO wedding_settings (
  couple_name, bride_name, groom_name, wedding_date,
  venue_name, venue_city, venue_country, dress_code,
  gift_instructions
) VALUES (
  'Anthony & Alexandra',
  'Alexandra Vargas',
  'Anthony Ugarte',
  '2026-12-05T16:00:00-04:00',
  'Finca Amada',
  'San Sebastián',
  'Puerto Rico',
  'White, casual elegant. No sparkle, no glitter, no shine.',
  'You may send a gift via ATH Móvil, PayPal, or Zelle using the QR code below. After sending, please fill out the form to let us know.'
);
