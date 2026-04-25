"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitRSVP, type RSVPResult } from "@/lib/actions/rsvp";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

const initialState: RSVPResult = { success: false };

export function RSVPForm() {
  const [state, formAction, pending] = useActionState(submitRSVP, initialState);
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const [attendance, setAttendance] = useState<"attending" | "not_attending" | "">("");
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.guestId) {
      router.push(`/gift?guestId=${state.guestId}`);
    }
  }, [state.success, state.guestId, router]);

  const err = state.fieldErrors ?? {};

  return (
    <section id="rsvp" className="bg-parchment px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-silver-dark">RSVP</p>
          <div className="mx-auto mb-6 h-px w-16 bg-silver" />
          <p className="font-display text-3xl font-light italic text-charcoal sm:text-4xl">Nos acompanaras?</p>
        </div>

        <div className="premium-card px-5 py-6 sm:px-8 sm:py-10 lg:px-10">
          <form action={formAction} className="flex flex-col gap-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                id="full_name"
                name="full_name"
                label="Nombre Completo *"
                placeholder="Tu nombre completo"
                required
                error={err.full_name?.[0]}
                className="md:col-span-2"
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Telefono *"
                placeholder="+1 787 000 0000"
                required
                error={err.phone?.[0]}
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Correo Electronico *"
                placeholder="tu@correo.com"
                required
                error={err.email?.[0]}
              />
            </div>

            <div className="h-px bg-silver-light" />

            <div className="flex flex-col gap-2">
              <span className="text-sm uppercase tracking-wider text-silver-dark">Asistencia *</span>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["attending", "not_attending"] as const).map((val) => (
                  <label
                    key={val}
                    className={[
                      "flex min-h-14 items-center justify-center gap-2 border px-4 py-3.5 text-center text-xs uppercase tracking-[0.2em]",
                      attendance === val
                        ? "border-espresso bg-espresso text-[#fff8ee]"
                        : "border-silver-light bg-cream text-muted hover:border-silver-dark hover:text-charcoal",
                    ].join(" ")}
                  >
                    <input
                      type="radio"
                      name="attendance_status"
                      value={val}
                      className="sr-only"
                      onChange={() => setAttendance(val)}
                      required
                    />
                    {val === "attending" ? "Asistire" : "No podre asistir"}
                  </label>
                ))}
              </div>
              {err.attendance_status && <p className="text-xs text-red-600">{err.attendance_status[0]}</p>}
            </div>

            {attendance === "attending" && (
              <div className="flex flex-col gap-4 border border-silver-light bg-cream p-4 sm:p-5">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="has_plus_one"
                    value="true"
                    checked={hasPlusOne}
                    onChange={(e) => setHasPlusOne(e.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0"
                    style={{ accentColor: "#2a2521" }}
                  />
                  <span className="text-sm uppercase tracking-wider text-charcoal">Traere un acompanante</span>
                </label>
                {!hasPlusOne && <input type="hidden" name="has_plus_one" value="false" />}
                {hasPlusOne && (
                  <Input
                    id="plus_one_name"
                    name="plus_one_name"
                    label="Nombre del acompanante"
                    placeholder="Nombre del acompanante"
                    error={err.plus_one_name?.[0]}
                  />
                )}
              </div>
            )}
            {attendance !== "attending" && <input type="hidden" name="has_plus_one" value="false" />}

            <Textarea
              id="message"
              name="message"
              label="Mensaje a los novios (opcional)"
              placeholder="Comparte un deseo o mensaje..."
              rows={4}
              maxLength={500}
              error={err.message?.[0]}
            />

            <div className="h-px bg-silver-light" />

            <div className="flex flex-col gap-4">
              <p className="text-sm uppercase tracking-wider text-silver-dark">Por favor confirma</p>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="adults_only_acknowledged"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ accentColor: "#2a2521" }}
                />
                <span className="text-xs leading-relaxed text-muted">
                  Acepto que este es un evento solo para adultos y no traere ninos.
                </span>
              </label>
              {err.adults_only_acknowledged && <p className="text-xs text-red-600 -mt-2">{err.adults_only_acknowledged[0]}</p>}

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="dress_code_acknowledged"
                  required
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ accentColor: "#2a2521" }}
                />
                <span className="text-xs leading-relaxed text-muted">
                  Acepto el codigo de vestimenta: blanco, casual elegante, sin brillantina ni glitter.
                </span>
              </label>
              {err.dress_code_acknowledged && <p className="text-xs text-red-600 -mt-2">{err.dress_code_acknowledged[0]}</p>}
            </div>

            {state.error && <p className="text-center text-sm text-red-600">{state.error}</p>}

            <Button type="submit" size="lg" loading={pending} className="mt-2 w-full">
              {attendance === "not_attending" ? "Enviar Respuesta" : "Confirmar Asistencia"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
