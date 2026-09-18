import { jsonError, jsonSuccess } from "@/lib/api/response";
import { laravelResourceCollection } from "@/lib/api/laravel-client";
import { requireAuth } from "@/lib/auth/session";
import type { GuardianBoardSummary } from "@/types/guardian-study-planner";

export async function GET(request: Request) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const page = url.searchParams.get("page") ?? "1";
    const pageSize = url.searchParams.get("page_size") ?? "15";

    const boards = await laravelResourceCollection<GuardianBoardSummary>(
      `/guardian/boards?page=${page}&page_size=${pageSize}`,
      "boards"
    );

    return jsonSuccess(boards);
  } catch (error) {
    return jsonError(error);
  }
}
