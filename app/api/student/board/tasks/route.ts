import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelResourceCollection } from "@/lib/api/student-laravel-client";
import { studyTasksSearchParams } from "@/lib/api/study-task-query";
import type { StudyTask } from "@/types/study-task";

export async function GET(request: Request) {
  try {
    const query = studyTasksSearchParams(request.url);
    const tasks = await studentLaravelResourceCollection<StudyTask>(
      `/mobile/student/board/tasks?${query}`,
      "tasks"
    );
    return jsonSuccess(tasks);
  } catch (error) {
    return jsonError(error);
  }
}
