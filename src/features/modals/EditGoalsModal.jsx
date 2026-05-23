export default function EditGoalsModal({
  text,
  t,
  language,
  editingGoals,
  setEditingGoals,
  setGoals,
  bodyTypeGoalOptions,
  progressGoalOptions,
  sessionGoalOptions,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.setMyGoals}
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            className="input"
            value={editingGoals.focusGoal}
            onChange={event => setEditingGoals(prev => ({ ...prev, focusGoal: event.target.value }))}
            placeholder={t("Meta principal", "Main goal")}
          />

          <label style={{ display: "block" }}>
            <span className="field-label">{text.bodyTypeLabel.toUpperCase()}</span>
            <select
              className="input"
              value={editingGoals.bodyTypeGoal || "athletic"}
              onChange={event => setEditingGoals(prev => ({ ...prev, bodyTypeGoal: event.target.value }))}
            >
              {bodyTypeGoalOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {language === "es"
                    ? ({ lean: "Definir / Cortar", athletic: "Recomposición Atlética", muscular: "Ganar Músculo / Volumen", maintain: "Mantener & Tonificar" }[option.value] || option.label)
                    : option.label}
                </option>
              ))}
            </select>
          </label>

          <select
            className="input"
            value={editingGoals.weeklyProgressGoal}
            onChange={event => setEditingGoals(prev => ({ ...prev, weeklyProgressGoal: event.target.value }))}
          >
            {Array.from(new Set([editingGoals.weeklyProgressGoal, ...progressGoalOptions])).map(option => (
              <option key={option} value={option}>{option}% {t("meta semanal", "weekly goal")}</option>
            ))}
          </select>

          <select
            className="input"
            value={editingGoals.weeklySessionsGoal}
            onChange={event => setEditingGoals(prev => ({ ...prev, weeklySessionsGoal: event.target.value }))}
          >
            {Array.from(new Set([editingGoals.weeklySessionsGoal, ...sessionGoalOptions])).map(option => (
              <option key={option} value={option}>{option} {text.sessionsWord}</option>
            ))}
          </select>

          <input
            className="input"
            type="date"
            value={editingGoals.targetDate}
            onChange={event => setEditingGoals(prev => ({ ...prev, targetDate: event.target.value }))}
            placeholder={t("Fecha meta", "Target date")}
          />
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingGoals(null)}>
            {text.cancel}
          </button>
          <button
            className="primary-btn"
            style={{ flex: 1 }}
            onClick={() => {
              setGoals(editingGoals);
              setEditingGoals(null);
            }}
          >
            {text.save}
          </button>
        </div>
      </div>
    </div>
  );
}
