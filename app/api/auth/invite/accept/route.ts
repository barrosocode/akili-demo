import { laravelRequest } from "@/lib/api/laravel-client";
import {
  jsonError,
  jsonSuccess,
  validationError,
} from "@/lib/api/response";
import { acceptInviteSchema } from "@/features/auth/schemas/auth.schema";

/**
 * Accepts guardian invite (token + password). API returns GuardianResource only —
 * no Sanctum token. Client should redirect to /signin after success.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = acceptInviteSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    await laravelRequest("/guardian/invite/accept", {
      method: "POST",
      data: parsed.data,
      skipAuth: true,
      skipUnauthorizedRetry: true,
    });

    return jsonSuccess({
      message: "Senha definida com sucesso. Você já pode fazer login.",
    });
  } catch (error) {
    return jsonError(error);
  }
}
