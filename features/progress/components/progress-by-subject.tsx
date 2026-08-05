import { PerformanceBadge } from "@/features/progress/components/performance-badge";
import type { ChildMaterial } from "@/types/domain/child";

type ProgressBySubjectProps = {
  materials: ChildMaterial[];
};

export function ProgressBySubject({ materials }: ProgressBySubjectProps) {
  if (!materials.length) {
    return (
      <div className="widget mb-4">
        <h3 className="widget_title">Por disciplina</h3>
        <p className="mb-0">Nenhum material em andamento no momento.</p>
      </div>
    );
  }

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Por disciplina</h3>
      <div className="row">
        {materials.map((material) => {
          const percent = material.percentComplete ?? 0;
          return (
            <div
              key={`${material.packageName}-${material.subject}`}
              className="col-md-6 mb-3"
            >
              <div className="border rounded p-3 h-100">
                <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                  <strong>{material.subject ?? material.packageName}</strong>
                  <PerformanceBadge level={material.performanceLevel} />
                </div>
                <div className="progress mb-2" aria-label="Progresso da disciplina">
                  <div className="progress-bar" style={{ width: `${percent}%` }} />
                </div>
                <p className="mb-1">{percent}% concluído</p>
                {material.teacherName ? (
                  <p className="mb-0 small">Professor(a): {material.teacherName}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
