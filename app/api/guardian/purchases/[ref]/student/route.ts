import { laravelRequest } from "@/lib/api/laravel-client";
import { forbidden, jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { fromRef } from "@/lib/api/sanitize";
import { requireAuth } from "@/lib/auth/session";
import { can } from "@/lib/permissions/can";
import {
  createChildSchema,
  toCreateChildPayload,
  type ChildRelationship,
} from "@/features/children/schemas/create-child.schema";
import type { CreatedGuardianChild } from "@/types/domain/guardian-purchase";

const RELATIONSHIPS = new Set<ChildRelationship>([
  "mother",
  "father",
  "guardian",
  "other",
]);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function extractStudent(payload: unknown): Record<string, unknown> | null {
  const record = asRecord(payload);
  if (!record) return null;
  const nested = asRecord(record.student);
  if (nested) return nested;
  const data = asRecord(record.data);
  const dataStudent = data ? asRecord(data.student) : null;
  if (dataStudent) return dataStudent;
  if (typeof record.name === "string") return record;
  return null;
}

function mapCreatedChild(
  payload: unknown,
  fallbackName: string
): CreatedGuardianChild {
  const student = extractStudent(payload);
  const purchase = asRecord(student?.purchase);
  const packageRecord = asRecord(purchase?.package);
  const relationship =
    typeof student?.relationship === "string" &&
    RELATIONSHIPS.has(student.relationship as ChildRelationship)
      ? student.relationship
      : null;

  const name =
    typeof student?.name === "string" && student.name.trim()
      ? student.name.trim()
      : fallbackName;

  return {
    name,
    preferredName:
      typeof student?.preferred_name === "string" && student.preferred_name.trim()
        ? student.preferred_name.trim()
        : null,
    birthdate: typeof student?.birthdate === "string" ? student.birthdate : null,
    relationship,
    packageName:
      typeof packageRecord?.name === "string" && packageRecord.name.trim()
        ? packageRecord.name.trim()
        : null,
  };
}

export async function POST(
  request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const session = await requireAuth();
    if (
      !session.capabilities.canAddChildren ||
      !can(session.permissions, "guardian.children.create")
    ) {
      return forbidden("Você não tem permissão para cadastrar um filho.");
    }

    const { ref } = await context.params;
    const purchaseUuid = fromRef(ref);
    if (!purchaseUuid) {
      return jsonError({
        title: "Não encontrado",
        status: 404,
        detail: "Não encontramos esta compra.",
      });
    }

    const body = await request.json().catch(() => null);
    const parsed = createChildSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "Verifique este campo.",
        ])
      );
      return validationError(errors);
    }

    const payload = toCreateChildPayload(parsed.data);
    const created = await laravelRequest<unknown>(
      `/guardian/purchases/${purchaseUuid}/student`,
      { method: "POST", data: payload }
    );

    return jsonSuccess(mapCreatedChild(created, payload.name), 201);
  } catch (error) {
    return jsonError(error);
  }
}
