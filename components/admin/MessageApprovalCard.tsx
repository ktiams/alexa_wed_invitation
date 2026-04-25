"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { approveMessage, hideMessage } from "@/lib/actions/admin/messages";
import type { GuestMessage } from "@/lib/types/database";

interface MessageApprovalCardProps {
  message: GuestMessage;
}

export function MessageApprovalCard({ message }: MessageApprovalCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleApprove() {
    startTransition(() => approveMessage(message.id));
  }

  function handleHide() {
    startTransition(() => hideMessage(message.id));
  }

  return (
    <div className="bg-white border border-silver-light p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-sans font-medium text-charcoal">{message.guest_name}</p>
          <p className="text-xs font-sans text-muted mt-0.5">
            {new Date(message.created_at).toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={message.is_approved ? "success" : "warning"}>
            {message.is_approved ? "Aprobado" : "Pendiente"}
          </Badge>
          {message.is_public && <Badge variant="success">Público</Badge>}
        </div>
      </div>

      <p className="text-sm font-sans text-charcoal leading-relaxed italic mb-5">
        &ldquo;{message.message}&rdquo;
      </p>

      <div className="flex gap-3">
        {!message.is_approved && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            loading={isPending}
          >
            Aprobar y Publicar
          </Button>
        )}
        {message.is_public && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleHide}
            loading={isPending}
          >
            Despublicar
          </Button>
        )}
      </div>
    </div>
  );
}
