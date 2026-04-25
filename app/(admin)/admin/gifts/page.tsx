import { createAdminClient } from "@/lib/supabase/admin";
import { GiftVerificationCard } from "@/components/admin/GiftVerificationCard";
import type { GiftTransaction } from "@/lib/types/database";

type GiftWithGuest = GiftTransaction & { guest_name?: string };

async function getGifts(): Promise<GiftWithGuest[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("gift_transactions")
    .select(`
      *,
      guests(full_name)
    `)
    .order("created_at", { ascending: false });

  return ((data ?? []) as (GiftTransaction & { guests?: { full_name: string } })[]).map((g) => ({
    ...g,
    guest_name: g.guests?.full_name,
  }));
}

export default async function GiftsPage() {
  const gifts = await getGifts();
  const pending = gifts.filter((g) => g.status === "pending");
  const verified = gifts.filter((g) => g.status === "verified");
  const rejected = gifts.filter((g) => g.status === "rejected");

  const totalVerified = verified.reduce((sum, g) => sum + (g.amount ?? 0), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-charcoal mb-1">Regalos</h1>
        <p className="text-sm uppercase tracking-wider font-sans text-muted">
          {pending.length} pendientes · {verified.length} verificados · ${totalVerified.toFixed(0)} total
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-10">
          <p className="text-sm uppercase tracking-wider font-sans text-muted mb-4">
            Pendiente de Verificación
          </p>
          <div className="flex flex-col gap-4">
            {pending.map((g) => (
              <GiftVerificationCard key={g.id} gift={g} />
            ))}
          </div>
        </section>
      )}

      {/* Verified */}
      {verified.length > 0 && (
        <section className="mb-10">
          <p className="text-sm uppercase tracking-wider font-sans text-muted mb-4">
            Verificados
          </p>
          <div className="flex flex-col gap-4">
            {verified.map((g) => (
              <GiftVerificationCard key={g.id} gift={g} />
            ))}
          </div>
        </section>
      )}

      {/* Rejected */}
      {rejected.length > 0 && (
        <section>
          <p className="text-sm uppercase tracking-wider font-sans text-muted mb-4">
            Rechazados
          </p>
          <div className="flex flex-col gap-4">
            {rejected.map((g) => (
              <GiftVerificationCard key={g.id} gift={g} />
            ))}
          </div>
        </section>
      )}

      {gifts.length === 0 && (
        <div className="bg-white border border-silver-light p-12 text-center">
          <p className="text-sm uppercase tracking-wider font-sans text-muted">
            Sin regalos registrados aún
          </p>
        </div>
      )}
    </div>
  );
}
