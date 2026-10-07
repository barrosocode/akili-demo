import { bffClient } from "@/services/bff/client";
import type { CreateChildPayload } from "@/features/children/schemas/create-child.schema";
import type {
  CreatedGuardianChild,
  GuardianPurchasesPage,
} from "@/types/domain/guardian-purchase";

export const purchasesBff = {
  list(page = 1, pageSize = 15) {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    return bffClient<GuardianPurchasesPage>(
      `/api/guardian/purchases?${params.toString()}`
    );
  },

  createStudent(ref: string, payload: CreateChildPayload) {
    return bffClient<CreatedGuardianChild>(
      `/api/guardian/purchases/${encodeURIComponent(ref)}/student`,
      { method: "POST", body: payload }
    );
  },
};
