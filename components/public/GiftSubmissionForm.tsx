"use client";

import { useActionState } from "react";
import { submitGift, type GiftResult } from "@/lib/actions/gifts";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

const initialState: GiftResult = { success: false };

interface GiftSubmissionFormProps {
  guestId?: string;
}

export function GiftSubmissionForm({ guestId }: GiftSubmissionFormProps) {
  const [state, formAction, pending] = useActionState(submitGift, initialState);

  if (state.success) {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center border border-silver text-xl text-silver-dark">+</div>
        <p className="mb-2 font-display text-2xl italic text-charcoal">Gracias</p>
        <p className="text-sm text-muted">Tu regalo ha sido registrado. Lo verificaremos en breve.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mx-auto flex max-w-2xl flex-col gap-5">
      {guestId && <input type="hidden" name="guest_id" value={guestId} />}

      <p className="text-center text-sm uppercase tracking-[0.2em] text-silver-dark">Registra Tu Regalo</p>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm uppercase tracking-wider text-muted">Metodo de Pago *</span>
          <select
            name="method"
            required
            className="w-full border border-silver-light bg-white px-4 py-3 text-sm text-charcoal outline-none focus:border-silver-dark"
          >
            <option value="">Selecciona metodo</option>
            {["ATH Movil", "PayPal", "Zelle", "Other"].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <Input id="amount" name="amount" type="number" min="0" step="0.01" label="Monto (opcional)" placeholder="0.00" />
      </div>

      <Textarea
        id="reference_note"
        name="reference_note"
        label="Nota de referencia (opcional)"
        placeholder="ID de transaccion o cualquier referencia..."
        rows={3}
        maxLength={200}
      />

      {state.error && <p className="text-center text-sm text-red-500">{state.error}</p>}

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Registrar Regalo
      </Button>
    </form>
  );
}
