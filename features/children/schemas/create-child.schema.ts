import { z } from "zod";

import { isValidCpf, stripCpf } from "@/lib/masks/cpf";

export const CHILD_RELATIONSHIPS = ["mother", "father", "guardian", "other"] as const;

export type ChildRelationship = (typeof CHILD_RELATIONSHIPS)[number];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function todayInBrazil(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function isCalendarDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function isBirthdateBeforeToday(value: string, now = new Date()): boolean {
  return isCalendarDate(value) && value < todayInBrazil(now);
}

export function maxBirthdateInput(now = new Date()): string {
  const [year, month, day] = todayInBrazil(now).split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() - 1);
  return date.toISOString().slice(0, 10);
}

export const createChildSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Informe o nome do filho.")
    .max(255, "O nome pode ter no máximo 255 caracteres."),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail do filho.")
    .email("Informe um e-mail válido.")
    .max(255, "O e-mail pode ter no máximo 255 caracteres."),
  preferred_name: z
    .string()
    .trim()
    .max(255, "O nome de tratamento pode ter no máximo 255 caracteres."),
  birthdate: z
    .string()
    .trim()
    .min(1, "Informe a data de nascimento.")
    .refine(isBirthdateBeforeToday, "A data de nascimento deve ser anterior a hoje."),
  cpf: z
    .string()
    .trim()
    .refine((value) => value.length === 0 || isValidCpf(value), {
      message: "O CPF informado é inválido.",
    })
    .optional(),
  relationship: z.enum(CHILD_RELATIONSHIPS, {
    errorMap: () => ({ message: "O parentesco informado é inválido." }),
  }),
});

export type CreateChildValues = z.infer<typeof createChildSchema>;

export interface CreateChildPayload {
  name: string;
  email: string;
  birthdate: string;
  relationship: ChildRelationship;
  preferred_name?: string;
  cpf?: string;
}

export function toCreateChildPayload(values: CreateChildValues): CreateChildPayload {
  const payload: CreateChildPayload = {
    name: values.name.trim(),
    email: values.email.trim().toLowerCase(),
    birthdate: values.birthdate,
    relationship: values.relationship,
  };

  const preferredName = values.preferred_name.trim();
  if (preferredName) payload.preferred_name = preferredName;

  const cpf = values.cpf ? stripCpf(values.cpf) : "";
  if (cpf) payload.cpf = cpf;

  return payload;
}
