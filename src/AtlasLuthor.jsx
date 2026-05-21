import React, { useEffect, useMemo, useState } from "react";

const pushSessions = [
  {
    time: "AM",
    name: "Pecho",
    warmup: { name: "Run 1 mile", duration: "15 min" },
    exercises: [
      { name: "Chest DB Press", sets: 4, reps: 10, weight: "25 lb" },
      { name: "Chest DB Incline Press", sets: 4, reps: 6, weight: "25 lb" },
      { name: "Incline Press", sets: 4, reps: 6, weight: "50 lb" },
      { name: "Supine Press", sets: 4, reps: 8, weight: "50 lb" },
      { name: "Chest DB Fly (Open)", sets: 4, reps: 8, weight: "25 lb" },
      { name: "Chest Machine Open", sets: 4, reps: 8, weight: "60 lb" },
    ],
  },
  {
    time: "PM",
    name: "Hombros + Tríceps",
    warmup: { name: "Stairs Level 5", duration: "15 min" },
    exercises: [
      { name: "Lateral Raise", sets: 4, reps: 8, weight: "15 lb" },
      { name: "Upright Row", sets: 4, reps: 6, weight: "50 lb" },
      { name: "Front Raise", sets: 4, reps: 8, weight: "15 lb" },
      { name: "Shoulder Press", sets: 4, reps: 8, weight: "30 lb" },
      { name: "Cable Rope Triceps Pushdown", sets: 4, reps: 8, weight: "50 lb" },
      { name: "Overhead DB Extension", sets: 4, reps: 8, weight: "40 lb" },
      { name: "Triceps Press", sets: 4, reps: 10, weight: "80 lb" },
      { name: "Barbell Overhead Triceps", sets: 4, reps: 6, weight: "30 lb" },
      { name: "Tricep Cable Over Head", sets: 4, reps: 8, weight: "30 lb" },
    ],
  },
];

const pullSessions = [
  {
    time: "AM",
    name: "Espalda",
    warmup: { name: "Row Machine", duration: "15 min" },
    exercises: [
      { name: "Lat Pull Down", sets: 4, reps: 8, weight: "75 lb" },
      { name: "Row Barbell", sets: 4, reps: 6, weight: "50 lb" },
      { name: "Row Dumbbell", sets: 4, reps: 6, weight: "30 lb" },
      { name: "Lower Back Extension", sets: 4, reps: 6, weight: "20 lb" },
      { name: "Olympic Lift", sets: 4, reps: 4, weight: "20 lb" },
      { name: "Squats", sets: 4, reps: 6, weight: "20 lb" },
    ],
  },
  {
    time: "PM",
    name: "Bíceps + Trapecio",
    warmup: { name: "Run 1 mile", duration: "15 min" },
    exercises: [
      { name: "Dumbbell Curls", sets: 4, reps: 8, weight: "20 lb" },
      { name: "Barbell Curls 21s", sets: 7, reps: "3x3", weight: "30 lb" },
      { name: "One Arm Curl", sets: 3, reps: 6, weight: "20 lb" },
      { name: "Pull Up Biceps", sets: 3, reps: 6, weight: "20 lb" },
      { name: "Cable Pull Up Pirámide", sets: 3, reps: 6, weight: "30-50 lb" },
      { name: "Upright Row Front", sets: 3, reps: 8, weight: "35 lb" },
      { name: "Upright Row Back", sets: 3, reps: 8, weight: "35 lb" },
      { name: "Shrugs", sets: 3, reps: 10, weight: "35 lb" },
    ],
  },
];

const legSessions = [
  {
    time: "AM",
    name: "Piernas",
    warmup: { name: "Stairs Level 5", duration: "15 min" },
    exercises: [
      { name: "Hack Squat", sets: 4, reps: 6, weight: "90 lb" },
      { name: "Barbell Squat", sets: 4, reps: 8, weight: "50 lb" },
      { name: "Leg Press", sets: 4, reps: 8, weight: "90 lb" },
      { name: "Walking Lunge", sets: 4, reps: 6, weight: "15 lb each" },
    ],
  },
  { time: "PM", name: "Descanso", warmup: null, exercises: [], rest: true },
];

