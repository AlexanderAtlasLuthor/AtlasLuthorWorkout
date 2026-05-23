// Achievement definitions and progress evaluation. Each achievement has a
// target value and a getProgress() function that pulls from the supplied
// data slices. computeAchievements returns each definition with its current
// progress and earned flag.

export const ACHIEVEMENT_DEFS = [
  {
    id: "first-workout",
    label: { en: "First Workout", es: "Primer Entreno" },
    description: { en: "Complete your first training day", es: "Completa tu primer día de entrenamiento" },
    target: 1,
    getProgress: stats => stats.completedDays,
  },
  {
    id: "workouts-10",
    label: { en: "10 Workouts", es: "10 Entrenos" },
    description: { en: "Complete 10 training days", es: "Completa 10 días de entrenamiento" },
    target: 10,
    getProgress: stats => stats.completedDays,
  },
  {
    id: "workouts-50",
    label: { en: "50 Workouts", es: "50 Entrenos" },
    description: { en: "Complete 50 training days", es: "Completa 50 días de entrenamiento" },
    target: 50,
    getProgress: stats => stats.completedDays,
  },
  {
    id: "workouts-100",
    label: { en: "Century Club", es: "Club del Centenar" },
    description: { en: "Complete 100 training days", es: "Completa 100 días de entrenamiento" },
    target: 100,
    getProgress: stats => stats.completedDays,
  },
  {
    id: "workouts-365",
    label: { en: "Iron Year", es: "Año de Hierro" },
    description: { en: "Complete 365 training days", es: "Completa 365 días de entrenamiento" },
    target: 365,
    getProgress: stats => stats.completedDays,
  },
  {
    id: "first-pr",
    label: { en: "First PR", es: "Primer Récord" },
    description: { en: "Hit your first personal record", es: "Logra tu primer récord personal" },
    target: 1,
    getProgress: stats => stats.prCount,
  },
  {
    id: "prs-5",
    label: { en: "5 PRs", es: "5 Récords" },
    description: { en: "Hit 5 personal records", es: "Logra 5 récords personales" },
    target: 5,
    getProgress: stats => stats.prCount,
  },
  {
    id: "prs-25",
    label: { en: "PR Hunter", es: "Cazador de Récords" },
    description: { en: "Hit 25 personal records", es: "Logra 25 récords personales" },
    target: 25,
    getProgress: stats => stats.prCount,
  },
  {
    id: "streak-4",
    label: { en: "4-Week Streak", es: "Racha de 4 Semanas" },
    description: { en: "Train consistently for 4 weeks", es: "Entrena 4 semanas seguidas" },
    target: 4,
    getProgress: stats => stats.weeklyStreak,
  },
  {
    id: "streak-12",
    label: { en: "12-Week Streak", es: "Racha de 12 Semanas" },
    description: { en: "Train consistently for 12 weeks", es: "Entrena 12 semanas seguidas" },
    target: 12,
    getProgress: stats => stats.weeklyStreak,
  },
  {
    id: "cardio-10",
    label: { en: "Cardio Starter", es: "Cardio Iniciado" },
    description: { en: "Log 10 cardio sessions", es: "Registra 10 sesiones de cardio" },
    target: 10,
    getProgress: stats => stats.cardioSessions,
  },
  {
    id: "cardio-50",
    label: { en: "Cardio Runner", es: "Corredor Constante" },
    description: { en: "Log 50 cardio sessions", es: "Registra 50 sesiones de cardio" },
    target: 50,
    getProgress: stats => stats.cardioSessions,
  },
  {
    id: "photos-5",
    label: { en: "Progress Tracker", es: "Sigue tu Progreso" },
    description: { en: "Save 5 progress photos", es: "Guarda 5 fotos de progreso" },
    target: 5,
    getProgress: stats => stats.photoCount,
  },
  {
    id: "photos-20",
    label: { en: "Visual Journey", es: "Viaje Visual" },
    description: { en: "Save 20 progress photos", es: "Guarda 20 fotos de progreso" },
    target: 20,
    getProgress: stats => stats.photoCount,
  },
  {
    id: "foods-50",
    label: { en: "Food Logger", es: "Registro de Comidas" },
    description: { en: "Log 50 food entries", es: "Registra 50 comidas" },
    target: 50,
    getProgress: stats => stats.foodEntries,
  },
  {
    id: "goal-weight",
    label: { en: "Goal Reached", es: "Meta Alcanzada" },
    description: { en: "Reach your target weight", es: "Alcanza tu peso meta" },
    target: 1,
    getProgress: stats => (stats.goalWeightReached ? 1 : 0),
  },
];

export function computeAchievementStats({
  calendarLog,
  exerciseNotes,
  cardioLog,
  progressPhotos,
  foodLog,
  weeklyStreak,
  profile,
}) {
  const completedDays = Object.values(calendarLog || {}).filter(
    entry => entry && (entry.status === "completed" || entry.status === "trained")
  ).length;

  const prCount = Object.values(exerciseNotes || {}).filter(note => note && note.pr).length;

  const cardioSessions = Object.values(cardioLog || {}).reduce(
    (sum, list) => sum + (Array.isArray(list) ? list.length : 0),
    0
  );

  const photoCount = Array.isArray(progressPhotos) ? progressPhotos.length : 0;

  const foodEntries = Object.values(foodLog || {}).reduce((total, day) => {
    if (!day || typeof day !== "object") return total;
    return (
      total +
      Object.values(day).reduce(
        (mealSum, list) => mealSum + (Array.isArray(list) ? list.length : 0),
        0
      )
    );
  }, 0);

  // Goal reached when current weight has crossed the target in the direction
  // implied by the start weight (handles both cutting and bulking goals).
  const start = Number(profile?.startWeight) || 0;
  const current = Number(profile?.currentWeight) || 0;
  const target = Number(profile?.targetWeight) || 0;
  let goalWeightReached = false;
  if (target > 0 && current > 0 && start > 0) {
    goalWeightReached = start <= target ? current >= target : current <= target;
  }

  return {
    completedDays,
    prCount,
    cardioSessions,
    photoCount,
    foodEntries,
    weeklyStreak: weeklyStreak || 0,
    goalWeightReached,
  };
}

export function computeAchievements(stats) {
  return ACHIEVEMENT_DEFS.map(def => {
    const progress = Math.max(0, def.getProgress(stats) || 0);
    return {
      id: def.id,
      label: def.label,
      description: def.description,
      target: def.target,
      progress,
      earned: progress >= def.target,
    };
  });
}
