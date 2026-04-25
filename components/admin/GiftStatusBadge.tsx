import { Badge } from "@/components/ui/Badge";
import type { GiftStatus } from "@/lib/types/database";

export function GiftStatusBadge({ status }: { status: GiftStatus | undefined | null }) {
  if (!status) return <Badge variant="muted">Ninguno</Badge>;

  const map: Record<GiftStatus, { label: string; variant: "success" | "warning" | "danger" | "muted" }> = {
    verified: { label: "Verificado", variant: "success" },
    pending: { label: "Pendiente", variant: "warning" },
    rejected: { label: "Rechazado", variant: "danger" },
  };

  const { label, variant } = map[status] ?? { label: status, variant: "muted" };
  return <Badge variant={variant}>{label}</Badge>;
}
