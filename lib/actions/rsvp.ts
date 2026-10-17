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
  const attending = data.attendance_status === "attending";
  const withPlusOne = attending && data.has_plus_one;
  const supabase = await createClient();

  // El id se genera aquí: RLS solo permite INSERT a los invitados (no SELECT),
  // así que no podemos pedir la fila de vuelta con .select().
  const guestId = crypto.randomUUID();

  const { error: guestError } = await supabase.from("guests").insert({
    id: guestId,
    full_name: data.full_name,
    phone: data.phone,
    email: data.email,
    attendance_status: data.attendance_status,
    has_plus_one: withPlusOne,
    plus_one_name: withPlusOne ? data.plus_one_name : null,
    adults_only_acknowledged: attending && data.adults_only_acknowledged,
    dress_code_acknowledged: attending && data.dress_code_acknowledged,
  });

  if (guestError) {
    return { success: false, error: "No pudimos guardar tu respuesta. Inténtalo de nuevo en un momento." };
  }

  if (data.message?.trim()) {
    await supabase.from("guest_messages").insert({
      guest_id: guestId,
      guest_name: data.full_name,
      message: data.message.trim(),
      is_approved: false,
      is_public: false,
    });
  }

  return { success: true, guestId };
}
