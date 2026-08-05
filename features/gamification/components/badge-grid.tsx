import type { GamificationBadge } from "@/types/domain/child";

type BadgeGridProps = {
  badges: GamificationBadge[];
};

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Medalhas</h3>
      {!badges.length ? (
        <p className="mb-0">Ainda não há medalhas — continue estudando!</p>
      ) : (
        <div className="row">
          {badges.map((badge) => (
            <div key={badge.key} className="col-6 col-md-4 mb-3">
              <div className="border rounded p-3 text-center h-100">
                <div style={{ fontSize: "1.75rem" }} aria-hidden>
                  {badge.icon}
                </div>
                <strong>{badge.name}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
