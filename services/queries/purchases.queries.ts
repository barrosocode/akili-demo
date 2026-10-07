"use client";

import { useQuery } from "@tanstack/react-query";
import { purchasesBff } from "@/services/bff/purchases.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function usePurchasesQuery(page = 1, enabled = true) {
  return useQuery({
    queryKey: queryKeys.purchases.list(page),
    queryFn: () => purchasesBff.list(page),
    enabled,
    retry: false,
  });
}
