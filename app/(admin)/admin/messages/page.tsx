import { createAdminClient } from "@/lib/supabase/admin";
import { MessageApprovalCard } from "@/components/admin/MessageApprovalCard";
import type { GuestMessage } from "@/lib/types/database";

async function getMessages(): Promise<GuestMessage[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("guest_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as GuestMessage[];
}

export default async function MessagesPage() {
  const messages = await getMessages();
  const pending = messages.filter((m) => !m.is_approved);
  const approved = messages.filter((m) => m.is_approved);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-charcoal mb-1">Mensajes</h1>
        <p className="text-sm uppercase tracking-wider font-sans text-muted">
          {pending.length} pendientes · {approved.length} aprobados
        </p>
      </div>

      {/* Pending */}
      {pending.length > 0 && (
        <section className="mb-10">
          <p className="text-sm uppercase tracking-wider font-sans text-muted mb-4">
            Pendiente de Aprobación
          </p>
          <div className="flex flex-col gap-4">
            {pending.map((m) => (
              <MessageApprovalCard key={m.id} message={m} />
            ))}
          </div>
        </section>
      )}

      {/* Approved */}
      {approved.length > 0 && (
        <section>
          <p className="text-sm uppercase tracking-wider font-sans text-muted mb-4">
            Aprobados
          </p>
          <div className="flex flex-col gap-4">
            {approved.map((m) => (
              <MessageApprovalCard key={m.id} message={m} />
            ))}
          </div>
        </section>
      )}

      {messages.length === 0 && (
        <div className="bg-white border border-silver-light p-12 text-center">
          <p className="text-sm uppercase tracking-wider font-sans text-muted">
            Sin mensajes aún
          </p>
        </div>
      )}
    </div>
  );
}
