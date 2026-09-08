import type { NextRequest } from "next/server";
import { z } from "zod";
import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";

const otpVerifySchema = z
  .object({
    email: z.string().email("Informe um e-mail válido"),
    purpose: z.enum(["first_access", "password_reset"]).default("first_access"),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = otpVerifySchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const response = await laravelRequest<{ message: string }>(
      "/auth/otp/verify",
      {
        method: "POST",
        data: {
          email: parsed.data.email,
          purpose: parsed.data.purpose,
          code: parsed.data.code,
          password: parsed.data.password,
          password_confirmation: parsed.data.password_confirmation,
        },
        skipAuth: true,
        skipUnauthorizedRetry: true,
      }
    );

    return jsonSuccess(response);
  } catch (error) {
    return jsonError(error);
  }
}
