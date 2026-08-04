"use client";

import { useQuery } from "@tanstack/react-query";
import { childrenBff } from "@/services/bff/children.bff";
import { queryKeys } from "@/services/queries/query-keys";
import { queryConfig } from "@/lib/cache/query-config";

export function useChildrenQuery() {
  return useQuery({
    queryKey: queryKeys.children.list(),
    queryFn: () => childrenBff.list(),
    staleTime: queryConfig.staleTime,
  });
}

export function useChildProgressQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.children.progress(ref),
    queryFn: () => childrenBff.progress(ref),
    enabled: Boolean(ref) && enabled,
    staleTime: queryConfig.staleTime,
  });
}
