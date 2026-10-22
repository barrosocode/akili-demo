"use client";

import { useQuery } from "@tanstack/react-query";

import { studentProgressScopeQuery } from "@/features/student/lib/student-progress-scope";
import { queryConfig } from "@/lib/cache/query-config";
import { childrenBff } from "@/services/bff/children.bff";
import { bffClient } from "@/services/bff/client";
import { queryKeys } from "@/services/queries/query-keys";
import type { StudentDashboard } from "@/types/student-learning";

function subjectKey(subjectUuid?: string): string {
  return subjectUuid?.trim() ?? "";
}

export function useStudentDashboardQuery(enabled = true, subjectUuid?: string) {
  const subject = subjectKey(subjectUuid);

  return useQuery({
    queryKey: subject ? ["student", "dashboard", subject] : ["student", "dashboard"],
    queryFn: () =>
      bffClient<StudentDashboard>(
        `/api/student/dashboard${studentProgressScopeQuery(subject)}`
      ),
    enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianSupervisionDashboardQuery(
  childRef: string,
  enabled = true,
  subjectUuid?: string
) {
  const subject = subjectKey(subjectUuid);

  return useQuery({
    queryKey: subject
      ? [...queryKeys.children.learning(childRef), subject]
      : queryKeys.children.learning(childRef),
    queryFn: () => childrenBff.learning(childRef, subject || undefined),
    enabled: enabled && Boolean(childRef),
    staleTime: queryConfig.staleTime,
  });
}
