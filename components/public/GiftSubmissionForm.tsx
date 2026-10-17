"use client";

import { useActionState } from "react";
import { submitGift, type GiftResult } from "@/lib/actions/gifts";
import { Input, Textarea } from "@/components/ui/Input";
import { PearlButton } from "@/components/ui/pearl-button";

const initialState: GiftResult = { success: false };

// Los valores coinciden con giftSchema; la etiqueta es lo que ve el invitado.
const methods = [
  { value: "ATH Móvil", label: "ATH Móvil" },
  { value: "Other", label: "Otro" },
];

interface GiftSubmissionFormProps {
  guestId?: string;
}

export function GiftSubmissionForm({ guestId }: GiftSubmissionFormProps) {
  const [state, formAction, pending] = useActionState(submitGift, initialState);

  if (state.success) {
    return (
      <div className="py-6 text-center">
        <p className="mb-2 font-display text-3xl italic text-charcoal">¡Gracias!</p>
        <p className="text-sm text-muted">Anotamos tu regalo. Lo confirmaremos muy pronto.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {guestId && <input type="hidden" name="guest_id" value={guestId} />}

      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">¿Ya enviaste tu regalo?</p>
        <p className="mt-2 text-sm text-muted">Avísanos para poder agradecértelo.</p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="method" className="text-sm font-medium text-silver-dark">
          Método de pago *
        </label>
        <select
          id="method"
          name="method"
          required
          defaultValue="ATH Móvil"
          className="w-full rounded-xl border border-silver-light bg-card px-4 py-3.5 text-base text-charcoal outline-none focus:border-gold-dark focus:ring-2 focus:ring-gold/20"
        >
          {methods.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <Input id="amount" name="amount" type="number" inputMode="decimal" min="0" step="0.01" label="Cantidad (opcional)" placeholder="0.00" />

      <Textarea
        id="reference_note"
        name="reference_note"
        label="Nota (opcional)"
        placeholder="Número de transacción o tu nombre"
        rows={3}
        maxLength={200}
      />

      {state.error && <p className="text-center text-sm text-red-700">{state.error}</p>}

      <PearlButton type="submit" disabled={pending} className="w-full" label={pending ? "Enviando…" : "Avisar de mi regalo"} />
    </form>
  );
}
