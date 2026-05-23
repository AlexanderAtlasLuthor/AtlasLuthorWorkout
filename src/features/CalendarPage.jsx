export default function CalendarPage({
  text,
  isLightMode,
  weekHeaderLabels,
  calendarCells,
  calendarLog,
  calendarLabels,
  calendarStatusCounts,
  getCalendarStatus,
  getCalendarVisual,
  getDateKey,
  displayDay,
}) {
  return (
    <div className="detail-list">
      <div className="home-card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
          {weekHeaderLabels.map((label, index) => (
            <p key={`${label}-${index}`} style={{ color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
          ))}
          {calendarCells.map((cell, index) => {
            if (!cell) return <div key={`blank-detail-${index}`} />;
            const isToday = cell.key === getDateKey();
            const status = getCalendarStatus(cell);
            const visual = getCalendarVisual(status, isLightMode);
            return (
              <div key={cell.key} title={`${cell.key} - ${status}`} style={{ aspectRatio: "1", borderRadius: 8, background: visual.bg, color: visual.fg, border: isToday ? `2px solid ${isLightMode ? "#101015" : "#FFFFFF"}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                {cell.dayNumber}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
          {["completed", "trained", "missed", "rest", "planned"].map(status => {
            const visual = getCalendarVisual(status, isLightMode);
            return (
              <span key={status} style={{ display: "flex", alignItems: "center", gap: 5, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, background: visual.bg, display: "inline-block" }} />
                {calendarLabels[status]}
              </span>
            );
          })}
        </div>
      </div>
      <div className="detail-grid">
        {Object.entries(calendarStatusCounts).map(([status, count]) => (
          <div key={status} className="detail-card">
            <p className="detail-label">{status.toUpperCase()}</p>
            <p className="detail-value">{count}</p>
          </div>
        ))}
      </div>
      {calendarCells.filter(Boolean).slice(-10).map(cell => {
        const logged = calendarLog[cell.key];
        const status = getCalendarStatus(cell);
        return (
          <div key={`${cell.key}-row`} className="detail-row">
            <div>
              <p className="detail-row-main">{cell.key} - {displayDay(cell.dayName)}</p>
              <p className="detail-row-sub">{logged ? `${logged.completed}/${logged.total} ${text.exercisesLogged}` : text.noEntrySaved}</p>
            </div>
            <span style={{ color: "#FFFFFF", fontFamily: "'Orbitron', monospace", fontSize: 10 }}>{status.toUpperCase()}</span>
          </div>
        );
      })}
    </div>
  );
}
