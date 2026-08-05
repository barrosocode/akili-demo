import { BadgeGrid } from "@/features/gamification/components/badge-grid";
import { MissionList } from "@/features/gamification/components/mission-list";
import { RewardsList } from "@/features/gamification/components/rewards-list";
import { StreakCounter } from "@/features/gamification/components/streak-counter";
import { XpLevelCard } from "@/features/gamification/components/xp-level-card";
import type { ChildGamification } from "@/types/domain/child";

type GamificationPanelProps = {
  gamification: ChildGamification | null;
};

export function GamificationPanel({ gamification }: GamificationPanelProps) {
  if (!gamification) {
    return (
      <div className="widget mb-4">
        <h3 className="widget_title">Conquistas</h3>
        <p className="mb-0">
          A gamificação não está disponível neste plano ou ainda não há dados.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6">
          <XpLevelCard gamification={gamification} />
        </div>
        <div className="col-md-6">
          <StreakCounter days={gamification.streakDays} />
        </div>
      </div>
      <BadgeGrid badges={gamification.badges} />
      <MissionList missions={gamification.missions} />
      <RewardsList rewards={gamification.rewards} />
    </div>
  );
}
