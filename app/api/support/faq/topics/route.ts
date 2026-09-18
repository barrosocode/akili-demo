import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { SUPPORT_PORTAL_GUARDIAN } from "@/features/support/lib/paths";
import type { SupportFaqTopicSummary } from "@/types/domain/support-faq";

export async function GET() {
  try {
    await requireAuth();
    const data = await laravelRequest<SupportFaqTopicSummary[]>(
      `/support/faq/topics?portal=${SUPPORT_PORTAL_GUARDIAN}`
    );
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
