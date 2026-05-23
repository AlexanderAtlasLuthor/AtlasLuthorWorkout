export default function TodayPage({
  text,
  t,
  themeFor,
  weeklyMetrics,
  todayDisplayName,
  fmtExW,
  openWorkout,
  resetWeek,
  incompleteExerciseRows,
  displayDay,
}) {
  const fallbackRow = {
    key: "done",
    exercise: { name: t("Todos los ejercicios completados", "All exercises completed"), weight: "" },
    dayName: weeklyMetrics.today,
    sessionName: t("Protocolo", "Protocol"),
    setsDone: 0,
    setsTotal: 0,
    setsLeft: 0,
  };
  const rows = incompleteExerciseRows.length ? incompleteExerciseRows : [fallbackRow];

  return (
    <div className="detail-list">
      <div className="detail-grid">
        <div className="detail-card">
          <p className="detail-label">{text.daySection}</p>
          <p className="detail-value" style={{ color: themeFor(weeklyMetrics.todayType).accent }}>{todayDisplayName} - {weeklyMetrics.todayType}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">{text.mWeekly}</p>
          <p className="detail-value" style={{ color: "#90C8FF" }}>{weeklyMetrics.weeklyProgress}%</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">{text.mDone}</p>
          <p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedExercises}/{weeklyMetrics.totalExercises}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">{text.mSessions}</p>
          <p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedSessions}/{weeklyMetrics.workoutSessions}</p>
        </div>
      </div>
      <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
        {text.startToday}
      </button>
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
        <button className="dark-btn" onClick={resetWeek}>{text.resetWeek}</button>
      </div>
      <div className="home-card">
        <p className="detail-label">{t("PRÓXIMAS PRIORIDADES", "NEXT PRIORITIES")}</p>
        <div className="detail-list">
          {rows.slice(0, 4).map(row => (
            <div key={`${row.key}-today-priority`} className="detail-row">
              <div>
                <p className="detail-row-main">{row.exercise.name}</p>
                <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} - {row.setsDone}/{row.setsTotal} {text.setsWord}</p>
              </div>
              <span style={{ color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtExW(row.exercise.weight)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
