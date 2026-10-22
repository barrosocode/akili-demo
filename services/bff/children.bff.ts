import { studentProgressScopeQuery } from "@/features/student/lib/student-progress-scope";
import { bffClient } from "@/services/bff/client";
import { learningSearchParams } from "@/services/bff/learning-search-params";
import type {
  LearningChart,
  LearningChartSeries,
  LearningKpi,
  LearningQueryFilters,
} from "@/types/domain/learning";
import type { ChildProgress, ChildSummary } from "@/types/domain/child";
import type { StudentDashboard } from "@/types/student-learning";

export const childrenBff = {
  list() {
    return bffClient<ChildSummary[]>("/api/guardian/children");
  },

  progress(ref: string) {
    return bffClient<ChildProgress>(`/api/guardian/children/${ref}/progress`);
  },
  learning(ref: string, subjectUuid?: string) {
    return bffClient<StudentDashboard>(
      `/api/guardian/children/${ref}/learning${studentProgressScopeQuery(subjectUuid)}`
    );
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

};

export { learningSearchParams };
