"use client";

import { useQuery } from "@tanstack/react-query";

import { queryConfig } from "@/lib/cache/query-config";
import { childrenBff } from "@/services/bff/children.bff";
import { bffClient } from "@/services/bff/client";
import { queryKeys } from "@/services/queries/query-keys";
import type { StudentDashboard } from "@/types/student-learning";

export function useStudentDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: ["student", "dashboard"],
    queryFn: () => bffClient<StudentDashboard>("/api/student/dashboard"),
    enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianSupervisionDashboardQuery(
  childRef: string,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.children.learning(childRef),
    queryFn: () => childrenBff.learning(childRef),
    enabled: enabled && Boolean(childRef),
    staleTime: queryConfig.staleTime,
  });
}
