"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { guardianStudyPlannerBff } from "@/services/bff/guardian-study-planner.bff";
import { BffClientError } from "@/services/bff/client";
import { queryKeys } from "@/services/queries/query-keys";
import type {
  AvailabilitySlot,
  GuardianStudySetting,
  SchoolScheduleSlot,
  StudyPlanDetail,
  StudyPlanGenerateInput,
} from "@/types/guardian-study-planner";

export function useSaveGuardianStudySettingsMutation(ref: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: Omit<GuardianStudySetting, "uuid">) =>
      guardianStudyPlannerBff.putSettings(ref, body),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.guardianStudyPlanner.settings(ref),
      });
    },
  });
}

export function useSaveGuardianAvailabilityMutation(ref: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slots: AvailabilitySlot[]) =>
      guardianStudyPlannerBff.putAvailability(ref, slots),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.guardianStudyPlanner.availability(ref),
      });
    },
  });
}

export function useSaveGuardianSchoolScheduleMutation(ref: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slots: SchoolScheduleSlot[]) =>
      guardianStudyPlannerBff.putSchoolSchedule(ref, slots),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.guardianStudyPlanner.schoolSchedule(ref),
      });
    },
  });
}

export function useGenerateStudyPlanMutation(ref: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: StudyPlanGenerateInput): Promise<StudyPlanDetail> => {
      try {
        return await guardianStudyPlannerBff.generate(ref, body);
      } catch (error) {
        if (
          error instanceof BffClientError &&
          error.status === 409 &&
          error.data
        ) {
          return error.data as StudyPlanDetail;
        }
        throw error;
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.guardianStudyPlanner.all,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.studyKanban.all,
      });
    },
  });
}
