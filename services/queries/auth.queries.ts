"use client";

import { useQuery } from "@tanstack/react-query";
import { authBff } from "@/services/bff/auth.bff";
import { queryKeys } from "@/services/queries/query-keys";
import { queryConfig } from "@/lib/cache/query-config";
import type { SessionUser } from "@/types/session";

/**
 * Sessão do responsável. Mantém a query habilitada (com initialData) para
 * refetch on focus e detectar expiração 401 sem depender só do SSR.
 */
export function useSessionQuery(initialData: SessionUser | null = null) {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: () => authBff.me(),
    initialData: initialData ?? undefined,
    staleTime: queryConfig.staleTime,
    retry: false,
    refetchOnWindowFocus: true,
  });
}
