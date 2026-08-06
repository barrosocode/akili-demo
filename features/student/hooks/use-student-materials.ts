"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { ContentPlayback, StudentMaterial, StudentProgressUpdate } from "@/types/student-learning";
import { bffClient } from "@/services/bff/client";

export function useStudentMaterialsQuery(enabled = true) {
  return useQuery({
    queryKey: ["student", "materials"],
    queryFn: () => bffClient<StudentMaterial[]>("/api/student/materials"),
    enabled,
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
    mutationFn: (body: Record<string, unknown>) =>
      bffClient<StudentProgressUpdate>(
        `/api/student/contents/${contentUuid}/progress`,
        { method: "POST", body }
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["student", "materials"] });
      queryClient.invalidateQueries({ queryKey: ["student", "content", contentUuid] });
    },
  });
}
