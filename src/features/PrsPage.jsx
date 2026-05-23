import { estimate1RMFromExercise } from "../lib/strength.js";

export default function PrsPage({
  text,
  fmtW,
  fmtExW,
  prEntries,
  heaviestExerciseRows,
  displayDay,
}) {
  const placeholder = { key: "empty-pr", exerciseName: text.noPrsYet, sessionName: text.markPrHint, weight: "", date: "" };
  const entries = prEntries.length ? prEntries : [placeholder];

  return (
    <div className="detail-list">
      <div className="detail-grid">
        <div className="detail-card"><p className="detail-label">{text.totalPrs}</p><p className="detail-value">{prEntries.length}</p></div>
        <div className="detail-card"><p className="detail-label">{text.heaviestLabel}</p><p className="detail-value">{heaviestExerciseRows[0] ? fmtExW(heaviestExerciseRows[0].exercise.weight) : "--"}</p></div>
      </div>
      {entries.map(entry => (
        <div key={entry.key} className="detail-row">
          <div>
            <p className="detail-row-main">{entry.exerciseName}</p>
            <p className="detail-row-sub">{entry.dayName ? displayDay(entry.dayName) : "PR"} — {entry.sessionName}</p>
          </div>
          <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtExW(entry.weight)} {entry.date}</span>
        </div>
      ))}
      <div className="home-card">
        <p className="detail-label">{text.heaviestLoads}</p>
        <div className="detail-list">
          {heaviestExerciseRows.slice(0, 5).map(row => (
            <div key={`${row.key}-heavy`} className="detail-row">
              <div>
                <p className="detail-row-main">{row.exercise.name}</p>
                <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} · {text.estimatedOneRM} {fmtW(estimate1RMFromExercise(row.exercise.weight, row.exercise.reps))}</p>
              </div>
              <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtExW(row.exercise.weight)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
