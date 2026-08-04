"use client";

import { useQuery } from "@tanstack/react-query";
import { authBff } from "@/services/bff/auth.bff";
import { queryKeys } from "@/services/queries/query-keys";
import { queryConfig } from "@/lib/cache/query-config";

export function useSessionQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authBff.me(),
    enabled,
    staleTime: queryConfig.staleTime,
    retry: false,
  });
}
