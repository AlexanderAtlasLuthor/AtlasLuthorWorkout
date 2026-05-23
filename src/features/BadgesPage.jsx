export default function BadgesPage({
  text,
  language,
  isLightMode,
  weeklyStreak,
  weeklyMetrics,
  currentWeekKey,
  earnedAchievementsCount,
  allAchievements,
  earnedBadges,
}) {
  return (
    <div className="detail-list">
      <div className="detail-grid">
        <div className="detail-card"><p className="detail-label">{text.weekStreak}</p><p className="detail-value" style={{ color: "#FFD060" }}>{weeklyStreak}</p></div>
        <div className="detail-card"><p className="detail-label">{text.daysClear}</p><p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedDays}/7</p></div>
        <div className="detail-card"><p className="detail-label">{text.weekOf}</p><p className="detail-value" style={{ color: "#90C8FF" }}>{currentWeekKey.slice(5)}</p></div>
        <div className="detail-card"><p className="detail-label">{text.badgesLabel}</p><p className="detail-value" style={{ color: "#B8A0FF" }}>{earnedAchievementsCount}/{allAchievements.length}</p></div>
      </div>
      {earnedBadges.length > 0 && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {earnedBadges.map(badge => (
            <span key={badge} style={{ color: "#FFD060", background: "rgba(255,208,96,0.08)", border: "1px solid rgba(255,208,96,0.32)", borderRadius: 999, padding: "9px 13px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>
              {badge}
            </span>
          ))}
        </div>
      )}
      <div style={{ display: "grid", gap: 10 }}>
        {allAchievements.map(achievement => {
          const pct = Math.min(100, Math.round((achievement.progress / achievement.target) * 100));
          const accent = achievement.earned ? "#FFD060" : "#90C8FF";
          return (
            <div
              key={achievement.id}
              className="home-card"
              style={{
                opacity: achievement.earned ? 1 : 0.72,
                borderColor: achievement.earned ? "rgba(255,208,96,0.5)" : undefined,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 900, fontSize: 14, color: accent }}>
                  {achievement.label[language] || achievement.label.en}
                </p>
                <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: accent, fontWeight: 900 }}>
                  {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                </span>
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: isLightMode ? "#5A6270" : "#8A8F99", marginTop: 4, lineHeight: 1.5 }}>
                {achievement.description[language] || achievement.description.en}
              </p>
              <div style={{ height: 6, borderRadius: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: accent, borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
