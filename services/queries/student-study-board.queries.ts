"use client";

import { useQuery } from "@tanstack/react-query";

import { queryConfig } from "@/lib/cache/query-config";
import { studentStudyBoardBff } from "@/services/bff/student-study-board.bff";
import { queryKeys } from "@/services/queries/query-keys";

export function useStudentStudyBoardQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.studentStudyBoard.board(),
    queryFn: () => studentStudyBoardBff.board(),
    enabled,
    staleTime: queryConfig.staleTime,
  });
}

export function useStudentCurrentStudyPlanQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.studentStudyBoard.currentPlan(),
    queryFn: () => studentStudyBoardBff.currentPlan(),
    enabled,
    staleTime: queryConfig.staleTime,
  });
}
