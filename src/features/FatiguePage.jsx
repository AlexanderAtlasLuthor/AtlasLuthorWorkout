export default function FatiguePage({
  text,
  t,
  averageRpe,
  highFatigueNotes,
  deloadWarning,
  currentWeekKey,
  noteRows,
  displayDay,
}) {
  const placeholder = {
    key: "empty-note",
    exercise: { name: text.noExerciseNotes },
    dayName: t("Notas", "Notes"),
    sessionName: text.addPainRPE,
    note: {},
  };
  const rows = noteRows.length ? noteRows : [placeholder];

  return (
    <div className="detail-list">
      <div className="detail-grid">
        <div className="detail-card"><p className="detail-label">{text.avgRpeLabel}</p><p className="detail-value">{averageRpe || "N/A"}</p></div>
        <div className="detail-card"><p className="detail-label">{text.highNotes}</p><p className="detail-value">{highFatigueNotes}</p></div>
        <div className="detail-card"><p className="detail-label">{text.deloadLabel}</p><p className="detail-value">{deloadWarning ? text.deloadActiveVal : text.deloadClearVal}</p></div>
        <div className="detail-card"><p className="detail-label">{text.thisWeek}</p><p className="detail-value">{currentWeekKey.slice(5)}</p></div>
      </div>
      <div className="home-card" style={{ borderColor: deloadWarning ? "#FFD06066" : "rgba(255,255,255,0.075)" }}>
        <p className="detail-row-main">{deloadWarning ? text.lowerLoadAdvice : text.noFatigueWarning}</p>
        <p className="detail-row-sub">{text.painSignalNote}</p>
      </div>
      <div className="home-card">
        <p className="detail-label">{text.recentSignals}</p>
        <div className="detail-list">
          {rows.slice(0, 6).map(row => (
            <div key={`${row.key}-fatigue-note`} className="detail-row">
              <div>
                <p className="detail-row-main">{row.exercise.name}</p>
                <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} - {t("Dolor", "Pain")} {row.note?.pain || "N/A"} - RPE {row.note?.difficulty || "N/A"}</p>
              </div>
              <span style={{ color: row.note?.pr ? "#FFD060" : "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{row.note?.pr ? "PR" : t("NOTA", "NOTE")}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
