"use client";

import { useQueries, useQuery } from "@tanstack/react-query";
import { childrenBff, learningSearchParams } from "@/services/bff/children.bff";
import { consentsBff } from "@/services/bff/consents.bff";
import { queryKeys } from "@/services/queries/query-keys";
import { queryConfig } from "@/lib/cache/query-config";
import {
  LEARNING_CHART_SERIES,
  type LearningQueryFilters,
} from "@/types/domain/learning";

export function useChildRegistrationConsentsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.children.registrationConsents(),
    queryFn: () => consentsBff.childRegistration(),
    enabled,
    staleTime: 0,
    retry: false,
  });
}

export function useChildrenQuery() {
  return useQuery({
    queryKey: queryKeys.children.list(),
    queryFn: () => childrenBff.list(),
    staleTime: queryConfig.staleTime,
  });
}

export function useChildProgressQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.children.progress(ref),
    queryFn: () => childrenBff.progress(ref),
    enabled: Boolean(ref) && enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useChildLearningQuery(ref: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.children.learning(ref),
    queryFn: () => childrenBff.learning(ref),
    enabled: Boolean(ref) && enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useChildLearningKpiQuery(
  ref: string,
  filters: LearningQueryFilters,
  enabled = true
) {
  const filterKey = learningSearchParams(filters);
  return useQuery({
    queryKey: queryKeys.children.learningKpi(ref, filterKey),
    queryFn: () => childrenBff.learningKpi(ref, filters),
    enabled: Boolean(ref) && enabled,
    staleTime: queryConfig.learningKpiStaleTime,
  });
}

export { LEARNING_CHART_SERIES };

export function useChildLearningChartsQuery(
  ref: string,
  filters: LearningQueryFilters,
  enabled = true
) {
  const filterKey = learningSearchParams(filters);
  return useQueries({
    queries: LEARNING_CHART_SERIES.map((series) => ({
      queryKey: queryKeys.children.learningChart(ref, series, filterKey),
      queryFn: () => childrenBff.learningChart(ref, series, filters),
      enabled: Boolean(ref) && enabled,
      staleTime: queryConfig.staleTime,
    })),
  });
}
