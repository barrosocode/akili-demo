"use client";

import { useQuery } from "@tanstack/react-query";

import { studentProgressScopeQuery } from "@/features/student/lib/student-progress-scope";
import { bffClient } from "@/services/bff/client";
import type { StudentFrequency } from "@/types/student-learning";

export function useStudentFrequencyQuery(enabled = true, subjectUuid?: string) {
  const subject = subjectUuid?.trim() ?? "";

  return useQuery({
    queryKey: subject
      ? ["student", "kpis", "frequency", subject]
      : ["student", "kpis", "frequency"],
    queryFn: () =>
      bffClient<StudentFrequency>(
        `/api/student/kpis/frequency${studentProgressScopeQuery(subject)}`
      ),
    enabled,
  });
}
