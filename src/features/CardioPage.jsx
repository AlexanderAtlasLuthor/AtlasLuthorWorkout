import TrendChart from "../components/TrendChart.jsx";
import { CARDIO_TYPES, cardioTypeInfo, cardioTypeLabel, estimateCardioCalories, formatPace } from "../lib/cardio.js";
import { distanceInputToMiles, distanceUnit } from "../lib/units.js";

export default function CardioPage({
  text,
  t,
  language,
  isLightMode,
  fmtDist,
  cardioLog,
  cardioDraft,
  setCardioDraft,
  unitSystem,
  weeklyCardio,
  profile,
  addCardioSession,
  removeCardioSession,
  getDateKey,
}) {
  const cardioDays = Object.entries(cardioLog).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14);
  const cardioMinutesSeries = [];
  for (let dayOffset = 13; dayOffset >= 0; dayOffset -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - dayOffset);
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    const minutes = (cardioLog[key] || []).reduce((sum, item) => sum + (Number(item.durationMin) || 0), 0);
    cardioMinutesSeries.push({ value: minutes });
  }
  const hasCardioTrend = cardioMinutesSeries.some(point => point.value > 0);
  const typeInfo = cardioTypeInfo(cardioDraft.type);
  const draftDistance = distanceInputToMiles(cardioDraft.distance, unitSystem);
  const draftDuration = Number(cardioDraft.durationMin) || 0;

  return (
    <div className="detail-list">
      <div className="detail-grid">
        <div className="detail-card"><p className="detail-label">{text.weeklyCardio.toUpperCase()}</p><p className="detail-value" style={{ color: "#FF9860" }}>{weeklyCardio.sessions}</p></div>
        <div className="detail-card"><p className="detail-label">{text.duration.toUpperCase()}</p><p className="detail-value">{weeklyCardio.minutes} {text.minutesShort}</p></div>
        <div className="detail-card"><p className="detail-label">{text.distance.toUpperCase()}</p><p className="detail-value">{fmtDist(weeklyCardio.distance)}</p></div>
        <div className="detail-card"><p className="detail-label">{text.caloriesBurned.toUpperCase()}</p><p className="detail-value" style={{ color: "#FF9860" }}>{weeklyCardio.calories}</p></div>
      </div>

      <div className="home-card">
        <p className="detail-label">{text.addCardioSession.toUpperCase()}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <select className="input" value={cardioDraft.type} onChange={event => setCardioDraft(prev => ({ ...prev, type: event.target.value }))}>
            {CARDIO_TYPES.map(option => <option key={option.id} value={option.id}>{cardioTypeLabel(option.id, language)}</option>)}
          </select>
          <div style={{ display: "grid", gridTemplateColumns: typeInfo.distance ? "1fr 1fr" : "1fr", gap: 8 }}>
            <label style={{ display: "block" }}>
              <span className="field-label">{text.duration.toUpperCase()} ({text.minutesShort})</span>
              <input className="input" type="number" inputMode="numeric" value={cardioDraft.durationMin} onChange={event => setCardioDraft(prev => ({ ...prev, durationMin: event.target.value }))} placeholder="20" />
            </label>
            {typeInfo.distance && (
              <label style={{ display: "block" }}>
                <span className="field-label">{text.distance.toUpperCase()} ({distanceUnit(unitSystem)})</span>
                <input className="input" type="number" inputMode="decimal" value={cardioDraft.distance} onChange={event => setCardioDraft(prev => ({ ...prev, distance: event.target.value }))} placeholder="3" />
              </label>
            )}
          </div>
          <input className="input" value={cardioDraft.note} onChange={event => setCardioDraft(prev => ({ ...prev, note: event.target.value }))} placeholder={text.noteField} />
          {draftDuration > 0 && (
            <p style={{ fontSize: 12, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif" }}>
              {estimateCardioCalories(cardioDraft.type, draftDuration, profile.currentWeight)} kcal
              {typeInfo.distance && draftDistance > 0 ? ` · ${formatPace(draftDistance, draftDuration, unitSystem)}` : ""}
            </p>
          )}
          <button className="primary-btn" onClick={addCardioSession}>{text.addCardioSession}</button>
        </div>
      </div>

      {hasCardioTrend && (
        <div className="home-card">
          <p className="detail-label">
            {t("MINUTOS · ÚLTIMOS 14 DÍAS", "MINUTES · LAST 14 DAYS")}
          </p>
          <div style={{ marginTop: 10 }}>
            <TrendChart
              points={cardioMinutesSeries}
              color="#FF9860"
              formatValue={value => `${Math.round(value)} ${text.minutesShort}`}
            />
          </div>
        </div>
      )}

      {cardioDays.length === 0 && (
        <p style={{ color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>{text.noCardioYet}</p>
      )}
      {cardioDays.map(([date, list]) => (
        <div key={date} className="home-card">
          <p className="detail-label">{date === getDateKey() ? t("HOY", "TODAY") : date}</p>
          <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
            {(list || []).map(item => (
              <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: isLightMode ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{cardioTypeLabel(item.type, language)}</p>
                  <p style={{ fontSize: 11, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif" }}>
                    {item.durationMin} {text.minutesShort}{item.distance > 0 ? ` · ${fmtDist(item.distance)} · ${formatPace(item.distance, item.durationMin, unitSystem)}` : ""} · {item.calories} kcal
                  </p>
                </div>
                <button className="edit-btn" onClick={() => removeCardioSession(date, item.id)} style={{ color: "#E5604D", flexShrink: 0 }}>{text.removeBtn}</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
