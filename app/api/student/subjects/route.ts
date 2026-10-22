import { studentLaravelEnvelope } from "@/lib/api/student-laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { ApiError } from "@/types/api";
import type { SubjectCatalogItem } from "@/types/subject-catalog";

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

type SubjectRecord = {
  uuid?: unknown;
  name?: unknown;
  color?: unknown;
  icon?: unknown;
};

function toCatalogItem(value: SubjectRecord): SubjectCatalogItem | null {
  if (typeof value.uuid !== "string" || typeof value.name !== "string") {
    return null;
  }

  const uuid = value.uuid.trim();
  const name = value.name.trim();
  if (!uuid || !name) return null;

  return {
    uuid,
    name,
    color: typeof value.color === "string" ? value.color : "",
    icon: typeof value.icon === "string" ? value.icon : "",
  };
}

function readSubjectsPage(payload: unknown): {
  items: SubjectRecord[];
  lastPage: number;
} {
  if (typeof payload !== "object" || payload === null) {
    throw new ApiError({
      title: "Resposta inválida",
      status: 502,
      detail: "Não foi possível ler as disciplinas.",
    });
  }

  const record = payload as Record<string, unknown>;
  if (!Array.isArray(record.data)) {
    throw new ApiError({
      title: "Resposta inválida",
      status: 502,
      detail: "Não foi possível ler as disciplinas.",
    });
  }

  const meta = record.meta;
  const lastPage =
    typeof meta === "object" &&
    meta !== null &&
    typeof (meta as { last_page?: unknown }).last_page === "number"
      ? (meta as { last_page: number }).last_page
      : 1;

  return { items: record.data as SubjectRecord[], lastPage };
}

export async function GET() {
  try {
    const byUuid = new Map<string, SubjectCatalogItem>();
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage && page <= MAX_PAGES) {
      const payload = await studentLaravelEnvelope(
        `/admin/subjects?page=${page}&per_page=${PAGE_SIZE}`
      );
      const result = readSubjectsPage(payload);

      for (const item of result.items) {
        const subject = toCatalogItem(item);
        if (subject && !byUuid.has(subject.uuid)) {
          byUuid.set(subject.uuid, subject);
        }
      }

      lastPage = result.lastPage > 0 ? result.lastPage : 1;
      page += 1;
    }

    const subjects = [...byUuid.values()].sort((left, right) =>
      left.name.localeCompare(right.name, "pt-BR")
    );

    return jsonSuccess(subjects);
  } catch (error) {
    return jsonError(error);
  }
}
