import TrendChart from "../../components/TrendChart.jsx";

export default function OneRMModal({
  text,
  t,
  fmtW,
  oneRMExerciseName,
  setOneRMExerciseName,
  exercisePerformance,
}) {
  const perf = exercisePerformance[oneRMExerciseName];
  const history = Array.isArray(perf?.history) ? perf.history : [];
  // Chart wants oldest -> newest; history is stored newest-first.
  const chartPoints = [...history].reverse().slice(-30).map(entry => ({ value: Number(entry.est1RM) || 0 }));

  return (
    <div className="modal-backdrop" onClick={() => setOneRMExerciseName(null)}>
      <div className="modal" onClick={event => event.stopPropagation()}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
          {t("HISTORIAL 1RM", "1RM HISTORY")}
        </p>
        <p style={{ fontSize: 16, color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontWeight: 900, marginBottom: 12 }}>
          {oneRMExerciseName}
        </p>

        <div className="detail-grid" style={{ marginBottom: 12 }}>
          <div className="detail-card"><p className="detail-label">{text.personalBest}</p><p className="detail-value" style={{ color: "#FFD060" }}>{fmtW(perf?.best1RM || 0)}</p></div>
          <div className="detail-card"><p className="detail-label">{t("MEJOR PESO", "BEST WEIGHT")}</p><p className="detail-value" style={{ color: "#90C8FF" }}>{fmtW(perf?.bestWeight || 0)}</p></div>
          <div className="detail-card"><p className="detail-label">{t("MEJOR REPS", "BEST REPS")}</p><p className="detail-value" style={{ color: "#B8A0FF" }}>{perf?.bestReps || 0}</p></div>
          <div className="detail-card"><p className="detail-label">{t("SESIONES", "SESSIONS")}</p><p className="detail-value" style={{ color: "#3FB98A" }}>{history.length}</p></div>
        </div>

        <TrendChart
          points={chartPoints}
          color="#FFD060"
          formatValue={value => fmtW(value)}
          emptyLabel={t("Aún no hay suficientes registros para graficar.", "Not enough records to chart yet.")}
        />

        {history.length > 0 && (
          <div className="detail-list" style={{ marginTop: 14, maxHeight: 220, overflowY: "auto" }}>
            {history.slice(0, 10).map((entry, idx) => (
              <div key={`${entry.date}-${idx}`} className="detail-row">
                <div>
                  <p className="detail-row-main">{entry.date}</p>
                  <p className="detail-row-sub">{fmtW(entry.weight)} × {entry.reps}</p>
                </div>
                <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900 }}>
                  1RM {fmtW(entry.est1RM)}
                </span>
              </div>
            ))}
          </div>
        )}

        <button className="primary-btn" style={{ marginTop: 14, width: "100%" }} onClick={() => setOneRMExerciseName(null)}>
          {text.close || t("Cerrar", "Close")}
        </button>
      </div>
    </div>
  );
}
