export default function ScorePage({
  text,
  isLightMode,
  atlasScore,
  weeklyMetrics,
  weeklySessionsGoal,
  weeklyStreak,
  prEntries,
  averageRpe,
  deloadWarning,
  shareWorkoutSummary,
  shareProgressCard,
}) {
  const scoreColor = atlasScore >= 80 ? "#3FB98A" : atlasScore >= 50 ? "#90C8FF" : "#FFD060";

  return (
    <div className="detail-list">
      <div className="detail-card" style={{ textAlign: "center", padding: "24px 20px", borderColor: `${scoreColor}55` }}>
        <p style={{ color: scoreColor, fontSize: 58, fontFamily: "'Orbitron', monospace", fontWeight: 900, lineHeight: 1, textShadow: `0 0 28px ${scoreColor}55` }}>{atlasScore}</p>
        <div style={{ height: 6, borderRadius: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden", margin: "12px auto 10px", maxWidth: 220 }}>
          <div style={{ width: `${atlasScore}%`, height: "100%", background: scoreColor, borderRadius: 4, boxShadow: `0 0 10px ${scoreColor}88` }} />
        </div>
        <p className="detail-row-sub">{deloadWarning ? text.deloadActive : text.protocolStable}</p>
      </div>
      <div className="detail-grid">
        <div className="detail-card"><p className="detail-label">{text.mWeekly}</p><p className="detail-value" style={{ color: "#90C8FF" }}>{weeklyMetrics.weeklyProgress}%</p></div>
        <div className="detail-card"><p className="detail-label">{text.mSessions}</p><p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedSessions}/{weeklySessionsGoal}</p></div>
        <div className="detail-card"><p className="detail-label">{text.streakLabel}</p><p className="detail-value" style={{ color: "#FFD060" }}>{weeklyStreak}</p></div>
        <div className="detail-card"><p className="detail-label">{text.prsLabel}</p><p className="detail-value" style={{ color: "#FFD060" }}>{prEntries.length}</p></div>
        <div className="detail-card"><p className="detail-label">{text.avgRpeLabel}</p><p className="detail-value">{averageRpe || "N/A"}</p></div>
        <div className="detail-card"><p className="detail-label">{text.deloadLabel}</p><p className="detail-value" style={{ color: deloadWarning ? "#E5604D" : "#3FB98A" }}>{deloadWarning ? "-10" : "+5"}</p></div>
      </div>
      <div className="home-card">
        <p className="detail-label">{text.scoreBreakdown}</p>
        <div className="detail-list">
          <div className="detail-row"><p className="detail-row-main">{text.weeklyCompletion}</p><span>{Math.round(weeklyMetrics.weeklyProgress * 0.45)} pts</span></div>
          <div className="detail-row"><p className="detail-row-main">{text.sessionTarget}</p><span>{Math.round(Math.min(weeklyMetrics.completedSessions / weeklySessionsGoal, 1) * 25)} pts</span></div>
          <div className="detail-row"><p className="detail-row-main">{text.streakPressure}</p><span>{Math.min(weeklyStreak, 4) * 5} pts</span></div>
          <div className="detail-row"><p className="detail-row-main">{text.prMomentum}</p><span>{prEntries.length * 3} pts</span></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button className="dark-btn" onClick={shareWorkoutSummary}>{text.shareProgress}</button>
        <button className="primary-btn" onClick={shareProgressCard}>{text.shareCard}</button>
      </div>
    </div>
  );
}
