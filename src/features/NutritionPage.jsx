import TrendChart from "../components/TrendChart.jsx";
import { ACTIVITY_LEVELS, MEALS, sumDayMacros } from "../lib/nutrition.js";

export default function NutritionPage({
  text,
  t,
  isLightMode,
  calorieTarget,
  todayMacros,
  macroTargets,
  nutritionBMR,
  nutritionTDEE,
  profile,
  setProfile,
  isAutoActivity,
  autoActivityLevel,
  weeklyMetrics,
  foodLog,
  todayFood,
  setAddFoodTarget,
  setFoodSearch,
  removeFoodEntry,
  getDateKey,
}) {
  const calLeft = calorieTarget - todayMacros.kcal;
  const calPct = calorieTarget > 0 ? Math.min(100, Math.round((todayMacros.kcal / calorieTarget) * 100)) : 0;
  const ringR = 52;
  const ringC = 2 * Math.PI * ringR;
  const mealLabels = { breakfast: text.breakfast, lunch: text.lunch, dinner: text.dinner, snack: text.snack };
  const macroRows = [
    { key: "protein", label: text.protein, val: todayMacros.protein, target: macroTargets.protein, color: "#90C8FF" },
    { key: "carbs", label: text.carbs, val: todayMacros.carbs, target: macroTargets.carbs, color: "#FFD060" },
    { key: "fat", label: text.fat, val: todayMacros.fat, target: macroTargets.fat, color: "#FF9860" },
  ];
  const foodDays = Object.entries(foodLog).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 7);

  const calorieSeries = [];
  for (let dayOffset = 13; dayOffset >= 0; dayOffset -= 1) {
    const day = new Date();
    day.setDate(day.getDate() - dayOffset);
    const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    calorieSeries.push({ value: sumDayMacros(foodLog[key]).kcal });
  }
  const hasCalorieData = calorieSeries.some(point => point.value > 0);

  return (
    <div className="detail-list">
      <div className="home-card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", width: 124, height: 124, flexShrink: 0 }}>
          <svg viewBox="0 0 124 124" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="62" cy="62" r={ringR} fill="none" stroke={isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"} strokeWidth="10" />
            <circle cx="62" cy="62" r={ringR} fill="none" stroke={calLeft < 0 ? "#E5604D" : "#3FB98A"} strokeWidth="10" strokeLinecap="round" strokeDasharray={ringC} strokeDashoffset={ringC * (1 - calPct / 100)} style={{ transition: "stroke-dashoffset 0.6s ease" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: isLightMode ? "#101015" : "#FFFFFF", lineHeight: 1 }}>{todayMacros.kcal}</p>
            <p style={{ fontSize: 9, letterSpacing: 1, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginTop: 3 }}>/ {calorieTarget}</p>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, letterSpacing: 3, color: "#3FB98A", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>{text.caloriesLabel}</p>
          <p style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: calLeft < 0 ? "#E5604D" : (isLightMode ? "#101015" : "#FFFFFF"), lineHeight: 1.1 }}>
            {Math.abs(calLeft)} <span style={{ fontSize: 12, color: "#8A8F99", fontWeight: 400 }}>{calLeft < 0 ? text.caloriesOver : text.caloriesLeft}</span>
          </p>
          <p style={{ fontSize: 12, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 6 }}>
            {text.bmrLabel} {nutritionBMR} · {text.tdeeLabel} {nutritionTDEE}
          </p>
          {calorieTarget <= 0 && (
            <p style={{ fontSize: 12, color: "#FFD060", fontFamily: "'DM Sans', sans-serif", marginTop: 6, lineHeight: 1.45 }}>
              {t(
                "Completa tu peso, altura, edad y sexo en el perfil para calcular tu meta de calorías.",
                "Add your weight, height, age and sex in your profile to calculate your calorie target."
              )}
            </p>
          )}
        </div>
      </div>

      <div className="home-card">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#3FB98A", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
          {text.activityLevel.toUpperCase()}
        </p>
        <select
          className="input"
          value={isAutoActivity ? "auto" : profile.activityLevel}
          onChange={event => setProfile(prev => ({ ...prev, activityLevel: event.target.value }))}
        >
          <option value="auto">
            {t("Automático", "Automatic")} · {text[`activity${autoActivityLevel.charAt(0).toUpperCase()}${autoActivityLevel.slice(1)}`]}
          </option>
          {ACTIVITY_LEVELS.map(level => (
            <option key={level} value={level}>
              {text[`activity${level.charAt(0).toUpperCase()}${level.slice(1)}`]}
            </option>
          ))}
        </select>
        <p style={{ fontSize: 12, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 8, lineHeight: 1.5 }}>
          {isAutoActivity
            ? t(`Calculado desde tu protocolo: ${weeklyMetrics.trainingDays} días y ${weeklyMetrics.trainingSessions} sesiones por semana. Tu meta de calorías se ajusta sola cuando cambias tu rutina.`, `Calculated from your protocol: ${weeklyMetrics.trainingDays} days and ${weeklyMetrics.trainingSessions} sessions per week. Your calorie goal updates itself when your routine changes.`)
            : t("Definido manualmente. Elige Automático para que se ajuste a tu entrenamiento real.", "Set manually. Choose Automatic to match your actual training.")}
        </p>
      </div>

      <div className="detail-grid">
        {macroRows.map(macro => {
          const pct = macro.target > 0 ? Math.min(100, Math.round((macro.val / macro.target) * 100)) : 0;
          return (
            <div key={macro.key} className="detail-card">
              <p className="detail-label">{macro.label.toUpperCase()}</p>
              <p className="detail-value" style={{ color: macro.color }}>{macro.val}<span style={{ fontSize: 11, color: "#8A8F99" }}> / {macro.target} g</span></p>
              <div style={{ height: 5, borderRadius: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 8 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: macro.color, borderRadius: 4, transition: "width 0.4s ease" }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="home-card">
        <p className="detail-label">
          {t("CALORÍAS · ÚLTIMOS 14 DÍAS", "CALORIES · LAST 14 DAYS")}
        </p>
        <div style={{ marginTop: 10 }}>
          {hasCalorieData ? (
            <TrendChart
              points={calorieSeries}
              color="#3FB98A"
              formatValue={value => `${Math.round(value)}`}
              emptyLabel=""
            />
          ) : (
            <p style={{ color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center", padding: "10px 8px" }}>
              {t("Registra comidas para ver tu tendencia de calorías.", "Log meals to see your calorie trend.")}
            </p>
          )}
        </div>
      </div>

      {MEALS.map(meal => {
        const entries = todayFood[meal] || [];
        const mealKcal = entries.reduce((sum, item) => sum + (Number(item.kcal) || 0) * (Number(item.qty) || 1), 0);
        return (
          <div key={meal} className="home-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: entries.length ? 10 : 0 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                {mealLabels[meal].toUpperCase()} · {Math.round(mealKcal)}
              </p>
              <button className="edit-btn" onClick={() => { setAddFoodTarget(meal); setFoodSearch(""); }} style={{ color: "#3FB98A" }}>+ {text.addFood}</button>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              {entries.map(item => (
                <div key={item.entryId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: isLightMode ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)", borderRadius: 10, padding: "8px 10px" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}{item.qty > 1 ? ` ×${item.qty}` : ""}</p>
                    <p style={{ fontSize: 11, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif" }}>{Math.round(item.kcal * item.qty)} kcal · P{Math.round(item.protein * item.qty)} C{Math.round(item.carbs * item.qty)} F{Math.round(item.fat * item.qty)}</p>
                  </div>
                  <button className="edit-btn" onClick={() => removeFoodEntry(getDateKey(), meal, item.entryId)} style={{ color: "#E5604D", flexShrink: 0 }}>{text.removeBtn}</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {todayMacros.kcal === 0 && (
        <p style={{ color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>{text.noFoodToday}</p>
      )}

      <div className="home-card">
        <p className="detail-label">{text.macroSplit.toUpperCase()}</p>
        <div className="detail-grid" style={{ marginTop: 10 }}>
          <div className="detail-card"><p className="detail-label">{text.calorieTarget}</p><p className="detail-value">{calorieTarget}</p></div>
          <div className="detail-card"><p className="detail-label">{text.protein}</p><p className="detail-value">{macroTargets.protein} g</p></div>
          <div className="detail-card"><p className="detail-label">{text.carbs}</p><p className="detail-value">{macroTargets.carbs} g</p></div>
          <div className="detail-card"><p className="detail-label">{text.fat}</p><p className="detail-value">{macroTargets.fat} g</p></div>
        </div>
      </div>

      {foodDays.length > 0 && (
        <div>
          <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>{text.nutritionHistory.toUpperCase()}</p>
          <div style={{ display: "grid", gap: 6 }}>
            {foodDays.map(([date, day]) => {
              const totals = sumDayMacros(day);
              const isToday = date === getDateKey();
              return (
                <div key={date} className="detail-row">
                  <p className="detail-row-main" style={{ fontSize: 12, color: isToday ? "#3FB98A" : undefined }}>{isToday ? t("HOY", "TODAY") : date}</p>
                  <span style={{ color: "#3FB98A", fontFamily: "'Orbitron', monospace", fontSize: 12 }}>{totals.kcal} kcal</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
