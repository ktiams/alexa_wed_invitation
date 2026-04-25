import { z } from "zod";

export const rsvpSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(7, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email address"),
  attendance_status: z.enum(["attending", "not_attending"]),
  has_plus_one: z.boolean(),
  plus_one_name: z.string().optional(),
  message: z.string().max(500, "Message must be under 500 characters").optional(),
  adults_only_acknowledged: z
    .boolean()
    .refine((v) => v === true, { message: "You must acknowledge the adults-only policy" }),
  dress_code_acknowledged: z
    .boolean()
    .refine((v) => v === true, { message: "You must acknowledge the dress code" }),
});

export type RSVPFormData = z.infer<typeof rsvpSchema>;

export const giftSchema = z.object({
  guest_id: z.string().uuid().optional(),
  amount: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined)),
  method: z.enum(["ATH Móvil", "PayPal", "Zelle", "Other"]),
  reference_note: z.string().max(200).optional(),
});

export type GiftFormData = z.infer<typeof giftSchema>;

export const adminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
