export default function GoalsPage({
  text,
  isLightMode,
  goals,
  weeklyMetrics,
  weeklyGoalPct,
  sessionsGoalPct,
  remainingExercises,
  setCompletionPct,
  setEditingGoals,
}) {
  const rows = [
    { label: text.weeklyProtocol, current: `${weeklyMetrics.weeklyProgress}%`, target: `${goals.weeklyProgressGoal}%`, pct: weeklyGoalPct, color: "#90C8FF" },
    { label: text.completedSessions, current: weeklyMetrics.completedSessions, target: goals.weeklySessionsGoal, pct: sessionsGoalPct, color: "#3FB98A" },
  ];

  return (
    <div className="detail-list">
      <div className="home-card">
        <p className="detail-label">{text.mainFocus}</p>
        <p className="detail-row-main">{goals.focusGoal}</p>
        <p className="detail-row-sub">{text.targetDateSub} {goals.targetDate}</p>
      </div>
      {rows.map(goal => (
        <div key={goal.label} className="detail-card">
          <p className="detail-label">{goal.label.toUpperCase()}</p>
          <p className="detail-value" style={{ color: goal.color }}>{goal.current} / {goal.target}</p>
          <div style={{ height: 9, background: isLightMode ? "#E2E4E9" : "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden", marginTop: 10 }}>
            <div style={{ width: `${goal.pct}%`, height: "100%", background: goal.color, borderRadius: 6, transition: "width 0.4s ease", boxShadow: `0 0 10px ${goal.color}77` }} />
          </div>
        </div>
      ))}
      <button className="primary-btn" onClick={() => setEditingGoals({ ...goals })}>{text.setMyGoals}</button>
      <div className="detail-grid">
        <div className="detail-card"><p className="detail-label">{text.remainingExercises}</p><p className="detail-value">{remainingExercises}</p></div>
        <div className="detail-card"><p className="detail-label">{text.setCompletionLabel}</p><p className="detail-value">{setCompletionPct}%</p></div>
      </div>
    </div>
  );
}
