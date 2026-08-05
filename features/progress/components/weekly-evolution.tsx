type WeeklyEvolutionProps = {
  values: number[];
};

export function WeeklyEvolution({ values }: WeeklyEvolutionProps) {
  if (!values.length) {
    return null;
  }

  const max = Math.max(...values, 1);
  const days = ["D-6", "D-5", "D-4", "D-3", "D-2", "D-1", "Hoje"];

  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Evolução semanal</h3>
      <div
        className="d-flex align-items-end gap-2"
        style={{ minHeight: 120 }}
        role="img"
        aria-label="Gráfico de evolução semanal do progresso"
      >
        {values.map((value, index) => {
          const height = Math.max(8, Math.round((value / max) * 100));
          return (
            <div
              key={`${days[index] ?? index}-${value}`}
              className="text-center flex-fill"
            >
              <div
                className="mx-auto rounded"
                style={{
                  height,
                  width: "70%",
                  background: "var(--theme-color, #2d6cdf)",
                  opacity: 0.85,
                }}
                title={`${value}%`}
              />
              <small className="d-block mt-1">{days[index] ?? index}</small>
              <small>
                <strong>{value}%</strong>
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
}
