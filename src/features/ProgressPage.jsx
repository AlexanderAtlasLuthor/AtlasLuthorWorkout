import TrendChart from "../components/TrendChart.jsx";

export default function ProgressPage({
  text,
  t,
  isLightMode,
  fmtW,
  displayDay,
  rememberProgress,
  setShowDataTools,
  resetWeek,
  chartEntries,
  maxChartWeight,
  minChartWeight,
  progressEntries,
  sessionHistory,
}) {
  const volumePoints = [...progressEntries]
    .reverse()
    .filter(entry => Number(entry.weeklyVolume) > 0)
    .slice(-20)
    .map(entry => ({ value: Number(entry.weeklyVolume) }));

  return (
    <div className="detail-list">
      <div className="compact-actions">
        <button className="primary-btn" onClick={rememberProgress}>{text.saveProgress}</button>
        <button className="dark-btn" onClick={() => setShowDataTools(true)}>{text.backup}</button>
        <button className="dark-btn" onClick={resetWeek}>{text.resetWeek}</button>
      </div>
      {chartEntries.length > 0 && (
        <div className="home-card" style={{ display: "flex", alignItems: "end", gap: 8, height: 130 }}>
          {chartEntries.map(entry => {
            const range = Math.max(maxChartWeight - minChartWeight, 1);
            const height = 34 + ((entry.weightNumber - minChartWeight) / range) * 66;
            return (
              <div key={`${entry.id}-feature-bar`} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                <div title={fmtW(entry.weight)} style={{ height, maxWidth: 52, margin: "0 auto", borderRadius: "8px 8px 3px 3px", background: "linear-gradient(180deg, #90C8FF, #5C93C8)", boxShadow: "0 0 18px rgba(144,200,255,0.3)" }} />
                <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 9, marginTop: 5 }}>{fmtW(entry.weight)}</p>
              </div>
            );
          })}
        </div>
      )}
      {volumePoints.length >= 2 && (
        <div className="home-card">
          <p className="detail-label">{t("VOLUMEN SEMANAL", "WEEKLY VOLUME")}</p>
          <div style={{ marginTop: 10 }}>
            <TrendChart
              points={volumePoints}
              color="#B8A0FF"
              formatValue={value => Math.round(value).toLocaleString()}
            />
          </div>
        </div>
      )}
      {progressEntries.slice(0, 12).map(entry => (
        <div key={`${entry.id}-feature`} className="detail-row">
          <div>
            <p className="detail-row-main">{entry.date} - {entry.type === "manual" ? text.manualSave : text.autoSnapshot}</p>
            <p className="detail-row-sub">{entry.completedExercises} {text.exercisesWord} - {entry.completedSessions} {text.sessionsWord} - {text.weekWord} {entry.weekKey}</p>
          </div>
          <span style={{ color: "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtW(entry.weight)}</span>
        </div>
      ))}
      {Object.keys(sessionHistory).length > 0 && (
        <div className="home-card">
          <p className="detail-label">{t("HISTORIAL DE SESIONES", "SESSION HISTORY")}</p>
          <div className="detail-list" style={{ marginTop: 10 }}>
            {Object.entries(sessionHistory)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 10)
              .map(([date, entry]) => {
                const exercises = (entry.sessions || []).flatMap(session => session.exercises || []);
                const completed = exercises.filter(item => item.completed).length;
                const bestEst = exercises.reduce((max, item) => Math.max(max, Number(item.est1RM) || 0), 0);
                const sessionNames = (entry.sessions || []).map(session => session.name).filter(Boolean).join(" · ");
                return (
                  <div key={date} className="detail-row">
                    <div>
                      <p className="detail-row-main">{date} · {displayDay(entry.dayName)}</p>
                      <p className="detail-row-sub">{sessionNames ? `${sessionNames} — ` : ""}{completed}/{exercises.length} {text.exercisesWord}</p>
                    </div>
                    {bestEst > 0 && (
                      <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>1RM {fmtW(bestEst)}</span>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
