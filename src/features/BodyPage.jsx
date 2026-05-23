import TrendChart from "../components/TrendChart.jsx";
import { MEASUREMENT_FIELDS } from "../lib/bodyComp.js";
import { inToCm } from "../lib/units.js";

export default function BodyPage({
  text,
  t,
  fmtW,
  fmtH,
  fmtWDelta,
  fmtMeasure,
  profile,
  profileSex,
  goals,
  weightChange,
  weightToGoal,
  bmi,
  bodyFatPct,
  leanMassLb,
  ibwLb,
  latestMeasurement,
  measurementEntries,
  navyBodyFatPct,
  unitSystem,
  getDateKey,
  setEditingMeasurements,
  setEditingProfile,
  progressEntries,
  dayBreakdowns,
  themeFor,
  displayDay,
  displayDayShort,
}) {
  return (
    <div className="detail-list">
      <div className="detail-grid">
        {[
          { label: text.currentLabel, val: fmtW(profile.currentWeight) },
          { label: text.start, val: fmtW(profile.startWeight) },
          { label: text.target, val: fmtW(profile.targetWeight) },
          { label: text.change, val: fmtWDelta(weightChange) },
          { label: text.toGoal, val: fmtWDelta(weightToGoal) },
          { label: text.heightLabel, val: fmtH(profile.height) },
          { label: text.sexLabel.toUpperCase(), val: profileSex === "male" ? text.maleLabel : text.femaleLabel },
          { label: text.ageLabel.toUpperCase(), val: `${profile.age || "--"} ${t("años", "yrs")}` },
        ].map(metric => (
          <div key={metric.label} className="detail-card">
            <p className="detail-label">{metric.label}</p>
            <p className="detail-value">{metric.val}</p>
          </div>
        ))}
      </div>
      {bmi > 0 && (
        <div className="home-card">
          <p className="detail-label">{text.bodyComposition.toUpperCase()}</p>
          <div className="detail-grid" style={{ marginTop: 10 }}>
            {[
              { label: text.bmiLabel, val: String(bmi) },
              { label: text.bodyFatLabel, val: `${bodyFatPct}%` },
              { label: text.leanMassLabel, val: fmtW(leanMassLb) },
              { label: text.ibwLabel, val: fmtW(ibwLb) },
            ].map(item => (
              <div key={item.label} className="detail-card">
                <p className="detail-label">{item.label}</p>
                <p className="detail-value">{item.val}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="home-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: latestMeasurement ? 10 : 0 }}>
          <p className="detail-label">{text.measurements.toUpperCase()}</p>
          <button
            className="edit-btn"
            onClick={() => {
              const draft = { date: getDateKey() };
              MEASUREMENT_FIELDS.forEach(field => {
                const inches = latestMeasurement?.[field] || 0;
                draft[field] = inches
                  ? String(unitSystem === "metric" ? Math.round(inToCm(inches) * 10) / 10 : inches)
                  : "";
              });
              setEditingMeasurements(draft);
            }}
          >
            {text.addMeasurement}
          </button>
        </div>
        {latestMeasurement ? (
          <>
            <div className="detail-grid">
              {MEASUREMENT_FIELDS.filter(field => latestMeasurement[field]).map(field => (
                <div key={field} className="detail-card">
                  <p className="detail-label">{text[field].toUpperCase()}</p>
                  <p className="detail-value">{fmtMeasure(latestMeasurement[field])}</p>
                </div>
              ))}
            </div>
            {navyBodyFatPct > 0 && (
              <p style={{ marginTop: 10, fontSize: 13, color: "#90C8FF", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                {text.navyBodyFat}: {navyBodyFatPct}%
              </p>
            )}
            {measurementEntries.length > 1 && (
              <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
                <p className="detail-label">{text.measurementHistory.toUpperCase()}</p>
                {measurementEntries.slice(0, 6).map(entry => (
                  <div key={entry.date} style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                    <span style={{ color: "#8A8F99", fontWeight: 700 }}>{entry.date}</span>
                    <span style={{ fontWeight: 800 }}>{entry.waist ? `${text.waist} ${fmtMeasure(entry.waist)}` : "--"}</span>
                  </div>
                ))}
              </div>
            )}
            {measurementEntries.filter(entry => Number(entry.waist) > 0).length >= 2 && (
              <div style={{ marginTop: 12 }}>
                <p className="detail-label">{text.waist.toUpperCase()}</p>
                <div style={{ marginTop: 8 }}>
                  <TrendChart
                    points={[...measurementEntries].reverse().filter(entry => Number(entry.waist) > 0).slice(-24).map(entry => ({ value: Number(entry.waist) }))}
                    color="#B8A0FF"
                    formatValue={value => fmtMeasure(value)}
                  />
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>{text.noMeasurements}</p>
        )}
      </div>
      <button className="primary-btn" onClick={() => setEditingProfile({ ...profile })}>
        {text.editBodyStatus}
      </button>
      <div className="home-card">
        <p className="detail-label">{text.bodyTrend}</p>
        <p className="detail-row-main">
          {weightChange === 0 ? text.stableSinceStart : weightChange > 0 ? text.upFromStarting : text.downFromStarting}
        </p>
        <p className="detail-row-sub">
          {t(`Fecha inicio ${profile.startDate}. Fecha meta ${goals.targetDate}. Diferencia actual a la meta: ${fmtWDelta(weightToGoal)}.`, `Start date ${profile.startDate}. Target date ${goals.targetDate}. Current gap to target is ${fmtWDelta(weightToGoal)}.`)}
        </p>
        <div style={{ marginTop: 12 }}>
          <TrendChart
            points={[...progressEntries].reverse().filter(entry => Number(entry.weight) > 0).slice(-24).map(entry => ({ value: Number(entry.weight) }))}
            color="#90C8FF"
            formatValue={value => fmtW(value)}
            emptyLabel={t("Registra tu peso para ver la tendencia.", "Log your weight to see the trend.")}
          />
        </div>
      </div>
      <div className="detail-list">
        {progressEntries.slice(0, 5).map(entry => (
          <div key={`${entry.id}-body-row`} className="detail-row">
            <div>
              <p className="detail-row-main">{entry.date}</p>
              <p className="detail-row-sub">{entry.type === "manual" ? text.manualBodyCheck : text.autoProgressCapture}</p>
            </div>
            <span style={{ color: "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtW(entry.weight)}</span>
          </div>
        ))}
      </div>
      <div className="home-card">
        <p className="detail-label">{text.dayByDay}</p>
        <div className="detail-list">
          {dayBreakdowns.map(row => (
            <div key={`${row.dayName}-metric-detail`} className="detail-row">
              <div>
                <p className="detail-row-main">{displayDayShort(row.dayName, row.label)} - {displayDay(row.dayName)}</p>
                <p className="detail-row-sub">{row.doneDayExercises}/{row.totalDayExercises} {text.exercisesWord} - {row.doneDaySets}/{row.totalDaySets} {text.setsWord}</p>
              </div>
              <span style={{ color: themeFor(row.type).accent, fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{row.progressPct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
