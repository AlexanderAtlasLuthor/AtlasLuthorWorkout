import { measureUnit } from "../../lib/units.js";
import { MEASUREMENT_FIELDS } from "../../lib/bodyComp.js";

export default function EditMeasurementsModal({
  text,
  unitSystem,
  editingMeasurements,
  setEditingMeasurements,
  saveMeasurements,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.addMeasurement.toUpperCase()}
        </p>
        <div style={{ display: "grid", gap: 10 }}>
          <label style={{ display: "block" }}>
            <span className="field-label">{text.dateField}</span>
            <input className="input" type="date" value={editingMeasurements.date} onChange={event => setEditingMeasurements(prev => ({ ...prev, date: event.target.value }))} />
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {MEASUREMENT_FIELDS.map(field => (
              <label key={field} style={{ display: "block" }}>
                <span className="field-label">{text[field].toUpperCase()} ({measureUnit(unitSystem)})</span>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  value={editingMeasurements[field] || ""}
                  onChange={event => setEditingMeasurements(prev => ({ ...prev, [field]: event.target.value }))}
                  placeholder="0"
                />
              </label>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingMeasurements(null)}>{text.cancel}</button>
          <button className="primary-btn" style={{ flex: 1 }} onClick={() => saveMeasurements(editingMeasurements)}>{text.save}</button>
        </div>
      </div>
    </div>
  );
}
