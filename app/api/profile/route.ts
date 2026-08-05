import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import {
  toGuardianProfilePayload,
  updateGuardianProfileSchema,
} from "@/features/profile/schemas/profile.schema";
import type {
  GuardianProfile,
  GuardianResourceApi,
} from "@/types/guardian-profile";

function mapGuardianProfile(payload: GuardianResourceApi): GuardianProfile {
  return {
    name: payload.name?.trim() || "",
    email: payload.email?.trim() || "",
    phone: payload.phone?.trim() || null,
    document: payload.document?.trim() || null,
  };
}

export async function GET() {
  try {
    await requireAuth();
    const payload = await laravelRequest<GuardianResourceApi>("/guardian/me");
    return jsonSuccess(mapGuardianProfile(payload));
  } catch (error) {
    return jsonError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireAuth();
    const body = await request.json();
    const parsed = updateGuardianProfileSchema.safeParse(body);

    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "",
        ])
      );
      return validationError(errors);
    }

    const payload = toGuardianProfilePayload(parsed.data);
    const updated = await laravelRequest<GuardianResourceApi>("/guardian/me", {
      method: "PATCH",
      data: payload,
    });

    return jsonSuccess(mapGuardianProfile(updated));
  } catch (error) {
    return jsonError(error);
  }
}
