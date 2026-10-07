"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { purchasesBff } from "@/services/bff/purchases.bff";
import { queryKeys } from "@/services/queries/query-keys";
import type { CreateChildPayload } from "@/features/children/schemas/create-child.schema";

export function useCreatePurchaseStudentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ref,
      payload,
    }: {
      ref: string;
      payload: CreateChildPayload;
    }) => purchasesBff.createStudent(ref, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.children.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.purchases.all });
    },
  });
}
