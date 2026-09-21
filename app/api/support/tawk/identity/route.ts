import { jsonError, jsonSuccess } from "@/lib/api/response";
import { supportConsumeRequest } from "@/lib/api/support-consume";
import type { TawkIdentity } from "@/features/support/tawk";

export async function GET() {
  try {
    const data = await supportConsumeRequest<TawkIdentity>("/support/tawk/identity");
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
