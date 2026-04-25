"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function verifyGift(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("gift_transactions")
    .update({ status: "verified" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gifts");
}

export async function rejectGift(id: string) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("gift_transactions")
    .update({ status: "rejected" })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/gifts");
}
