import { z } from "zod";
import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { toSessionUser } from "@/lib/permissions/guardian-capabilities";
import { updateProfileSchema } from "@/features/auth/schemas/auth.schema";
import type { AuthUser } from "@/types/auth";

export async function PATCH(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const user = await laravelRequest<AuthUser>("/client/auth/me", {
      method: "PATCH",
      data: parsed.data,
    });

    return jsonSuccess(toSessionUser(user));
  } catch (error) {
    return jsonError(error);
  }
}
