export default function EditNoteModal({
  text,
  t,
  themeAccent,
  editingNote,
  setEditingNote,
  saveExerciseNote,
  painOptions,
  rpeOptions,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: themeAccent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {t("NOTAS DEL EJERCICIO", "EXERCISE NOTES")}
        </p>

        <h3 style={{ fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
          {editingNote.name}
        </h3>

        <div style={{ display: "grid", gap: 10 }}>
          <select
            className="input"
            value={editingNote.pain}
            onChange={event => setEditingNote(prev => ({ ...prev, pain: event.target.value }))}
          >
            {painOptions.map(option => (
              <option key={option || "empty"} value={option}>{option || t("Dolor / malestar", "Pain / discomfort")}</option>
            ))}
          </select>

          <select
            className="input"
            value={editingNote.difficulty}
            onChange={event => setEditingNote(prev => ({ ...prev, difficulty: event.target.value }))}
          >
            {rpeOptions.map(option => (
              <option key={option || "empty"} value={option}>{option ? `RPE ${option}` : t("Dificultad 1-10", "Difficulty 1-10")}</option>
            ))}
          </select>

          <input
            className="input"
            value={editingNote.technique}
            onChange={event => setEditingNote(prev => ({ ...prev, technique: event.target.value }))}
            placeholder={t("Notas de técnica", "Technique notes")}
          />

          <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
            <input
              type="checkbox"
              checked={editingNote.pr}
              onChange={event => setEditingNote(prev => ({ ...prev, pr: event.target.checked }))}
            />
            {t("Marcar como Récord", "Mark as PR")}
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingNote(null)}>
            {text.cancel}
          </button>
          <button
            className="primary-btn"
            style={{ flex: 1 }}
            onClick={() => saveExerciseNote(editingNote)}
          >
            {text.save}
          </button>
        </div>
      </div>
    </div>
  );
}
