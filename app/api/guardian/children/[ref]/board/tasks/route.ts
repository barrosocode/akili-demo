import { requireChildUuid } from "@/lib/api/guardian-child";
import { laravelResourceCollection } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studyTasksSearchParams } from "@/lib/api/study-task-query";
import type { StudyTask } from "@/types/study-task";

export async function GET(
  request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const query = studyTasksSearchParams(request.url);
    const tasks = await laravelResourceCollection<StudyTask>(
      `/guardian/students/${uuid}/board/tasks?${query}`,
      "tasks"
    );
    return jsonSuccess(tasks);
  } catch (error) {
    return jsonError(error);
  }
}
