import { laravelHttp } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { requireAuth } from "@/lib/auth/session";
import { ApiError } from "@/types/api";
import type { CatalogSubject } from "@/types/guardian-study-planner";

const PAGE_SIZE = 100;
const MAX_PAGES = 20;

type SubjectRecord = {
  uuid?: unknown;
  name?: unknown;
};

function toSubject(value: SubjectRecord): CatalogSubject | null {
  if (typeof value.uuid !== "string" || typeof value.name !== "string") {
    return null;
  }
  const uuid = value.uuid.trim();
  const name = value.name.trim();
  if (!uuid || !name) return null;
  return { uuid, name };
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

  if (Array.isArray(record.subjects)) {
    const pagination = record.pagination as { total_pages?: unknown } | null;
    const totalPages =
      pagination && typeof pagination.total_pages === "number"
        ? pagination.total_pages
        : 1;
    return { items: record.subjects as SubjectRecord[], lastPage: totalPages };
  }

  if (Array.isArray(record.data)) {
    const meta = record.meta as { last_page?: unknown } | null;
    const lastPage =
      meta && typeof meta.last_page === "number" ? meta.last_page : 1;
    return { items: record.data as SubjectRecord[], lastPage };
  }

  throw new ApiError({
    title: "Resposta inválida",
    status: 502,
    detail: "Não foi possível ler as disciplinas.",
  });
}

export async function GET() {
  try {
    await requireAuth();

    const byUuid = new Map<string, CatalogSubject>();
    let page = 1;
    let lastPage = 1;

    while (page <= lastPage && page <= MAX_PAGES) {
      const response = await laravelHttp.get(
        `/admin/subjects?page=${page}&page_size=${PAGE_SIZE}`
      );
      const result = readSubjectsPage(response.data);

      for (const item of result.items) {
        const subject = toSubject(item);
        if (subject) byUuid.set(subject.uuid, subject);
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
