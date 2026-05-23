export default function HomeScreen({
  text,
  t,
  isLightMode,
  fmtW,
  fmtWDelta,
  fmtExW,

  storageFull,
  themeFor,
  weeklyMetrics,
  userAvatar,
  userName,
  greeting,
  homeMessage,
  todayDisplayName,
  displayDay,
  displayDayShort,
  openWorkout,
  openFeaturePage,

  setShowMenu,
  setShowSettings,
  setShowDataTools,

  daysToGoal,
  goalProgressPct,
  goals,
  setEditingGoals,
  weeklyGoalPct,
  sessionsGoalPct,

  waterPct,
  waterGlasses,
  waterGoalNum,
  addWater,
  removeWater,

  todayMacros,
  calorieTarget,
  macroTargets,

  profile,
  setEditingProfile,
  weightChange,
  weightToGoal,

  atlasScore,
  deloadWarning,
  averageRpe,
  prEntries,
  weeklyStreak,

  weekHeaderLabels,
  calendarCells,
  calendarLabels,
  getCalendarStatus,
  getCalendarVisual,
  getDateKey,

  rememberProgress,
  progressSaved,
  latestProgress,
  progressEntries,
  chartEntries,
  maxChartWeight,
  minChartWeight,
  resetWeek,

  earnedBadges,
  currentWeekKey,

  latestPhoto,
  totalPhotoCount,
  setViewingPhoto,
  progressPhotos,
  photoDraft,
  setPhotoDraft,
  handleProgressPhoto,
  saveProgressPhoto,

  isProgressionDue,
  lastProgressionReview,
  progressionItems,
  rejectProgression,
  acceptProgression,

  days,
  workoutData,
}) {
  return (
    <div className="fade-up" style={{ padding: "20px" }}>
      {storageFull && (
        <div className="home-card" style={{ marginBottom: 14, borderColor: "#E5604D88", background: isLightMode ? "#FBEAE8" : "#1C0D0A" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: "#E5604D", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
            {t("ALMACENAMIENTO LLENO", "STORAGE FULL")}
          </p>
          <p style={{ color: isLightMode ? "#7A2A20" : "#E59A8E", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
            {t("El almacenamiento de este dispositivo está lleno y no se pudieron guardar los cambios recientes. Exporta un respaldo y elimina algunas fotos de progreso para liberar espacio.", "This device's storage is full, so recent changes could not be saved. Export a backup, then remove some progress photos to free space.")}
          </p>
        </div>
      )}
      <div style={{ marginBottom: 14, padding: "20px 20px 18px", background: isLightMode ? "#FFFFFF" : "rgba(19,19,24,0.86)", border: isLightMode ? `1.5px solid ${themeFor(weeklyMetrics.todayType).accent}` : `1.5px solid rgba(255,255,255,0.08)`, borderRadius: 18, backdropFilter: "blur(18px)", boxShadow: isLightMode ? `0 4px 20px rgba(0,0,0,0.08), inset 0 0 0 1px ${themeFor(weeklyMetrics.todayType).accent}22` : "none" }}>
        <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
          <button
            type="button"
            aria-label="Open settings"
            onClick={() => { setShowMenu(false); setShowSettings(true); }}
            style={{ width: 80, height: 80, borderRadius: 999, overflow: "hidden", padding: 0, border: `3px solid ${themeFor(weeklyMetrics.todayType).accent}`, background: isLightMode ? "#E9EAEE" : "#0C0C14", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 0 0 1px rgba(0,0,0,0.3)` }}
          >
            {userAvatar
              ? <img src={userAvatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 28, color: isLightMode ? "#7A8090" : "#888" }}>{userName.slice(0, 1).toUpperCase()}</span>}
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 9, letterSpacing: 4, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", marginBottom: 6, textTransform: "uppercase" }}>
              {greeting}
            </p>
            <h2 style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: isLightMode ? "#101015" : "#FFFFFF", lineHeight: 1, letterSpacing: 1, margin: 0 }}>
              {userName}
            </h2>
          </div>
        </div>
        <div style={{ height: 1, background: isLightMode ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)", margin: "16px 0 12px" }} />
        <p style={{ color: isLightMode ? "#5A6270" : "#9CA1AC", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
          {homeMessage}
        </p>
      </div>

      <div className="home-card" style={{ marginBottom: 14, borderColor: isLightMode ? `${themeFor(weeklyMetrics.todayType).accent}60` : "#2A2A34", borderTopWidth: isLightMode ? 3 : 1.5, borderTopColor: isLightMode ? themeFor(weeklyMetrics.todayType).accent : undefined }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
          {text.today} - {displayDayShort(weeklyMetrics.today, weeklyMetrics.todayLabel)} / {weeklyMetrics.todayType}
        </p>

        <h2 style={{ fontSize: 25, fontFamily: "'Orbitron', monospace", letterSpacing: 2, marginBottom: 8 }}>
          {todayDisplayName}
        </h2>

        <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
          {text.weeklyProgressIs} <span style={{ color: isLightMode ? "#101015" : "#FFFFFF", fontWeight: 800 }}>{weeklyMetrics.weeklyProgress}%</span>. {text.keepMoving}
        </p>

        <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
          {text.startToday}
        </button>
      </div>

      {typeof daysToGoal === "number" && daysToGoal > 0 && (() => {
        const cdColor = daysToGoal <= 7 ? "#FFD060" : daysToGoal <= 30 ? "#90C8FF" : isLightMode ? "#101015" : "#FFFFFF";
        const cdBorderColor = daysToGoal <= 7 ? "rgba(255,208,96,0.3)" : daysToGoal <= 30 ? "rgba(144,200,255,0.2)" : "rgba(255,255,255,0.075)";
        const pct = goalProgressPct ?? 0;
        return (
          <div className="home-card" style={{ marginBottom: 14, borderColor: cdBorderColor }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: daysToGoal <= 7 ? "#FFD060" : daysToGoal <= 30 ? "#90C8FF" : "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                {text.countdownTitle.toUpperCase()}
              </p>
              <p style={{ fontSize: 10, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", letterSpacing: 1 }}>{goals.targetDate}</p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 14 }}>
              <div style={{ flexShrink: 0 }}>
                <p style={{ fontSize: daysToGoal >= 100 ? 52 : 64, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: cdColor, lineHeight: 1, animation: daysToGoal <= 7 ? "countdownPulse 2s ease-in-out infinite" : "none" }}>
                  {daysToGoal}
                </p>
                <p style={{ fontSize: 9, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", marginTop: 4 }}>
                  {text.daysLeft}
                </p>
              </div>
              <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                <p style={{ color: isLightMode ? "#101015" : "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 4 }}>
                  {goals.focusGoal}
                </p>
                {daysToGoal <= 7 && <p style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 9, letterSpacing: 2, fontWeight: 900 }}>{text.finalStretch.toUpperCase()}</p>}
                {daysToGoal > 7 && daysToGoal <= 30 && <p style={{ color: "#90C8FF", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>{text.almostThere}</p>}
              </div>
            </div>
            <div style={{ width: "100%", height: 8, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: cdColor, borderRadius: 6, transition: "width 1s ease", boxShadow: `0 0 10px ${cdColor}77` }} />
            </div>
            <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 5 }}>
              {pct}% {t("completado", "complete")}
            </p>
          </div>
        );
      })()}

      <div className="home-card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
              {text.waterToday.toUpperCase()}
            </p>
            <p style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: waterPct >= 100 ? "#3FB98A" : "#90C8FF", lineHeight: 1 }}>
              {waterGlasses}<span style={{ fontSize: 14, color: isLightMode ? "#7A8090" : "#666", fontWeight: 400 }}>/{waterGoalNum}</span>
            </p>
          </div>
          <button className="edit-btn" onClick={() => openFeaturePage("water")} style={{ color: "#90C8FF" }}>
            {t("Ver", "View")}
          </button>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
          {Array.from({ length: waterGoalNum }).map((_, gi) => {
            const filled = gi < waterGlasses;
            const wAccent = waterPct >= 100 ? "#3FB98A" : "#90C8FF";
            return (
              <div
                key={gi}
                onClick={() => filled ? removeWater() : addWater()}
                style={{ flex: 1, height: 24, borderRadius: 4, background: filled ? wAccent : (isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"), cursor: "pointer", transition: "background 0.2s ease" }}
              />
            );
          })}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <button className="dark-btn" onClick={() => removeWater()} style={{ color: isLightMode ? "#7A8090" : "#8A8F99" }}>
            − {text.glassWord}
          </button>
          <button className="dark-btn" onClick={() => addWater()} style={{ color: waterPct >= 100 ? "#3FB98A" : "#90C8FF" }}>
            + {text.glassWord}
          </button>
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
              {text.nutritionToday.toUpperCase()}
            </p>
            <p style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: "#3FB98A", lineHeight: 1 }}>
              {todayMacros.kcal}<span style={{ fontSize: 14, color: isLightMode ? "#7A8090" : "#666", fontWeight: 400 }}>/{calorieTarget}</span>
            </p>
          </div>
          <button className="edit-btn" onClick={() => openFeaturePage("nutrition")} style={{ color: "#3FB98A" }}>
            {t("Ver", "View")}
          </button>
        </div>
        <div style={{ height: 8, borderRadius: 5, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 10 }}>
          <div style={{ width: `${calorieTarget > 0 ? Math.min(100, Math.round((todayMacros.kcal / calorieTarget) * 100)) : 0}%`, height: "100%", background: todayMacros.kcal > calorieTarget && calorieTarget > 0 ? "#E5604D" : "#3FB98A", borderRadius: 5, transition: "width 0.4s ease" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {[
            { label: text.protein, val: todayMacros.protein, target: macroTargets.protein, color: "#90C8FF" },
            { label: text.carbs, val: todayMacros.carbs, target: macroTargets.carbs, color: "#FFD060" },
            { label: text.fat, val: todayMacros.fat, target: macroTargets.fat, color: "#FF9860" },
          ].map(macro => (
            <div key={macro.label} style={{ textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: macro.color }}>
                {macro.val}<span style={{ fontSize: 10, color: "#8A8F99" }}>/{macro.target}</span>
              </p>
              <p style={{ fontSize: 9, letterSpacing: 1, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginTop: 3 }}>{macro.label.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
              {text.bodyStatus.toUpperCase()}
            </p>
            <p style={{ fontSize: 28, color: "#FFFFFF", fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
              {fmtW(profile.currentWeight)}
            </p>
          </div>

          <button className="edit-btn" onClick={() => setEditingProfile({ ...profile })}>
            {text.edit}
          </button>
        </div>

        <div className="metric-grid">
          {[
            { label: text.start, val: fmtW(profile.startWeight) },
            { label: text.target, val: fmtW(profile.targetWeight) },
            { label: text.change, val: fmtWDelta(weightChange) },
            { label: text.toGoal, val: fmtWDelta(weightToGoal) },
          ].map(metric => (
            <div key={metric.label} className="stat-box">
              <p style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                {metric.val}
              </p>
              <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.atlasScore.toUpperCase()}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 92, height: 92, borderRadius: "50%", border: `8px solid ${isLightMode ? themeFor(weeklyMetrics.todayType).accent : "#FFFFFF"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isLightMode ? `0 0 20px ${themeFor(weeklyMetrics.todayType).accent}44` : "0 0 24px rgba(255,255,255,0.12)" }}>
            <span style={{ fontSize: 25, fontWeight: 900, fontFamily: "'Orbitron', monospace" }}>{atlasScore}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 800 }}>
              {deloadWarning ? text.deloadActive : text.protocolStable}
            </p>
            <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
              {text.avgRpe} {averageRpe || "N/A"} · PRs {prEntries.length} · {text.streak} {weeklyStreak}
            </p>
          </div>
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.monthCalendar.toUpperCase()}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6, marginBottom: 10 }}>
          {weekHeaderLabels.map((label, index) => (
            <p key={`${label}-${index}`} style={{ color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
          ))}
          {calendarCells.map((cell, index) => {
            if (!cell) return <div key={`blank-${index}`} />;

            const todayKey = getDateKey();
            const isToday = cell.key === todayKey;
            const status = getCalendarStatus(cell);
            const visual = getCalendarVisual(status, isLightMode);

            return (
              <div key={cell.key} title={`${cell.key} - ${status}`} style={{ aspectRatio: "1", borderRadius: 8, background: visual.bg, color: visual.fg, border: isToday ? `2px solid ${isLightMode ? "#101015" : "#FFFFFF"}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                {cell.dayNumber}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {["completed", "trained", "missed", "rest"].map(status => {
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

      <div className="home-card" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.prTracker.toUpperCase()}
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {(prEntries.length ? prEntries.slice(0, 5) : [{ key: "empty", exerciseName: text.noPrsYet, sessionName: text.markPrHint, weight: "", date: "" }]).map(entry => (
            <div key={entry.key} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: "#101015", border: "1px solid #24242E", borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 800 }}>{entry.exerciseName}</span>
              <span style={{ color: isLightMode ? "#7A8090" : "#888", fontSize: 12, fontWeight: 700 }}>{fmtExW(entry.weight)} {entry.date}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14, borderColor: deloadWarning ? "#FFD06066" : "rgba(255,255,255,0.075)" }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: deloadWarning ? "#FFD060" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
          {text.fatigueDeload.toUpperCase()}
        </p>
        <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 800 }}>
          {text.averageRpe} {averageRpe || text.noRpeNotes}
        </p>
        <p style={{ color: deloadWarning ? "#FFD060" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
          {deloadWarning ? text.deloadAdvice : text.noDeloadSignal}
        </p>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
              {text.myGoals.toUpperCase()}
            </p>
            <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 700 }}>
              {goals.focusGoal}
            </p>
          </div>

          <button className="edit-btn" onClick={() => setEditingGoals({ ...goals })}>
            {text.set}
          </button>
        </div>

        <div style={{ display: "grid", gap: 14 }}>
          {[
            { label: text.weeklyProtocol, current: `${weeklyMetrics.weeklyProgress}%`, target: `${goals.weeklyProgressGoal}%`, pct: weeklyGoalPct, color: "#90C8FF" },
            { label: text.completedSessions, current: weeklyMetrics.completedSessions, target: goals.weeklySessionsGoal, pct: sessionsGoalPct, color: "#3FB98A" },
          ].map(goal => (
            <div key={goal.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, marginBottom: 7 }}>
                <span style={{ color: isLightMode ? "#5A6270" : "#9CA1AC" }}>{goal.label}</span>
                <span style={{ color: goal.color }}>{goal.current} / {goal.target}</span>
              </div>
              <div style={{ height: 9, background: isLightMode ? "#E2E4E9" : "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden" }}>
                <div style={{ width: `${goal.pct}%`, height: "100%", background: goal.color, borderRadius: 6, transition: "width 0.4s ease", boxShadow: `0 0 10px ${goal.color}77` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
              {text.progressMemory.toUpperCase()}
            </p>
            <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
              {latestProgress
                ? `${text.lastSaved} ${latestProgress.date}: ${fmtW(latestProgress.weight)}, ${latestProgress.weeklyProgress}%`
                : text.noProgressSaved}
            </p>
          </div>

          <button className="edit-btn" onClick={rememberProgress}>
            {text.save}
          </button>
        </div>

        {progressSaved && (
          <p style={{ color: "#90C8FF", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
            {text.progressSavedMsg}
          </p>
        )}

        <div style={{ display: "grid", gap: 8 }}>
          {progressEntries.slice(0, 3).map(entry => (
            <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: "#101015", border: "1px solid #20202A", borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif" }}>
              <span style={{ color: isLightMode ? "#7A8090" : "#888", fontSize: 12, fontWeight: 700 }}>
                {entry.date} {entry.type === "manual" ? text.savedTag : text.autoTag}
              </span>
              <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 800 }}>
                {fmtW(entry.weight)} · {entry.completedExercises} {text.exercisesWord}
              </span>
            </div>
          ))}
        </div>

        {chartEntries.length > 0 && (
          <div style={{ display: "flex", alignItems: "end", gap: 8, height: 92, marginTop: 14, padding: "10px 8px", borderRadius: 12, border: "1px solid #20202A", background: isLightMode ? "rgba(20,24,36,0.05)" : "rgba(10,10,14,0.55)" }}>
            {chartEntries.map(entry => {
              const range = Math.max(maxChartWeight - minChartWeight, 1);
              const height = 24 + ((entry.weightNumber - minChartWeight) / range) * 48;

              return (
                <div key={`${entry.id}-bar`} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                  <div title={fmtW(entry.weight)} style={{ height, maxWidth: 46, margin: "0 auto", borderRadius: "8px 8px 3px 3px", background: "linear-gradient(180deg, #90C8FF, #5C93C8)", boxShadow: "0 0 18px rgba(144,200,255,0.3)" }} />
                  <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 9, marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {fmtW(entry.weight)}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginTop: 12 }}>
          <button className="dark-btn" onClick={() => setShowDataTools(true)}>
            {text.backup}
          </button>
          <button className="dark-btn" onClick={resetWeek}>
            {text.resetWeek}
          </button>
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.streakBadges.toUpperCase()}
        </p>
        <div className="metric-grid" style={{ marginBottom: 12 }}>
          <div className="stat-box">
            <p style={{ fontSize: 22, fontWeight: 900, color: "#FFD060", fontFamily: "'Orbitron', monospace" }}>
              {weeklyStreak}
            </p>
            <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
              {text.weekStreak}
            </p>
          </div>
          <div className="stat-box">
            <p style={{ fontSize: 22, fontWeight: 900, color: "#3FB98A", fontFamily: "'Orbitron', monospace" }}>
              {weeklyMetrics.completedDays}/7
            </p>
            <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
              {text.daysClear}
            </p>
          </div>
          <div className="stat-box">
            <p style={{ fontSize: 16, fontWeight: 900, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>
              {currentWeekKey.slice(5)}
            </p>
            <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
              {text.weekOf}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(earnedBadges.length ? earnedBadges : [text.protocolStarted]).map(badge => (
            <span key={badge} style={{ color: "#FFD060", background: "rgba(255,208,96,0.08)", border: "1px solid rgba(255,208,96,0.32)", borderRadius: 999, padding: "7px 11px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800 }}>
              {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="home-card" style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
            {text.progressPhotos.toUpperCase()}
          </p>
          <button className="edit-btn" onClick={() => openFeaturePage("photos")} style={{ color: "#90C8FF" }}>
            {t("Ver todo", "View all")}
          </button>
        </div>

        {latestPhoto ? (
          <div
            onClick={() => setViewingPhoto(latestPhoto)}
            style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "1px solid #24242E" }}
          >
            <img src={latestPhoto.dataUrl} alt={latestPhoto.note || "Latest progress"} style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }} />
            <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(8,8,12,0.72)", color: "#FFFFFF", borderRadius: 999, padding: "5px 11px", fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 900, letterSpacing: 1, backdropFilter: "blur(6px)" }}>
              {totalPhotoCount} {text.photoCount}
            </span>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "36px 14px 13px", background: "linear-gradient(transparent, rgba(6,6,10,0.92))" }}>
              <p style={{ fontSize: 9, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.latest.toUpperCase()}</p>
              <p style={{ fontSize: 17, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                {latestPhoto.date} · {fmtW(latestPhoto.weight)}
              </p>
              {latestPhoto.note && (
                <p style={{ fontSize: 12, color: "#C8D0DC", fontFamily: "'DM Sans', sans-serif", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{latestPhoto.note}</p>
              )}
            </div>
          </div>
        ) : (
          <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 190, borderRadius: 14, border: `1.5px dashed ${isLightMode ? "rgba(0,0,0,0.18)" : "#3A3A46"}`, cursor: "pointer", textAlign: "center", padding: 20 }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? "#9AA0AC" : "#5A5F6A"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
              <circle cx="13" cy="13" r="4" />
            </svg>
            <p style={{ color: isLightMode ? "#5A6270" : "#9CA1AC", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14 }}>{text.addFirstPhoto}</p>
            <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
          </label>
        )}

        {progressPhotos.length > 1 && (
          <div className="photo-strip">
            {progressPhotos.slice(0, 10).map(photo => (
              <div key={photo.id} onClick={() => setViewingPhoto(photo)} style={{ flex: "0 0 76px", cursor: "pointer", scrollSnapAlign: "start" }}>
                <img src={photo.dataUrl} alt={photo.note || "Progress"} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 10, border: "1px solid #24242E", display: "block" }} />
                <p style={{ fontSize: 9, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", marginTop: 4, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.date?.slice(5) || ""}</p>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <input className="input" type="date" value={photoDraft.date} onChange={event => setPhotoDraft(prev => ({ ...prev, date: event.target.value }))} />
            <label className="dark-btn" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {photoDraft.dataUrl ? t("Cambiar foto", "Change photo") : text.choosePhoto}
              <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
            </label>
          </div>
          <input className="input" value={photoDraft.note} onChange={event => setPhotoDraft(prev => ({ ...prev, note: event.target.value }))} placeholder={text.photoNote} />
          {photoDraft.dataUrl && (
            <>
              <img src={photoDraft.dataUrl} alt="Progress preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12, border: "1px solid #24242E", display: "block" }} />
              <button className="primary-btn" onClick={saveProgressPhoto}>{text.savePhoto}</button>
            </>
          )}
        </div>
      </div>

      {isProgressionDue(lastProgressionReview) && progressionItems.length > 0 && (
        <div className="home-card" style={{ marginBottom: 14, borderColor: "#FFD06055", background: "#151207" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFD060", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
            {text.twoWeekUpgrade}
          </p>

          <p style={{ color: "#BFA45E", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
            {text.progressionLead} {progressionItems.length} {text.progressionTail}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <button className="dark-btn" onClick={rejectProgression}>
              {text.keepCurrent}
            </button>
            <button className="primary-btn" onClick={acceptProgression}>
              {text.applyFive}
            </button>
          </div>
        </div>
      )}

      <div className="metric-grid" style={{ marginBottom: 14 }}>
        {[
          { label: text.mWeekly, val: `${weeklyMetrics.weeklyProgress}%`, color: "#90C8FF" },
          { label: text.mDone, val: weeklyMetrics.completedExercises, color: "#3FB98A" },
          { label: text.mExercises, val: weeklyMetrics.totalExercises, color: null },
          { label: text.mSets, val: weeklyMetrics.totalSets, color: null },
          { label: text.mSessions, val: weeklyMetrics.workoutSessions, color: null },
          { label: text.mCompleted, val: weeklyMetrics.completedSessions, color: "#3FB98A" },
          { label: text.mCardio, val: weeklyMetrics.cardioSessions, color: "#FF9860" },
          { label: text.mDays, val: "7", color: "#FFD060" },
        ].map(metric => (
          <div key={metric.label} className="stat-box">
            <p style={{ fontSize: 22, fontWeight: 900, color: metric.color || (isLightMode ? "#101015" : "#FFFFFF"), fontFamily: "'Orbitron', monospace" }}>
              {metric.val}
            </p>
            <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      <div className="home-card">
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 12 }}>
          {text.weekPlan.toUpperCase()}
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          {days.map(dayName => {
            const currentDay = workoutData[dayName];
            const currentTheme = themeFor(currentDay.type);

            return (
              <button
                key={dayName}
                className="dark-btn"
                onClick={() => openWorkout(dayName)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
              >
                <span>
                  <span style={{ display: "block", fontFamily: "'Orbitron', monospace", letterSpacing: 1 }}>
                    {displayDayShort(dayName, currentDay.label)} - {displayDay(dayName)}
                  </span>
                  <span style={{ display: "block", color: isLightMode ? "#7A8090" : "#888", fontSize: 12, marginTop: 3 }}>
                    {currentDay.sessions.map(s => s.name).join(" / ")}
                  </span>
                </span>

                <span style={{ color: currentTheme.accent, background: currentTheme.badge, border: `1px solid ${currentTheme.accent}40`, padding: "6px 9px", borderRadius: 8, fontFamily: "'Orbitron', monospace", fontSize: 10 }}>
                  {currentDay.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
