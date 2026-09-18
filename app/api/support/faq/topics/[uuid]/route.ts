import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { SUPPORT_PORTAL_GUARDIAN } from "@/features/support/lib/paths";
import type { SupportFaqTopicDetail } from "@/types/domain/support-faq";

type RouteContext = {
  params: Promise<{ uuid: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAuth();
    const { uuid } = await context.params;
    const data = await laravelRequest<SupportFaqTopicDetail>(
      `/support/faq/topics/${uuid}?portal=${SUPPORT_PORTAL_GUARDIAN}`
    );
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
