import { jsonError, jsonSuccess } from "@/lib/api/response";
import { supportConsumeRequest } from "@/lib/api/support-consume";
import { SUPPORT_PORTAL_GUARDIAN } from "@/features/support/lib/paths";
import type { SupportFaqTopicSummary } from "@/types/domain/support-faq";

export async function GET() {
  try {
    const data = await supportConsumeRequest<SupportFaqTopicSummary[]>(
      `/support/faq/topics?portal=${SUPPORT_PORTAL_GUARDIAN}`
    );
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
