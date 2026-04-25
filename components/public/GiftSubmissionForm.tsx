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
      <div className="text-center py-10">
        <div className="w-12 h-12 border border-silver flex items-center justify-center mx-auto mb-4 text-silver-dark text-xl">
          ✓
        </div>
        <p className="font-display text-2xl italic text-charcoal mb-2">Gracias</p>
        <p className="text-sm font-sans text-muted">
          Tu regalo ha sido registrado. Lo verificaremos en breve.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5 max-w-md mx-auto">
      {guestId && <input type="hidden" name="guest_id" value={guestId} />}

      <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans text-center">
        Registra Tu Regalo
      </p>

      {/* Method */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm uppercase tracking-wider text-muted font-sans font-medium">
          Método de Pago *
        </span>
        <select
          name="method"
          required
          className="w-full bg-white border border-silver-light px-4 py-3 text-sm font-sans text-charcoal outline-none focus:border-silver-dark"
        >
          <option value="">Selecciona método</option>
          {["ATH Móvil", "PayPal", "Zelle", "Other"].map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Amount */}
      <Input
        id="amount"
        name="amount"
        type="number"
        min="0"
        step="0.01"
        label="Monto (opcional)"
        placeholder="0.00"
      />

      {/* Reference */}
      <Textarea
        id="reference_note"
        name="reference_note"
        label="Nota de referencia (opcional)"
        placeholder="ID de transacción o cualquier referencia..."
        rows={2}
        maxLength={200}
      />

      {state.error && (
        <p className="text-sm text-red-500 font-sans text-center">{state.error}</p>
      )}

      <Button type="submit" size="lg" loading={pending} className="w-full">
        Registrar Regalo
      </Button>
    </form>
  );
}
