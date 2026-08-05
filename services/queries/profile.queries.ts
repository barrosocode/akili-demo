"use client";

import { useQuery } from "@tanstack/react-query";

import { queryConfig } from "@/lib/cache/query-config";
import { profileBff } from "@/services/bff/profile.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useGuardianProfileQuery() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileBff.get(),
    staleTime: queryConfig.staleTime,
  });
}
