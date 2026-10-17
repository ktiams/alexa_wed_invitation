"use server";

import { createClient } from "@/lib/supabase/server";

export interface GiftResult {
  success: boolean;
  error?: string;
}

export async function submitGift(
  _prevState: GiftResult,
  formData: FormData
): Promise<GiftResult> {
  const guest_id = formData.get("guest_id") as string | null;
  const amount_raw = formData.get("amount") as string | null;
  const method = formData.get("method") as string;
  const reference_note = formData.get("reference_note") as string | null;

  if (!method) {
    return { success: false, error: "Elige el método de pago." };
  }

  const amount = amount_raw ? parseFloat(amount_raw) : null;
  if (amount !== null && isNaN(amount)) {
    return { success: false, error: "Escribe una cantidad válida." };
  }

  const supabase = await createClient();

  const { error } = await supabase.from("gift_transactions").insert({
    guest_id: guest_id || undefined,
    amount: amount ?? null,
    method,
    reference_note: reference_note?.trim() || null,
    status: "pending",
  });

  if (error) {
    return { success: false, error: "No pudimos guardar el aviso. Inténtalo de nuevo en un momento." };
  }

  return { success: true };
}
