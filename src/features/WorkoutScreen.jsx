import { getExerciseCues } from "../lib/exerciseInfo.js";
import { estimate1RMFromExercise } from "../lib/strength.js";

export default function WorkoutScreen({
  text,
  t,
  language,
  isLightMode,
  days,
  themeFor,
  displayDay,
  displayDayShort,
  fmtW,
  fmtExW,
  formatTimer,

  workoutData,
  activeDay,
  setActiveDay,
  activeSession,
  setActiveSession,
  todayOnlyMode,
  setTodayOnlyMode,
  setScreen,

  expandedExerciseIndex,
  setExpandedExerciseIndex,
  highlightedExerciseIndex,
  setHighlightedExerciseIndex,

  checked,
  exerciseNotes,
  setProgress,
  exercisePerformance,

  cuesExerciseIndex,
  setCuesExerciseIndex,
  setOneRMExerciseName,

  quickMode,
  setQuickMode,
  quickExercise,
  quickExerciseIndex,
  quickExerciseKey,
  quickNote,
  quickSetsDone,
  quickTotalSets,
  quickSetsLeft,

  restTimer,
  restTimerRadius,
  restTimerCircumference,
  restTimerOffset,
  restPresets,
  restSecondsSetting,
  startRestTimer,
  stopRestTimer,

  setEditingRoutine,
  setEditingNote,
  setEditingCardio,
  setEditingExercise,

  updateSetCount,
  toggleExercise,
}) {
  const day = workoutData[activeDay];
  const session = day.sessions[Math.min(activeSession, day.sessions.length - 1)];
  const theme = themeFor(day.type);
  const total = session.exercises.length;
  const done = session.exercises.filter((_, i) => checked[`${activeDay}-${activeSession}-${i}`]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <div style={{ padding: "14px 20px 0" }}>
        <button
          className="dark-btn"
          onClick={() => {
            setTodayOnlyMode(false);
            setScreen("home");
          }}
        >
          {text.backHome}
        </button>
      </div>

      {!todayOnlyMode && (
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ display: "flex", gap: 6, background: isLightMode ? "rgba(0,0,0,0.07)" : "#111115", borderRadius: 14, padding: "8px 8px" }}>
            {days.map(d => {
              const isActive = d === activeDay;
              const dayTheme = themeFor(workoutData[d].type);

              return (
                <button
                  key={d}
                  type="button"
                  className="day-pill"
                  aria-label={`${displayDay(d)} - ${workoutData[d].type}`}
                  aria-pressed={isActive}
                  style={isActive ? { background: dayTheme.badge, border: `1.5px solid ${isLightMode ? dayTheme.accent : dayTheme.accent + "50"}` } : {}}
                  onClick={() => {
                    setActiveDay(d);
                    setActiveSession(0);
                    setExpandedExerciseIndex(null);
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: isActive ? dayTheme.accent : (isLightMode ? "#7A8090" : "#6E7480"), fontFamily: "'Orbitron', monospace" }}>
                    {displayDayShort(d, workoutData[d].label)}
                  </div>
                  <div style={{ fontSize: 8, color: isActive ? dayTheme.sub : (isLightMode ? "#9AA0AC" : "#5A5F6A"), marginTop: 3, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                    {workoutData[d].type.slice(0, 3)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
            {displayDay(activeDay).toUpperCase()}
          </span>
          <span style={{ fontSize: 11, letterSpacing: 2, color: isLightMode ? "#9AA0AC" : "#7C828E", fontFamily: "'Orbitron', monospace" }}>
            {" "}- {day.type}
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          {total > 0 && (
            <div style={{ fontSize: 13, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              <span style={{ color: theme.accent, fontWeight: 700 }}>{done}</span> / {total} {text.doneWord}
            </div>
          )}
          {total > 0 && (
            <button
              className="edit-btn"
              onClick={() => setQuickMode(prev => !prev)}
              style={quickMode ? { color: theme.accent, borderColor: theme.accent + "66" } : {}}
            >
              {quickMode ? text.full : text.quick}
            </button>
          )}
          <button
            className="edit-btn"
            onClick={() => setEditingRoutine({ dayName: activeDay, sessionIndex: activeSession, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } })}
          >
            {text.editDay}
          </button>
        </div>
      </div>

      {total > 0 && (
        <div style={{ padding: "10px 20px 0" }}>
          <div style={{ height: 4, background: isLightMode ? "rgba(0,0,0,0.09)" : "#1E1E26", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: theme.accent, borderRadius: 4, transition: "width 0.4s ease" }} />
          </div>
        </div>
      )}

      {total > 0 && (
        <div style={{ padding: "16px 20px 0" }}>
          <div className="home-card" style={{ padding: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
                  {text.restTimer}
                </p>
                <p style={{ fontSize: 13, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                  {restTimer.running ? text.recoverNext : text.startAfterSet}
                </p>
              </div>

              <div style={{ position: "relative", width: 112, height: 112, flexShrink: 0 }}>
                <svg viewBox="0 0 112 112" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                  <circle
                    cx="56"
                    cy="56"
                    r={restTimerRadius}
                    fill="none"
                    stroke={isLightMode ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.08)"}
                    strokeWidth="9"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r={restTimerRadius}
                    fill="none"
                    stroke={theme.accent}
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={restTimerCircumference}
                    strokeDashoffset={restTimerOffset}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.2s ease", filter: `drop-shadow(0 0 10px ${theme.accent}55)` }}
                  />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <p style={{ fontSize: 23, color: isLightMode ? "#101015" : "#FFFFFF", fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
                    {formatTimer(restTimer.secondsLeft)}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#5A6270" : "#888", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {restTimer.running ? text.restWord : text.readyWord}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))", gap: 8 }}>
              {restPresets.map(seconds => (
                <button
                  key={seconds}
                  className="dark-btn"
                  onClick={() => startRestTimer(seconds)}
                  style={{ padding: "10px 8px", borderColor: seconds === restSecondsSetting ? `${theme.accent}66` : undefined }}
                >
                  {seconds}s
                </button>
              ))}
            </div>

            {restTimer.secondsLeft > 0 && (
              <button className="edit-btn" onClick={stopRestTimer} style={{ width: "100%", marginTop: 10, padding: 10 }}>
                {text.stopTimer}
              </button>
            )}
          </div>
        </div>
      )}

      {day.sessions.length > 1 && (
        <div style={{ padding: "16px 20px 0", display: "flex", gap: 10 }}>
          {day.sessions.map((s, i) => (
            <button
              key={i}
              className="session-tab"
              onClick={() => setActiveSession(i)}
              style={activeSession === i
                ? { background: theme.badge, borderColor: isLightMode ? theme.accent : theme.accent + "60", color: theme.accent, fontWeight: 700 }
                : { opacity: isLightMode ? 0.55 : 1 }}
            >
              <span style={{ fontSize: 11, letterSpacing: 2, fontFamily: "'Orbitron', monospace" }}>{s.time}</span>
              <div style={{ marginTop: 3, fontSize: 13 }}>{s.name}</div>
            </button>
          ))}
        </div>
      )}

      {quickMode && quickExercise && (
        <div className="fade-up" style={{ padding: "20px" }}>
          <div className="home-card" style={{ minHeight: 360, display: "grid", alignContent: "center", gap: 16 }}>
            <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
              {text.quickSession}
            </p>
            <h2 style={{ fontSize: 26, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 }}>
              {quickExercise.name}
            </h2>
            <div className="metric-grid">
              <div className="stat-box">
                <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{fmtExW(quickExercise.weight)}</p>
                <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.weightWord}</p>
              </div>
              <div className="stat-box">
                <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickExercise.sets}x{quickExercise.reps}</p>
                <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.mSets}</p>
              </div>
              <div className="stat-box">
                <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsDone}/{quickTotalSets}</p>
                <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.mDone}</p>
              </div>
              <div className="stat-box">
                <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsLeft}</p>
                <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.leftCap}</p>
              </div>
            </div>
            {quickNote && (
              <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                {quickNote.pr ? "PR · " : ""}{quickNote.difficulty ? `RPE ${quickNote.difficulty} · ` : ""}{quickNote.technique || quickNote.pain}
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
              <button className="dark-btn" onClick={() => updateSetCount(quickExerciseIndex, -1)}>
                {text.minusSet}
              </button>
              <button className="primary-btn" onClick={() => updateSetCount(quickExerciseIndex, 1)}>
                {text.plusSet}
              </button>
            </div>
            <button className="dark-btn" onClick={() => toggleExercise(quickExerciseIndex)}>
              {text.markExerciseDone}
            </button>
            <button
              className="dark-btn"
              onClick={() =>
                setEditingNote({
                  key: quickExerciseKey,
                  name: quickExercise.name,
                  pain: quickNote?.pain || "",
                  difficulty: quickNote?.difficulty || "",
                  pr: !!quickNote?.pr,
                  technique: quickNote?.technique || "",
                })
              }
            >
              {text.notesWord}
            </button>
            <button className="dark-btn" onClick={() => setQuickMode(false)}>
              {text.fullSession}
            </button>
          </div>
        </div>
      )}

      {!quickMode && (
        <div key={`${activeDay}-${activeSession}`} className="fade-up" style={{ padding: "20px 20px 0" }}>
          {session.warmup && (
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: "1.5px solid #1E1E26", background: "#0F0F14", marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#1A1A22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill={isLightMode ? "#4A5062" : "white"} xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                </svg>
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 9, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
                  {text.cardioWarmup}
                </p>
                <p style={{ fontSize: 15, color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                  {session.warmup.name}
                </p>
              </div>

              {session.warmup.duration && (
                <div style={{ fontSize: 15, fontWeight: 700, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                  {session.warmup.duration}
                </div>
              )}

              <button
                className="edit-btn"
                onClick={() =>
                  setEditingCardio({
                    dayName: activeDay,
                    sessionIndex: activeSession,
                    name: session.warmup.name,
                    duration: session.warmup.duration || "",
                  })
                }
              >
                {text.edit}
              </button>
            </div>
          )}

          {session.rest && (
            <div style={{ textAlign: "center", padding: "50px 20px", border: "1.5px solid #1A1A22", borderRadius: 16, background: "#0F0F14" }}>
              <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill={isLightMode ? "#6A4ACC" : "#B8A0FF"} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              </div>
              <p style={{ fontSize: 14, letterSpacing: 4, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                {text.recoveryMode}
              </p>
              <p style={{ fontSize: 15, color: isLightMode ? "#7A8090" : "#9CA1AC", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
                {text.restEatRebuild}
              </p>
            </div>
          )}

          {session.exercises.map((ex, i) => {
            const key = `${activeDay}-${activeSession}-${i}`;
            const isDone = !!checked[key];
            const note = exerciseNotes[key];
            const hasNote = note && (note.pain || note.difficulty || note.pr || note.technique);
            const setsDone = Number(setProgress[key] || 0);
            const totalExerciseSets = Number(ex.sets || 0);
            const setsLeft = Math.max(totalExerciseSets - setsDone, 0);
            const isExpanded = expandedExerciseIndex === i && !isDone;

            if (isExpanded) {
              const setCompPct2 = totalExerciseSets > 0 ? Math.round((setsDone / totalExerciseSets) * 100) : 0;
              const est = estimate1RMFromExercise(ex.weight, ex.reps);
              const perf = exercisePerformance[ex.name];
              const cues = getExerciseCues(ex.name, language);
              return (
                <div
                  key={i}
                  className="home-card fade-up"
                  style={{ marginBottom: 12, borderColor: theme.accent, boxShadow: `0 0 32px ${theme.accent}2A, inset 0 0 0 1px ${theme.accent}22`, padding: "18px 18px 16px", background: isLightMode ? "#FFFFFF" : `linear-gradient(135deg, rgba(19,19,24,0.98) 0%, rgba(12,12,16,0.99) 100%)` }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
                        <p style={{ fontSize: 9, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                          {t("EJERCICIO ACTIVO", "ACTIVE EXERCISE")}
                        </p>
                      </div>
                      <h3 style={{ fontSize: 21, fontWeight: 900, fontFamily: "'DM Sans', sans-serif", color: isLightMode ? "#101015" : "#FFFFFF", lineHeight: 1.2 }}>
                        {ex.name}
                      </h3>
                    </div>
                    <button className="edit-btn" onClick={() => setExpandedExerciseIndex(null)} style={{ flexShrink: 0, marginLeft: 10, color: isLightMode ? "#7A8090" : "#888" }}>
                      ↑ {t("Colapsar", "Collapse")}
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                    <div style={{ padding: "12px 8px", borderRadius: 12, background: isLightMode ? "rgba(0,0,0,0.04)" : `${theme.accent}10`, border: `1px solid ${theme.accent}33`, textAlign: "center" }}>
                      <p style={{ fontSize: 22, fontWeight: 900, color: theme.accent, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{fmtExW(ex.weight)}</p>
                      <p style={{ fontSize: 8, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{text.weightWord}</p>
                    </div>
                    <div style={{ padding: "12px 8px", borderRadius: 12, background: isLightMode ? "rgba(0,0,0,0.04)" : `${theme.accent}10`, border: `1px solid ${theme.accent}33`, textAlign: "center" }}>
                      <p style={{ fontSize: 22, fontWeight: 900, color: theme.accent, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{ex.sets}×{ex.reps}</p>
                      <p style={{ fontSize: 8, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{text.mSets}×{text.repsWord}</p>
                    </div>
                    <div style={{ padding: "12px 8px", borderRadius: 12, background: setsDone === totalExerciseSets && totalExerciseSets > 0 ? `${theme.accent}22` : (isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"), border: `1px solid ${setsDone === totalExerciseSets && totalExerciseSets > 0 ? theme.accent : "rgba(255,255,255,0.07)"}`, textAlign: "center" }}>
                      <p style={{ fontSize: 22, fontWeight: 900, color: setsDone === totalExerciseSets && totalExerciseSets > 0 ? theme.accent : "#FFFFFF", fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{setCompPct2}%</p>
                      <p style={{ fontSize: 8, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{t("HECHO", "DONE")}</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                      <span style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>{text.mSets} {setsDone}/{totalExerciseSets}</span>
                      <span style={{ color: setsLeft === 0 ? "#3FB98A" : theme.accent, fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900 }}>
                        {setsLeft === 0 ? t("✓ COMPLETO", "✓ COMPLETE") : `${setsLeft} ${text.leftWord}`}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 5 }}>
                      {Array.from({ length: totalExerciseSets }).map((_, si) => (
                        <div
                          key={si}
                          onClick={() => updateSetCount(i, si < setsDone ? -1 : 1)}
                          style={{ flex: 1, height: 10, borderRadius: 6, background: si < setsDone ? theme.accent : (isLightMode ? "#E2E4E9" : "#2A2A34"), transition: "background 0.3s ease", cursor: "pointer", boxShadow: si < setsDone ? `0 0 6px ${theme.accent}88` : "none" }}
                        />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <button
                      className="dark-btn"
                      onClick={() => updateSetCount(i, -1)}
                      style={{ padding: "14px 10px", fontSize: 16, fontWeight: 900, color: isLightMode ? "#7A8090" : "#8A8F99" }}
                    >
                      {text.minusSet}
                    </button>
                    <button
                      style={{ padding: "14px 10px", fontSize: 16, fontWeight: 900, borderRadius: 14, border: 0, background: theme.accent, color: isLightMode ? "#FFFFFF" : "#050507", fontFamily: "'Orbitron', monospace", cursor: "pointer", letterSpacing: 1 }}
                      onClick={() => updateSetCount(i, 1)}
                    >
                      {text.plusSet}
                    </button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button
                      className="dark-btn"
                      onClick={() => setEditingNote({ key, name: ex.name, pain: note?.pain || "", difficulty: note?.difficulty || "", pr: !!note?.pr, technique: note?.technique || "" })}
                      style={{ color: hasNote ? theme.accent : "#666", borderColor: hasNote ? `${theme.accent}44` : undefined }}
                    >
                      {text.notesWord} {hasNote ? "✓" : ""}
                    </button>
                    <button
                      className="dark-btn"
                      onClick={() => toggleExercise(i)}
                      style={{ color: "#3FB98A", borderColor: "#3FB98A33" }}
                    >
                      {text.markExerciseDone}
                    </button>
                  </div>

                  {hasNote && (
                    <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 10, background: `${theme.accent}10`, border: `1px solid ${theme.accent}22` }}>
                      <p style={{ color: theme.accent, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800 }}>
                        {note.pr ? "⭐ PR · " : ""}{note.difficulty ? `RPE ${note.difficulty} · ` : ""}{note.technique || note.pain}
                      </p>
                    </div>
                  )}

                  {est > 0 && (
                    <button
                      type="button"
                      onClick={() => perf?.history?.length && setOneRMExerciseName(ex.name)}
                      disabled={!perf?.history?.length}
                      style={{
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "9px 11px",
                        borderRadius: 10,
                        background: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                        border: "none",
                        width: "100%",
                        cursor: perf?.history?.length ? "pointer" : "default",
                        color: "inherit",
                        textAlign: "left",
                        font: "inherit",
                      }}
                    >
                      <span style={{ fontSize: 11, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                        {text.estimatedOneRM}{perf?.history?.length ? " ↗" : ""}
                      </span>
                      <span style={{ fontSize: 12, color: theme.accent, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                        {fmtW(est)}{perf?.best1RM ? ` · ${text.personalBest} ${fmtW(perf.best1RM)}` : ""}
                      </span>
                    </button>
                  )}
                  {cues.length > 0 && (
                    <button
                      className="edit-btn"
                      style={{ width: "100%", marginTop: 10, padding: 10 }}
                      onClick={() => setCuesExerciseIndex(prev => (prev === i ? null : i))}
                    >
                      {text.formCues}{cuesExerciseIndex === i ? " ↑" : ""}
                    </button>
                  )}
                  {cuesExerciseIndex === i && cues.length > 0 && (
                    <div style={{ marginTop: 8, display: "grid", gap: 7 }}>
                      {cues.map((cue, cueIndex) => (
                        <div key={cueIndex} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: theme.accent, marginTop: 6, flexShrink: 0 }} />
                          <p style={{ fontSize: 12, color: isLightMode ? "#5A6270" : "#C8D0DC", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{cue}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <div
                key={i}
                className={`ex-card${isDone ? " done" : ""}`}
                role="button"
                tabIndex={0}
                aria-pressed={isDone}
                aria-label={`${ex.name}, ${isDone ? "completed" : "not completed"}`}
                onClick={() => {
                  if (!isDone) {
                    setExpandedExerciseIndex(i);
                    setHighlightedExerciseIndex(i);
                  } else {
                    toggleExercise(i);
                  }
                }}
                onKeyDown={event => {
                  if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                    event.preventDefault();
                    if (!isDone) setExpandedExerciseIndex(i);
                    else toggleExercise(i);
                  }
                }}
                style={highlightedExerciseIndex === i && !isDone ? { borderColor: theme.accent, boxShadow: `0 0 22px ${theme.accent}22` } : {}}
              >
                <div
                  className="check"
                  style={isDone ? { background: theme.accent, borderColor: theme.accent, color: isLightMode ? "#FFFFFF" : "#000" } : {}}
                  onClick={event => { event.stopPropagation(); toggleExercise(i); }}
                >
                  {isDone ? "✓" : ""}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 600, color: isDone ? (isLightMode ? "#9CA1AC" : "#555") : (isLightMode ? "#101015" : "#FFFFFF"), fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {ex.name}
                  </p>
                  <p style={{ fontSize: 12, color: isDone ? "#6E7480" : (isLightMode ? "#5A6270" : "#888"), marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
                    {ex.sets} {text.setsWord} x {ex.reps} {text.repsWord}
                  </p>
                  <p style={{ fontSize: 11, color: isDone ? "#6E7480" : (isLightMode ? "#8A8F99" : "#AAAAAA"), marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                    {text.mSets} {setsDone}/{totalExerciseSets} · {setsLeft} {text.leftWord}
                  </p>
                  {hasNote && (
                    <p style={{ fontSize: 11, color: isDone ? "#6E7480" : theme.accent, marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {note.pr ? "PR · " : ""}{note.difficulty ? `RPE ${note.difficulty} · ` : ""}{note.technique || note.pain || t("Notas guardadas", "Notes saved")}
                    </p>
                  )}
                </div>

                <div style={{ display: "grid", gap: 6 }}>
                  <button
                    className="edit-btn"
                    onClick={event => {
                      event.stopPropagation();
                      updateSetCount(i, 1);
                      if (!isDone) setExpandedExerciseIndex(i);
                    }}
                    style={{ color: theme.accent }}
                  >
                    +Set
                  </button>
                  <button
                    className="edit-btn"
                    onClick={event => {
                      event.stopPropagation();
                      updateSetCount(i, -1);
                    }}
                  >
                    -Set
                  </button>
                </div>

                <button
                  className="edit-btn"
                  onClick={event => {
                    event.stopPropagation();
                    setEditingNote({
                      key,
                      name: ex.name,
                      pain: note?.pain || "",
                      difficulty: note?.difficulty || "",
                      pr: !!note?.pr,
                      technique: note?.technique || "",
                    });
                  }}
                  style={{ color: hasNote ? theme.accent : "#888" }}
                >
                  {text.notesWord}
                </button>

                <button
                  onClick={event => {
                    event.stopPropagation();
                    setEditingExercise({
                      dayName: activeDay,
                      sessionIndex: activeSession,
                      exerciseIndex: i,
                      name: ex.name,
                      weight: ex.weight,
                    });
                  }}
                  style={{ padding: "6px 12px", borderRadius: 8, background: isDone ? (isLightMode ? "#E2E4E9" : "#111") : theme.badge, border: `1px solid ${isDone ? (isLightMode ? "#D5D7DD" : "#222") : theme.accent + "40"}`, cursor: "pointer" }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700, color: isDone ? "#444" : theme.accent, fontFamily: "'DM Sans', sans-serif" }}>
                    {fmtExW(ex.weight)}
                  </span>
                </button>
              </div>
            );
          })}

          {total > 0 && (
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              {[
                { label: text.mExercises, val: total },
                { label: text.totalSets, val: session.exercises.reduce((a, e) => a + e.sets, 0) },
                { label: text.progressWord, val: `${pct}%` },
              ].map(s => (
                <div key={s.label} className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 700, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                    {s.val}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
