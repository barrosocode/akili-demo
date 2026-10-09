import { requireChildUuid } from "@/lib/api/guardian-child";
import { laravelResource } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess, validationError } from "@/lib/api/response";
import type { GuardianStudySetting } from "@/types/guardian-study-planner";

const REVIEW_MODELS = new Set(["dehaene", "leitner", "custom", "livre"]);

function parseSettingsBody(body: unknown): GuardianStudySetting | null {
  if (typeof body !== "object" || body === null) return null;
  const record = body as Record<string, unknown>;
  if (typeof record.inverted_classroom !== "boolean") return null;
  if (typeof record.spaced_review !== "boolean") return null;
  if (typeof record.review_model !== "string" || !REVIEW_MODELS.has(record.review_model)) {
    return null;
  }
  if (typeof record.tdah_adjustment !== "boolean") return null;
  if (typeof record.on_medication !== "boolean") return null;

  const items =
    record.items_per_session === null || record.items_per_session === undefined
      ? null
      : record.items_per_session;
  if (items !== null && (typeof items !== "number" || items < 1 || items > 4)) {
    return null;
  }

  return {
    uuid: null,
    inverted_classroom: record.inverted_classroom,
    spaced_review: record.spaced_review,
    review_model: record.review_model as GuardianStudySetting["review_model"],
    items_per_session: items,
    tdah_adjustment: record.tdah_adjustment,
    on_medication: record.on_medication,
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ ref: string }> }
) {
  try {
    const { ref } = await context.params;
    const uuid = await requireChildUuid(ref);
    const setting = await laravelResource<GuardianStudySetting>(
      `/guardian/students/${uuid}/study-settings`,
      "study_setting"
    );
    return jsonSuccess(setting);
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
    const parsed = parseSettingsBody(await request.json().catch(() => null));
    if (!parsed) {
      return validationError({
        inverted_classroom: "Confira as opções de estudo.",
      });
    }

    const setting = await laravelResource<GuardianStudySetting>(
      `/guardian/students/${uuid}/study-settings`,
      "study_setting",
      {
        method: "PUT",
        data: {
          inverted_classroom: parsed.inverted_classroom,
          spaced_review: parsed.spaced_review,
          review_model: parsed.review_model,
          items_per_session: parsed.items_per_session,
          tdah_adjustment: parsed.tdah_adjustment,
          on_medication: parsed.on_medication,
        },
      }
    );
    return jsonSuccess(setting);
  } catch (error) {
    return jsonError(error);
  }
}
