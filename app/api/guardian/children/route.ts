import { extractEnvelopeList } from "@/lib/api/envelope";
import { jsonError, jsonSuccess, notImplemented } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { laravelRequest } from "@/lib/api/laravel-client";
import { mapPortalChild } from "@/lib/permissions/guardian-capabilities";
import type { PortalChild } from "@/types/portal-session";
import type { ChildSummary } from "@/types/domain/child";

interface NestedGuardianStudentApi {
  can_view_progress?: boolean;
  can_purchase?: boolean;
  accessible?: boolean;
  status?: string;
  student?: {
    uuid?: string;
    name?: string;
    status?: string;
    profile_photo_url?: string | null;
    classrooms?: Array<{ name?: string; school?: { name?: string } }>;
  };
}

function mapLegacyLink(link: NestedGuardianStudentApi): ChildSummary | null {
  const student = link.student;
  if (!student?.uuid || !student.name) return null;

  return mapPortalChild({
    uuid: student.uuid,
    name: student.name,
    profile_photo_url: student.profile_photo_url ?? null,
    avatar: student.profile_photo_url ?? null,
    status: link.accessible === false ? "restricted" : (student.status ?? link.status ?? "active"),
    grade_label: null,
    classroom_name: student.classrooms?.[0]?.name ?? null,
    school_name: student.classrooms?.[0]?.school?.name ?? null,
    progress: null,
    can_view_progress: Boolean(link.can_view_progress),
    can_purchase: Boolean(link.can_purchase),
    accessible: link.accessible !== false,
  });
}

function isFlatChild(item: unknown): item is PortalChild {
  if (typeof item !== "object" || item === null) return false;
  const record = item as Record<string, unknown>;
  return typeof record.uuid === "string" && typeof record.name === "string" && !("student" in record);
}

function withChildDefaults(child: PortalChild): PortalChild {
  return {
    ...child,
    status: child.status || "active",
    profile_photo_url: child.profile_photo_url ?? null,
    avatar: child.avatar ?? null,
    grade_label: child.grade_label ?? null,
    classroom_name: child.classroom_name ?? null,
    school_name: child.school_name ?? null,
    can_view_progress: Boolean(child.can_view_progress),
    can_purchase: Boolean(child.can_purchase),
    accessible: child.accessible !== false,
  };
}

export async function GET() {
  try {
    await requireAuth();
    const payload = await laravelRequest<unknown>("/guardian/students");
    const { items } = extractEnvelopeList(payload, "students");

    const children = items
      .map((item) => {
        if (isFlatChild(item)) return mapPortalChild(withChildDefaults(item));
        return mapLegacyLink(item as NestedGuardianStudentApi);
      })
      .filter((child): child is ChildSummary => child !== null);

    return jsonSuccess(children);
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
        detail:
          "Responsáveis vinculados pela escola não podem cadastrar filhos por aqui.",
      });
    }
    return notImplemented("Cadastro de filho");
  } catch (error) {
    return jsonError(error);
  }
}
