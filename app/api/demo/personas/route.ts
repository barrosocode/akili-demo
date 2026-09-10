import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { normalizePersonasPayload } from "@/lib/demo/personas";

export async function GET() {
  try {
    await requireAuth();
    const payload = await laravelRequest<unknown>("/demo/personas");
    return jsonSuccess(normalizePersonasPayload(payload));
  } catch (error) {
    return jsonError(error);
  }
}
