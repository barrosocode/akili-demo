import { jsonError, jsonSuccess } from "@/lib/api/response";
import { studentLaravelResource } from "@/lib/api/student-laravel-client";
import type { StudentBoard } from "@/types/student-study-board";

export async function GET() {
  try {
    const board = await studentLaravelResource<StudentBoard>(
      "/mobile/student/board",
      "board"
    );
    return jsonSuccess(board);
  } catch (error) {
    return jsonError(error);
  }
}