const baseWorkoutData = {
  Lunes: { label: "MON", type: "PUSH", sessions: pushSessions },
  Martes: { label: "TUE", type: "PULL", sessions: pullSessions },
  Miércoles: { label: "WED", type: "LEGS", sessions: legSessions },
  Jueves: { label: "THU", type: "PUSH", sessions: pushSessions },
  Viernes: { label: "FRI", type: "PULL", sessions: pullSessions },
  Sábado: { label: "SAT", type: "LEGS", sessions: legSessions },
  Domingo: {
    label: "SUN",
    type: "OMNIMAN",
    sessions: [
      {
        time: "FULL",
        name: "Omniman Protocol",
        warmup: { name: "Run 1 mile", duration: "" },
        exercises: [
          { name: "Olympic Lift", sets: 3, reps: 4, weight: "20 lb" },
          { name: "Squats Barbell", sets: 3, reps: 6, weight: "20 lb" },
          { name: "Lateral Raise", sets: 3, reps: 8, weight: "15 lb" },
          { name: "Upright Row", sets: 3, reps: 8, weight: "15 lb" },
          { name: "Cable Rope Triceps Pushdown", sets: 3, reps: 8, weight: "30 lb" },
          { name: "Overhead DB Extension", sets: 3, reps: 10, weight: "25 lb" },
        ],
      },
    ],
  },
};

const TYPE_THEME = {
  PUSH: { accent: "#E8E8E8", sub: "#A0A0A0", badge: "#2a2a2a" },
  PULL: { accent: "#90C8FF", sub: "#5899CC", badge: "#0d1f33" },
  LEGS: { accent: "#B8A0FF", sub: "#8060CC", badge: "#180d33" },
  OMNIMAN: { accent: "#FFD060", sub: "#CC9900", badge: "#2a1e00" },
};

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const STORAGE_KEYS = {
  workout: "atlas-luthor-workout-data",
  checked: "atlas-luthor-checked",
  lastProgression: "atlas-luthor-last-progression-review",
};

function cloneData(value) {
  return JSON.parse(JSON.stringify(value));
}

function safeLoad(key, fallback) {
  if (typeof window === "undefined") return cloneData(fallback);

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : cloneData(fallback);
  } catch {
    return cloneData(fallback);
  }
}

function addFiveToWeight(weight) {
  if (!weight || typeof weight !== "string") return weight;
  return weight.replace(/\d+/g, number => String(Number(number) + 5));
}

function getTodayDayName() {
  const index = new Date().getDay();
  const map = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return map[index];
}

function isProgressionDue(lastDate) {
  if (!lastDate) return true;

  const last = new Date(lastDate);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  return diffDays >= 14;
}

