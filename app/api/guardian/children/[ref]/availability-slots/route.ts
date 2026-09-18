import { requireChildUuid } from "@/lib/api/guardian-child";
import { laravelResourceCollection } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import type { AvailabilitySlot } from "@/types/guardian-study-planner";

function isSlot(value: unknown): value is AvailabilitySlot {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.weekday === "string" &&
    typeof record.starts_at === "string" &&
    typeof record.ends_at === "string" &&
    typeof record.is_recurring === "boolean" &&
    Array.isArray(record.exception_dates)
  );
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

    const slots = await laravelResourceCollection<AvailabilitySlot>(
      `/guardian/students/${uuid}/availability-slots?page=${page}&page_size=${pageSize}`,
      "availability_slots"
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
    const slots = (body as { availability_slots?: unknown })?.availability_slots;

    if (!Array.isArray(slots) || !slots.every(isSlot)) {
      return validationError({
        availability_slots: "Informe os horários de estudo da semana.",
      });
    }

    const result = await laravelResourceCollection<AvailabilitySlot>(
      `/guardian/students/${uuid}/availability-slots`,
      "availability_slots",
      {
        method: "PUT",
        data: {
          availability_slots: slots.map((slot) => ({
            weekday: slot.weekday,
            starts_at: slot.starts_at,
            ends_at: slot.ends_at,
            is_recurring: slot.is_recurring,
            exception_dates: slot.exception_dates,
          })),
        },
      }
    );
    return jsonSuccess(result);
  } catch (error) {
    return jsonError(error);
  }
}
