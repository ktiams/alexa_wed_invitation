export type AttendanceStatus = "attending" | "not_attending" | "pending";
export type GiftStatus = "pending" | "verified" | "rejected";

export interface Guest {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  attendance_status: AttendanceStatus;
  has_plus_one: boolean;
  plus_one_name: string | null;
  adults_only_acknowledged: boolean;
  dress_code_acknowledged: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface GiftTransaction {
  id: string;
  guest_id: string;
  amount: number | null;
  method: string;
  reference_note: string | null;
  screenshot_url: string | null;
  status: GiftStatus;
  created_at: string;
  updated_at: string;
}

export interface GuestMessage {
  id: string;
  guest_id: string | null;
  guest_name: string;
  message: string;
  is_approved: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface WeddingSettings {
  id: string;
  couple_name: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  venue_name: string;
  venue_city: string;
  venue_country: string;
  dress_code: string;
  gift_qr_url: string | null;
  gift_instructions: string | null;
  /** Migración 002: subida de fotos abierta (QR de las mesas). */
  photo_upload_enabled?: boolean;
  /** Migración 002: álbum visible en la invitación y en /album. */
  album_published?: boolean;
  created_at: string;
  updated_at: string;
}

// Invitado con sus avisos de regalo y su mensaje (lista de Invitados del panel)
export interface GuestWithDetails extends Guest {
  gift_transactions?: GiftTransaction[];
  guest_messages?: GuestMessage[];
}
