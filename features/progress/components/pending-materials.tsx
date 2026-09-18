import type { ChildMaterial } from "@/types/domain/child";

type PendingMaterialsProps = {
  materials: ChildMaterial[];
};

export function PendingMaterials({ materials }: PendingMaterialsProps) {
  if (!materials.length) {
    return (
      <div className="widget mb-4">
        <h3 className="widget_title">Materiais pendentes</h3>
        <p className="mb-0">Nenhum material liberado no momento.</p>
      </div>
    );
  }

  const pending = materials.filter(
    (item) => (item.percentComplete ?? 0) < 100
  );

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Materiais pendentes</h3>
      {!pending.length ? (
        <p className="mb-0">Todos os materiais estão concluídos. Parabéns!</p>
      ) : (
        <ul className="list-unstyled mb-0">
          {pending.map((item) => (
            <li
              key={`${item.packageName}-${item.nextLesson}`}
              className="mb-2 pb-2 border-bottom"
            >
              <strong>{item.subject ?? item.packageName}</strong>
              <div>
                {item.nextLesson ?? "Continuar estudos"}
                {item.percentComplete != null
                  ? ` · ${item.percentComplete}%`
                  : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
