import type { GamificationMission } from "@/types/domain/child";

type MissionListProps = {
  missions: GamificationMission[];
};

export function MissionList({ missions }: MissionListProps) {
  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Missões</h3>
      {!missions.length ? (
        <p className="mb-0">Nenhuma missão ativa no momento.</p>
      ) : (
        <ul className="list-unstyled mb-0">
          {missions.map((mission) => {
            const percent = Math.min(
              100,
              Math.round((mission.progress / Math.max(mission.target, 1)) * 100)
            );
            const done = mission.status === "completed";
            return (
              <li key={mission.title} className="mb-3">
                <div className="d-flex justify-content-between gap-2">
                  <strong>{mission.title}</strong>
                  <span>{done ? "Concluída" : `${mission.progress}/${mission.target}`}</span>
                </div>
                <div className="progress my-1" aria-label={mission.title}>
                  <div className="progress-bar" style={{ width: `${percent}%` }} />
                </div>
                <small>+{mission.rewardXp} XP</small>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
