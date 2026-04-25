import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card, CardTitle } from "@/components/ui/Card";
import { GiftStatusBadge } from "@/components/admin/GiftStatusBadge";
import { GuestProfileActions } from "@/components/admin/GuestProfileActions";
import type { GuestWithDetails } from "@/lib/types/database";

async function getGuest(id: string): Promise<GuestWithDetails | null> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("guests")
    .select(`
      *,
      gift_transactions(*, created_at),
      guest_messages(*, created_at)
    `)
    .eq("id", id)
    .single();

  return data as GuestWithDetails | null;
}

export default async function GuestProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const guest = await getGuest(id);

  if (!guest) notFound();

  return (
    <div>
      {/* Back */}
      <Link
        href="/admin/guests"
        className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-sans text-muted hover:text-charcoal transition-colors mb-8"
      >
        ← Volver a Invitados
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-charcoal mb-1">
            {guest.full_name}
          </h1>
          <p className="text-xs uppercase tracking-widest font-sans text-muted">
            {new Date(guest.created_at).toLocaleString()}
          </p>
        </div>
        {guest.attendance_status === "attending" ? (
          <Badge variant="success">Asistirá</Badge>
        ) : guest.attendance_status === "not_attending" ? (
          <Badge variant="danger">Declinó</Badge>
        ) : (
          <Badge variant="muted">Pendiente</Badge>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Contact details */}
        <Card>
          <CardTitle>Contacto</CardTitle>
          <dl className="flex flex-col gap-3">
            {[
              { label: "Correo", value: guest.email },
              { label: "Teléfono", value: guest.phone },
              { label: "Acompañante", value: guest.has_plus_one ? guest.plus_one_name || "Sí" : "Ninguno" },
              { label: "Solo Adultos", value: guest.adults_only_acknowledged ? "✓ Confirmado" : "✗ No confirmado" },
              { label: "Vestimenta", value: guest.dress_code_acknowledged ? "✓ Confirmado" : "✗ No confirmado" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4 text-sm font-sans">
                <dt className="text-muted w-28 shrink-0">{label}</dt>
                <dd className="text-charcoal">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Gifts */}
        <Card>
          <CardTitle>Regalos</CardTitle>
          {!guest.gift_transactions?.length ? (
            <p className="text-xs font-sans text-muted">Sin regalos registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {guest.gift_transactions.map((g) => (
                <div key={g.id} className="flex items-center justify-between text-sm font-sans border-b border-silver-light pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="text-charcoal font-medium">{g.method}</p>
                    {g.reference_note && (
                      <p className="text-xs text-muted mt-0.5">{g.reference_note}</p>
                    )}
                    {g.amount && (
                      <p className="text-xs text-muted mt-0.5">${g.amount}</p>
                    )}
                  </div>
                  <GiftStatusBadge status={g.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Messages */}
        <Card>
          <CardTitle>Mensajes</CardTitle>
          {!guest.guest_messages?.length ? (
            <p className="text-xs font-sans text-muted">Sin mensajes.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {guest.guest_messages.map((m) => (
                <div key={m.id}>
                  <p className="text-sm font-sans text-charcoal leading-relaxed italic">
                    &ldquo;{m.message}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <Badge variant={m.is_approved ? "success" : "warning"}>
                      {m.is_approved ? "Aprobado" : "Pendiente"}
                    </Badge>
                    {m.is_public && <Badge variant="success">Público</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Admin actions */}
        <GuestProfileActions guest={guest} />
      </div>
    </div>
  );
}
