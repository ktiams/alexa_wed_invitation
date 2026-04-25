import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { GiftStatusBadge } from "@/components/admin/GiftStatusBadge";
import { CSVExportButton } from "@/components/admin/CSVExportButton";
import type { GuestWithDetails } from "@/lib/types/database";

async function getGuests(): Promise<GuestWithDetails[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("guests")
    .select(`
      *,
      gift_transactions(id, status, amount, method, created_at),
      guest_messages(id, is_approved, is_public, created_at)
    `)
    .order("created_at", { ascending: false });

  return (data ?? []) as GuestWithDetails[];
}

function AttendanceBadge({ status }: { status: string }) {
  if (status === "attending") return <Badge variant="success">Asistira</Badge>;
  if (status === "not_attending") return <Badge variant="danger">Declino</Badge>;
  return <Badge variant="muted">Pendiente</Badge>;
}

export default async function GuestsPage() {
  const guests = await getGuests();

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mb-1 font-display text-3xl font-light text-charcoal">Invitados</h1>
          <p className="text-sm uppercase tracking-wider text-muted">{guests.length} registros totales</p>
        </div>
        <div className="w-full sm:w-auto">
          <CSVExportButton guests={guests} />
        </div>
      </div>

      {guests.length === 0 && (
        <div className="rounded-[1.5rem] border border-silver-light bg-white p-10 text-center">
          <p className="text-xs uppercase tracking-widest text-muted">Sin invitados aun</p>
        </div>
      )}

      {guests.length > 0 && (
        <>
          <div className="space-y-4 md:hidden">
            {guests.map((g) => {
              const latestGift = g.gift_transactions?.[0];
              const latestMessage = g.guest_messages?.[0];

              return (
                <article key={g.id} className="rounded-[1.5rem] border border-silver-light bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-charcoal">{g.full_name}</p>
                      <p className="mt-1 break-words text-sm text-muted">{g.email ?? "-"}</p>
                      <p className="mt-1 text-sm text-muted">{g.phone ?? "-"}</p>
                    </div>
                    <AttendanceBadge status={g.attendance_status} />
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-silver-dark">Acompanante</p>
                      <p className="mt-1 text-sm text-charcoal">{g.has_plus_one ? g.plus_one_name || "Yes" : "-"}</p>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-silver-dark">Regalo</p>
                      <div className="mt-1">
                        <GiftStatusBadge status={latestGift?.status} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-silver-dark">Mensaje</p>
                      <div className="mt-1">
                        {latestMessage ? (
                          <Badge variant={latestMessage.is_approved ? "success" : "warning"}>
                            {latestMessage.is_approved ? "Aprobado" : "Pendiente"}
                          </Badge>
                        ) : (
                          <Badge variant="muted">Ninguno</Badge>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-[0.65rem] uppercase tracking-[0.24em] text-silver-dark">Fecha</p>
                      <p className="mt-1 text-sm text-charcoal">{new Date(g.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <Link
                    href={`/admin/guests/${g.id}`}
                    className="mt-5 inline-flex items-center gap-2 border-b border-charcoal pb-0.5 text-xs uppercase tracking-widest text-charcoal transition-colors hover:border-muted hover:text-muted"
                  >
                    Ver detalle
                  </Link>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto rounded-[1.5rem] border border-silver-light bg-white md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-silver-light">
                  {["Nombre", "Telefono", "Correo", "Asistencia", "Acompanante", "Regalo", "Mensaje", "Fecha"].map((col) => (
                    <th key={col} className="whitespace-nowrap px-4 py-3 text-left text-xs uppercase tracking-widest text-muted">
                      {col}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => {
                  const latestGift = g.gift_transactions?.[0];
                  const latestMessage = g.guest_messages?.[0];

                  return (
                    <tr key={g.id} className="border-b border-silver-light/50 transition-colors hover:bg-cream/50">
                      <td className="whitespace-nowrap px-4 py-3 font-medium text-charcoal">{g.full_name}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{g.phone ?? "-"}</td>
                      <td className="px-4 py-3 text-muted">{g.email ?? "-"}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <AttendanceBadge status={g.attendance_status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-muted">{g.has_plus_one ? g.plus_one_name || "Yes" : "-"}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <GiftStatusBadge status={latestGift?.status} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-3">
                        {latestMessage ? (
                          <Badge variant={latestMessage.is_approved ? "success" : "warning"}>
                            {latestMessage.is_approved ? "Aprobado" : "Pendiente"}
                          </Badge>
                        ) : (
                          <Badge variant="muted">Ninguno</Badge>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-muted">{new Date(g.created_at).toLocaleDateString()}</td>
                      <td className="whitespace-nowrap px-4 py-3">
                        <Link
                          href={`/admin/guests/${g.id}`}
                          className="border-b border-charcoal text-xs uppercase tracking-widest text-charcoal transition-colors hover:border-muted hover:text-muted"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
