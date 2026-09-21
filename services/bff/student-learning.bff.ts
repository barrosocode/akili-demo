import { learningSearchParams } from "@/services/bff/children.bff";
import { bffClient } from "@/services/bff/client";
import type {
  LearningChart,
  LearningChartSeries,
  LearningKpi,
  LearningQueryFilters,
} from "@/types/domain/learning";
import type { StudentDashboard, StudentFrequency } from "@/types/student-learning";

export const studentLearningBff = {
  dashboard() {
    return bffClient<StudentDashboard>("/api/student/dashboard");
  },

  frequency() {
    return bffClient<StudentFrequency>("/api/student/kpis/frequency");
  },

  learningKpi(filters: LearningQueryFilters) {
    return bffClient<LearningKpi>(
      `/api/student/kpis/learning?${learningSearchParams(filters)}`
    );
  },

  learningChart(series: LearningChartSeries, filters: LearningQueryFilters) {
    return bffClient<LearningChart>(
      `/api/student/charts/learning?${learningSearchParams(filters, series)}`
    );
  },
};
