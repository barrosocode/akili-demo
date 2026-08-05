import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Informe seu e-mail")
    .email("Informe um e-mail válido"),
});

export type NewsletterFormValues = z.infer<typeof newsletterSchema>;
