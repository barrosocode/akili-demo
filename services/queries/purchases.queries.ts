"use client";

import { useQuery } from "@tanstack/react-query";
import { purchasesBff } from "@/services/bff/purchases.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function usePurchasesQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.purchases.list(),
    queryFn: () => purchasesBff.list(),
    enabled,
    retry: false,
  });
}
