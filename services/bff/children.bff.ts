import { bffClient } from "@/services/bff/client";
import type {
  LearningChart,
  LearningChartSeries,
  LearningKpi,
  LearningQueryFilters,
} from "@/types/domain/learning";
import type { ChildProgress, ChildSummary } from "@/types/domain/child";
import type { StudentDashboard } from "@/types/student-learning";

function learningSearchParams(
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
  return params.toString();
}

export const childrenBff = {
  list() {
    return bffClient<ChildSummary[]>("/api/guardian/children");
  },

  progress(ref: string) {
    return bffClient<ChildProgress>(`/api/guardian/children/${ref}/progress`);
  },

  learning(ref: string) {
    return bffClient<StudentDashboard>(`/api/guardian/children/${ref}/learning`);
  },

  learningKpi(ref: string, filters: LearningQueryFilters) {
    return bffClient<LearningKpi>(
      `/api/guardian/children/${ref}/kpis/learning?${learningSearchParams(filters)}`
    );
  },

  learningChart(
    ref: string,
    series: LearningChartSeries,
    filters: LearningQueryFilters
  ) {
    return bffClient<LearningChart>(
      `/api/guardian/children/${ref}/charts/learning?${learningSearchParams(filters, series)}`
    );
  },

  create(payload: Record<string, unknown>) {
    return bffClient<ChildSummary>("/api/guardian/children", {
      method: "POST",
      body: payload,
    });
  },
};

export { learningSearchParams };
