"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { Card, CardTitle } from "@/components/ui/Card";
import { addAdminNote } from "@/lib/actions/admin/guests";
import type { GuestWithDetails } from "@/lib/types/database";

interface GuestProfileActionsProps {
  guest: GuestWithDetails;
}

export function GuestProfileActions({ guest }: GuestProfileActionsProps) {
  const [note, setNote] = useState(guest.admin_notes ?? "");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSaveNote() {
    startTransition(async () => {
      await addAdminNote(guest.id, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  return (
    <Card>
      <CardTitle>Notas Internas</CardTitle>
      <div className="flex flex-col gap-4">
        <Textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Notas internas sobre este invitado..."
          rows={4}
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveNote}
          loading={isPending}
          className="self-start"
        >
          {saved ? "Guardado ✓" : "Guardar Nota"}
        </Button>
      </div>
    </Card>
  );
}
