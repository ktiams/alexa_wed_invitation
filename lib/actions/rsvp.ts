"use server";

import { createClient } from "@/lib/supabase/server";
import { rsvpSchema } from "@/lib/utils/validation";

export interface RSVPResult {
  success: boolean;
  guestId?: string;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function submitRSVP(
  _prevState: RSVPResult,
  formData: FormData
): Promise<RSVPResult> {
  const raw = {
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    attendance_status: formData.get("attendance_status"),
    has_plus_one: formData.get("has_plus_one") === "true",
    plus_one_name: formData.get("plus_one_name") || undefined,
    message: formData.get("message") || undefined,
    adults_only_acknowledged: formData.get("adults_only_acknowledged") === "on",
    dress_code_acknowledged: formData.get("dress_code_acknowledged") === "on",
  };

  const parsed = rsvpSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    parsed.error.issues.forEach((issue) => {
      const key = issue.path[0] as string;
      if (!fieldErrors[key]) fieldErrors[key] = [];
      fieldErrors[key].push(issue.message);
    });
    return { success: false, fieldErrors };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const { data: guest, error: guestError } = await supabase
    .from("guests")
    .insert({
      full_name: data.full_name,
      phone: data.phone,
      email: data.email,
      attendance_status: data.attendance_status,
      has_plus_one: data.has_plus_one,
      plus_one_name: data.has_plus_one ? data.plus_one_name || null : null,
      adults_only_acknowledged: data.adults_only_acknowledged,
      dress_code_acknowledged: data.dress_code_acknowledged,
    })
    .select("id")
    .single();

  if (guestError || !guest) {
    return { success: false, error: "Failed to save your RSVP. Please try again." };
  }

  if (data.message?.trim()) {
    await supabase.from("guest_messages").insert({
      guest_id: guest.id,
      guest_name: data.full_name,
      message: data.message.trim(),
      is_approved: false,
      is_public: false,
    });
  }

  return { success: true, guestId: guest.id };
}
