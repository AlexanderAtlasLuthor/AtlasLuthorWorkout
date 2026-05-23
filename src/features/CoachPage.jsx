const GOAL_COLORS = { lean: "#FF9860", athletic: "#90C8FF", muscular: "#B8A0FF", maintain: "#3FB98A" };

const ES_GOAL_LABELS = {
  lean: "Definir / Cortar",
  athletic: "Recomposición Atlética",
  muscular: "Ganar Músculo",
  maintain: "Mantener & Tonificar",
};

export default function CoachPage({
  text,
  t,
  language,
  isLightMode,
  profile,
  profileSex,
  goals,
  setGoals,
  setEditingProfile,
  bmi,
  bodyFatPct,
  leanMassLb,
  ibwLb,
  fmtW,
  fmtH,
  coachTips,
  bodyTypeGoalOptions,
}) {
  const bmiCategory = bmi <= 0
    ? null
    : bmi < 18.5 ? { label: t("Bajo Peso", "Underweight"), color: "#90C8FF" }
    : bmi < 25 ? { label: t("Normal", "Normal"), color: "#3FB98A" }
    : bmi < 30 ? { label: t("Sobrepeso", "Overweight"), color: "#FFD060" }
    : { label: t("Obeso", "Obese"), color: "#FF9860" };

  const bfCategory = bodyFatPct <= 0
    ? null
    : profileSex === "male"
      ? (bodyFatPct < 14 ? { label: t("En Forma", "Fit"), color: "#3FB98A" }
        : bodyFatPct < 25 ? { label: t("Normal", "Normal"), color: "#FFD060" }
        : { label: t("Alto", "High"), color: "#FF9860" })
      : (bodyFatPct < 21 ? { label: t("En Forma", "Fit"), color: "#3FB98A" }
        : bodyFatPct < 32 ? { label: t("Normal", "Normal"), color: "#FFD060" }
        : { label: t("Alto", "High"), color: "#FF9860" });

  const selectedGoal = goals.bodyTypeGoal || "athletic";
  const goalAccent = GOAL_COLORS[selectedGoal] || "#90C8FF";

  const stats = [
    { label: text.bmiLabel, val: bmi > 0 ? String(bmi) : "—", sub: bmiCategory?.label || "", color: bmiCategory?.color || "#8A8F99" },
    { label: text.bodyFatLabel, val: bmi > 0 ? `${bodyFatPct}%` : "—", sub: bfCategory?.label || "", color: bfCategory?.color || "#8A8F99" },
    { label: text.leanMassLabel, val: bmi > 0 ? fmtW(leanMassLb) : "—", sub: t("MASA ACTIVA", "ACTIVE MASS"), color: "#90C8FF" },
    { label: text.ibwLabel, val: ibwLb > 0 ? fmtW(ibwLb) : "—", sub: t("FÓRMULA DEVINE", "DEVINE FORMULA"), color: "#B8A0FF" },
  ];

  return (
    <div className="detail-list">
      <div className="detail-grid">
        {stats.map(item => (
          <div key={item.label} className="detail-card">
            <p className="detail-label">{item.label}</p>
            <p className="detail-value" style={{ color: item.color }}>{item.val}</p>
            {item.sub && <p style={{ fontSize: 9, letterSpacing: 1, color: item.color, fontFamily: "'Orbitron', monospace", marginTop: 4, opacity: 0.8 }}>{item.sub}</p>}
          </div>
        ))}
      </div>

      <div className="detail-row">
        <div>
          <p className="detail-row-main">{profileSex === "male" ? text.maleLabel : text.femaleLabel} · {profile.age || "--"} {t("años", "yrs")}</p>
          <p className="detail-row-sub">{fmtH(profile.height)} · {fmtW(profile.currentWeight)}</p>
        </div>
        <button className="edit-btn" onClick={() => setEditingProfile({ ...profile })}>{text.edit}</button>
      </div>

      <div>
        <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.bodyTypeLabel.toUpperCase()}
        </p>
        <div style={{ display: "grid", gap: 8 }}>
          {bodyTypeGoalOptions.map(option => {
            const selected = selectedGoal === option.value;
            const acc = GOAL_COLORS[option.value] || "#90C8FF";
            const label = language === "es" ? (ES_GOAL_LABELS[option.value] || option.label) : option.label;
            return (
              <button
                key={option.value}
                className="dark-btn"
                onClick={() => setGoals(prev => ({ ...prev, bodyTypeGoal: option.value }))}
                style={{ textAlign: "left", borderColor: selected ? `${acc}55` : undefined, boxShadow: selected ? `inset 0 0 0 1px ${acc}44` : "none" }}
              >
                <span style={{ display: "block", fontWeight: 900, color: selected ? acc : (isLightMode ? "#101015" : "#FFFFFF"), fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="home-card" style={{ borderColor: `${goalAccent}22` }}>
        <p style={{ fontSize: 10, letterSpacing: 3, color: goalAccent, fontFamily: "'Orbitron', monospace", marginBottom: 14 }}>
          {text.tipsTitle.toUpperCase()}
        </p>
        <div style={{ display: "grid", gap: 18 }}>
          {coachTips.map(section => (
            <div key={section.title}>
              <p style={{ fontSize: 9, letterSpacing: 2, color: section.accent, fontFamily: "'Orbitron', monospace", marginBottom: 9 }}>
                {section.title}
              </p>
              <div style={{ display: "grid", gap: 9 }}>
                {section.tips.map((tip, index) => (
                  <div key={index} style={{ display: "flex", gap: 11, alignItems: "flex-start" }}>
                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: section.accent, marginTop: 6, flexShrink: 0 }} />
                    <p style={{ color: isLightMode ? "#1A1A2E" : "#C8D0DC", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6 }}>{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="dark-btn" onClick={() => setEditingProfile({ ...profile })}>
        {text.editBodyStatus}
      </button>
    </div>
  );
}
