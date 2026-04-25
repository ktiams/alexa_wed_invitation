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
    <div className="rounded-[1.5rem] border border-silver-light bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-charcoal">{message.guest_name}</p>
          <p className="mt-0.5 text-xs text-muted">{new Date(message.created_at).toLocaleString()}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={message.is_approved ? "success" : "warning"}>
            {message.is_approved ? "Aprobado" : "Pendiente"}
          </Badge>
          {message.is_public && <Badge variant="success">Publico</Badge>}
        </div>
      </div>

      <p className="mb-5 text-sm italic leading-relaxed text-charcoal">&ldquo;{message.message}&rdquo;</p>

      <div className="flex flex-col gap-3 sm:flex-row">
        {!message.is_approved && (
          <Button variant="primary" size="sm" onClick={handleApprove} loading={isPending} className="w-full sm:w-auto">
            Aprobar y Publicar
          </Button>
        )}
        {message.is_public && (
          <Button variant="outline" size="sm" onClick={handleHide} loading={isPending} className="w-full sm:w-auto">
            Despublicar
          </Button>
        )}
      </div>
    </div>
  );
}
