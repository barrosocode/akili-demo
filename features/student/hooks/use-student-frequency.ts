"use client";

import { useQuery } from "@tanstack/react-query";

import { bffClient } from "@/services/bff/client";
import type { StudentFrequency } from "@/types/student-learning";

export function useStudentFrequencyQuery(enabled = true) {
  return useQuery({
    queryKey: ["student", "kpis", "frequency"],
    queryFn: () => bffClient<StudentFrequency>("/api/student/kpis/frequency"),
    enabled,
  });
}
