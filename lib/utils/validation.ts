import { z } from "zod";

// Cada invitación cubre al invitado y, como máximo, un acompañante adulto.
// Si viene con acompañante, su nombre es obligatorio. Las confirmaciones de
// "solo adultos" y vestimenta solo se piden a quien asiste.
export const rsvpSchema = z
  .object({
    full_name: z.string().trim().min(2, "Escribe tu nombre completo"),
    phone: z.string().trim().min(7, "Escribe un teléfono válido"),
    email: z.string().trim().email("Escribe un correo válido"),
    attendance_status: z.enum(["attending", "not_attending"], { message: "Dinos si podrás acompañarnos" }),
    has_plus_one: z.boolean(),
    plus_one_name: z.string().trim().optional(),
    message: z.string().max(500, "El mensaje debe tener menos de 500 caracteres").optional(),
    adults_only_acknowledged: z.boolean(),
    dress_code_acknowledged: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.attendance_status !== "attending") return;
    if (data.has_plus_one && (!data.plus_one_name || data.plus_one_name.length < 2)) {
      ctx.addIssue({ code: "custom", path: ["plus_one_name"], message: "Escribe el nombre de tu acompañante" });
    }
    if (!data.adults_only_acknowledged) {
      ctx.addIssue({ code: "custom", path: ["adults_only_acknowledged"], message: "Confirma que será una celebración solo para adultos" });
    }
    if (!data.dress_code_acknowledged) {
      ctx.addIssue({ code: "custom", path: ["dress_code_acknowledged"], message: "Confirma el código de vestimenta" });
    }
  });

export type RSVPFormData = z.infer<typeof rsvpSchema>;

export const giftSchema = z.object({
  guest_id: z.string().uuid().optional(),
  amount: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined)),
  method: z.enum(["ATH Móvil", "Other"]),
  reference_note: z.string().max(200).optional(),
});

export type GiftFormData = z.infer<typeof giftSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
