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
      <Link
        href="/admin/guests"
        className="mb-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted transition-colors hover:text-charcoal sm:mb-8"
      >
        ← Volver a Invitados
      </Link>

      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mb-1 font-display text-3xl font-light text-charcoal">{guest.full_name}</h1>
          <p className="text-xs uppercase tracking-widest text-muted">{new Date(guest.created_at).toLocaleString()}</p>
        </div>
        {guest.attendance_status === "attending" ? (
          <Badge variant="success">Asistira</Badge>
        ) : guest.attendance_status === "not_attending" ? (
          <Badge variant="danger">Declino</Badge>
        ) : (
          <Badge variant="muted">Pendiente</Badge>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Contacto</CardTitle>
          <dl className="flex flex-col gap-3">
            {[
              { label: "Correo", value: guest.email },
              { label: "Telefono", value: guest.phone },
              { label: "Acompanante", value: guest.has_plus_one ? guest.plus_one_name || "Si" : "Ninguno" },
              { label: "Solo Adultos", value: guest.adults_only_acknowledged ? "Confirmado" : "No confirmado" },
              { label: "Vestimenta", value: guest.dress_code_acknowledged ? "Confirmado" : "No confirmado" },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-1 text-sm sm:flex-row sm:gap-4">
                <dt className="shrink-0 text-muted sm:w-32">{label}</dt>
                <dd className="break-words text-charcoal">{value ?? "-"}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card>
          <CardTitle>Regalos</CardTitle>
          {!guest.gift_transactions?.length ? (
            <p className="text-xs text-muted">Sin regalos registrados.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {guest.gift_transactions.map((g) => (
                <div key={g.id} className="flex flex-col gap-3 border-b border-silver-light pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-charcoal">{g.method}</p>
                    {g.reference_note && <p className="mt-0.5 break-words text-xs text-muted">{g.reference_note}</p>}
                    {g.amount && <p className="mt-0.5 text-xs text-muted">${g.amount}</p>}
                  </div>
                  <GiftStatusBadge status={g.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardTitle>Mensajes</CardTitle>
          {!guest.guest_messages?.length ? (
            <p className="text-xs text-muted">Sin mensajes.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {guest.guest_messages.map((m) => (
                <div key={m.id}>
                  <p className="text-sm italic leading-relaxed text-charcoal">&ldquo;{m.message}&rdquo;</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Badge variant={m.is_approved ? "success" : "warning"}>
                      {m.is_approved ? "Aprobado" : "Pendiente"}
                    </Badge>
                    {m.is_public && <Badge variant="success">Publico</Badge>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <GuestProfileActions guest={guest} />
      </div>
    </div>
  );
}
