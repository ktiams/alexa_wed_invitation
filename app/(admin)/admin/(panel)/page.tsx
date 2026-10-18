import { createAdminClient } from "@/lib/supabase/admin";
import type { GiftTransaction, GuestWithDetails } from "@/lib/types/database";

// Invitados: cuántas personas vienen, cuántos mensajes y regalos hay, y la lista de
// respuestas del RSVP. Sin botones: el mensaje privado y el regalo avisado se ven en la
// misma fila; al tocar un nombre aparecen teléfono, correo y la fecha de respuesta.
// Los mensajes son privados (solo los novios los leen aquí) y los regalos no se verifican.

async function getData() {
  const supabase = createAdminClient();
  const [guestsRes, giftsRes] = await Promise.all([
    supabase
      .from("guests")
      .select("*, gift_transactions(id, amount, method, reference_note, created_at), guest_messages(id, message, created_at)")
      .order("created_at", { ascending: false }),
    supabase
      .from("gift_transactions")
      .select("id, amount, method, reference_note, created_at")
      .is("guest_id", null)
      .order("created_at", { ascending: false }),
  ]);
  return {
    guests: (guestsRes.data ?? []) as GuestWithDetails[],
    looseGifts: (giftsRes.data ?? []) as GiftTransaction[],
  };
}

const dateFormat = new Intl.DateTimeFormat("es-PR", {
  day: "numeric",
  month: "short",
  timeZone: "America/Puerto_Rico",
});

function giftText(gift: Pick<GiftTransaction, "amount" | "method">) {
  const amount = gift.amount ? `$${Number(gift.amount).toLocaleString("es-PR")}` : "Un regalo";
  return `${amount} por ${gift.method}`;
}

function plural(n: number, one: string, many: string) {
  return `${n} ${n === 1 ? one : many}`;
}

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 shrink-0 text-gold-dark" aria-hidden="true">
      <path d="M20 12.5c0 3.6-3.6 6.5-8 6.5-1.1 0-2.2-.2-3.1-.5L4 20l1.3-3.6C4.5 15.3 4 14 4 12.5 4 8.9 7.6 6 12 6s8 2.9 8 6.5z" />
    </svg>
  );
}

