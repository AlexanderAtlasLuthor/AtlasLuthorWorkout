export default function EditCardioModal({
  text,
  themeAccent,
  editingCardio,
  setEditingCardio,
  updateCardio,
  cardioOptions,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: themeAccent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          EDIT CARDIO
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <input
            className="input"
            value={editingCardio.name}
            onChange={event => setEditingCardio(prev => ({ ...prev, name: event.target.value }))}
            placeholder="Cardio name"
          />

          <select
            className="input"
            value={editingCardio.duration}
            onChange={event => setEditingCardio(prev => ({ ...prev, duration: event.target.value }))}
          >
            {Array.from(new Set([editingCardio.duration, ...cardioOptions])).map(option => (
              <option key={option || "empty"} value={option}>{option || "No duration"}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingCardio(null)}>
            {text.cancel}
          </button>
          <button
            className="primary-btn"
            style={{ flex: 1 }}
            onClick={() => {
              updateCardio({
                dayName: editingCardio.dayName,
                sessionIndex: editingCardio.sessionIndex,
                warmup: {
                  name: editingCardio.name,
                  duration: editingCardio.duration,
                },
              });
              setEditingCardio(null);
            }}
          >
            {text.save}
          </button>
        </div>
      </div>
    </div>
  );
}
