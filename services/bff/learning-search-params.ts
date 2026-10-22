import type {
  LearningChartSeries,
  LearningQueryFilters,
} from "@/types/domain/learning";

export function learningSearchParams(
  filters: LearningQueryFilters,
  series?: LearningChartSeries
): string {
  const params = new URLSearchParams({
    date_from: filters.date_from,
    date_to: filters.date_to,
    outcome: filters.outcome,
    session_position: filters.session_position,
  });

  if (series) params.set("series", series);

  const subjectUuid = filters.subject_uuid?.trim() ?? "";
  if (subjectUuid) params.set("subject_uuid", subjectUuid);

  return params.toString();
}
