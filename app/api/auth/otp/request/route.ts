import type { NextRequest } from "next/server";
import { z } from "zod";
import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";

const otpRequestSchema = z.object({
  email: z.string().email("Informe um e-mail válido"),
  purpose: z.enum(["first_access", "password_reset"]).default("first_access"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = otpRequestSchema.safeParse(body);

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
      "/auth/otp/request",
      {
        method: "POST",
        data: {
          email: parsed.data.email,
          purpose: parsed.data.purpose,
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
