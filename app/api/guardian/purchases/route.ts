import { extractEnvelopeList } from "@/lib/api/envelope";
import { laravelRequest } from "@/lib/api/laravel-client";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { toRef } from "@/lib/api/sanitize";
import { requireAuth } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils/format";
import type {
  GuardianPurchase,
  GuardianPurchasePagination,
  GuardianPurchasesPage,
} from "@/types/domain/guardian-purchase";

const STATUS_LABELS: Record<string, string> = {
  paid: "Paga",
  pending: "Pendente",
  expired: "Expirada",
  failed: "Não concluída",
  refunded: "Reembolsada",
};

const UNAVAILABLE_REASONS: Record<string, string> = {
  pending: "O pagamento ainda não foi confirmado.",
  expired: "Esta compra expirou.",
  failed: "O pagamento não foi concluído.",
  refunded: "Esta compra foi reembolsada.",
};

function readPageParams(url: URL): { page: number; pageSize: number } {
  const pageRaw = Number(url.searchParams.get("page") ?? "1");
  const sizeRaw = Number(url.searchParams.get("page_size") ?? "15");
  const page = Number.isInteger(pageRaw) && pageRaw >= 1 ? pageRaw : 1;
  const pageSize =
    Number.isInteger(sizeRaw) && sizeRaw >= 1 && sizeRaw <= 100 ? sizeRaw : 15;
  return { page, pageSize };
}

function readPagination(
  value: unknown,
  fallback: { page: number; pageSize: number; count: number }
): GuardianPurchasePagination {
  const record =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : null;

  const page = typeof record?.page === "number" ? record.page : fallback.page;
  const pageSize =
    typeof record?.page_size === "number" ? record.page_size : fallback.pageSize;
  const totalItems =
    typeof record?.total_items === "number" ? record.total_items : fallback.count;
  const totalPages =
    typeof record?.total_pages === "number"
      ? record.total_pages
      : totalItems > 0
        ? 1
        : 0;

  return { page, pageSize, totalItems, totalPages };
}

function amountLabel(cents: unknown, currency: unknown): string {
  if (typeof cents !== "number" || !Number.isFinite(cents)) return "";
  const code =
    typeof currency === "string" && /^[A-Z]{3}$/.test(currency) ? currency : "BRL";
  return formatCurrency(cents, code);
}

function mapPurchase(item: unknown): GuardianPurchase | null {
  if (typeof item !== "object" || item === null) return null;
  const record = item as Record<string, unknown>;
  if (typeof record.uuid !== "string" || !record.uuid) return null;

  const status = typeof record.status === "string" ? record.status : "";
  const canAddChild = record.can_add_child === true;
  const packageRecord =
    typeof record.package === "object" && record.package !== null
      ? (record.package as Record<string, unknown>)
      : null;
  const studentRecord =
    typeof record.student === "object" && record.student !== null
      ? (record.student as Record<string, unknown>)
      : null;

  const studentName =
    typeof studentRecord?.name === "string" ? studentRecord.name.trim() : "";
  const studentUuid =
    typeof studentRecord?.uuid === "string" ? studentRecord.uuid : "";
  const studentUser =
    typeof studentRecord?.user === "object" && studentRecord.user !== null
      ? (studentRecord.user as Record<string, unknown>)
      : null;
  const rawLogin = studentRecord?.login ?? studentUser?.login;
  const studentLogin =
    typeof rawLogin === "string" && rawLogin.trim() ? rawLogin.trim() : null;

  const student =
    studentName && studentUuid
      ? { ref: toRef(studentUuid), name: studentName, login: studentLogin }
      : studentName
        ? { ref: "", name: studentName, login: studentLogin }
        : null;

  return {
    ref: toRef(record.uuid),
    packageName:
      typeof packageRecord?.name === "string" && packageRecord.name.trim()
        ? packageRecord.name.trim()
        : "Plano",
    statusLabel: STATUS_LABELS[status] ?? "Indisponível",
    amountLabel: amountLabel(record.amount_cents, record.currency),
    paidAt: typeof record.paid_at === "string" ? record.paid_at : null,
    canAddChild,
    unavailableReason:
      canAddChild || student
        ? null
        : (UNAVAILABLE_REASONS[status] ??
          "Esta compra ainda não permite cadastrar um filho."),
    student,
  };
}

export async function GET(request: Request) {
  try {
    await requireAuth();
    const url = new URL(request.url);
    const { page, pageSize } = readPageParams(url);

    const payload = await laravelRequest<unknown>("/guardian/purchases", {
      params: { page, page_size: pageSize },
    });

    const { items, pagination } = extractEnvelopeList(payload, "purchases");
    const purchases = items
      .map(mapPurchase)
      .filter((item): item is GuardianPurchase => item !== null);

    const body: GuardianPurchasesPage = {
      purchases,
      pagination: readPagination(pagination, {
        page,
        pageSize,
        count: purchases.length,
      }),
    };

    return jsonSuccess(body);
  } catch (error) {
    return jsonError(error);
  }
}
