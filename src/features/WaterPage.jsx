const WATER_GOAL_OPTIONS = ["4", "6", "8", "10", "12", "14", "16"];

export default function WaterPage({
  text,
  t,
  language,
  isLightMode,
  waterLog,
  waterGlasses,
  waterGoalNum,
  waterPct,
  addWater,
  removeWater,
  setWaterGoalForToday,
  getDateKey,
}) {
  const wAccent = waterPct >= 100 ? "#3FB98A" : "#90C8FF";
  const waterStreakDays = (() => {
    const sortedKeys = Object.keys(waterLog).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    const today2 = getDateKey();
    for (let si = 0; si < sortedKeys.length; si++) {
      const d = sortedKeys[si];
      if (si === 0 && d !== today2) break;
      const e = waterLog[d];
      if (Number(e.glasses || 0) >= Number(e.goal || 8)) streak++;
      else break;
    }
    return streak;
  })();

  const whyLines = language === "es"
    ? [
        "Mejora la fuerza y resistencia muscular hasta un 10-15%.",
        "Aumenta el enfoque mental y reduce la fatiga durante el entrenamiento.",
        "Acelera el metabolismo y optimiza la quema de grasa.",
        "Mejora la recuperación muscular post-entrenamiento.",
      ]
    : [
        "Boosts muscle strength and endurance by up to 10-15%.",
        "Improves mental focus and reduces fatigue during training.",
        "Speeds up metabolism and optimizes fat burning.",
        "Enhances muscle recovery post-workout.",
      ];

  return (
    <div className="detail-list">
      <div className="detail-grid">
        <div className="detail-card">
          <p className="detail-label">{text.waterToday.toUpperCase()}</p>
          <p className="detail-value" style={{ color: wAccent }}>{waterGlasses}/{waterGoalNum}</p>
          <p style={{ fontSize: 10, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", marginTop: 4, letterSpacing: 1 }}>{text.glasses.toUpperCase()}</p>
        </div>
        <div className="detail-card">
          <p className="detail-label">{t("COMPLETADO", "COMPLETED")}</p>
          <p className="detail-value" style={{ color: wAccent }}>{waterPct}%</p>
          {waterStreakDays > 0 && <p style={{ fontSize: 10, color: "#FFD060", fontFamily: "'Orbitron', monospace", marginTop: 4, letterSpacing: 1 }}>{waterStreakDays} {t("DÍAS SEGUIDOS", "DAY STREAK")}</p>}
        </div>
      </div>

      <div>
        <div style={{ width: "100%", height: 48, borderRadius: 10, overflow: "hidden", background: isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)", position: "relative", marginBottom: 10 }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: `${waterPct}%`, background: wAccent, opacity: 0.85, transition: "height 0.6s cubic-bezier(0.4,0,0.2,1)", borderRadius: "0 0 8px 8px" }}>
            {waterGlasses > 0 && (
              <div style={{ position: "absolute", top: -4, left: "-50%", width: "200%", height: 8, background: "rgba(255,255,255,0.2)", borderRadius: "50%", animation: "waterWave 3s ease-in-out infinite" }} />
            )}
          </div>
          {waterPct >= 30 && (
            <p style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Orbitron', monospace", fontSize: 14, fontWeight: 900, color: "#FFFFFF" }}>
              {waterPct}%
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {Array.from({ length: waterGoalNum }).map((_, gi) => {
            const filled = gi < waterGlasses;
            return (
              <div
                key={gi}
                onClick={() => filled ? removeWater() : addWater()}
                style={{ flex: 1, height: 6, borderRadius: 3, background: filled ? wAccent : (isLightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"), cursor: "pointer", transition: "background 0.2s ease" }}
              />
            );
          })}
        </div>
      </div>

      {waterPct >= 100 && (
        <div className="detail-card" style={{ borderColor: "#3FB98A44" }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: "#3FB98A", fontFamily: "'Orbitron', monospace" }}>
            {t("META DIARIA ALCANZADA", "DAILY GOAL REACHED")}
          </p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button className="dark-btn" onClick={() => removeWater()} style={{ padding: "14px 10px", fontSize: 16, fontWeight: 900, color: isLightMode ? "#7A8090" : "#8A8F99" }}>
          − {text.glassWord}
        </button>
        <button className="primary-btn" onClick={() => addWater()} style={{ padding: "14px 10px", fontSize: 16, fontWeight: 900 }}>
          + {text.glassWord}
        </button>
      </div>

      <div className="detail-card">
        <p className="detail-label">{text.waterGoal.toUpperCase()}</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
          {WATER_GOAL_OPTIONS.map(option => {
            const sel = String(waterGoalNum) === option;
            return (
              <button
                key={option}
                onClick={() => setWaterGoalForToday(option)}
                style={{ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${sel ? "#90C8FF66" : (isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)")}`, background: sel ? (isLightMode ? "rgba(144,200,255,0.12)" : "rgba(144,200,255,0.1)") : "transparent", color: sel ? "#90C8FF" : "#888", fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 900, cursor: "pointer" }}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {t("HISTORIAL RECIENTE", "RECENT HISTORY")}
        </p>
        <div style={{ display: "grid", gap: 6 }}>
          {Object.entries(waterLog)
            .sort((a, b) => b[0].localeCompare(a[0]))
            .slice(0, 7)
            .map(([date, entry]) => {
              const g = Number(entry.glasses || 0);
              const gl = Number(entry.goal || 8);
              const pctH = Math.min(100, gl > 0 ? Math.round((g / gl) * 100) : 0);
              const hColor = pctH >= 100 ? "#3FB98A" : pctH >= 50 ? "#90C8FF" : "#666";
              const isToday = date === getDateKey();
              return (
                <div key={date} className="detail-row" style={{ borderColor: isToday ? "#90C8FF22" : undefined }}>
                  <div style={{ minWidth: 72 }}>
                    <p className="detail-row-main" style={{ fontSize: 12, color: isToday ? "#90C8FF" : undefined }}>
                      {isToday ? t("HOY", "TODAY") : date}
                    </p>
                  </div>
                  <div style={{ flex: 1, height: 4, borderRadius: 4, overflow: "hidden", background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
                    <div style={{ width: `${pctH}%`, height: "100%", background: hColor, borderRadius: 4, transition: "width 0.4s ease" }} />
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 900, color: hColor, fontFamily: "'Orbitron', monospace", minWidth: 40, textAlign: "right" }}>{g}/{gl}</p>
                </div>
              );
            })}
        </div>
      </div>

      <div className="home-card">
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {t("POR QUÉ IMPORTA", "WHY IT MATTERS")}
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {whyLines.map((line, ii) => (
            <div key={ii} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#90C8FF", marginTop: 5, flexShrink: 0 }} />
              <p style={{ color: isLightMode ? "#2A3A4A" : "#B8C8D8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.55 }}>{line}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
