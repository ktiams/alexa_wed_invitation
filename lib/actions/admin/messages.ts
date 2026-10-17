"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { revalidatePath } from "next/cache";

export async function approveMessage(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("guest_messages")
    .update({ is_approved: true, is_public: true })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function hideMessage(id: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("guest_messages")
    .update({ is_public: false })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
