import { z } from "zod";

import { isValidCpf, stripCpf } from "@/lib/masks/cpf";

export const CHILD_RELATIONSHIPS = ["mother", "father", "guardian", "other"] as const;

export type ChildRelationship = (typeof CHILD_RELATIONSHIPS)[number];

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const STUDENT_LOGIN = /^[A-Za-z][A-Za-z0-9._-]{2,31}$/;

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

export const createChildSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Informe o nome do filho.")
      .max(255, "O nome pode ter no máximo 255 caracteres."),
    login: z
      .string()
      .trim()
      .min(1, "Informe o usuário do filho.")
      .max(32, "O usuário pode ter no máximo 32 caracteres.")
      .regex(
        STUDENT_LOGIN,
        "O usuário precisa ter de 3 a 32 caracteres, começar com uma letra e usar só letras, números, ponto, hífen ou sublinhado."
      ),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres."),
    password_confirmation: z.string().min(1, "Confirme a senha."),
    preferred_name: z
      .string()
      .trim()
      .max(255, "O nome de tratamento pode ter no máximo 255 caracteres.")
      .optional(),
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
  })
  .refine((values) => values.password === values.password_confirmation, {
    message: "As senhas não conferem.",
    path: ["password_confirmation"],
  });

export type CreateChildValues = z.infer<typeof createChildSchema>;

export const childConsentInputSchema = z.object({
  documentRef: z.string().trim().min(1, "Aceite os termos para cadastrar o filho."),
  accepted: z.literal(true, {
    errorMap: () => ({ message: "É preciso aceitar os termos para cadastrar o filho." }),
  }),
});

export const createChildRequestSchema = createChildSchema.and(
  z.object({
    consents: z
      .array(childConsentInputSchema, {
        required_error: "Aceite os termos para cadastrar o filho.",
        invalid_type_error: "Aceite os termos para cadastrar o filho.",
      })
      .min(1, "Aceite os termos para cadastrar o filho."),
  })
);

export type CreateChildConsentInput = z.infer<typeof childConsentInputSchema>;

export interface CreateChildPayload {
  name: string;
  login: string;
  password: string;
  password_confirmation: string;
  birthdate: string;
  relationship: ChildRelationship;
  consents: CreateChildConsentInput[];
  preferred_name?: string;
  cpf?: string;
}

export function toCreateChildPayload(
  values: CreateChildValues,
  consents: CreateChildConsentInput[]
): CreateChildPayload {
  const payload: CreateChildPayload = {
    name: values.name.trim(),
    login: values.login.trim(),
    password: values.password,
    password_confirmation: values.password_confirmation,
    birthdate: values.birthdate,
    relationship: values.relationship,
    consents,
  };

  const preferredName = values.preferred_name?.trim() ?? "";
  if (preferredName) payload.preferred_name = preferredName;

  const cpf = values.cpf ? stripCpf(values.cpf) : "";
  if (cpf) payload.cpf = cpf;

  return payload;
}
