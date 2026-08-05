type StreakCounterProps = {
  days: number;
};

export function StreakCounter({ days }: StreakCounterProps) {
  return (
    <div className="widget mb-4">
      <h3 className="widget_title">Sequência de estudos</h3>
      <p className="mb-0" style={{ fontSize: "1.5rem" }}>
        🔥 <strong>{days}</strong>{" "}
        {days === 1 ? "dia consecutivo" : "dias consecutivos"}
      </p>
    </div>
  );
}
