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
    <div className="bg-white border border-silver-light p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-sans font-medium text-charcoal">
            {gift.guest_name ?? "Invitado desconocido"} — {gift.method}
          </p>
          <p className="text-xs font-sans text-muted mt-0.5">
            {new Date(gift.created_at).toLocaleString()}
          </p>
          {gift.reference_note && (
            <p className="text-xs font-sans text-muted mt-1">Ref: {gift.reference_note}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <GiftStatusBadge status={gift.status} />
          {gift.amount && (
            <p className="text-sm font-sans font-medium text-charcoal">
              ${gift.amount}
            </p>
          )}
        </div>
      </div>

      {gift.status === "pending" && (
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={handleVerify}
            loading={isPending}
          >
            Verificar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={handleReject}
            loading={isPending}
          >
            Rechazar
          </Button>
        </div>
      )}
    </div>
  );
}
