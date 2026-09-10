"use client";

import { useQuery } from "@tanstack/react-query";

import { queryConfig } from "@/lib/cache/query-config";
import { shouldProbeDemoPersonas } from "@/lib/demo/personas";
import { useSession } from "@/providers/session-provider";
import { BffClientError } from "@/services/bff/client";
import { demoBff } from "@/services/bff/demo.bff";
import { queryKeys } from "@/services/queries/query-keys";
import type { DemoPersona } from "@/types/demo";

function isDemoUnavailable(error: unknown): boolean {
  return (
    error instanceof BffClientError &&
    (error.status === 403 || error.status === 404)
  );
}

export function useDemoPersonas() {
  const { user, isAuthenticated } = useSession();
  const enabled = isAuthenticated && shouldProbeDemoPersonas(user);

  const query = useQuery({
    queryKey: queryKeys.demo.personas,
    queryFn: () => demoBff.listPersonas(),
    enabled,
    retry: false,
    staleTime: queryConfig.staleTime,
  });

  const personas: DemoPersona[] = isDemoUnavailable(query.error)
    ? []
    : (query.data ?? []);

  return {
    personas,
    isLoading: query.isLoading && enabled,
    isUnavailable: isDemoUnavailable(query.error),
  };
}
