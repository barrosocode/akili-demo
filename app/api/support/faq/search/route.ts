import { jsonError, jsonSuccess } from "@/lib/api/response";
import { supportConsumeRequest } from "@/lib/api/support-consume";
import { SUPPORT_PORTAL_GUARDIAN } from "@/features/support/lib/paths";
import type { SupportFaqSearchHit } from "@/types/domain/support-faq";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") ?? "").trim();
    const query = new URLSearchParams({
      portal: SUPPORT_PORTAL_GUARDIAN,
      search,
    });
    const data = await supportConsumeRequest<SupportFaqSearchHit[]>(
      `/support/faq/search?${query.toString()}`
    );
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
