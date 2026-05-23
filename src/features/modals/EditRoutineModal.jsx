export default function EditRoutineModal({
  text,
  t,
  language,
  isLightMode,
  fmtExW,
  days,
  workoutData,
  getDisplayDay,
  editingRoutine,
  setEditingRoutine,
  updateRoutineSessionMeta,
  addRoutineSession,
  duplicateRoutineSession,
  removeRoutineSession,
  removeRoutineExercise,
  updateRoutineExercise,
  addRoutineExercise,
  exerciseFilterMuscle,
  setExerciseFilterMuscle,
  exerciseMuscleGroups,
  commonExercises,
  setOptions,
  repOptions,
  weightOptions,
}) {
  const routineDay = workoutData[editingRoutine.dayName];
  const safeSessionIndex = Math.min(editingRoutine.sessionIndex, routineDay.sessions.length - 1);
  const routineSession = routineDay.sessions[safeSessionIndex];

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 13, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
              {text.manageWorkouts.toUpperCase()}
            </p>
            <p style={{ fontSize: 12, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
              {text.manageWorkoutsSub}
            </p>
          </div>
          <button className="edit-btn" onClick={() => setEditingRoutine(null)} style={{ padding: "8px 12px" }}>
            {text.doneBtn}
          </button>
        </div>

        <p className="menu-section-label">{text.daySection}</p>
        <select
          className="input"
          style={{ marginTop: 6, marginBottom: 16 }}
          value={editingRoutine.dayName}
          onChange={event => setEditingRoutine(prev => ({ ...prev, dayName: event.target.value, sessionIndex: 0 }))}
        >
          {days.map(dayName => (
            <option key={dayName} value={dayName}>{getDisplayDay(dayName, language)} — {workoutData[dayName].type}</option>
          ))}
        </select>

        <p className="menu-section-label">{text.sessionSection}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 6, marginBottom: 16 }}>
          <select
            className="input"
            value={safeSessionIndex}
            onChange={event => setEditingRoutine(prev => ({ ...prev, sessionIndex: Number(event.target.value) }))}
          >
            {routineDay.sessions.map((currentSession, index) => (
              <option key={`${currentSession.name}-${index}`} value={index}>{index + 1}. {currentSession.time} — {currentSession.name}</option>
            ))}
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 8 }}>
            <label style={{ display: "block" }}>
              <span className="field-label">{text.sessionNameField}</span>
              <input
                className="input"
                value={routineSession?.name || ""}
                onChange={event => updateRoutineSessionMeta({ name: event.target.value })}
                placeholder={text.sessionNamePlaceholder}
              />
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">{text.timeField}</span>
              <select
                className="input"
                value={routineSession?.time || "AM"}
                onChange={event => updateRoutineSessionMeta({ time: event.target.value })}
              >
                {Array.from(new Set([routineSession?.time || "AM", "AM", "PM", "FULL"])).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            <button className="dark-btn" onClick={addRoutineSession}>{text.addSessionBtn}</button>
            <button className="dark-btn" onClick={duplicateRoutineSession}>{text.duplicateBtn}</button>
            <button
              className="dark-btn"
              onClick={removeRoutineSession}
              disabled={routineDay.sessions.length <= 1}
              style={routineDay.sessions.length <= 1 ? { opacity: 0.4 } : { color: "#E5604D" }}
            >
              {text.deleteBtn}
            </button>
          </div>
        </div>

        <p className="menu-section-label">{text.mExercises}</p>
        <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
          {(routineSession?.exercises || []).length === 0 && (
            <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "10px 2px" }}>
              {text.noExercisesYet}
            </p>
          )}
          {(routineSession?.exercises || []).map((exercise, exerciseIndex) => (
            <div key={`${exercise.name}-${exerciseIndex}`} style={{ border: "1px solid #24242E", borderRadius: 14, overflow: "hidden" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(144,200,255,0.05)", borderBottom: "1px solid #24242E" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: "#90C8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#0A0A10", fontFamily: "'Orbitron', monospace", flexShrink: 0 }}>
                    {exerciseIndex + 1}
                  </div>
                  <span style={{ fontSize: 9, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace", fontWeight: 700 }}>
                    {text.exerciseLabel}
                  </span>
                </div>
                <button className="edit-btn" onClick={() => removeRoutineExercise(exerciseIndex)} style={{ color: "#E5604D", fontSize: 11 }}>
                  {text.removeBtn}
                </button>
              </div>
              <div style={{ padding: "10px 14px 14px" }}>
                <input className="input" value={exercise.name} onChange={event => updateRoutineExercise(exerciseIndex, { name: event.target.value })} placeholder={text.exerciseNamePlaceholder} style={{ marginBottom: 10, fontWeight: 600 }} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.mSets}</p>
                    <select className="input" value={exercise.sets} onChange={event => updateRoutineExercise(exerciseIndex, { sets: event.target.value })}>
                      {setOptions.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.repsLabel}</p>
                    <select className="input" value={exercise.reps} onChange={event => updateRoutineExercise(exerciseIndex, { reps: event.target.value })}>
                      {Array.from(new Set([String(exercise.reps), ...repOptions])).map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.weightWord}</p>
                    <select className="input" value={exercise.weight} onChange={event => updateRoutineExercise(exerciseIndex, { weight: event.target.value })}>
                      {Array.from(new Set([exercise.weight, ...weightOptions])).map(option => <option key={option} value={option}>{fmtExW(option)}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="menu-section-label" style={{ marginTop: 16 }}>{text.addExerciseSection}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 8 }}>
            <select
              className="input"
              value={exerciseFilterMuscle}
              onChange={event => setExerciseFilterMuscle(event.target.value)}
            >
              {exerciseMuscleGroups.map(group => (
                <option key={group} value={group}>{group}</option>
              ))}
            </select>
            <select
              className="input"
              value={editingRoutine.draft.name}
              onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, name: event.target.value } }))}
            >
              <option value="">{t("Seleccionar ejercicio", "Select exercise")}</option>
              {(exerciseFilterMuscle === "All"
                ? Object.values(commonExercises).flat()
                : (commonExercises[exerciseFilterMuscle] || [])
              ).map(ex => (
                <option key={ex} value={ex}>{ex}</option>
              ))}
            </select>
          </div>
          <input
            className="input"
            value={editingRoutine.draft.name}
            onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, name: event.target.value } }))}
            placeholder={t("O escribe el nombre del ejercicio", "Or type a custom exercise name")}
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
            <select className="input" value={editingRoutine.draft.sets} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, sets: event.target.value } }))}>
              {setOptions.map(option => <option key={option} value={option}>{option} {text.setsWord}</option>)}
            </select>
            <select className="input" value={editingRoutine.draft.reps} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, reps: event.target.value } }))}>
              {repOptions.map(option => <option key={option} value={option}>{option} {text.repsWord}</option>)}
            </select>
            <select className="input" value={editingRoutine.draft.weight} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, weight: event.target.value } }))}>
              {weightOptions.map(option => <option key={option} value={option}>{fmtExW(option)}</option>)}
            </select>
          </div>
          <button className="primary-btn" onClick={addRoutineExercise}>
            {t("Agregar Ejercicio", "Add Exercise")}
          </button>
          <button className="dark-btn" onClick={() => setEditingRoutine(null)}>
            {text.doneBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
