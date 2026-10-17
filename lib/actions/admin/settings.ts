"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { WeddingSettings } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

export async function updateWeddingSettings(
  id: string,
  data: Partial<Omit<WeddingSettings, "id" | "created_at" | "updated_at">>
) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("wedding_settings")
    .update(data)
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/");
}
