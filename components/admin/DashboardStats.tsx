import type { DashboardStats } from "@/lib/types/database";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-[1.5rem] border border-silver-light bg-white p-5 sm:p-6">
      <p className="mb-3 text-[0.68rem] uppercase tracking-[0.24em] text-muted">{label}</p>
      <p className="font-display text-3xl font-light text-charcoal sm:text-4xl">{value}</p>
      {sub && <p className="mt-1 text-xs text-silver-dark">{sub}</p>}
    </div>
  );
}

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard label="Confirmados" value={stats.total_attending} sub="invitados confirmados" />
      <StatCard label="No Asistiran" value={stats.total_not_attending} sub="declinaron" />
      <StatCard label="RSVPs Pendientes" value={stats.total_pending} sub="esperando respuesta" />
      <StatCard label="Acompanantes" value={stats.total_companions} sub="acompanantes confirmados" />
      <StatCard label="Asistencia Est." value={stats.estimated_attendance} sub="invitados + acompanantes" />
      <StatCard label="Regalos Registrados" value={stats.total_gifts_submitted} sub="registros totales" />
      <StatCard label="Regalos Verificados" value={`$${stats.total_gifts_verified_amount.toFixed(0)}`} sub="monto total verificado" />
      <StatCard label="Regalos Pendientes" value={stats.pending_gift_verifications} sub="esperando verificacion" />
      <StatCard label="Mensajes Pendientes" value={stats.pending_messages} sub="esperando aprobacion" />
    </div>
  );
}
