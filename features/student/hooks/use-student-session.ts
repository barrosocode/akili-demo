"use client";

import { useQuery } from "@tanstack/react-query";

import type { StudentPortalSession } from "@/types/student-learning";
import { bffClient } from "@/services/bff/client";

export function useStudentSession(options?: { enabled?: boolean }) {
  const query = useQuery({
    queryKey: ["student", "session"],
    queryFn: () => bffClient<StudentPortalSession>("/api/student/auth/me"),
    retry: false,
    enabled: options?.enabled ?? true,
  });

  return {
    session: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
