export default function MetricsPage({
  text,
  t,
  isLightMode,
  weeklyMetrics,
  weeklySetProgress,
  volumeByGroup,
  weeklyVolume,
}) {
  const cards = [
    { label: text.mWeekly, val: `${weeklyMetrics.weeklyProgress}%`, color: "#90C8FF" },
    { label: text.mDone, val: weeklyMetrics.completedExercises, color: "#3FB98A" },
    { label: text.mExercises, val: weeklyMetrics.totalExercises, color: null },
    { label: text.mSets, val: weeklyMetrics.totalSets, color: null },
    { label: text.setProgressLabel, val: `${weeklySetProgress}/${weeklyMetrics.totalSets}`, color: "#90C8FF" },
    { label: text.mSessions, val: weeklyMetrics.workoutSessions, color: null },
    { label: text.mCompleted, val: weeklyMetrics.completedSessions, color: "#3FB98A" },
    { label: text.mCardio, val: weeklyMetrics.cardioSessions, color: "#FF9860" },
  ];

  return (
    <div className="detail-list">
      <div className="detail-grid">
        {cards.map(metric => (
          <div key={metric.label} className="detail-card">
            <p className="detail-label">{metric.label}</p>
            <p className="detail-value" style={metric.color ? { color: metric.color } : undefined}>{metric.val}</p>
          </div>
        ))}
      </div>

      <div className="home-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <p className="detail-label">{text.muscleBalance.toUpperCase()}</p>
          <p style={{ fontSize: 11, color: "#B8A0FF", fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
            {text.totalVolume}: {Math.round(weeklyVolume).toLocaleString()}
          </p>
        </div>
        <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
          {Object.entries(volumeByGroup).sort((a, b) => b[1] - a[1]).map(([group, vol]) => {
            const pct = weeklyVolume > 0 ? Math.round((vol / weeklyVolume) * 100) : 0;
            return (
              <div key={group}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: isLightMode ? "#5A6270" : "#8A8F99", marginBottom: 4 }}>
                  <span>{group}</span><span>{pct}%</span>
                </div>
                <div style={{ height: 7, borderRadius: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "#B8A0FF", borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </div>
            );
          })}
          {weeklyVolume === 0 && (
            <p style={{ color: "#8A8F99", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
              {t("Completa series para ver tu volumen y balance muscular.", "Complete sets to see your volume and muscle balance.")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
