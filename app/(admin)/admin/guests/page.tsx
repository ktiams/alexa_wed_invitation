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
  if (status === "attending") return <Badge variant="success">Asistirá</Badge>;
  if (status === "not_attending") return <Badge variant="danger">Declinó</Badge>;
  return <Badge variant="muted">Pendiente</Badge>;
}

export default async function GuestsPage() {
  const guests = await getGuests();

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-charcoal mb-1">Invitados</h1>
          <p className="text-sm uppercase tracking-wider font-sans text-muted">
            {guests.length} registros totales
          </p>
        </div>
        <CSVExportButton guests={guests} />
      </div>

      {/* Table */}
      <div className="bg-white border border-silver-light overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-silver-light">
              {["Nombre", "Teléfono", "Correo", "Asistencia", "Acompañante", "Regalo", "Mensaje", "Fecha"].map(
                (col) => (
                  <th
                    key={col}
                    className="text-left px-4 py-3 text-xs uppercase tracking-widest text-muted font-medium whitespace-nowrap"
                  >
                    {col}
                  </th>
                )
              )}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {guests.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-muted text-xs uppercase tracking-widest">
                  Sin invitados aún
                </td>
              </tr>
            )}
            {guests.map((g) => {
              const latestGift = g.gift_transactions?.[0];
              const latestMessage = g.guest_messages?.[0];

              return (
                <tr key={g.id} className="border-b border-silver-light/50 hover:bg-cream/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-charcoal whitespace-nowrap">
                    {g.full_name}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">{g.phone ?? "—"}</td>
                  <td className="px-4 py-3 text-muted">{g.email ?? "—"}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <AttendanceBadge status={g.attendance_status} />
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap">
                    {g.has_plus_one ? g.plus_one_name || "Yes" : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <GiftStatusBadge status={latestGift?.status} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {latestMessage ? (
                      <Badge variant={latestMessage.is_approved ? "success" : "warning"}>
                        {latestMessage.is_approved ? "Aprobado" : "Pendiente"}
                      </Badge>
                    ) : (
                      <Badge variant="muted">Ninguno</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted whitespace-nowrap text-xs">
                    {new Date(g.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <Link
                      href={`/admin/guests/${g.id}`}
                      className="text-xs uppercase tracking-widest font-sans text-charcoal border-b border-charcoal hover:text-muted hover:border-muted transition-colors"
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
    </div>
  );
}
