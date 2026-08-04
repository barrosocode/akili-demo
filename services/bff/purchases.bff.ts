import { bffClient } from "@/services/bff/client";

export interface PurchaseSummary {
  ref: string;
  name: string;
  status: string;
  amountLabel: string;
}

export const purchasesBff = {
  list() {
    return bffClient<PurchaseSummary[]>("/api/guardian/purchases");
  },
};
