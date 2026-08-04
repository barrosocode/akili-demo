"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { childrenBff } from "@/services/bff/children.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useCreateChildMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => childrenBff.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.children.all });
    },
  });
}
