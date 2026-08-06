"use client";

import { useQuery } from "@tanstack/react-query";

import type { StudentDashboard } from "@/types/student-learning";
import { bffClient } from "@/services/bff/client";

export function useStudentDashboardQuery(enabled = true) {
  return useQuery({
    queryKey: ["student", "dashboard"],
    queryFn: () => bffClient<StudentDashboard>("/api/student/dashboard"),
    enabled,
  });
}

export function useGuardianSupervisionDashboardQuery(childRef: string, enabled = true) {
  return useQuery({
    queryKey: ["guardian", "supervision", childRef, "dashboard"],
    queryFn: () => bffClient<StudentDashboard>(`/api/guardian/children/${childRef}/learning`),
    enabled: enabled && Boolean(childRef),
  });
}
