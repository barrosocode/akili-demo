import type { GamificationReward } from "@/types/domain/child";

type RewardsListProps = {
  rewards: GamificationReward[];
};

export function RewardsList({ rewards }: RewardsListProps) {
  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Recompensas</h3>
      {!rewards.length ? (
        <p className="mb-0">Complete missões para desbloquear recompensas.</p>
      ) : (
        <ul className="mb-0">
          {rewards.map((reward) => (
            <li key={reward.title}>{reward.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
