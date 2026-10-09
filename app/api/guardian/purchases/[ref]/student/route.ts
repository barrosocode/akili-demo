import type { NextRequest } from "next/server";

import { laravelRequest } from "@/lib/api/laravel-client";
import { forbidden, jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import { fromRef } from "@/lib/api/sanitize";
import { requireAuth } from "@/lib/auth/session";
import { can } from "@/lib/permissions/can";
import {
  createChildRequestSchema,
  toCreateChildPayload,
  type ChildRelationship,
  type CreateChildConsentInput,
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

function readLogin(student: Record<string, unknown> | null): string | null {
  if (!student) return null;
  if (typeof student.login === "string" && student.login.trim()) {
    return student.login.trim();
  }
  const user = asRecord(student.user);
  if (typeof user?.login === "string" && user.login.trim()) {
    return user.login.trim();
  }
  return null;
}

function resolveClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return request.headers.get("cf-connecting-ip")?.trim() || null;
}

function forensicHeaders(request: NextRequest): Record<string, string> {
  const headers: Record<string, string> = {};
  const clientIp = resolveClientIp(request);
  const userAgent = request.headers.get("user-agent");
  const acceptLanguage = request.headers.get("accept-language");
  if (clientIp) headers["X-Forwarded-For"] = clientIp;
  if (userAgent) headers["User-Agent"] = userAgent;
  if (acceptLanguage) headers["Accept-Language"] = acceptLanguage;
  return headers;
}

function toLaravelConsents(
  consents: CreateChildConsentInput[]
): Array<{ document_uuid: string; accepted: true }> | null {
  const mapped: Array<{ document_uuid: string; accepted: true }> = [];
  for (const consent of consents) {
    const documentUuid = fromRef(consent.documentRef);
    if (!documentUuid) return null;
    mapped.push({ document_uuid: documentUuid, accepted: true });
  }
  return mapped;
}

function mapCreatedChild(
  payload: unknown,
  fallbackName: string,
  fallbackLogin: string
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
    login: readLogin(student) ?? fallbackLogin,
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
  request: NextRequest,
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
    const parsed = createChildRequestSchema.safeParse(body);
    if (!parsed.success) {
      const errors = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
          key,
          value?.[0] ?? "Verifique este campo.",
        ])
      );
      return validationError(errors);
    }

    const consents = toLaravelConsents(parsed.data.consents);
    if (!consents) {
      return validationError({
        consents: "Aceite os termos para cadastrar o filho.",
      });
    }

    const childPayload = toCreateChildPayload(parsed.data, parsed.data.consents);
    const created = await laravelRequest<unknown>(
      `/guardian/purchases/${purchaseUuid}/student`,
      {
        method: "POST",
        headers: forensicHeaders(request),
        data: {
          name: childPayload.name,
          login: childPayload.login,
          password: childPayload.password,
          password_confirmation: childPayload.password_confirmation,
          birthdate: childPayload.birthdate,
          relationship: childPayload.relationship,
          ...(childPayload.preferred_name
            ? { preferred_name: childPayload.preferred_name }
            : {}),
          ...(childPayload.cpf ? { cpf: childPayload.cpf } : {}),
          consents,
        },
      }
    );

    return jsonSuccess(mapCreatedChild(created, childPayload.name, childPayload.login), 201);
  } catch (error) {
    return jsonError(error);
  }
}
