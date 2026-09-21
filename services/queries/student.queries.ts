"use client";

import { useQueries, useQuery } from "@tanstack/react-query";

import { queryConfig } from "@/lib/cache/query-config";
import { learningSearchParams } from "@/services/bff/children.bff";
import { studentLearningBff } from "@/services/bff/student-learning.bff";
import { queryKeys } from "@/services/queries/query-keys";
import { LEARNING_CHART_SERIES } from "@/types/domain/learning";
import type { LearningQueryFilters } from "@/types/domain/learning";

export function useStudentLearningKpiQuery(
  filters: LearningQueryFilters,
  enabled = true
) {
  const filterKey = learningSearchParams(filters);
  return useQuery({
    queryKey: queryKeys.student.learningKpi(filterKey),
    queryFn: () => studentLearningBff.learningKpi(filters),
    enabled,
    staleTime: queryConfig.learningKpiStaleTime,
  });
}

export function useStudentLearningChartsQuery(
  filters: LearningQueryFilters,
  enabled = true
) {
  const filterKey = learningSearchParams(filters);
  return useQueries({
    queries: LEARNING_CHART_SERIES.map((series) => ({
      queryKey: queryKeys.student.learningChart(series, filterKey),
      queryFn: () => studentLearningBff.learningChart(series, filters),
      enabled,
      staleTime: queryConfig.staleTime,
    })),
  });
}
