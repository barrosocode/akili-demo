"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { endAuthenticatedTawkSession } from "@/features/support/tawk";
import { assistanceBff } from "@/services/bff/assistance.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useEndAssistanceMutation() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => assistanceBff.end(),
    onSuccess: async (result) => {
      await endAuthenticatedTawkSession();
      queryClient.removeQueries({ queryKey: queryKeys.support.tawkIdentityRoot });
      queryClient.removeQueries({ queryKey: queryKeys.auth.me });
      queryClient.clear();
      window.location.assign(result.redirectTo);
    },
    onError: async () => {
      await endAuthenticatedTawkSession();
      queryClient.clear();
      router.refresh();
    },
  });
}