function GiftIcon({ small = false }: { small?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${small ? "h-3.5 w-3.5" : "h-5 w-5"} shrink-0 text-gold-dark`}
      aria-hidden="true"
    >
      <rect x="4" y="9" width="16" height="11" rx="1.5" />
      <path d="M3 9h18M12 9v11M12 9c-1.5-3.5-5.5-4-5.5-1.5S10 9 12 9zM12 9c1.5-3.5 5.5-4 5.5-1.5S14 9 12 9z" />
    </svg>
  );
}

export default async function GuestsPage() {
  const { guests, looseGifts } = await getData();
  const attending = guests.filter((g) => g.attendance_status === "attending");
  const declined = guests.filter((g) => g.attendance_status === "not_attending").length;
  const companions = attending.filter((g) => g.has_plus_one).length;
  const people = attending.length + companions;
  const messages = guests.filter((g) => g.guest_messages?.length).length;
  const gifts = guests.reduce((n, g) => n + (g.gift_transactions?.length ?? 0), 0) + looseGifts.length;

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-display text-4xl font-light text-charcoal">Invitados</h1>

      <section className="rounded-3xl border border-silver-light bg-card/85 px-5 py-4 shadow-warm-sm backdrop-blur-[2px]">
        <div className="flex items-center gap-4">
          <span className="font-display text-6xl font-medium leading-none tabular-nums text-charcoal">{people}</span>
          <p className="font-body text-sm leading-snug text-muted">
            <b className="block text-base font-semibold text-charcoal">{people === 1 ? "persona viene" : "personas vienen"}</b>
            {plural(attending.length, "dijo que sí", "dijeron que sí")}
            {companions > 0 && ` (${companions} con acompañante)`} · {plural(declined, "no puede", "no pueden")}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-silver-light pt-3 font-body text-sm text-muted">
          <span className="flex items-center gap-2">
            <MessageIcon />
            <span>
              <b className="font-semibold tabular-nums text-charcoal">{messages}</b> {messages === 1 ? "mensaje" : "mensajes"}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <GiftIcon />
            <span>
              <b className="font-semibold tabular-nums text-charcoal">{gifts}</b> {gifts === 1 ? "regalo avisado" : "regalos avisados"}
            </span>
          </span>
        </div>
      </section>

      {guests.length === 0 ? (
        <p className="rounded-3xl border border-silver-light bg-card/85 px-5 py-10 text-center font-body text-sm text-muted">
          Todavía nadie ha respondido. Aquí aparecerán las confirmaciones del RSVP.
        </p>
      ) : (
        <ul className="overflow-hidden rounded-3xl border border-silver-light bg-card/85 backdrop-blur-[2px]">
          {guests.map((g) => {
            const coming = g.attendance_status === "attending";
            const message = g.guest_messages?.[0]?.message;
            const guestGifts = g.gift_transactions ?? [];
            return (
              <li key={g.id} className="border-t border-silver-light first:border-t-0">
                <details className="group">
                  <summary className="grid cursor-pointer list-none grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3.5 transition-colors hover:bg-nude-light/50 group-open:bg-nude-light md:grid-cols-[minmax(0,1fr)_9rem_auto] [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0">
                      <span className="block truncate font-body text-[0.95rem] font-semibold text-charcoal">{g.full_name}</span>
                      {coming && (
                        <span className="block truncate font-body text-sm text-muted">
                          {g.has_plus_one && g.plus_one_name ? `con ${g.plus_one_name}` : "Solo"}
                        </span>
                      )}
                    </span>
                    <span className="hidden font-body text-sm tabular-nums text-muted md:block">{g.phone ?? ""}</span>
                    <span
                      className={[
                        "rounded-full px-2.5 py-1 font-body text-xs font-semibold",
                        coming ? "bg-[#e6ecdc] text-[#4f6a3f]" : "bg-[#f6e1dc] text-[#9a4e43]",
                      ].join(" ")}
                    >
                      {coming ? "Viene" : "No viene"}
                    </span>

                    {/* Mensaje y regalo a la vista, sin tener que tocar el nombre. */}
                    {message && (
                      <p className="col-span-full line-clamp-3 border-l-2 border-gold/50 pl-3 font-display text-[1.05rem] italic leading-snug text-charcoal group-open:line-clamp-none">
                        &ldquo;{message}&rdquo;
                      </p>
                    )}
                    {guestGifts.length > 0 && (
                      <span className="col-span-full flex flex-wrap gap-1.5">
                        {guestGifts.map((gift) => (
                          <span
                            key={gift.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-champagne bg-champagne-light px-2.5 py-1 font-body text-xs font-semibold text-charcoal"
                          >
                            <GiftIcon small />
                            Regalo: {giftText(gift)}
                          </span>
                        ))}
                      </span>
                    )}
                  </summary>

                  <div className="flex flex-col gap-1.5 border-t border-dashed border-champagne bg-nude-light px-4 pb-4 pt-3 font-body text-sm text-muted">
                    {g.phone && (
                      <a href={`tel:${g.phone.replace(/[^\d+]/g, "")}`} className="w-fit text-charcoal underline decoration-gold/50 underline-offset-4">
                        {g.phone}
                      </a>
                    )}
                    {g.email && <span className="break-all">{g.email}</span>}
                    {!message && <span>No dejó mensaje.</span>}
                    {guestGifts.length === 0 && <span>No ha avisado de un regalo.</span>}
                    <span className="text-xs">Respondió el {dateFormat.format(new Date(g.created_at))}</span>
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}

      {looseGifts.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold-dark">
            Avisos de regalo sin RSVP
          </h2>
          <ul className="overflow-hidden rounded-3xl border border-silver-light bg-card/85">
            {looseGifts.map((gift) => (
              <li key={gift.id} className="flex flex-col gap-0.5 border-t border-silver-light px-4 py-3 font-body text-sm first:border-t-0">
                <b className="font-semibold text-charcoal">{giftText(gift)}</b>
                {gift.reference_note && <span className="break-words text-muted">{gift.reference_note}</span>}
                <span className="text-xs text-muted">{dateFormat.format(new Date(gift.created_at))}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
