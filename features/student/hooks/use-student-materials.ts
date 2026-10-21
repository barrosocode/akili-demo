"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { resolveStudentMaterialsSearch } from "@/features/student/lib/student-materials-search";
import type {
  ContentPlayback,
  StudentMaterial,
  StudentProgressUpdate,
  StudentProgressUpdateRequest,
} from "@/types/student-learning";
import { bffClient } from "@/services/bff/client";

export function useStudentMaterialsQuery(
  enabled = true,
  search?: string,
  subjectUuid?: string
) {
  const resolved = resolveStudentMaterialsSearch(search, subjectUuid);

  return useQuery({
    queryKey: ["student", "materials", resolved.term, resolved.subjectUuid],
    queryFn: () => bffClient<StudentMaterial[]>(resolved.path),
    enabled,
    placeholderData: keepPreviousData,
  });
}

export function useStudentContentQuery(contentUuid: string, enabled = true) {
  return useQuery({
    queryKey: ["student", "content", contentUuid],
    queryFn: () => bffClient<ContentPlayback>(`/api/student/contents/${contentUuid}`),
    enabled: enabled && Boolean(contentUuid),
  });
}

export function useGuardianSupervisionContentQuery(
  childRef: string,
  contentUuid: string,
  enabled = true
) {
  return useQuery({
    queryKey: ["guardian", "supervision", childRef, "content", contentUuid],
    queryFn: () =>
      bffClient<ContentPlayback>(
        `/api/guardian/children/${childRef}/contents/${contentUuid}`
      ),
    enabled: enabled && Boolean(childRef) && Boolean(contentUuid),
  });
}

export function useSaveStudentProgressMutation(contentUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: StudentProgressUpdateRequest) =>
      bffClient<StudentProgressUpdate>(
        `/api/student/contents/${contentUuid}/progress`,
        { method: "POST", body }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["student", "materials"] });
      queryClient.invalidateQueries({ queryKey: ["student", "content", contentUuid] });
      queryClient.invalidateQueries({ queryKey: ["student", "kpis", "frequency"] });
    },
  });
}
