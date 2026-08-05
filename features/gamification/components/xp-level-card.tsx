import type { ChildGamification } from "@/types/domain/child";

type XpLevelCardProps = {
  gamification: ChildGamification;
};

export function XpLevelCard({ gamification }: XpLevelCardProps) {
  // Visual aproximado: quanto menor o XP restante, mais cheia a barra.
  const progress = Math.max(
    8,
    Math.min(100, 100 - Math.min(90, gamification.xpToNextLevel / 3))
  );

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Nível e XP</h3>
      <p className="mb-1">
        Nível <strong>{gamification.level}</strong> — {gamification.levelName}
      </p>
      <p className="mb-2">
        <strong>{gamification.xp}</strong> XP · faltam{" "}
        <strong>{gamification.xpToNextLevel}</strong> para o próximo nível
      </p>
      <div className="progress" aria-label="Progresso para o próximo nível">
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
