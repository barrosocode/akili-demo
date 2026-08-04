import { sanitizeRecord } from "@/lib/api/sanitize";
import { jsonError, jsonSuccess, notImplemented } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";
import type { ChildSummary } from "@/types/domain/child";

interface GuardianStudentApi {
  uuid: string;
  name: string;
  profile_photo_url?: string | null;
  friendly_code?: string | null;
  grade_label?: string | null;
  school_name?: string | null;
  can_view_progress?: boolean;
  can_purchase?: boolean;
}

function mapChild(student: GuardianStudentApi): ChildSummary {
  const sanitized = sanitizeRecord(
    student as unknown as Record<string, unknown>
  ) as Record<string, unknown>;
  return {
    ref: String(sanitized.ref ?? ""),
    name: String(student.name),
    avatarUrl: student.profile_photo_url ?? null,
    friendlyCode: student.friendly_code ?? null,
    gradeLabel: student.grade_label ?? null,
    schoolName: student.school_name ?? null,
    canViewProgress: Boolean(student.can_view_progress ?? true),
    canPurchase: Boolean(student.can_purchase),
  };
}

export async function GET() {
  try {
    await requireAuth();
    const students = await laravelRequest<GuardianStudentApi[]>("/guardian/students");
    return jsonSuccess(students.map(mapChild));
  } catch (error) {
    return jsonError(error);
  }
}

export async function POST() {
  try {
    const session = await requireAuth();
    if (!session.capabilities.canAddChildren) {
      return jsonError({
        title: "Ação não permitida",
        status: 403,
        detail: "Responsáveis vinculados pela escola não podem cadastrar filhos por aqui.",
      });
    }
    return notImplemented("Cadastro de filho");
  } catch (error) {
    return jsonError(error);
  }
}
