export type LearningKpiOutcome = "all" | "correct" | "incorrect";

export type LearningSessionPosition = "all" | "start" | "middle" | "end";

export type LearningChartSeries =
  | "time_ratio_over_time"
  | "time_ratio_by_order"
  | "accuracy_over_time"
  | "accuracy_by_order"
  | "accuracy_by_time_ratio";

export type LearningQueryFilters = {
  date_from: string;
  date_to: string;
  outcome: LearningKpiOutcome;
  session_position: LearningSessionPosition;
};

export type LearningKpi = {
  aggregation: "response";
  filters: Record<string, string | null>;
  time_ratio: {
    avg: number | null;
    responses_count: number;
    avg_response_time_ms: number | null;
    avg_expected_time_seconds: number | null;
  };
  accuracy: {
    percent: number | null;
    correct_count: number;
    incorrect_count: number;
    responses_count: number;
  };
};

export type LearningChartPoint = {
  x: string | number;
  y: number | null;
  n: number;
  capped?: boolean;
};

export type LearningChart = {
  series: LearningChartSeries;
  bucket: string;
  filters: Record<string, string | null>;
  points: LearningChartPoint[];
};
