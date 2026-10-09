"use client";

import { useQuery } from "@tanstack/react-query";

import { queryConfig } from "@/lib/cache/query-config";
import { guardianStudyPlannerBff } from "@/services/bff/guardian-study-planner.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useGuardianChildBoardQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.board(ref),
    queryFn: () => guardianStudyPlannerBff.board(ref),
    enabled: enabled && Boolean(ref),
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianStudySettingsQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.settings(ref),
    queryFn: () => guardianStudyPlannerBff.settings(ref),
    enabled: enabled && Boolean(ref),
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianAvailabilityQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.availability(ref),
    queryFn: () => guardianStudyPlannerBff.availability(ref),
    enabled: enabled && Boolean(ref),
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianSchoolScheduleQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.schoolSchedule(ref),
    queryFn: () => guardianStudyPlannerBff.schoolSchedule(ref),
    enabled: enabled && Boolean(ref),
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianCurrentStudyPlanQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.currentPlan(ref),
    queryFn: () => guardianStudyPlannerBff.currentPlan(ref),
    enabled: enabled && Boolean(ref),
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianStudyPlansQuery(
  ref: string,
  page: number,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.plans(ref, page),
    queryFn: () => guardianStudyPlannerBff.plans(ref, page),
    enabled: enabled && Boolean(ref),
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianSubjectsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.subjects(),
    queryFn: () => guardianStudyPlannerBff.subjects(),
    enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianChildLearningCatalogQuery(
  ref: string,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.learning(ref),
    queryFn: () => guardianStudyPlannerBff.learning(ref),
    enabled: enabled && Boolean(ref),
    staleTime: queryConfig.staleTime,
  });
}

export function useGuardianStudyPlanPollQuery(
  ref: string,
  planUuid: string | null
) {
  return useQuery({
    queryKey: queryKeys.guardianStudyPlanner.plan(ref, planUuid ?? "none"),
    queryFn: () => guardianStudyPlannerBff.plan(ref, planUuid ?? ""),
    enabled: Boolean(ref && planUuid),
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === "pending" || status === "generating") return 3000;
      return false;
    },
    staleTime: 0,
  });
}
