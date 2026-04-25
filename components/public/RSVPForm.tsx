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
    <section id="rsvp" className="py-20 px-4 sm:px-6 bg-parchment">
      <div className="max-w-xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans mb-4">
            RSVP
          </p>
          <div className="h-px w-16 bg-silver mx-auto mb-6" />
          <p className="font-display text-3xl sm:text-4xl font-light italic text-charcoal">
            ¿Nos acompañarás?
          </p>
        </div>

        {/* Premium form card */}
        <div className="bg-card border border-silver-light px-6 py-8 sm:px-10 sm:py-10 shadow-warm">
          <form action={formAction} className="flex flex-col gap-6">
            {/* Personal details */}
            <div className="flex flex-col gap-5">
              <Input
                id="full_name"
                name="full_name"
                label="Nombre Completo *"
                placeholder="Tu nombre completo"
                required
                error={err.full_name?.[0]}
              />
              <Input
                id="phone"
                name="phone"
                type="tel"
                label="Teléfono *"
                placeholder="+1 787 000 0000"
                required
                error={err.phone?.[0]}
              />
              <Input
                id="email"
                name="email"
                type="email"
                label="Correo Electrónico *"
                placeholder="tu@correo.com"
                required
                error={err.email?.[0]}
              />
            </div>

            {/* Thin divider */}
            <div className="h-px bg-silver-light" />

            {/* Attendance toggle */}
            <div className="flex flex-col gap-2">
              <span className="text-sm uppercase tracking-wider text-silver-dark font-sans font-medium">
                Asistencia *
              </span>
              <div className="grid grid-cols-2 gap-3">
                {(["attending", "not_attending"] as const).map((val) => (
                  <label
                    key={val}
                    className={[
                      "flex items-center justify-center gap-2 px-4 py-3.5 border cursor-pointer",
                      "transition-all duration-200 text-xs uppercase tracking-widest font-sans",
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
                    {val === "attending" ? "Asistiré" : "No podré asistir"}
                  </label>
                ))}
              </div>
              {err.attendance_status && (
                <p className="text-xs text-red-600 font-sans">{err.attendance_status[0]}</p>
              )}
            </div>

            {/* Companion — only visible when attending */}
            {attendance === "attending" && (
              <div className="flex flex-col gap-4 border border-silver-light bg-cream p-5">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="has_plus_one"
                    value="true"
                    checked={hasPlusOne}
                    onChange={(e) => setHasPlusOne(e.target.checked)}
                    className="w-4 h-4 shrink-0"
                    style={{ accentColor: "#2a2521" }}
                  />
                  <span className="text-sm uppercase tracking-wider font-sans text-charcoal">
                    Traeré un acompañante
                  </span>
                </label>
                {!hasPlusOne && <input type="hidden" name="has_plus_one" value="false" />}
                {hasPlusOne && (
                  <Input
                    id="plus_one_name"
                    name="plus_one_name"
                    label="Nombre del acompañante"
                    placeholder="Nombre del acompañante"
                    error={err.plus_one_name?.[0]}
                  />
                )}
              </div>
            )}
            {attendance !== "attending" && (
              <input type="hidden" name="has_plus_one" value="false" />
            )}

            {/* Message */}
            <Textarea
              id="message"
              name="message"
              label="Mensaje a los novios (opcional)"
              placeholder="Comparte un deseo o mensaje..."
              rows={4}
              maxLength={500}
              error={err.message?.[0]}
            />

            {/* Thin divider */}
            <div className="h-px bg-silver-light" />

            {/* Acknowledgements */}
            <div className="flex flex-col gap-4">
              <p className="text-sm uppercase tracking-wider font-sans text-silver-dark">
                Por favor confirma
              </p>

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="adults_only_acknowledged"
                  required
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ accentColor: "#2a2521" }}
                />
                <span className="text-xs font-sans text-muted leading-relaxed group-hover:text-charcoal transition-colors">
                  Acepto que este es un evento solo para adultos y no traeré niños.
                </span>
              </label>
              {err.adults_only_acknowledged && (
                <p className="text-xs text-red-600 font-sans -mt-2">{err.adults_only_acknowledged[0]}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="dress_code_acknowledged"
                  required
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ accentColor: "#2a2521" }}
                />
                <span className="text-xs font-sans text-muted leading-relaxed group-hover:text-charcoal transition-colors">
                  Acepto el código de vestimenta: blanco, casual elegante — sin brillantina, sin glitter, sin brillo.
                </span>
              </label>
              {err.dress_code_acknowledged && (
                <p className="text-xs text-red-600 font-sans -mt-2">{err.dress_code_acknowledged[0]}</p>
              )}
            </div>

            {/* Server error */}
            {state.error && (
              <p className="text-sm text-red-600 font-sans text-center">{state.error}</p>
            )}

            <Button type="submit" size="lg" loading={pending} className="w-full mt-2">
              {attendance === "not_attending" ? "Enviar Respuesta" : "Confirmar Asistencia"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
