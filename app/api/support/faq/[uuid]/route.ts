import { jsonError, jsonSuccess } from "@/lib/api/response";
import { supportConsumeRequest } from "@/lib/api/support-consume";
import { SUPPORT_PORTAL_GUARDIAN } from "@/features/support/lib/paths";
import type { SupportFaqDetail } from "@/types/domain/support-faq";

type RouteContext = {
  params: Promise<{ uuid: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { uuid } = await context.params;
    const data = await supportConsumeRequest<SupportFaqDetail>(
      `/support/faq/${uuid}?portal=${SUPPORT_PORTAL_GUARDIAN}`
    );
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
