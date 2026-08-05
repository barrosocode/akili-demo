import { z } from "zod";

import { isValidPhone, stripDigits } from "@/lib/masks/br";
import { isValidCpf, stripCpf } from "@/lib/masks/cpf";

export const updateGuardianProfileSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo"),
  phone: z.string().trim().refine((value) => !value || isValidPhone(value), {
    message: "Informe um telefone válido com DDD",
  }),
  document: z.string().trim().refine((value) => !value || isValidCpf(value), {
    message: "Informe um CPF válido",
  }),
});

export type UpdateGuardianProfileValues = z.infer<
  typeof updateGuardianProfileSchema
>;

export function toGuardianProfilePayload(values: UpdateGuardianProfileValues): {
  name: string;
  phone: string | null;
  document: string | null;
} {
  const phoneDigits = stripDigits(values.phone ?? "");
  const documentDigits = stripCpf(values.document ?? "");

  return {
    name: values.name.trim(),
    phone: phoneDigits.length > 0 ? phoneDigits : null,
    document: documentDigits.length > 0 ? documentDigits : null,
  };
}
