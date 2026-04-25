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
  created_at: string;
  updated_at: string;
}

// Joined type for admin guest table view
export interface GuestWithDetails extends Guest {
  gift_transactions?: GiftTransaction[];
  guest_messages?: GuestMessage[];
}

// Dashboard aggregate stats
export interface DashboardStats {
  total_attending: number;
  total_not_attending: number;
  total_pending: number;
  total_companions: number;
  estimated_attendance: number;
  total_gifts_submitted: number;
  total_gifts_verified_amount: number;
  pending_gift_verifications: number;
  pending_messages: number;
}
