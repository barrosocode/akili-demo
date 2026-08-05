import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail ou usuário"),
  password: z.string().min(1, "Informe sua senha"),
});

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});

export const forgotPasswordResetSchema = z
  .object({
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não conferem",
    path: ["password_confirmation"],
  });

export const signupSchema = z
  .object({
    name: z.string().min(2, "Informe seu nome completo"),
    email: z.string().email("Informe um e-mail válido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não conferem",
    path: ["password_confirmation"],
  });

export const acceptInviteSchema = z
  .object({
    token: z.string().min(1, "Convite inválido"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não conferem",
    path: ["password_confirmation"],
  });

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
});

export const firstAccessRequestSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
});

export const firstAccessVerifySchema = z
  .object({
    email: z.string().email("Informe um e-mail válido"),
    code: z
      .string()
      .min(6, "Informe o código de 6 dígitos")
      .max(6, "Informe o código de 6 dígitos"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não conferem",
    path: ["password_confirmation"],
  });
