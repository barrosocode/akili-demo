import { requireChildUuid } from "@/lib/api/guardian-child";
import { laravelResource } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import type { StudentBoard } from "@/types/student-study-board";

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const board = await laravelResource<StudentBoard>(
      `/guardian/students/${uuid}/board`,
      "board"
    );
    return jsonSuccess(board);
  } catch (error) {
    return jsonError(error);
  }
}
