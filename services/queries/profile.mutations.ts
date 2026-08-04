"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileBff } from "@/services/bff/profile.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { name: string }) => profileBff.update(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth.me, user);
    },
  });
}
