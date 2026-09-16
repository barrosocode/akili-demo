import { supportLaravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import type { SupportDeskUser } from "@/features/support-desk/types";

type RouteContext = { params: Promise<{ uuid: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { uuid } = await context.params;
    const user = await supportLaravelRequest<SupportDeskUser>(
      `/support/users/${uuid}`,
      { skipUnauthorizedRetry: true }
    );
    return jsonSuccess(user);
  } catch (error) {
    return jsonError(error);
  }
}
