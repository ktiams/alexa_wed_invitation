import type { DashboardStats } from "@/lib/types/database";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
}

function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="bg-white border border-silver-light p-6">
      <p className="text-xs uppercase tracking-widest text-muted font-sans mb-3">{label}</p>
      <p className="font-display text-4xl font-light text-charcoal">{value}</p>
      {sub && (
        <p className="text-xs font-sans text-silver-dark mt-1">{sub}</p>
      )}
    </div>
  );
}

interface DashboardStatsProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <StatCard
        label="Confirmados"
        value={stats.total_attending}
        sub="invitados confirmados"
      />
      <StatCard
        label="No Asistirán"
        value={stats.total_not_attending}
        sub="declinaron"
      />
      <StatCard
        label="RSVPs Pendientes"
        value={stats.total_pending}
        sub="esperando respuesta"
      />
      <StatCard
        label="Acompañantes"
        value={stats.total_companions}
        sub="acompañantes confirmados"
      />
      <StatCard
        label="Asistencia Est."
        value={stats.estimated_attendance}
        sub="invitados + acompañantes"
      />
      <StatCard
        label="Regalos Registrados"
        value={stats.total_gifts_submitted}
        sub="registros totales"
      />
      <StatCard
        label="Regalos Verificados"
        value={`$${stats.total_gifts_verified_amount.toFixed(0)}`}
        sub="monto total verificado"
      />
      <StatCard
        label="Regalos Pendientes"
        value={stats.pending_gift_verifications}
        sub="esperando verificación"
      />
      <StatCard
        label="Mensajes Pendientes"
        value={stats.pending_messages}
        sub="esperando aprobación"
      />
    </div>
  );
}
