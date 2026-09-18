import { requireChildUuid } from "@/lib/api/guardian-child";
import { laravelResourceCollection } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import type { SchoolScheduleSlot } from "@/types/guardian-study-planner";

function isSlot(value: unknown): value is SchoolScheduleSlot {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.weekday === "string" && typeof record.subject_uuid === "string";
}

export async function GET(
  request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const url = new URL(request.url);
    const page = url.searchParams.get("page") ?? "1";
    const pageSize = url.searchParams.get("page_size") ?? "100";

    const slots = await laravelResourceCollection<SchoolScheduleSlot>(
      `/guardian/students/${uuid}/school-schedule?page=${page}&page_size=${pageSize}`,
      "school_schedule_slots"
    );
    return jsonSuccess(slots);
  } catch (error) {
    return jsonError(error);
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const body = await request.json().catch(() => null);
    const slots = (body as { school_schedule_slots?: unknown })?.school_schedule_slots;

    if (!Array.isArray(slots) || !slots.every(isSlot)) {
      return validationError({
        school_schedule_slots: "Informe os dias e as disciplinas da escola.",
      });
    }

    const result = await laravelResourceCollection<SchoolScheduleSlot>(
      `/guardian/students/${uuid}/school-schedule`,
      "school_schedule_slots",
      {
        method: "PUT",
        data: {
          school_schedule_slots: slots.map((slot) => ({
            weekday: slot.weekday,
            subject_uuid: slot.subject_uuid,
          })),
        },
      }
    );
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}
