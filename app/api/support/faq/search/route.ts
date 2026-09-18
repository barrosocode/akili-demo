import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { SUPPORT_PORTAL_GUARDIAN } from "@/features/support/lib/paths";
import type { SupportFaqSearchHit } from "@/types/domain/support-faq";

export async function GET(request: Request) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const search = (searchParams.get("search") ?? "").trim();
    const query = new URLSearchParams({
      portal: SUPPORT_PORTAL_GUARDIAN,
      search,
    });
    const data = await laravelRequest<SupportFaqSearchHit[]>(
      `/support/faq/search?${query.toString()}`
    );
    return jsonSuccess(data);
  } catch (error) {
    return jsonError(error);
  }
}
