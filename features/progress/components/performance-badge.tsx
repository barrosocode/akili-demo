import { performanceLabel } from "@/features/progress/lib/labels";
import type { PerformanceLevel } from "@/types/domain/child";

type PerformanceBadgeProps = {
  level: PerformanceLevel | string | null | undefined;
};

export function PerformanceBadge({ level }: PerformanceBadgeProps) {
  return (
    <span className="badge bg-theme" style={{ fontWeight: 600 }}>
      {performanceLabel(level)}
    </span>
  );
}
