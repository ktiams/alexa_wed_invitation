"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { revalidatePath } from "next/cache";

export async function verifyGift(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("gift_transactions")
    .update({ status: "verified" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gifts");
}

export async function rejectGift(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("gift_transactions")
    .update({ status: "rejected" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gifts");
}
