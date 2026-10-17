"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { submitRSVP, type RSVPResult } from "@/lib/actions/rsvp";
import { Input, Textarea } from "@/components/ui/Input";
import { PearlButton } from "@/components/ui/pearl-button";
import { SparklesCore } from "@/components/ui/sparkles";
import { LIGHT_SPARKLES } from "@/lib/sparkles";

const initialState: RSVPResult = { success: false };

type Attendance = "attending" | "not_attending" | "";

const attendanceOptions = [
  { value: "attending", label: "Sí, ahí estaré" },
  { value: "not_attending", label: "No podré ir" },
] as const;

const checkRow =
  "flex min-h-[3.25rem] cursor-pointer items-start gap-3 rounded-2xl border border-silver-light bg-cream px-4 py-3 text-sm leading-snug text-charcoal";

export function RSVPForm() {
  const [state, formAction, pending] = useActionState(submitRSVP, initialState);
  const [attendance, setAttendance] = useState<Attendance>("");
  const [hasPlusOne, setHasPlusOne] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (state.success && state.guestId) {
      router.push(`/gift?guestId=${state.guestId}`);
    }
  }, [state.success, state.guestId, router]);

  const err = state.fieldErrors ?? {};
  const attending = attendance === "attending";

  return (
    <section id="rsvp" className="relative isolate scroll-mt-4 bg-nude-light px-4 py-14 sm:px-6 sm:py-20">
      {/* Los destellos quedan en el fondo: la tarjeta del formulario es opaca y se lee limpia */}
      <SparklesCore {...LIGHT_SPARKLES} className="absolute inset-0 -z-10 h-full w-full" />
      <div className="mx-auto max-w-2xl">
        <div className="mb-7 text-center sm:mb-9">
          <p className="text-xs uppercase tracking-[0.3em] text-gold-dark">Confirma tu asistencia</p>
          <h2 className="mt-3 font-display text-4xl font-light text-charcoal sm:text-5xl">¿Nos acompañarás?</h2>
        </div>

        <form action={formAction} className="soft-card flex flex-col gap-5 px-4 py-5 sm:px-8 sm:py-8">
          <fieldset className="flex flex-col gap-2">
            <legend className="sr-only">¿Asistirás?</legend>
            <div className="grid grid-cols-2 gap-2">
              {attendanceOptions.map((option) => (
                <label key={option.value} className="relative">
                  <input
                    type="radio"
                    name="attendance_status"
                    value={option.value}
                    checked={attendance === option.value}
                    onChange={() => setAttendance(option.value)}
                    className="peer sr-only"
                    required
                  />
                  <span className="flex min-h-14 cursor-pointer items-center justify-center rounded-2xl border border-silver-light bg-cream px-2 text-center text-[0.95rem] font-medium text-charcoal peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-ivory peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-gold-dark">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
            {err.attendance_status && <p className="text-sm text-red-700">{err.attendance_status[0]}</p>}
          </fieldset>

          <Input
            id="full_name"
            name="full_name"
            label="Tu nombre completo *"
            placeholder="Nombre y apellido"
            autoComplete="name"
            required
            error={err.full_name?.[0]}
          />
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            label="Teléfono *"
            placeholder="787 000 0000"
            required
            error={err.phone?.[0]}
          />
          <Input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            label="Correo electrónico *"
            placeholder="tu@correo.com"
            required
            error={err.email?.[0]}
          />

          {attending && (
            <div className="flex flex-col gap-3 rounded-2xl border border-silver-light bg-cream p-4">
              <p className="text-sm text-muted">Tu invitación es para ti y un acompañante adulto.</p>
              <label className="flex min-h-11 cursor-pointer items-center justify-between gap-3 text-[0.95rem] font-medium text-charcoal">
                Voy con acompañante
                <input
                  type="checkbox"
                  role="switch"
                  name="has_plus_one"
                  value="true"
                  checked={hasPlusOne}
                  onChange={(e) => setHasPlusOne(e.target.checked)}
                  className="relative h-[1.875rem] w-[3.125rem] shrink-0 cursor-pointer appearance-none rounded-full bg-beige transition-colors after:absolute after:left-[3px] after:top-[3px] after:h-6 after:w-6 after:rounded-full after:bg-card after:shadow after:transition-transform after:content-[''] checked:bg-espresso checked:after:translate-x-5"
                />
              </label>
              {hasPlusOne && (
                <Input
                  id="plus_one_name"
                  name="plus_one_name"
                  label="Nombre del acompañante *"
                  placeholder="Nombre y apellido"
                  autoComplete="off"
                  required
                  error={err.plus_one_name?.[0]}
                />
              )}
            </div>
          )}

          <Textarea
            id="message"
            name="message"
            label="Mensaje para los novios (opcional)"
            placeholder="Un deseo, un consejo, un recuerdo…"
            rows={3}
            maxLength={500}
            error={err.message?.[0]}
          />

          {attending && (
            <div className="flex flex-col gap-2.5">
              <label className={checkRow}>
                <input type="checkbox" name="adults_only_acknowledged" required className="mt-0.5 h-[1.375rem] w-[1.375rem] shrink-0 accent-espresso" />
                Entiendo que será una celebración solo para adultos.
              </label>
              {err.adults_only_acknowledged && <p className="-mt-1 text-sm text-red-700">{err.adults_only_acknowledged[0]}</p>}

              <label className={checkRow}>
                <input type="checkbox" name="dress_code_acknowledged" required className="mt-0.5 h-[1.375rem] w-[1.375rem] shrink-0 accent-espresso" />
                Vestiré solo de blanco, crema o rosa, sin brillos.
              </label>
              {err.dress_code_acknowledged && <p className="-mt-1 text-sm text-red-700">{err.dress_code_acknowledged[0]}</p>}
            </div>
          )}

          {state.error && <p className="text-center text-sm text-red-700">{state.error}</p>}

          <PearlButton
            type="submit"
            disabled={pending}
            className="w-full"
            label={pending ? "Enviando…" : attendance === "not_attending" ? "Enviar respuesta" : "Confirmar asistencia"}
          />
        </form>
      </div>
    </section>
  );
}
