"use client";

import { useQuery } from "@tanstack/react-query";

import { bffClient } from "@/services/bff/client";
import type { SubjectCatalogItem } from "@/types/subject-catalog";

export function useStudentSubjectsQuery(enabled = true) {
  return useQuery({
    queryKey: ["student", "subjects"],
    queryFn: () => bffClient<SubjectCatalogItem[]>("/api/student/subjects"),
    enabled,
  });
}
