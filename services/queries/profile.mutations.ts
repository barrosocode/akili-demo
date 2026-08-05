"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { UpdateGuardianProfileValues } from "@/features/profile/schemas/profile.schema";
import { profileBff } from "@/services/bff/profile.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGuardianProfileValues) =>
      profileBff.update(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile.me(), profile);
      void queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
    },
  });
}
