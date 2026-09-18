import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import type { TawkIdentity } from "@/features/support/tawk";

export async function GET() {
  try {
    await requireAuth();
    const data = await laravelRequest<TawkIdentity>("/support/tawk/identity");
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
