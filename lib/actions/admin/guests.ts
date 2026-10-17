"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import type { AttendanceStatus } from "@/lib/types/database";
import { revalidatePath } from "next/cache";

export async function updateGuest(
  id: string,
  data: {
    full_name?: string;
    phone?: string;
    email?: string;
    attendance_status?: AttendanceStatus;
    has_plus_one?: boolean;
    plus_one_name?: string | null;
    admin_notes?: string;
  }
) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase.from("guests").update(data).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/guests");
  revalidatePath(`/admin/guests/${id}`);
}

export async function addAdminNote(id: string, note: string) {
  await requireAdmin();
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("guests")
    .update({ admin_notes: note })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath(`/admin/guests/${id}`);
}
