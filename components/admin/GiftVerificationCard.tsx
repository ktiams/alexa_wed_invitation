"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { GiftStatusBadge } from "@/components/admin/GiftStatusBadge";
import { verifyGift, rejectGift } from "@/lib/actions/admin/gifts";
import type { GiftTransaction } from "@/lib/types/database";

interface GiftVerificationCardProps {
  gift: GiftTransaction & { guest_name?: string };
}

export function GiftVerificationCard({ gift }: GiftVerificationCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleVerify() {
    startTransition(() => verifyGift(gift.id));
  }

  function handleReject() {
    startTransition(() => rejectGift(gift.id));
  }

  return (
    <div className="rounded-[1.5rem] border border-silver-light bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-charcoal">
            {gift.guest_name ?? "Invitado desconocido"} - {gift.method}
          </p>
          <p className="mt-0.5 text-xs text-muted">{new Date(gift.created_at).toLocaleString()}</p>
          {gift.reference_note && <p className="mt-1 break-words text-xs text-muted">Ref: {gift.reference_note}</p>}
        </div>
        <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end">
          <GiftStatusBadge status={gift.status} />
          {gift.amount && <p className="text-sm font-medium text-charcoal">${gift.amount}</p>}
        </div>
      </div>

      {gift.status === "pending" && (
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="primary" size="sm" onClick={handleVerify} loading={isPending} className="w-full sm:w-auto">
            Verificar
          </Button>
          <Button variant="danger" size="sm" onClick={handleReject} loading={isPending} className="w-full sm:w-auto">
            Rechazar
          </Button>
        </div>
      )}
    </div>
  );
}
