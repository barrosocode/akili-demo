import type { NextRequest } from "next/server";
import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { firstAccessRequestSchema } from "@/features/auth/schemas/auth.schema";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = firstAccessRequestSchema.safeParse(body);

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
          purpose: "first_access",
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
