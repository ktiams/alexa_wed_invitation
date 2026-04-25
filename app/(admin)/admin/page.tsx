import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardStatsGrid } from "@/components/admin/DashboardStats";
import type { DashboardStats } from "@/lib/types/database";

async function getStats(): Promise<DashboardStats> {
  const supabase = createAdminClient();

  const [guestsRes, giftsRes, messagesRes] = await Promise.all([
    supabase.from("guests").select("attendance_status, has_plus_one"),
    supabase.from("gift_transactions").select("status, amount"),
    supabase.from("guest_messages").select("is_approved"),
  ]);

  const guests = guestsRes.data ?? [];
  const gifts = giftsRes.data ?? [];
  const messages = messagesRes.data ?? [];

  const total_attending = guests.filter((g) => g.attendance_status === "attending").length;
  const total_not_attending = guests.filter((g) => g.attendance_status === "not_attending").length;
  const total_pending = guests.filter((g) => g.attendance_status === "pending").length;
  const total_companions = guests.filter((g) => g.has_plus_one).length;
  const estimated_attendance = total_attending + total_companions;

  const total_gifts_submitted = gifts.length;
  const verified_gifts = gifts.filter((g) => g.status === "verified");
  const total_gifts_verified_amount = verified_gifts.reduce(
    (sum, g) => sum + (g.amount ?? 0),
    0
  );
  const pending_gift_verifications = gifts.filter((g) => g.status === "pending").length;
  const pending_messages = messages.filter((m) => !m.is_approved).length;

  return {
    total_attending,
    total_not_attending,
    total_pending,
    total_companions,
    estimated_attendance,
    total_gifts_submitted,
    total_gifts_verified_amount,
    pending_gift_verifications,
    pending_messages,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-charcoal mb-1">
          Panel Principal
        </h1>
        <p className="text-sm uppercase tracking-wider font-sans text-muted">
          5 de diciembre, 2026 · Finca Amada
        </p>
      </div>

      <DashboardStatsGrid stats={stats} />
    </div>
  );
}
