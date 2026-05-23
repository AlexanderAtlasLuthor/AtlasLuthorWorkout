export default function MenuModal({
  text,
  isLightMode,
  userName,
  setShowMenu,
  setShowSettings,
  setShowReminders,
  setShowDataTools,
  setEditingRoutine,
  activeDay,
  activeSession,
  weeklyMetrics,
  openWorkout,
  resetWeek,
  featurePages,
  openFeaturePage,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 13, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
              {text.atlasMenu}
            </p>
            <p style={{ fontSize: 12, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
              {text.signedInAs} {userName}
            </p>
          </div>
          <button className="edit-btn" onClick={() => setShowMenu(false)} style={{ padding: "8px 12px" }}>
            {text.close}
          </button>
        </div>

        <p className="menu-section-label">{text.workoutWord}</p>
        <div style={{ display: "grid", gap: 8, marginBottom: 18, marginTop: 6 }}>
          <button
            className="primary-btn"
            onClick={() => {
              setShowMenu(false);
              openWorkout(weeklyMetrics.today);
            }}
          >
            {text.startToday}
          </button>
          <button
            className="dark-btn"
            onClick={() => {
              setShowMenu(false);
              setEditingRoutine({ dayName: activeDay, sessionIndex: activeSession, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } });
            }}
          >
            {text.manageWorkouts}
          </button>
          <button
            className="dark-btn"
            onClick={() => {
              resetWeek();
              setShowMenu(false);
            }}
          >
            {text.resetWeek}
          </button>
        </div>

        <p className="menu-section-label">{text.pages.toUpperCase()}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 18, marginTop: 6 }}>
          {featurePages.map(page => (
            <button
              key={page.id}
              className="dark-btn"
              onClick={() => openFeaturePage(page.id)}
              style={{ padding: "11px 8px", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}
            >
              <span style={{ width: 18, height: 3, borderRadius: 2, background: page.accent, display: "block" }} />
              <span style={{ fontWeight: 800, fontSize: 13 }}>{page.label}</span>
            </button>
          ))}
        </div>

        <p className="menu-section-label">{text.appWord}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
          <button
            className="dark-btn"
            onClick={() => {
              setShowMenu(false);
              setShowSettings(true);
            }}
          >
            {text.settings}
          </button>
          <button
            className="dark-btn"
            onClick={() => {
              setShowMenu(false);
              setShowReminders(true);
            }}
          >
            {text.reminders}
          </button>
          <button
            className="dark-btn"
            onClick={() => {
              setShowMenu(false);
              setShowDataTools(true);
            }}
          >
            {text.backupSync}
          </button>
        </div>
      </div>
    </div>
  );
}
