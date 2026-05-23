import { ACTIVITY_LEVELS } from "../../lib/nutrition.js";

export default function EditProfileModal({
  text,
  t,
  language,
  isLightMode,
  fmtW,
  fmtH,
  editingProfile,
  setEditingProfile,
  setProfile,
  calculateBMI,
  calculateBodyFatPct,
  calculateIBW,
  getLeanMass,
  genderOptions,
  ageOptions,
  bodyWeightOptions,
  heightOptions,
}) {
  const editBmi = calculateBMI(editingProfile.currentWeight, editingProfile.height);
  const editBf = calculateBodyFatPct(editBmi, editingProfile.age, editingProfile.sex || "male");
  const editIbw = calculateIBW(editingProfile.height, editingProfile.sex || "male");
  const editLean = getLeanMass(editingProfile.currentWeight, editBf);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.editBodyStatus}
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={{ display: "block" }}>
              <span className="field-label">{text.sexLabel}</span>
              <select
                className="input"
                value={editingProfile.sex || "male"}
                onChange={event => setEditingProfile(prev => ({ ...prev, sex: event.target.value }))}
              >
                {genderOptions.map(option => (
                  <option key={option.value} value={option.value}>{language === "es" ? (option.value === "male" ? "Hombre" : "Mujer") : option.label}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">{text.ageLabel}</span>
              <select
                className="input"
                value={editingProfile.age || "30"}
                onChange={event => setEditingProfile(prev => ({ ...prev, age: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.age || "30", ...ageOptions])).map(option => (
                  <option key={option} value={option}>{option} {t("años", "yrs")}</option>
                ))}
              </select>
            </label>
          </div>

          <label style={{ display: "block" }}>
            <span className="field-label">{text.activityLevel.toUpperCase()}</span>
            <select
              className="input"
              value={ACTIVITY_LEVELS.includes(editingProfile.activityLevel) ? editingProfile.activityLevel : "auto"}
              onChange={event => setEditingProfile(prev => ({ ...prev, activityLevel: event.target.value }))}
            >
              <option value="auto">{t("Automático (según tu rutina)", "Automatic (from your routine)")}</option>
              {ACTIVITY_LEVELS.map(level => (
                <option key={level} value={level}>
                  {text[`activity${level.charAt(0).toUpperCase()}${level.slice(1)}`]}
                </option>
              ))}
            </select>
          </label>

          <select
            className="input"
            value={editingProfile.currentWeight}
            onChange={event => setEditingProfile(prev => ({ ...prev, currentWeight: event.target.value }))}
          >
            {Array.from(new Set([editingProfile.currentWeight, ...bodyWeightOptions])).map(option => (
              <option key={option} value={option}>{fmtW(option)} {t("actual", "current")}</option>
            ))}
          </select>

          <select
            className="input"
            value={editingProfile.startWeight}
            onChange={event => setEditingProfile(prev => ({ ...prev, startWeight: event.target.value }))}
          >
            {Array.from(new Set([editingProfile.startWeight, ...bodyWeightOptions])).map(option => (
              <option key={option} value={option}>{fmtW(option)} {t("inicio", "start")}</option>
            ))}
          </select>

          <select
            className="input"
            value={editingProfile.targetWeight}
            onChange={event => setEditingProfile(prev => ({ ...prev, targetWeight: event.target.value }))}
          >
            {Array.from(new Set([editingProfile.targetWeight, ...bodyWeightOptions])).map(option => (
              <option key={option} value={option}>{fmtW(option)} {t("meta", "target")}</option>
            ))}
          </select>

          <select
            className="input"
            value={editingProfile.height}
            onChange={event => setEditingProfile(prev => ({ ...prev, height: event.target.value }))}
          >
            {Array.from(new Set([editingProfile.height, ...heightOptions])).map(option => (
              <option key={option} value={option}>{fmtH(option)}</option>
            ))}
          </select>

          <input
            className="input"
            type="date"
            value={editingProfile.startDate}
            onChange={event => setEditingProfile(prev => ({ ...prev, startDate: event.target.value }))}
            placeholder={t("Fecha de inicio", "Start date")}
          />

          {editBmi > 0 && (
            <div style={{ border: "1px solid #24242E", borderRadius: 12, padding: 12, background: "#101015" }}>
              <p style={{ fontSize: 9, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.bodyComposition.toUpperCase()}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
                {[
                  { label: text.bmiLabel, val: String(editBmi) },
                  { label: text.bodyFatLabel, val: `${editBf}%` },
                  { label: text.leanMassLabel, val: fmtW(editLean) },
                  { label: text.ibwLabel, val: fmtW(editIbw) },
                ].map(item => (
                  <div key={item.label} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 16, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>{item.val}</p>
                    <p style={{ fontSize: 9, letterSpacing: 1, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", marginTop: 3 }}>{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingProfile(null)}>
            {text.cancel}
          </button>
          <button
            className="primary-btn"
            style={{ flex: 1 }}
            onClick={() => {
              setProfile(editingProfile);
              setEditingProfile(null);
            }}
          >
            {text.save}
          </button>
        </div>
      </div>
    </div>
  );
}
