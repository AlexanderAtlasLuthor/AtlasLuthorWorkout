export default function EditExerciseModal({
  text,
  themeAccent,
  fmtExW,
  editingExercise,
  setEditingExercise,
  updateExerciseWeight,
  weightOptions,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: themeAccent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.editWeight}
        </p>

        <h3 style={{ fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
          {editingExercise.name}
        </h3>

        <select
          className="input"
          value={editingExercise.weight}
          onChange={event => setEditingExercise(prev => ({ ...prev, weight: event.target.value }))}
        >
          {Array.from(new Set([editingExercise.weight, ...weightOptions])).map(weight => (
            <option key={weight} value={weight}>{fmtExW(weight)}</option>
          ))}
        </select>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingExercise(null)}>
            {text.cancel}
          </button>
          <button
            className="primary-btn"
            style={{ flex: 1 }}
            onClick={() => {
              updateExerciseWeight(editingExercise);
              setEditingExercise(null);
            }}
          >
            {text.save}
          </button>
        </div>
      </div>
    </div>
  );
}
