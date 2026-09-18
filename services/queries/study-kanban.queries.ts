"use client";

import { useInfiniteQuery } from "@tanstack/react-query";

import { guardianStudyPlannerBff } from "@/services/bff/guardian-study-planner.bff";
import { studentStudyBoardBff } from "@/services/bff/student-study-board.bff";
import { queryKeys } from "@/services/queries/query-keys";
import type { StudyTask, StudyTaskStatus } from "@/types/study-task";

function sortTasks(tasks: StudyTask[]): StudyTask[] {
  return [...tasks].sort((left, right) => {
    if (left.position !== right.position) return left.position - right.position;
    return (left.scheduled_start ?? "").localeCompare(right.scheduled_start ?? "");
  });
}

type ColumnSource =
  | { source: "student" }
  | { source: "guardian"; childRef: string };

export function useStudyKanbanColumnQuery(
  column: ColumnSource,
  status: StudyTaskStatus,
  enabled = true
) {
  const queryKey =
    column.source === "student"
      ? queryKeys.studyKanban.studentColumn(status)
      : queryKeys.studyKanban.guardianColumn(column.childRef, status);

  const query = useInfiniteQuery({
    queryKey,
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      column.source === "student"
        ? studentStudyBoardBff.tasks(status, pageParam)
        : guardianStudyPlannerBff.tasks(column.childRef, status, pageParam),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.pagination;
      if (!pagination) return undefined;
      if (pagination.page >= pagination.total_pages) return undefined;
      return pagination.page + 1;
    },
    enabled:
      enabled &&
      (column.source === "student" || Boolean(column.childRef)),
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    staleTime: 15_000,
  });

  const tasks = sortTasks(
    query.data?.pages.flatMap((page) => page.items) ?? []
  );

  return {
    ...query,
    tasks,
  };
}
