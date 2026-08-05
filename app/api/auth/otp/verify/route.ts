import type { NextRequest } from "next/server";
import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { firstAccessVerifySchema } from "@/features/auth/schemas/auth.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = firstAccessVerifySchema.safeParse(body);

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
          purpose: "first_access",
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
