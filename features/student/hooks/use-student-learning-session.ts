"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { learningSessionCurrentQuery } from "@/lib/api/learning-session-query";
import { bffClient, BffClientError } from "@/services/bff/client";
import { queryKeys } from "@/services/queries/query-keys";
import type {
  ActivityAttempt,
  ActivityResponseSummary,
  CompleteActivityAttemptRequest,
  CompleteLearningSessionRequest,
  LearningSession,
  LearningSessionKind,
  RecordActivityResponseRequest,
  StartActivityAttemptRequest,
  StartLearningSessionRequest,
} from "@/types/student-learning";

async function fetchOrStartLearningSession(options: {
  contentUuid: string;
  contentVersionUuid: string;
  studyTaskUuid?: string;
  sessionKind?: LearningSessionKind;
}): Promise<LearningSession> {
  const { contentUuid, contentVersionUuid, studyTaskUuid, sessionKind } =
    options;
  const currentPath = `/api/student/contents/${contentUuid}/sessions/current${learningSessionCurrentQuery(
    { studyTaskUuid, sessionKind }
  )}`;

  try {
    const current = await bffClient<LearningSession | null>(currentPath);
    if (current && typeof current === "object" && current.uuid) {
      return current;
    }
  } catch (error) {
    if (!(error instanceof BffClientError) || error.status !== 404) {
      throw error;
    }
  }

  const body: StartLearningSessionRequest = {
    content_version_uuid: contentVersionUuid,
  };
  if (studyTaskUuid) {
    body.study_task_uuid = studyTaskUuid;
    body.metadata = { study_task_uuid: studyTaskUuid };
  }

  return bffClient<LearningSession>(
    `/api/student/contents/${contentUuid}/sessions`,
    { method: "POST", body }
  );
}

export function useStudentLearningSessionQuery(
  contentUuid: string,
  contentVersionUuid: string | undefined,
  enabled = true,
  studyTaskUuid?: string,
  sessionKind?: LearningSessionKind
) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: [
      "student",
      "content",
      contentUuid,
      "session",
      contentVersionUuid,
      studyTaskUuid ?? "none",
      sessionKind ?? "none",
    ],
    queryFn: async () => {
      if (!contentVersionUuid) {
        throw new Error("Versão do conteúdo indisponível.");
      }
      const session = await fetchOrStartLearningSession({
        contentUuid,
        contentVersionUuid,
        studyTaskUuid,
        sessionKind,
      });
      if (studyTaskUuid) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.studyKanban.all });
      }
      return session;
    },
    enabled: enabled && Boolean(contentUuid) && Boolean(contentVersionUuid),
    staleTime: Infinity,
    gcTime: 30 * 60 * 1000,
    retry: 1,
  });
}

export function useStartStudentAttemptMutation() {
  return useMutation({
    mutationFn: ({
      sessionUuid,
      body,
    }: {
      sessionUuid: string;
      body: StartActivityAttemptRequest;
    }) =>
      bffClient<ActivityAttempt>(
        `/api/student/sessions/${sessionUuid}/attempts`,
        { method: "POST", body }
      ),
  });
}

export function useCompleteStudentAttemptMutation() {
  return useMutation({
    mutationFn: ({
      attemptUuid,
      body,
    }: {
      attemptUuid: string;
      body: CompleteActivityAttemptRequest;
    }) =>
      bffClient<ActivityAttempt>(
        `/api/student/attempts/${attemptUuid}`,
        { method: "PATCH", body }
      ),
  });
}

export function useRecordStudentResponseMutation() {
  return useMutation({
    mutationFn: ({
      attemptUuid,
      body,
    }: {
      attemptUuid: string;
      body: RecordActivityResponseRequest;
    }) =>
      bffClient<ActivityResponseSummary>(
        `/api/student/attempts/${attemptUuid}/responses`,
        { method: "POST", body }
      ),
  });
}

export function useCompleteStudentSessionMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      sessionUuid,
      body,
    }: {
      sessionUuid: string;
      body: CompleteLearningSessionRequest;
    }) =>
      bffClient<LearningSession>(`/api/student/sessions/${sessionUuid}`, {
        method: "PATCH",
        body,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["study-kanban"] });
    },
  });
}