export default function AtlasLuthor() {
  const [screen, setScreen] = useState("home");
  const [activeDay, setActiveDay] = useState(getTodayDayName());
  const [activeSession, setActiveSession] = useState(0);
  const [checked, setChecked] = useState(() => safeLoad(STORAGE_KEYS.checked, {}));
  const [workoutData, setWorkoutData] = useState(() => safeLoad(STORAGE_KEYS.workout, baseWorkoutData));
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingCardio, setEditingCardio] = useState(null);
  const [showProgression, setShowProgression] = useState(false);
  const [lastProgressionReview, setLastProgressionReview] = useState(() =>
    safeLoad(STORAGE_KEYS.lastProgression, null)
  );

  const day = workoutData[activeDay];
  const session = day.sessions[Math.min(activeSession, day.sessions.length - 1)];
  const theme = TYPE_THEME[day.type];

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.workout, JSON.stringify(workoutData));
  }, [workoutData]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.checked, JSON.stringify(checked));
  }, [checked]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.lastProgression, JSON.stringify(lastProgressionReview));
  }, [lastProgressionReview]);

  useEffect(() => {
    if (isProgressionDue(lastProgressionReview)) {
      setShowProgression(true);
    }
  }, [lastProgressionReview]);

  const toggleCheck = key => {
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const total = session.exercises.length;
  const done = session.exercises.filter((_, i) => checked[`${activeDay}-${activeSession}-${i}`]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const weeklyMetrics = useMemo(() => {
    let totalExercises = 0;
    let totalSets = 0;
    let completedExercises = 0;
    let cardioSessions = 0;
    let workoutSessions = 0;
    let completedSessions = 0;

    days.forEach(dayName => {
      workoutData[dayName].sessions.forEach((currentSession, sessionIndex) => {
        if (!currentSession.rest) workoutSessions += 1;
        if (currentSession.warmup) cardioSessions += 1;

        totalExercises += currentSession.exercises.length;
        totalSets += currentSession.exercises.reduce((sum, ex) => sum + Number(ex.sets || 0), 0);

        const sessionDone = currentSession.exercises.filter(
          (_, exerciseIndex) => checked[`${dayName}-${sessionIndex}-${exerciseIndex}`]
        ).length;

        completedExercises += sessionDone;

        if (currentSession.exercises.length > 0 && sessionDone === currentSession.exercises.length) {
          completedSessions += 1;
        }
      });
    });

    const weeklyProgress = totalExercises > 0 ? Math.round((completedExercises / totalExercises) * 100) : 0;
    const today = getTodayDayName();
    const todayWorkout = workoutData[today];

    return {
      totalExercises,
      totalSets,
      completedExercises,
      weeklyProgress,
      cardioSessions,
      workoutSessions,
      completedSessions,
      today,
      todayType: todayWorkout.type,
      todayLabel: todayWorkout.label,
    };
  }, [checked, workoutData]);

  const progressionItems = useMemo(() => {
    const items = [];

    days.forEach(dayName => {
      workoutData[dayName].sessions.forEach((currentSession, sessionIndex) => {
        currentSession.exercises.forEach((exercise, exerciseIndex) => {
          items.push({
            dayName,
            sessionIndex,
            exerciseIndex,
            sessionName: currentSession.name,
            name: exercise.name,
            oldWeight: exercise.weight,
            newWeight: addFiveToWeight(exercise.weight),
          });
        });
      });
    });

    return items;
  }, [workoutData]);

  const updateExerciseWeight = ({ dayName, sessionIndex, exerciseIndex, weight }) => {
    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.map((s, sIndex) =>
          sIndex === sessionIndex
            ? {
                ...s,
                exercises: s.exercises.map((ex, eIndex) =>
                  eIndex === exerciseIndex ? { ...ex, weight } : ex
                ),
              }
            : s
        ),
      },
    }));
  };

  const updateCardio = ({ dayName, sessionIndex, warmup }) => {
    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.map((s, sIndex) =>
          sIndex === sessionIndex ? { ...s, warmup } : s
        ),
      },
    }));
  };

  const acceptProgression = () => {
    setWorkoutData(prev => {
      const next = cloneData(prev);

      days.forEach(dayName => {
        next[dayName].sessions.forEach(currentSession => {
          currentSession.exercises = currentSession.exercises.map(exercise => ({
            ...exercise,
            weight: addFiveToWeight(exercise.weight),
          }));
        });
      });

      return next;
    });

    setLastProgressionReview(new Date().toISOString());
    setShowProgression(false);
  };

  const rejectProgression = () => {
    setLastProgressionReview(new Date().toISOString());
    setShowProgression(false);
  };

  const openWorkout = dayName => {
    setActiveDay(dayName);
    setActiveSession(0);
    setScreen("workout");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0C0C10", color: "#FFFFFF", fontFamily: "'Orbitron', monospace", paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

        .page-shell { width: 100%; }
        .day-pill { cursor: pointer; flex: 1; padding: 10px 4px; border-radius: 10px; text-align: center; border: 1px solid transparent; transition: all 0.2s; }
        .session-tab { cursor: pointer; flex: 1; padding: 12px 10px; border-radius: 10px; border: 1.5px solid #222; background: #141418; transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #888; text-align: center; }
        .ex-card { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 14px; border: 1.5px solid #1E1E26; background: #131318; cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .ex-card:hover { border-color: #2E2E3E; background: #181820; }
        .ex-card.done { opacity: 0.35; }
        .check { width: 26px; height: 26px; border-radius: 8px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; transition: all 0.2s; color: #000; font-weight: 700; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .stat-box { flex: 1; background: #141418; border: 1.5px solid #1E1E26; border-radius: 12px; padding: 14px 8px; text-align: center; }
        .home-card { background: #131318; border: 1.5px solid #1E1E26; border-radius: 16px; padding: 16px; }
        .metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }

        .primary-btn { width: 100%; border: 0; border-radius: 14px; padding: 15px 16px; background: #FFFFFF; color: #050507; font-family: 'Orbitron', monospace; font-weight: 900; letter-spacing: 2px; cursor: pointer; }
        .dark-btn { border: 1.5px solid #262633; border-radius: 12px; padding: 12px 14px; background: #141418; color: #FFFFFF; font-family: 'DM Sans', sans-serif; font-weight: 700; cursor: pointer; }
        .edit-btn { border: 1px solid #2B2B36; background: #0F0F14; color: #777; border-radius: 8px; padding: 6px 8px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; }
        .input { width: 100%; border: 1.5px solid #282834; background: #0F0F14; color: #FFFFFF; border-radius: 12px; padding: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; outline: none; }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.78); z-index: 20; display: flex; align-items: flex-end; justify-content: center; padding: 16px; }
        .modal { width: 100%; max-width: 520px; max-height: 82vh; overflow: auto; background: #101015; border: 1.5px solid #2A2A34; border-radius: 22px; padding: 18px; box-shadow: 0 20px 80px rgba(0,0,0,0.4); }

        @media (min-width: 760px) {
          .page-shell { max-width: 720px; margin: 0 auto; }
          .metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .modal-backdrop { align-items: center; }
        }
      `}</style>

      <div className="page-shell">
        <div style={{ padding: "36px 20px 20px", textAlign: "center", borderBottom: "1px solid #1A1A22" }}>
          <p style={{ fontSize: 9, letterSpacing: 5, color: "#444", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
            PROTOCOL ACTIVE
          </p>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: 5, color: "#FFFFFF", lineHeight: 1, fontFamily: "'Orbitron', monospace" }}>
            ATLAS
          </h1>
          <h1 style={{ fontSize: 38, fontWeight: 900, letterSpacing: 6, color: "#888", lineHeight: 1.1, fontFamily: "'Orbitron', monospace" }}>
            LUTHOR
          </h1>
          <p style={{ fontSize: 11, color: "#444", marginTop: 8, fontFamily: "'DM Sans', sans-serif", letterSpacing: 1 }}>
            03.23 - 04.09.2026 · 197 LB · 5&apos;9&quot;
          </p>
        </div>

        {screen === "home" && (
          <div className="fade-up" style={{ padding: "20px" }}>
            <div className="home-card" style={{ marginBottom: 14, borderColor: "#2A2A34" }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: TYPE_THEME[weeklyMetrics.todayType].accent, fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                TODAY - {weeklyMetrics.todayLabel} / {weeklyMetrics.todayType}
              </p>

              <h2 style={{ fontSize: 25, fontFamily: "'Orbitron', monospace", letterSpacing: 2, marginBottom: 8 }}>
                {weeklyMetrics.today}
              </h2>

              <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                Weekly progress is at <span style={{ color: "#FFFFFF", fontWeight: 800 }}>{weeklyMetrics.weeklyProgress}%</span>. Keep the protocol moving.
              </p>

              <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
                START TODAY
              </button>
            </div>

            {isProgressionDue(lastProgressionReview) && (
              <div className="home-card" style={{ marginBottom: 14, borderColor: "#FFD06055", background: "#151207" }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFD060", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                  2-WEEK UPGRADE READY
                </p>

                <p style={{ color: "#BFA45E", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
                  The app can suggest +5 lb for every exercise, but it will ask before changing anything.
                </p>

                <button className="dark-btn" style={{ width: "100%", color: "#FFD060" }} onClick={() => setShowProgression(true)}>
                  Review +5 lb Proposal
                </button>
              </div>
            )}

            <div className="metric-grid" style={{ marginBottom: 14 }}>
              {[
                { label: "WEEKLY", val: `${weeklyMetrics.weeklyProgress}%` },
                { label: "DONE", val: weeklyMetrics.completedExercises },
                { label: "EXERCISES", val: weeklyMetrics.totalExercises },
                { label: "SETS", val: weeklyMetrics.totalSets },
                { label: "SESSIONS", val: weeklyMetrics.workoutSessions },
                { label: "COMPLETED", val: weeklyMetrics.completedSessions },
                { label: "CARDIO", val: weeklyMetrics.cardioSessions },
                { label: "DAYS", val: "7" },
              ].map(metric => (
                <div key={metric.label} className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {metric.val}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="home-card">
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#555", fontFamily: "'Orbitron', monospace", marginBottom: 12 }}>
                WEEK PLAN
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                {days.map(dayName => {
                  const currentDay = workoutData[dayName];
                  const currentTheme = TYPE_THEME[currentDay.type];

                  return (
                    <button
                      key={dayName}
                      className="dark-btn"
                      onClick={() => openWorkout(dayName)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
                    >
                      <span>
                        <span style={{ display: "block", fontFamily: "'Orbitron', monospace", letterSpacing: 1 }}>
                          {currentDay.label} - {dayName}
                        </span>
                        <span style={{ display: "block", color: "#666", fontSize: 12, marginTop: 3 }}>
                          {currentDay.sessions.map(s => s.name).join(" / ")}
                        </span>
                      </span>

                      <span style={{ color: currentTheme.accent, background: currentTheme.badge, border: `1px solid ${currentTheme.accent}40`, padding: "6px 9px", borderRadius: 8, fontFamily: "'Orbitron', monospace", fontSize: 10 }}>
                        {currentDay.type}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {screen === "workout" && (
          <>
            <div style={{ padding: "14px 20px 0" }}>
              <button className="dark-btn" onClick={() => setScreen("home")}>
                Back Home
              </button>
            </div>

            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ display: "flex", gap: 6, background: "#111115", borderRadius: 14, padding: "8px 8px" }}>
                {days.map(d => {
                  const isActive = d === activeDay;
                  const t = TYPE_THEME[workoutData[d].type];

                  return (
                    <div
                      key={d}
                      className="day-pill"
                      style={isActive ? { background: t.badge, border: `1.5px solid ${t.accent}50` } : {}}
                      onClick={() => {
                        setActiveDay(d);
                        setActiveSession(0);
                      }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: isActive ? t.accent : "#555", fontFamily: "'Orbitron', monospace" }}>
                        {workoutData[d].label}
                      </div>
                      <div style={{ fontSize: 8, color: isActive ? t.sub : "#333", marginTop: 3, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {workoutData[d].type.slice(0, 3)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                  {activeDay.toUpperCase()}
                </span>
                <span style={{ fontSize: 11, letterSpacing: 2, color: "#444", fontFamily: "'Orbitron', monospace" }}>
                  {" "}- {day.type}
                </span>
              </div>

              {total > 0 && (
                <div style={{ fontSize: 13, color: "#666", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                  <span style={{ color: theme.accent, fontWeight: 700 }}>{done}</span> / {total} done
                </div>
              )}
            </div>

            {total > 0 && (
              <div style={{ padding: "10px 20px 0" }}>
                <div style={{ height: 4, background: "#1E1E26", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: theme.accent, borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </div>
            )}

            {day.sessions.length > 1 && (
              <div style={{ padding: "16px 20px 0", display: "flex", gap: 10 }}>
                {day.sessions.map((s, i) => (
                  <button
                    key={i}
                    className="session-tab"
                    onClick={() => setActiveSession(i)}
                    style={activeSession === i ? { background: theme.badge, borderColor: theme.accent + "60", color: theme.accent } : {}}
                  >
                    <span style={{ fontSize: 11, letterSpacing: 2, fontFamily: "'Orbitron', monospace" }}>{s.time}</span>
                    <div style={{ marginTop: 3, fontSize: 13 }}>{s.name}</div>
                  </button>
                ))}
              </div>
            )}

            <div key={`${activeDay}-${activeSession}`} className="fade-up" style={{ padding: "20px 20px 0" }}>
              {session.warmup && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: "1.5px solid #1E1E26", background: "#0F0F14", marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#1A1A22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    ⚡
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 9, letterSpacing: 3, color: "#555", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
                      CARDIO / WARM-UP
                    </p>
                    <p style={{ fontSize: 15, color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      {session.warmup.name}
                    </p>
                  </div>

                  {session.warmup.duration && (
                    <div style={{ fontSize: 15, fontWeight: 700, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                      {session.warmup.duration}
                    </div>
                  )}

                  <button
                    className="edit-btn"
                    onClick={() =>
                      setEditingCardio({
                        dayName: activeDay,
                        sessionIndex: activeSession,
                        name: session.warmup.name,
                        duration: session.warmup.duration || "",
                      })
                    }
                  >
                    Edit
                  </button>
                </div>
              )}

              {session.rest && (
                <div style={{ textAlign: "center", padding: "50px 20px", border: "1.5px solid #1A1A22", borderRadius: 16, background: "#0F0F14" }}>
                  <div style={{ fontSize: 42, marginBottom: 14 }}>🌙</div>
                  <p style={{ fontSize: 14, letterSpacing: 4, color: "#555", fontFamily: "'Orbitron', monospace" }}>
                    RECOVERY MODE
                  </p>
                  <p style={{ fontSize: 15, color: "#444", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
                    Rest. Eat. Rebuild.
                  </p>
                </div>
              )}

              {session.exercises.map((ex, i) => {
                const key = `${activeDay}-${activeSession}-${i}`;
                const isDone = !!checked[key];

                return (
                  <div key={i} className={`ex-card${isDone ? " done" : ""}`} onClick={() => toggleCheck(key)}>
                    <div className="check" style={isDone ? { background: theme.accent, borderColor: theme.accent } : {}}>
                      {isDone ? "✓" : ""}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: isDone ? "#555" : "#FFFFFF", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ex.name}
                      </p>
                      <p style={{ fontSize: 12, color: isDone ? "#383838" : "#666", marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
                        {ex.sets} sets x {ex.reps} reps
                      </p>
                    </div>

                    <button
                      onClick={event => {
                        event.stopPropagation();
                        setEditingExercise({
                          dayName: activeDay,
                          sessionIndex: activeSession,
                          exerciseIndex: i,
                          name: ex.name,
                          weight: ex.weight,
                        });
                      }}
                      style={{ padding: "6px 12px", borderRadius: 8, background: isDone ? "#111" : theme.badge, border: `1px solid ${isDone ? "#222" : theme.accent + "40"}`, cursor: "pointer" }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700, color: isDone ? "#444" : theme.accent, fontFamily: "'DM Sans', sans-serif" }}>
                        {ex.weight}
                      </span>
                    </button>
                  </div>
                );
              })}

              {total > 0 && (
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  {[
                    { label: "EXERCISES", val: total },
                    { label: "TOTAL SETS", val: session.exercises.reduce((a, e) => a + e.sets, 0) },
                    { label: "PROGRESS", val: `${pct}%` },
                  ].map(s => (
                    <div key={s.label} className="stat-box">
                      <p style={{ fontSize: 22, fontWeight: 700, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                        {s.val}
                      </p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {editingExercise && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              EDIT WEIGHT
            </p>

            <h3 style={{ fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
              {editingExercise.name}
            </h3>

            <input
              className="input"
              value={editingExercise.weight}
              onChange={event => setEditingExercise(prev => ({ ...prev, weight: event.target.value }))}
              placeholder="Example: 30 lb"
            />

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingExercise(null)}>
                Cancel
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  updateExerciseWeight(editingExercise);
                  setEditingExercise(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {editingCardio && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              EDIT CARDIO
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <input
                className="input"
                value={editingCardio.name}
                onChange={event => setEditingCardio(prev => ({ ...prev, name: event.target.value }))}
                placeholder="Cardio name"
              />

              <input
                className="input"
                value={editingCardio.duration}
                onChange={event => setEditingCardio(prev => ({ ...prev, duration: event.target.value }))}
                placeholder="Duration / distance / level"
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingCardio(null)}>
                Cancel
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
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showProgression && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFD060", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              2-WEEK PROGRESSION CHECK
            </p>

            <h3 style={{ fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>
              Add +5 lb?
            </h3>

            <p style={{ color: "#777", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
              Nothing changes unless you accept. Review the proposal below.
            </p>

            <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
              {progressionItems.slice(0, 18).map(item => (
                <div
                  key={`${item.dayName}-${item.sessionIndex}-${item.exerciseIndex}`}
                  style={{ background: "#15151B", border: "1px solid #24242E", borderRadius: 12, padding: 12, fontFamily: "'DM Sans', sans-serif" }}
                >
                  <p style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 13 }}>{item.name}</p>
                  <p style={{ color: "#666", fontSize: 12, marginTop: 3 }}>
                    {item.dayName} / {item.sessionName}
                  </p>
                  <p style={{ color: "#FFD060", fontWeight: 800, marginTop: 4 }}>
                    {item.oldWeight} -&gt; {item.newWeight}
                  </p>
                </div>
              ))}

              {progressionItems.length > 18 && (
                <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 13 }}>
                  + {progressionItems.length - 18} more exercises included.
                </p>
              )}
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <button className="primary-btn" onClick={acceptProgression}>
                ACCEPT +5 LB
              </button>

              <button className="dark-btn" onClick={rejectProgression}>
                Not now / Keep current weights
              </button>

              <button className="dark-btn" onClick={() => setShowProgression(false)}>
                Remind me later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
