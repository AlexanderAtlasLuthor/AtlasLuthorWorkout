import React, { useEffect, useMemo, useRef, useState } from "react";

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
  PUSH: { accent: "#E8E8E8", sub: "#A0A0A0", badge: "#2a2a2a", lightAccent: "#3C4250", lightSub: "#6B7280", lightBadge: "#E4E6EB" },
  PULL: { accent: "#90C8FF", sub: "#5899CC", badge: "#0d1f33", lightAccent: "#1F6FB8", lightSub: "#3F7FB0", lightBadge: "#DBEAFA" },
  LEGS: { accent: "#B8A0FF", sub: "#8060CC", badge: "#180d33", lightAccent: "#6A4ACC", lightSub: "#7E68C0", lightBadge: "#E7E1FB" },
  OMNIMAN: { accent: "#FFD060", sub: "#CC9900", badge: "#2a1e00", lightAccent: "#9A7400", lightSub: "#B08A1F", lightBadge: "#F6E9C2" },
  CUSTOM: { accent: "#9AA0AA", sub: "#6E7480", badge: "#202025", lightAccent: "#4A4F58", lightSub: "#6E7480", lightBadge: "#E5E6E9" },
};

const CALENDAR_STATUS = {
  completed: { label: "Completed", dark: { bg: "#3FB98A", fg: "#04130C" }, light: { bg: "#2E9E73", fg: "#FFFFFF" } },
  trained: { label: "Trained", dark: { bg: "#90C8FF", fg: "#06182B" }, light: { bg: "#3F8FD6", fg: "#FFFFFF" } },
  missed: { label: "Missed", dark: { bg: "#E5604D", fg: "#2A0A06" }, light: { bg: "#D6493A", fg: "#FFFFFF" } },
  rest: { label: "Rest", dark: { bg: "#3A3A44", fg: "#AEB2BC" }, light: { bg: "#D7D9DF", fg: "#3A3F49" } },
  planned: { label: "Planned", dark: { bg: "#16161C", fg: "#5A5A66" }, light: { bg: "#ECEDF1", fg: "#9AA0AC" } },
};

function getCalendarVisual(status, isLight) {
  const entry = CALENDAR_STATUS[status] || CALENDAR_STATUS.planned;
  return isLight ? entry.light : entry.dark;
}

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const STORAGE_KEYS = {
  users: "atlas-luthor-users",
  activeUser: "atlas-luthor-active-user",
  dataPrefix: "atlas-luthor-data:",
};

// Legacy global keys from the pre-multi-user layout. They are not per-account,
// so they are migrated away from and removed to prevent cross-account bleed.
const LEGACY_STORAGE_KEYS = [
  "atlas-luthor-workout-data",
  "atlas-luthor-checked",
  "atlas-luthor-last-progression-review",
  "atlas-luthor-profile",
  "atlas-luthor-goals",
  "atlas-luthor-progress-log",
  "atlas-luthor-exercise-notes",
  "atlas-luthor-calendar-log",
  "atlas-luthor-progress-photos",
  "atlas-luthor-photo-albums",
  "atlas-luthor-cloud-settings",
  "atlas-luthor-notification-settings",
  "atlas-luthor-set-progress",
  "atlas-luthor-app-settings",
];

const DEFAULT_PROFILE = {
  currentWeight: "197",
  startWeight: "197",
  targetWeight: "185",
  height: "5'9\"",
  startDate: "2026-03-23",
  sex: "male",
  age: "30",
};

const DEFAULT_GOALS = {
  weeklyProgressGoal: "90",
  weeklySessionsGoal: "10",
  targetDate: "2026-04-09",
  focusGoal: "Build strength and finish the protocol",
  bodyTypeGoal: "athletic",
};

const DEFAULT_CLOUD_SETTINGS = {
  endpoint: "",
  status: "Not connected",
};

const DEFAULT_NOTIFICATION_SETTINGS = {
  enabled: false,
  workoutTime: "07:00",
  restTime: "21:30",
  workoutMessage: "Protocol ready.",
  restMessage: "Log progress, eat, hydrate, and recover.",
  sound: "chime",
  customReminders: [],
  lastWorkoutNotice: "",
  lastRestNotice: "",
};

function getDefaultLanguage() {
  if (typeof navigator === "undefined") return "en";
  return String(navigator.language || "en").toLowerCase().startsWith("es") ? "es" : "en";
}

const DEFAULT_APP_SETTINGS = {
  firstName: "",
  lastName: "",
  name: "Atlas",
  avatar: "",
  language: getDefaultLanguage(),
  themeMode: "auto",
  tapFeedback: true,
};

function withNameParts(settings) {
  const next = { ...DEFAULT_APP_SETTINGS, ...(settings || {}) };

  if (!next.firstName && !next.lastName && next.name) {
    const parts = next.name.trim().split(/\s+/);
    next.firstName = parts[0] || "";
    next.lastName = parts.slice(1).join(" ");
  }

  return next;
}

// Reduces an account record to auth/metadata only. Drops legacy plaintext
// passwords and the duplicated data blob older versions stored here.
function cleanRegistryEntry(entry) {
  return {
    id: entry.id || entry.userId,
    userId: entry.userId || entry.id,
    name: entry.name || "",
    createdAt: entry.createdAt || new Date().toISOString(),
    passwordSalt: entry.passwordSalt || "",
    passwordHash: entry.passwordHash || "",
  };
}

// A complete, account-scoped data bundle. Used for new accounts and to wipe
// the in-memory state on logout so one account never shows another's data.
function defaultUserData() {
  return {
    workoutData: cloneData(baseWorkoutData),
    checked: {},
    lastProgressionReview: null,
    profile: cloneData(DEFAULT_PROFILE),
    goals: cloneData(DEFAULT_GOALS),
    progressLog: [],
    exerciseNotes: {},
    calendarLog: {},
    progressPhotos: [],
    photoAlbums: [],
    cloudSettings: cloneData(DEFAULT_CLOUD_SETTINGS),
    notificationSettings: cloneData(DEFAULT_NOTIFICATION_SETTINGS),
    setProgress: {},
    appSettings: withNameParts(DEFAULT_APP_SETTINGS),
    waterLog: {},
  };
}

const DEFAULT_SIGNUP = {
  userId: "",
  password: "",
  firstName: "",
  lastName: "",
  currentWeight: "197",
  targetWeight: "185",
  height: "5'9\"",
  startDate: getDateKey(),
  targetDate: "2026-04-09",
  focusGoal: "Build strength and finish the protocol",
  language: getDefaultLanguage(),
  trainingPlan: "blank",
  sex: "male",
  age: "30",
};

const WEIGHT_OPTIONS = Array.from({ length: 61 }, (_, index) => `${index * 5} lb`);
const BODY_WEIGHT_OPTIONS = Array.from({ length: 271 }, (_, index) => String(80 + index));
const HEIGHT_OPTIONS = ["4'10\"","4'11\"","5'0\"","5'1\"","5'2\"","5'3\"","5'4\"","5'5\"","5'6\"","5'7\"","5'8\"","5'9\"","5'10\"","5'11\"","6'0\"","6'1\"","6'2\"","6'3\"","6'4\"","6'5\"","6'6\"","6'7\""];
const GENDER_OPTIONS = [{ value: "male", label: "Male" }, { value: "female", label: "Female" }];
const AGE_OPTIONS = Array.from({ length: 63 }, (_, i) => String(18 + i));
const BODY_TYPE_GOAL_OPTIONS = [
  { value: "lean", label: "Get Lean / Cut" },
  { value: "athletic", label: "Athletic Recomp" },
  { value: "muscular", label: "Build Muscle / Bulk" },
  { value: "maintain", label: "Maintain & Tone" },
];
const WATER_GOAL_OPTIONS = ["4", "6", "8", "10", "12", "14", "16"];
const COMMON_EXERCISES = {
  "Chest": ["Bench Press","DB Bench Press","Incline Bench Press","Incline DB Press","Decline Bench Press","Push Up","Cable Chest Fly","DB Chest Fly","Chest Machine Press","Pec Deck Fly","Cable Crossover","Weighted Dip","Supine Press"],
  "Back": ["Deadlift","Pull Up","Chin Up","Lat Pull Down","Seated Cable Row","Row Barbell","Row Dumbbell","T-Bar Row","Rack Pull","Lower Back Extension","Face Pull","Shrugs","Upright Row Front","Upright Row Back"],
  "Shoulders": ["Shoulder Press","DB Shoulder Press","Arnold Press","Lateral Raise","Front Raise","Rear Delt Fly","Upright Row","Cable Lateral Raise","Machine Shoulder Press"],
  "Biceps": ["Dumbbell Curls","Barbell Curls 21s","One Arm Curl","Pull Up Biceps","Cable Pull Up Pirámide","Hammer Curl","Preacher Curl","Cable Curl","Concentration Curl","EZ Bar Curl","Incline DB Curl"],
  "Triceps": ["Cable Rope Triceps Pushdown","Overhead DB Extension","Skull Crusher","Close Grip Bench Press","Tricep Press","Barbell Overhead Triceps","Tricep Cable Over Head","DB Kickback"],
  "Legs": ["Hack Squat","Barbell Squat","Squats","Leg Press","Walking Lunge","Reverse Lunge","Bulgarian Split Squat","Leg Extension","Leg Curl","Calf Raise","Hip Thrust","Glute Bridge","Romanian Deadlift","Squats Barbell"],
  "Core": ["Plank","Side Plank","Ab Wheel","Cable Crunch","Hanging Leg Raise","Decline Crunch","Russian Twist","Dead Bug","Bicycle Crunch","V-Up","Flutter Kick"],
  "Cardio": ["Run 1 Mile","Row Machine","Stairs Level 5","Treadmill","Cycling","Elliptical","Jump Rope","Box Jump","Burpee"],
  "Full Body": ["Olympic Lift","Power Clean","Hang Clean","Clean and Jerk","Snatch","Push Press","Kettlebell Swing","Squats Barbell"],
};
const EXERCISE_MUSCLE_GROUPS = ["All", ...Object.keys(COMMON_EXERCISES)];
const SET_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map(String);
const REP_OPTIONS = [4, 5, 6, 8, 10, 12, 15, 20, "3x3", "AMRAP"].map(String);
const RPE_OPTIONS = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const PAIN_OPTIONS = ["", "None", "Tight", "Mild", "Moderate", "Sharp", "Stop"];
const PROGRESS_GOAL_OPTIONS = ["70", "75", "80", "85", "90", "95", "100"];
const SESSION_GOAL_OPTIONS = ["3", "4", "5", "6", "7", "8", "9", "10", "11"];
const CARDIO_OPTIONS = ["", "10 min", "15 min", "20 min", "Run 1 mile", "Stairs Level 5", "Row Machine 15 min"];
const SOUND_OPTIONS = ["silent", "chime", "pulse", "bell"];
const LANGUAGE_OPTIONS = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
];
const THEME_MODE_OPTIONS = [
  { value: "auto", label: "Auto" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];
const TRAINING_PLAN_OPTIONS = [
  { value: "blank", label: "Start blank routine" },
  { value: "atlas", label: "Use Atlas protocol" },
];
const UI_TEXT = {
  en: {
    goodMorning: "Good morning",
    goodEvening: "Good evening",
    goodNight: "Good night",
    todayCommand: "Today Command",
    bodyStatus: "Body Status",
    atlasScore: "Atlas Score",
    monthCalendar: "Month Calendar",
    prTracker: "PR Tracker",
    fatigueDeload: "Fatigue / Deload",
    myGoals: "My Goals",
    progressMemory: "Progress Memory",
    streakBadges: "Streak / Badges",
    progressPhotos: "Progress Photos",
    weeklyMetrics: "Weekly Metrics",
    weekPlan: "Week Plan",
    settings: "Settings",
    reminders: "Reminders",
    pages: "Pages",
    profileName: "Profile name",
    language: "Language",
    theme: "Theme",
    lightStarts: "Auto: light mode until 1:00 PM, dark mode from 1:00 PM to 11:59 PM.",
    openFullPhotos: "Open photo page",
    noPhotos: "No progress photos yet.",
    modeSuffix: "MODE",
    today: "TODAY",
    weeklyProgressIs: "Weekly progress is at",
    keepMoving: "Keep the protocol moving.",
    startToday: "START TODAY",
    edit: "Edit",
    save: "Save",
    set: "Set",
    backup: "Backup",
    resetWeek: "Reset Week",
    start: "START",
    target: "TARGET",
    change: "CHANGE",
    toGoal: "TO GOAL",
    protocolStable: "Protocol status stable",
    deloadActive: "Deload warning active",
    avgRpe: "Avg RPE",
    streak: "Streak",
    noPrsYet: "No PRs marked yet",
    markPrHint: "Use Notes > Mark as PR",
    averageRpe: "Average RPE:",
    noRpeNotes: "No RPE notes yet",
    deloadAdvice: "Consider lowering load, adding rest, or keeping sets submaximal.",
    noDeloadSignal: "No deload signal from current notes.",
    weeklyProtocol: "Weekly protocol",
    completedSessions: "Completed sessions",
    lastSaved: "Last saved",
    noProgressSaved: "No progress saved yet.",
    progressSavedMsg: "Progress saved.",
    savedTag: "SAVED",
    autoTag: "AUTO",
    exercisesWord: "exercises",
    weekStreak: "WEEK STREAK",
    daysClear: "DAYS CLEAR",
    weekOf: "WEEK OF",
    protocolStarted: "Protocol Started",
    twoWeekUpgrade: "2-WEEK UPGRADE",
    progressionLead: "Two weeks in. You can add +5 lb to all",
    progressionTail: "exercises, or keep your current weights. Nothing changes unless you pick one.",
    keepCurrent: "Keep current",
    applyFive: "Apply +5 lb",
    mWeekly: "WEEKLY",
    mDone: "DONE",
    mExercises: "EXERCISES",
    mSets: "SETS",
    mSessions: "SESSIONS",
    mCompleted: "COMPLETED",
    mCardio: "CARDIO",
    mDays: "DAYS",
    total: "TOTAL",
    latest: "LATEST",
    photoNote: "Photo note",
    choosePhoto: "Choose Photo",
    savePhoto: "Save Photo",
    noNote: "No note",
    calCompleted: "Completed",
    calTrained: "Trained",
    calMissed: "Missed",
    calRest: "Rest",
    calPlanned: "Planned",
    backHome: "Back Home",
    restTimer: "REST TIMER",
    recoverNext: "Recover, then attack the next set.",
    startAfterSet: "Start after a hard set.",
    restWord: "REST",
    readyWord: "READY",
    stopTimer: "Stop Timer",
    editDay: "Edit Day",
    quick: "Quick",
    full: "Full",
    doneWord: "done",
    setsWord: "sets",
    repsWord: "reps",
    leftWord: "left",
    cardioWarmup: "CARDIO / WARM-UP",
    recoveryMode: "RECOVERY MODE",
    restEatRebuild: "Rest. Eat. Rebuild.",
    quickSession: "QUICK SESSION",
    weightWord: "WEIGHT",
    leftCap: "LEFT",
    markExerciseDone: "Mark Exercise Done",
    notesWord: "Notes",
    fullSession: "Full Session",
    minusSet: "- Set",
    plusSet: "+ Set",
    totalSets: "TOTAL SETS",
    progressWord: "PROGRESS",
    atlasMenu: "ATLAS MENU",
    signedInAs: "Signed in as",
    workoutWord: "WORKOUT",
    manageWorkouts: "Manage Workouts",
    appWord: "APP",
    backupSync: "Backup / Sync",
    logout: "Logout",
    close: "Close",
    cancel: "Cancel",
    doneBtn: "Done",
    waterToday: "Water Today",
    waterTracking: "Water Tracking",
    glasses: "glasses",
    glassWord: "Glass",
    waterGoal: "Daily Goal",
    drinkReminder: "Stay hydrated. Aim for your daily goal.",
    coachTitle: "Coach",
    bodyTypeLabel: "Body Type Goal",
    tipsTitle: "Protocol Tips",
    bmiLabel: "BMI",
    bodyFatLabel: "Body Fat",
    leanMassLabel: "Lean Mass",
    ibwLabel: "Ideal Weight",
    sexLabel: "Sex",
    ageLabel: "Age",
    countdownTitle: "Countdown to Goal",
    finalStretch: "Final stretch!",
    almostThere: "Almost there. Don't stop!",
    daysLeft: "DAYS LEFT",
    maleLabel: "Male",
    femaleLabel: "Female",
    bodyComposition: "Body Composition",
  },
  es: {
    goodMorning: "Buenos días",
    goodEvening: "Buenas tardes",
    goodNight: "Buenas noches",
    todayCommand: "Comando de Hoy",
    bodyStatus: "Estado Corporal",
    atlasScore: "Puntaje Atlas",
    monthCalendar: "Calendario Mensual",
    prTracker: "Récords Personales",
    fatigueDeload: "Fatiga / Descarga",
    myGoals: "Mis Metas",
    progressMemory: "Memoria de Progreso",
    streakBadges: "Racha / Insignias",
    progressPhotos: "Fotos de Progreso",
    weeklyMetrics: "Métricas Semanales",
    weekPlan: "Plan Semanal",
    settings: "Configuración",
    reminders: "Recordatorios",
    pages: "Páginas",
    profileName: "Nombre del perfil",
    language: "Idioma",
    theme: "Tema",
    lightStarts: "Auto: modo claro hasta la 1:00 PM, modo oscuro de 1:00 PM a 11:59 PM.",
    openFullPhotos: "Abrir página de fotos",
    noPhotos: "Aún no hay fotos de progreso.",
    modeSuffix: "",
    today: "HOY",
    weeklyProgressIs: "El progreso semanal está en",
    keepMoving: "Sigue con el protocolo.",
    startToday: "EMPEZAR HOY",
    edit: "Editar",
    save: "Guardar",
    set: "Definir",
    backup: "Respaldo",
    resetWeek: "Reiniciar Semana",
    start: "INICIO",
    target: "META",
    change: "CAMBIO",
    toGoal: "A LA META",
    protocolStable: "Protocolo estable",
    deloadActive: "Aviso de descarga activo",
    avgRpe: "RPE prom.",
    streak: "Racha",
    noPrsYet: "Aún no hay récords marcados",
    markPrHint: "Usa Notas > Marcar récord",
    averageRpe: "RPE promedio:",
    noRpeNotes: "Aún no hay notas de RPE",
    deloadAdvice: "Considera bajar la carga, descansar más o dejar las series submáximas.",
    noDeloadSignal: "Sin señal de descarga en las notas actuales.",
    weeklyProtocol: "Protocolo semanal",
    completedSessions: "Sesiones completadas",
    lastSaved: "Último guardado",
    noProgressSaved: "Aún no hay progreso guardado.",
    progressSavedMsg: "Progreso guardado.",
    savedTag: "GUARDADO",
    autoTag: "AUTO",
    exercisesWord: "ejercicios",
    weekStreak: "RACHA SEM.",
    daysClear: "DÍAS LIMPIOS",
    weekOf: "SEMANA DE",
    protocolStarted: "Protocolo Iniciado",
    twoWeekUpgrade: "MEJORA QUINCENAL",
    progressionLead: "Ya van dos semanas. Puedes sumar +5 lb a los",
    progressionTail: "ejercicios, o mantener tus pesos actuales. Nada cambia hasta que elijas.",
    keepCurrent: "Mantener actual",
    applyFive: "Aplicar +5 lb",
    mWeekly: "SEMANAL",
    mDone: "HECHO",
    mExercises: "EJERCICIOS",
    mSets: "SERIES",
    mSessions: "SESIONES",
    mCompleted: "COMPLETADAS",
    mCardio: "CARDIO",
    mDays: "DÍAS",
    total: "TOTAL",
    latest: "ÚLTIMA",
    photoNote: "Nota de la foto",
    choosePhoto: "Elegir foto",
    savePhoto: "Guardar foto",
    noNote: "Sin nota",
    calCompleted: "Completado",
    calTrained: "Entrenado",
    calMissed: "Perdido",
    calRest: "Descanso",
    calPlanned: "Planeado",
    backHome: "Volver al inicio",
    restTimer: "TEMPORIZADOR",
    recoverNext: "Recupérate y ataca la siguiente serie.",
    startAfterSet: "Inícialo tras una serie dura.",
    restWord: "DESC.",
    readyWord: "LISTO",
    stopTimer: "Detener",
    editDay: "Editar día",
    quick: "Rápido",
    full: "Completo",
    doneWord: "hechas",
    setsWord: "series",
    repsWord: "reps",
    leftWord: "restan",
    cardioWarmup: "CARDIO / CALENTAMIENTO",
    recoveryMode: "MODO RECUPERACIÓN",
    restEatRebuild: "Descansa. Come. Reconstruye.",
    quickSession: "SESIÓN RÁPIDA",
    weightWord: "PESO",
    leftCap: "RESTAN",
    markExerciseDone: "Marcar ejercicio hecho",
    notesWord: "Notas",
    fullSession: "Sesión completa",
    minusSet: "- Serie",
    plusSet: "+ Serie",
    totalSets: "SERIES TOTALES",
    progressWord: "PROGRESO",
    atlasMenu: "MENÚ ATLAS",
    signedInAs: "Sesión de",
    workoutWord: "ENTRENO",
    manageWorkouts: "Gestionar rutinas",
    appWord: "APP",
    backupSync: "Respaldo / Sync",
    logout: "Cerrar sesión",
    close: "Cerrar",
    cancel: "Cancelar",
    doneBtn: "Listo",
    waterToday: "Agua Hoy",
    waterTracking: "Control de Agua",
    glasses: "vasos",
    glassWord: "Vaso",
    waterGoal: "Meta Diaria",
    drinkReminder: "Mantente hidratado. Llega a tu meta diaria.",
    coachTitle: "Coach",
    bodyTypeLabel: "Meta de Cuerpo",
    tipsTitle: "Consejos del Protocolo",
    bmiLabel: "IMC",
    bodyFatLabel: "Grasa Corporal",
    leanMassLabel: "Masa Magra",
    ibwLabel: "Peso Ideal",
    sexLabel: "Sexo",
    ageLabel: "Edad",
    countdownTitle: "Cuenta Regresiva",
    finalStretch: "¡La recta final!",
    almostThere: "¡Casi ahí! No pares.",
    daysLeft: "DÍAS RESTANTES",
    maleLabel: "Hombre",
    femaleLabel: "Mujer",
    bodyComposition: "Composición Corporal",
  },
};

const DAY_TRANSLATIONS = {
  en: {
    Lunes: "Monday",
    Martes: "Tuesday",
    Miércoles: "Wednesday",
    Jueves: "Thursday",
    Viernes: "Friday",
    Sábado: "Saturday",
    Domingo: "Sunday",
  },
  es: {
    Lunes: "Lunes",
    Martes: "Martes",
    Miércoles: "Miércoles",
    Jueves: "Jueves",
    Viernes: "Viernes",
    Sábado: "Sábado",
    Domingo: "Domingo",
  },
};

const DAY_SHORT_TRANSLATIONS = {
  en: { Lunes: "MON", Martes: "TUE", Miércoles: "WED", Jueves: "THU", Viernes: "FRI", Sábado: "SAT", Domingo: "SUN" },
  es: { Lunes: "LUN", Martes: "MAR", Miércoles: "MIE", Jueves: "JUE", Viernes: "VIE", Sábado: "SAB", Domingo: "DOM" },
};

function parseHeightToInches(heightStr) {
  if (!heightStr) return 0;
  const match = String(heightStr).match(/(\d+)'(\d+)?/);
  if (!match) return 0;
  return Number(match[1] || 0) * 12 + Number(match[2] || 0);
}

function calculateBMI(weightLb, heightStr) {
  const wKg = Number(weightLb) * 0.453592;
  const inches = parseHeightToInches(heightStr);
  if (inches === 0) return 0;
  const hM = inches * 0.0254;
  return Math.round((wKg / (hM * hM)) * 10) / 10;
}

function calculateBodyFatPct(bmi, age, sex) {
  if (!bmi) return 0;
  const a = Math.max(1, Number(age) || 25);
  const sexFactor = sex === "female" ? 0 : 1;
  return Math.max(3, Math.round(((1.2 * bmi) + (0.23 * a) - (10.8 * sexFactor) - 5.4) * 10) / 10);
}

function calculateIBW(heightStr, sex) {
  const inches = parseHeightToInches(heightStr);
  if (inches === 0) return 0;
  const over5Ft = Math.max(0, inches - 60);
  const baseKg = sex === "female" ? 45.5 : 50;
  return Math.round((baseKg + 2.3 * over5Ft) * 2.205);
}

function getLeanMass(weightLb, bodyFatPct) {
  return Math.max(0, Math.round(Number(weightLb) * (1 - Number(bodyFatPct) / 100)));
}

function getDaysToGoal(targetDate) {
  if (!targetDate) return null;
  const target = new Date(targetDate + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = target.getTime() - now.getTime();
  return diff >= 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
}

function getHomeMessage(weeklyProgress, calendarLog, daysToGoal, language, todayDisplayName, todayType) {
  const isEs = language === "es";
  const todayKey = getDateKey();
  const todayLog = calendarLog[todayKey];
  const hasTrainedToday = todayLog?.status === "completed" || todayLog?.status === "trained";
  let missedStreak = 0;
  for (let i = 1; i <= 5; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    if (calendarLog[k]?.status === "missed") missedStreak++;
    else break;
  }
  if (typeof daysToGoal === "number" && daysToGoal === 0) return isEs ? "¡Llegaste a tu fecha meta! Fija un nuevo objetivo." : "You hit your target date! Time to set the next goal.";
  if (typeof daysToGoal === "number" && daysToGoal <= 7 && daysToGoal > 0) return isEs ? `¡Solo ${daysToGoal} días para tu meta! Termina fuerte — cada serie cuenta.` : `Only ${daysToGoal} days left. Leave nothing on the table.`;
  if (typeof daysToGoal === "number" && daysToGoal <= 30 && daysToGoal > 0) return isEs ? `${daysToGoal} días para tu meta. No pierdas el momentum.` : `${daysToGoal} days to your goal. Don't lose the momentum.`;
  if (missedStreak >= 3) return isEs ? "Han pasado varios días. El cuerpo se adapta — pero solo si entrenas. Vuelve hoy." : "It's been a few days. Fitness is built in the gym, not planned there. Get back today.";
  if (weeklyProgress >= 95) return isEs ? "¡Semana casi perfecta! Cierra al 100% y demuestra lo que eres." : "Dominant week. Close it at 100% and cement the standard.";
  if (weeklyProgress >= 70) return isEs ? "¡Sólida semana! Una o dos sesiones más y cierras fuerte." : "Strong week. One more session and you close it right.";
  if (weeklyProgress >= 40) return isEs ? "Buen ritmo esta semana. Sigue acumulando — la consistencia es todo." : "Good rhythm this week. Keep stacking sessions — consistency wins.";
  if (hasTrainedToday) return isEs ? "¡Ya entrenaste hoy! El trabajo está hecho. Descansa y recupérate." : "You already trained today. Work is done — rest and recover.";
  const type = todayType || "TRAINING";
  const day = todayDisplayName || (isEs ? "Hoy" : "Today");
  return isEs ? `Es día de ${type}. Ejecuta el protocolo y sé mejor que ayer.` : `${day} is ${type} day. Execute the protocol and be better than yesterday.`;
}

function getCoachTips(sex, age, bmi, bodyFatPct, bodyTypeGoal, language) {
  const isEs = language === "es";
  const ageNum = Number(age) || 25;
  const tips = [];
  if (bodyTypeGoal === "lean") {
    tips.push(isEs ? "Déficit calórico moderado de 300–500 kcal/día. Déficit mayor pierde músculo." : "Moderate caloric deficit of 300–500 kcal/day. Larger deficits burn muscle.");
    tips.push(isEs ? "Come 0.8–1g de proteína por lb de peso corporal para proteger el músculo." : "Eat 0.8–1g of protein per lb of body weight to protect muscle mass.");
    tips.push(isEs ? "Cardio HIIT 2–3 días/semana maximiza la quema de grasa preservando músculo." : "HIIT cardio 2–3 days/week maximizes fat loss while preserving muscle.");
  } else if (bodyTypeGoal === "muscular") {
    tips.push(isEs ? "Superávit calórico de 300–500 kcal/día para optimizar la ganancia de masa muscular." : "Caloric surplus of 300–500 kcal/day optimizes muscle gain without excess fat.");
    tips.push(isEs ? "Prioriza ejercicios compuestos pesados: Squat, Bench Press, Deadlift, Row, Press." : "Prioritize heavy compound lifts: Squat, Bench Press, Deadlift, Row, Press.");
    tips.push(isEs ? "Duerme 8 horas. El músculo se sintetiza principalmente durante el sueño." : "Sleep 8 hours. Most muscle synthesis happens during sleep.");
  } else if (bodyTypeGoal === "athletic") {
    tips.push(isEs ? "Recomposición: come en mantenimiento calórico con alta proteína." : "Recomposition: eat at maintenance calories with high protein intake.");
    tips.push(isEs ? "Combina 4 días de fuerza con 2 de cardio para un físico atlético equilibrado." : "Combine 4 strength days with 2 cardio days for a balanced athletic physique.");
    tips.push(isEs ? "La consistencia es más importante que la intensidad. El protocolo gana a largo plazo." : "Consistency beats intensity. The protocol wins long-term.");
  } else {
    tips.push(isEs ? "Mantenimiento: sé consistente con tu protocolo y mantén el balance calórico." : "Maintenance: stay consistent with your weekly protocol and caloric balance.");
    tips.push(isEs ? "Varía la intensidad cada 4–6 semanas para evitar el estancamiento." : "Vary intensity every 4–6 weeks to prevent plateaus.");
  }
  if (ageNum >= 40) {
    tips.push(isEs ? "A los 40+: prioriza movilidad diaria y descanso. Las articulaciones importan tanto como el músculo." : "Age 40+: prioritize daily mobility and rest. Joints matter as much as muscle.");
    tips.push(isEs ? "Deload cada 4–6 semanas es especialmente importante con la edad." : "Deloading every 4–6 weeks becomes increasingly important with age.");
  } else if (ageNum < 25) {
    tips.push(isEs ? "A tu edad, la recuperación es rápida. Puedes entrenar con mayor intensidad y frecuencia." : "At your age, recovery is fast. You can train with higher intensity and frequency.");
  }
  if (sex === "female") {
    tips.push(isEs ? "El entrenamiento de fuerza es ideal: tonifica, no crea 'bulky', y quema más calorías que el cardio." : "Strength training is ideal: it tones, doesn't make you 'bulky', and burns more calories than cardio.");
  }
  if (bmi > 30) {
    tips.push(isEs ? "Con BMI elevado, el entrenamiento de fuerza es más efectivo que solo el cardio para perder grasa." : "With elevated BMI, strength training is more effective than cardio alone for fat loss.");
  }
  if (bmi > 0 && bmi < 18.5) {
    tips.push(isEs ? "Estás por debajo del peso ideal. Agrega 300–500 kcal extra de alimentos nutritivos diariamente." : "You're below ideal weight. Add 300–500 extra kcal from nutritious foods daily.");
  }
  return tips;
}

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

// Writes JSON to localStorage and reports success so the UI can warn the
// user instead of silently losing data when the quota is exceeded.
function safeSave(key, value) {
  if (typeof window === "undefined") return true;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function safeRemove(key) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage errors when clearing legacy keys.
  }
}

function makeSalt() {
  const bytes = new Uint8Array(16);

  if (typeof window !== "undefined" && window.crypto?.getRandomValues) {
    window.crypto.getRandomValues(bytes);
  } else {
    for (let index = 0; index < bytes.length; index += 1) {
      bytes[index] = Math.floor(Math.random() * 256);
    }
  }

  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

// Hashes a password with its salt. Uses SHA-256 when the secure crypto API is
// available and falls back to a lightweight hash so login never crashes.
async function hashPassword(password, salt) {
  const text = `${salt}:${password}`;

  try {
    if (typeof window !== "undefined" && window.crypto?.subtle) {
      const encoded = new TextEncoder().encode(text);
      const digest = await window.crypto.subtle.digest("SHA-256", encoded);
      return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
    }
  } catch {
    // Fall through to the lightweight hash below.
  }

  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv${(hash >>> 0).toString(16)}`;
}

// Resizes and re-encodes an image so photos stay small enough for localStorage.
function compressImage(file, maxSize, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("decode-failed"));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * scale));
        const height = Math.max(1, Math.round(image.height * scale));
        const canvas = document.createElement("canvas");

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        if (!context) {
          resolve(String(reader.result));
          return;
        }

        context.drawImage(image, 0, 0, width, height);

        try {
          resolve(canvas.toDataURL("image/jpeg", quality));
        } catch {
          resolve(String(reader.result));
        }
      };

      image.src = String(reader.result);
    };

    reader.readAsDataURL(file);
  });
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

function getDateKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function toNumber(value) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function signedNumber(value) {
  if (value > 0) return `+${value}`;
  return String(value);
}

function formatTimer(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function getExerciseKey(dayName, sessionIndex, exerciseIndex) {
  return `${dayName}-${sessionIndex}-${exerciseIndex}`;
}

function getWorkoutWeekKey(date = new Date()) {
  const current = new Date(date);
  const dayIndex = current.getDay();
  const mondayOffset = dayIndex === 0 ? -6 : 1 - dayIndex;
  current.setDate(current.getDate() + mondayOffset);
  return current.toISOString().slice(0, 10);
}

function getMonthKey(date = new Date()) {
  return date.toISOString().slice(0, 7);
}

function getDayNameFromDate(date) {
  const map = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return map[date.getDay()];
}

function getAutoTheme(hour = new Date().getHours()) {
  return hour >= 13 ? "dark" : "light";
}

function getGreetingKey(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 12) return "goodMorning";
  if (hour >= 22 || hour < 5) return "goodNight";
  return "goodEvening";
}

function getDisplayDay(dayName, language = "en") {
  return DAY_TRANSLATIONS[language]?.[dayName] || dayName;
}

function getDisplayDayShort(dayName, language = "en", fallback = "") {
  return DAY_SHORT_TRANSLATIONS[language]?.[dayName] || fallback || dayName.slice(0, 3).toUpperCase();
}

function getWeekHeaderLabels(language = "en") {
  return language === "es" ? ["D", "L", "M", "M", "J", "V", "S"] : ["S", "M", "T", "W", "T", "F", "S"];
}

function createBlankWorkoutData() {
  return days.reduce((acc, dayName) => {
    acc[dayName] = {
      label: baseWorkoutData[dayName].label,
      type: "CUSTOM",
      sessions: [
        {
          time: "AM",
          name: "Custom Session",
          warmup: null,
          exercises: [],
        },
      ],
    };

    return acc;
  }, {});
}

function getMonthDays(monthKey) {
  const [year, month] = monthKey.split("-").map(Number);
  const first = new Date(year, month - 1, 1);
  const totalDays = new Date(year, month, 0).getDate();
  const leading = first.getDay();
  const cells = Array.from({ length: leading }, () => null);

  for (let dayNumber = 1; dayNumber <= totalDays; dayNumber += 1) {
    const date = new Date(year, month - 1, dayNumber);
    cells.push({
      date,
      key: date.toISOString().slice(0, 10),
      dayNumber,
      dayName: getDayNameFromDate(date),
    });
  }

  return cells;
}

function getExerciseFromKey(workoutData, key) {
  const [dayName, sessionIndexRaw, exerciseIndexRaw] = key.split("-");
  const sessionIndex = Number(sessionIndexRaw);
  const exerciseIndex = Number(exerciseIndexRaw);
  const currentSession = workoutData[dayName]?.sessions?.[sessionIndex];
  const exercise = currentSession?.exercises?.[exerciseIndex];

  return { dayName, sessionIndex, exerciseIndex, currentSession, exercise };
}

function playReminderSound(sound = "chime") {
  if (sound === "silent" || typeof window === "undefined") return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const frequencies = {
    chime: [660, 880],
    pulse: [440, 440, 440],
    bell: [784, 988, 1175],
  }[sound] || [660];

  frequencies.forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * 0.18;

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.16);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.18);
  });
}

// A single shared context, reused for the short tap click so rapid taps do
// not spawn dozens of audio contexts.
let tapAudioContext = null;

function playTapTone() {
  if (typeof window === "undefined") return;

  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return;

  try {
    if (!tapAudioContext) tapAudioContext = new AudioContextCtor();
    if (tapAudioContext.state === "suspended") tapAudioContext.resume();

    const context = tapAudioContext;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime;

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(660, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.07, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.08);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + 0.09);
  } catch {
    // Ignore audio errors so a tap never breaks the UI.
  }
}

export default function AtlasLuthor() {
  const [screen, setScreen] = useState("home");
  const [users, setUsers] = useState(() => safeLoad(STORAGE_KEYS.users, {}));
  const [activeUserId, setActiveUserId] = useState(() => safeLoad(STORAGE_KEYS.activeUser, ""));
  const [authMode, setAuthMode] = useState("landing");
  const [loginDraft, setLoginDraft] = useState({ userId: "", password: "" });
  const [signupDraft, setSignupDraft] = useState(DEFAULT_SIGNUP);
  const [authError, setAuthError] = useState("");
  const [activeDay, setActiveDay] = useState(getTodayDayName());
  const [activeSession, setActiveSession] = useState(0);
  const [checked, setChecked] = useState({});
  const [workoutData, setWorkoutData] = useState(() => cloneData(baseWorkoutData));
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingCardio, setEditingCardio] = useState(null);
  const [lastProgressionReview, setLastProgressionReview] = useState(null);
  const [profile, setProfile] = useState(() => cloneData(DEFAULT_PROFILE));
  const [goals, setGoals] = useState(() => cloneData(DEFAULT_GOALS));
  const [progressLog, setProgressLog] = useState([]);
  const [exerciseNotes, setExerciseNotes] = useState({});
  const [calendarLog, setCalendarLog] = useState({});
  const [progressPhotos, setProgressPhotos] = useState([]);
  const [photoAlbums, setPhotoAlbums] = useState([]);
  const [cloudSettings, setCloudSettings] = useState(() => cloneData(DEFAULT_CLOUD_SETTINGS));
  const [appSettings, setAppSettings] = useState(() => withNameParts(DEFAULT_APP_SETTINGS));
  const [notificationSettings, setNotificationSettings] = useState(() => cloneData(DEFAULT_NOTIFICATION_SETTINGS));
  const [setProgress, setSetProgress] = useState({});
  const [storageFull, setStorageFull] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [editingGoals, setEditingGoals] = useState(null);
  const [editingNote, setEditingNote] = useState(null);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [showDataTools, setShowDataTools] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [activeFeaturePage, setActiveFeaturePage] = useState("today");
  const [progressSaved, setProgressSaved] = useState(false);
  const [todayOnlyMode, setTodayOnlyMode] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [highlightedExerciseIndex, setHighlightedExerciseIndex] = useState(0);
  const [photoDraft, setPhotoDraft] = useState({ date: getDateKey(), note: "", dataUrl: "", album: "" });
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [albumFilter, setAlbumFilter] = useState("");
  const [albumDraft, setAlbumDraft] = useState("");
  const [reminderDraft, setReminderDraft] = useState({ label: "Custom reminder", time: "12:00", message: "Stay on protocol.", sound: "chime" });
  const [restTimer, setRestTimer] = useState({ secondsLeft: 0, duration: 0, running: false, label: "", endsAt: null, notified: false });
  const [clockNow, setClockNow] = useState(() => new Date());
  const [waterLog, setWaterLog] = useState({});
  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState(null);
  const [exerciseFilterMuscle, setExerciseFilterMuscle] = useState("All");
  const notifiedTimersRef = useRef(new Set());
  const loadedUserRef = useRef("");
  const tapFeedbackRef = useRef(true);

  const day = workoutData[activeDay];
  const session = day.sessions[Math.min(activeSession, day.sessions.length - 1)];

  useEffect(() => {
    tapFeedbackRef.current = appSettings.tapFeedback !== false;
  }, [appSettings.tapFeedback]);

  // Plays a short click and a light vibration when an interactive element is
  // pressed, giving immediate confirmation that a tap registered.
  useEffect(() => {
    const handleTap = event => {
      const control = event.target.closest("button, [role='button'], label.dark-btn");
      if (!control || control.disabled || !tapFeedbackRef.current) return;

      playTapTone();
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(9);
        } catch {
          // Vibration is unsupported on some devices; ignore.
        }
      }
    };

    window.addEventListener("pointerdown", handleTap);
    return () => window.removeEventListener("pointerdown", handleTap);
  }, []);

  useEffect(() => {
    safeSave(STORAGE_KEYS.users, users);
  }, [users]);

  useEffect(() => {
    safeSave(STORAGE_KEYS.activeUser, activeUserId);
  }, [activeUserId]);

  // Removes legacy, non-account-scoped storage keys left by older versions.
  useEffect(() => {
    LEGACY_STORAGE_KEYS.forEach(safeRemove);
  }, []);

  // Persists the signed-in account's data to its own namespaced key. It only
  // writes after that account's data has been loaded into state, so the
  // initial render cannot overwrite stored data with defaults, and logout
  // (no active account) cannot leak or wipe anything.
  useEffect(() => {
    if (!activeUserId || !users[activeUserId] || loadedUserRef.current !== activeUserId) return;

    const saved = safeSave(STORAGE_KEYS.dataPrefix + activeUserId, {
      workoutData,
      checked,
      lastProgressionReview,
      profile,
      goals,
      progressLog,
      exerciseNotes,
      calendarLog,
      progressPhotos,
      photoAlbums,
      cloudSettings,
      notificationSettings,
      setProgress,
      appSettings,
      waterLog,
    });

    setStorageFull(!saved);
  }, [
    activeUserId,
    users,
    workoutData,
    checked,
    lastProgressionReview,
    profile,
    goals,
    progressLog,
    exerciseNotes,
    calendarLog,
    progressPhotos,
    photoAlbums,
    cloudSettings,
    notificationSettings,
    setProgress,
    appSettings,
    waterLog,
  ]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setClockNow(new Date()), 60000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!restTimer.running || !restTimer.endsAt) return undefined;

    const syncRestTimer = () => {
      setRestTimer(prev => {
        if (!prev.running || !prev.endsAt) return prev;

        const nextSeconds = Math.max(Math.ceil((prev.endsAt - Date.now()) / 1000), 0);

        if (nextSeconds > 0) {
          return prev.secondsLeft === nextSeconds ? prev : { ...prev, secondsLeft: nextSeconds };
        }

        const notificationKey = String(prev.endsAt);

        if (!notifiedTimersRef.current.has(notificationKey)) {
          notifiedTimersRef.current.add(notificationKey);
          sendAtlasNotification(
            "Atlas Rest Complete",
            `${prev.label || "Rest timer"} is done. Next set is ready.`,
            notificationSettings.sound
          );
        }

        return { ...prev, secondsLeft: 0, running: false, notified: true };
      });
    };

    syncRestTimer();
    const timerId = window.setInterval(syncRestTimer, 500);
    window.addEventListener("focus", syncRestTimer);
    document.addEventListener("visibilitychange", syncRestTimer);

    return () => {
      window.clearInterval(timerId);
      window.removeEventListener("focus", syncRestTimer);
      document.removeEventListener("visibilitychange", syncRestTimer);
    };
  }, [restTimer.running, restTimer.endsAt, notificationSettings.sound]);

  const updateCalendarForToday = nextChecked => {
    const date = getDateKey();
    const today = getTodayDayName();
    const todaySessions = workoutData[today].sessions;
    const dayExercises = todaySessions.reduce((sum, currentSession) => sum + currentSession.exercises.length, 0);
    const dayDone = todaySessions.reduce(
      (sum, currentSession, sessionIndex) =>
        sum + currentSession.exercises.filter((_, exerciseIndex) => nextChecked[getExerciseKey(today, sessionIndex, exerciseIndex)]).length,
      0
    );
    // Today is never "missed" while it is still in progress.
    const status =
      dayExercises === 0 ? "rest" : dayDone === dayExercises ? "completed" : dayDone > 0 ? "trained" : "planned";

    setCalendarLog(prev => ({
      ...prev,
      [date]: {
        date,
        status,
        completed: dayDone,
        total: dayExercises,
        dayName: today,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const updateSetCount = (exerciseIndex, delta) => {
    const key = getExerciseKey(activeDay, activeSession, exerciseIndex);
    const exercise = session.exercises[exerciseIndex];
    const totalSets = Number(exercise?.sets || 0);
    const currentSets = Number(setProgress[key] || 0);
    const nextSets = Math.max(0, Math.min(totalSets, currentSets + delta));
    const nextSetProgress = { ...setProgress, [key]: nextSets };
    const nextChecked = { ...checked };

    if (totalSets > 0 && nextSets >= totalSets) {
      nextChecked[key] = true;
      const nextIndex = session.exercises.findIndex((_, index) => index > exerciseIndex && !nextChecked[getExerciseKey(activeDay, activeSession, index)]);
      setHighlightedExerciseIndex(nextIndex >= 0 ? nextIndex : exerciseIndex);
      startRestTimer(90);
    } else {
      nextChecked[key] = false;
      setHighlightedExerciseIndex(exerciseIndex);
      if (delta > 0) startRestTimer(90);
    }

    setSetProgress(nextSetProgress);
    setChecked(nextChecked);
    updateCalendarForToday(nextChecked);
  };

  const toggleExercise = exerciseIndex => {
    const key = getExerciseKey(activeDay, activeSession, exerciseIndex);
    const wasDone = !!checked[key];
    const nextChecked = { ...checked, [key]: !wasDone };

    setChecked(nextChecked);
    updateCalendarForToday(nextChecked);

    if (!wasDone) {
      setSetProgress(prev => ({ ...prev, [key]: Number(session.exercises[exerciseIndex]?.sets || 0) }));
      const nextIndex = session.exercises.findIndex((_, index) => index > exerciseIndex && !nextChecked[getExerciseKey(activeDay, activeSession, index)]);
      setHighlightedExerciseIndex(nextIndex >= 0 ? nextIndex : exerciseIndex);
      startRestTimer(90);
    } else {
      setSetProgress(prev => ({ ...prev, [key]: 0 }));
      setHighlightedExerciseIndex(exerciseIndex);
    }
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
    let completedDays = 0;

    days.forEach(dayName => {
      let dayExercises = 0;
      let dayDone = 0;

      workoutData[dayName].sessions.forEach((currentSession, sessionIndex) => {
        if (!currentSession.rest) workoutSessions += 1;
        if (currentSession.warmup) cardioSessions += 1;

        totalExercises += currentSession.exercises.length;
        dayExercises += currentSession.exercises.length;
        totalSets += currentSession.exercises.reduce((sum, ex) => sum + Number(ex.sets || 0), 0);

        const sessionDone = currentSession.exercises.filter(
          (_, exerciseIndex) => checked[`${dayName}-${sessionIndex}-${exerciseIndex}`]
        ).length;

        completedExercises += sessionDone;
        dayDone += sessionDone;

        if (currentSession.exercises.length > 0 && sessionDone === currentSession.exercises.length) {
          completedSessions += 1;
        }
      });

      if (dayExercises > 0 && dayDone === dayExercises) {
        completedDays += 1;
      }
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
      completedDays,
      today,
      todayType: todayWorkout.type,
      todayLabel: todayWorkout.label,
    };
  }, [checked, workoutData]);

  useEffect(() => {
    if (!notificationSettings.enabled || typeof Notification === "undefined" || Notification.permission !== "granted") {
      return undefined;
    }

    const checkNotifications = () => {
      const now = new Date();
      const todayKey = getDateKey();
      const currentTime = now.toTimeString().slice(0, 5);

      if (currentTime === notificationSettings.workoutTime && notificationSettings.lastWorkoutNotice !== todayKey) {
        sendAtlasNotification(
          "Atlas Luthor",
          notificationSettings.workoutMessage || `Today is ${todayDisplayName} / ${weeklyMetrics.todayType}. Protocol ready.`,
          notificationSettings.sound
        );
        setNotificationSettings(prev => ({ ...prev, lastWorkoutNotice: todayKey }));
      }

      if (currentTime === notificationSettings.restTime && notificationSettings.lastRestNotice !== todayKey) {
        sendAtlasNotification(
          "Atlas Luthor Recovery",
          notificationSettings.restMessage || "Log progress, eat, hydrate, and recover.",
          notificationSettings.sound
        );
        setNotificationSettings(prev => ({ ...prev, lastRestNotice: todayKey }));
      }

      (notificationSettings.customReminders || []).forEach(reminder => {
        if (!reminder.enabled || reminder.time !== currentTime || reminder.lastNotice === todayKey) return;

        sendAtlasNotification(reminder.label || "Atlas Reminder", reminder.message || "Stay on protocol.", reminder.sound || notificationSettings.sound);
        setNotificationSettings(prev => ({
          ...prev,
          customReminders: (prev.customReminders || []).map(item =>
            item.id === reminder.id ? { ...item, lastNotice: todayKey } : item
          ),
        }));
      });

      return undefined;
    };

    checkNotifications();
    const intervalId = window.setInterval(checkNotifications, 60000);

    return () => window.clearInterval(intervalId);
  }, [notificationSettings, weeklyMetrics.today, weeklyMetrics.todayType]);

  useEffect(() => {
    if (!activeUserId || loadedUserRef.current !== activeUserId) return;

    const date = getDateKey();

    setProgressLog(prev => {
      const autoRecord = {
        id: `auto-${date}`,
        type: "auto",
        date,
        recordedAt: new Date().toISOString(),
        weight: profile.currentWeight,
        targetWeight: profile.targetWeight,
        weeklyProgress: weeklyMetrics.weeklyProgress,
        completedExercises: weeklyMetrics.completedExercises,
        completedSessions: weeklyMetrics.completedSessions,
        completedDays: weeklyMetrics.completedDays,
        weekKey: getWorkoutWeekKey(),
      };
      const withoutTodayAuto = prev.filter(item => item.id !== autoRecord.id);

      return [autoRecord, ...withoutTodayAuto].slice(0, 60);
    });
  }, [
    profile.currentWeight,
    profile.targetWeight,
    weeklyMetrics.completedExercises,
    weeklyMetrics.completedDays,
    weeklyMetrics.completedSessions,
    weeklyMetrics.weeklyProgress,
  ]);

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

  const progressEntries = useMemo(
    () =>
      [...progressLog].sort(
        (a, b) => new Date(b.recordedAt || b.date).getTime() - new Date(a.recordedAt || a.date).getTime()
      ),
    [progressLog]
  );
  const latestProgress = progressEntries[0];
  const currentWeight = toNumber(profile.currentWeight);
  const startWeight = toNumber(profile.startWeight);
  const targetWeight = toNumber(profile.targetWeight);
  const weightChange = Math.round((currentWeight - startWeight) * 10) / 10;
  const weightToGoal = Math.round((currentWeight - targetWeight) * 10) / 10;
  const weeklyProgressGoal = Math.max(toNumber(goals.weeklyProgressGoal), 1);
  const weeklySessionsGoal = Math.max(toNumber(goals.weeklySessionsGoal), 1);
  const weeklyGoalPct = Math.min(100, Math.round((weeklyMetrics.weeklyProgress / weeklyProgressGoal) * 100));
  const sessionsGoalPct = Math.min(100, Math.round((weeklyMetrics.completedSessions / weeklySessionsGoal) * 100));
  const chartEntries = useMemo(() => {
    const manualEntries = progressEntries.filter(entry => entry.type === "manual");
    const entries = manualEntries.length ? manualEntries : progressEntries;

    return entries
      .slice(0, 8)
      .reverse()
      .map(entry => ({ ...entry, weightNumber: toNumber(entry.weight) }));
  }, [progressEntries]);
  const chartWeights = chartEntries.map(entry => entry.weightNumber).filter(Boolean);
  const minChartWeight = chartWeights.length ? Math.min(...chartWeights) : 0;
  const maxChartWeight = chartWeights.length ? Math.max(...chartWeights) : 0;
  const currentWeekKey = getWorkoutWeekKey();
  const completedWeekKeys = useMemo(
    () => [...new Set(progressEntries.filter(entry => Number(entry.completedDays || 0) >= 3).map(entry => entry.weekKey || entry.date))],
    [progressEntries]
  );
  const weeklyStreak = completedWeekKeys.length;
  const earnedBadges = [
    weeklyMetrics.weeklyProgress >= 100 ? "Protocol Clear" : null,
    weeklyMetrics.completedSessions >= weeklySessionsGoal ? "Session Hunter" : null,
    weeklyStreak >= 2 ? `${weeklyStreak} Week Streak` : null,
    progressEntries.some(entry => entry.type === "manual") ? "Progress Logged" : null,
  ].filter(Boolean);
  const restTimerRadius = 44;
  const restTimerCircumference = 2 * Math.PI * restTimerRadius;
  const restTimerProgress = restTimer.duration > 0 ? restTimer.secondsLeft / restTimer.duration : 0;
  const restTimerOffset = restTimerCircumference * (1 - restTimerProgress);
  const currentMonthKey = getMonthKey();
  const calendarCells = getMonthDays(currentMonthKey);
  // Resolves a calendar day's status. Unlogged past days are only "missed"
  // when that weekday is actually programmed as a training day; scheduled
  // rest days show as "rest" instead of a false miss.
  const getCalendarStatus = cell => {
    const logged = calendarLog[cell.key];
    if (logged?.status) return logged.status;

    const dayPlan = workoutData[cell.dayName];
    const isRestDay =
      !dayPlan || dayPlan.sessions.every(currentSession => currentSession.rest || currentSession.exercises.length === 0);

    if (isRestDay) return "rest";
    return cell.key < getDateKey() ? "missed" : "planned";
  };
  const prEntries = useMemo(
    () =>
      Object.entries(exerciseNotes)
        .filter(([, note]) => note.pr)
        .map(([key, note]) => {
          const { dayName, currentSession, exercise } = getExerciseFromKey(workoutData, key);

          return {
            key,
            dayName,
            sessionName: currentSession?.name || "Session",
            exerciseName: exercise?.name || "Exercise",
            weight: exercise?.weight || "",
            date: note.updatedAt ? note.updatedAt.slice(0, 10) : "",
          };
        })
        .sort((a, b) => b.date.localeCompare(a.date)),
    [exerciseNotes, workoutData]
  );
  const weeklyNoteValues = useMemo(
    () =>
      Object.values(exerciseNotes)
        .filter(note => !note.updatedAt || getWorkoutWeekKey(new Date(note.updatedAt)) === currentWeekKey)
        .map(note => ({
          difficulty: toNumber(note.difficulty),
          pain: toNumber(note.pain),
          painText: String(note.pain || "").toLowerCase(),
        })),
    [exerciseNotes, currentWeekKey]
  );
  const rpeValues = weeklyNoteValues.map(note => note.difficulty).filter(value => value > 0);
  const averageRpe = rpeValues.length ? Math.round((rpeValues.reduce((sum, value) => sum + value, 0) / rpeValues.length) * 10) / 10 : 0;
  const highFatigueNotes = weeklyNoteValues.filter(
    note => note.difficulty >= 9 || note.pain >= 7 || ["pain", "dolor", "sharp"].some(word => note.painText.includes(word))
  ).length;
  const deloadWarning = averageRpe >= 8.5 || highFatigueNotes >= 2;
  const atlasScore = Math.min(
    100,
    Math.round(
      weeklyMetrics.weeklyProgress * 0.45 +
        Math.min(weeklyMetrics.completedSessions / weeklySessionsGoal, 1) * 25 +
        Math.min(weeklyStreak, 4) * 5 +
        prEntries.length * 3 +
        (deloadWarning ? -10 : 5)
    )
  );
  const quickExerciseIndex = highlightedExerciseIndex >= 0 ? highlightedExerciseIndex : 0;
  const quickExercise = session.exercises[quickExerciseIndex] || session.exercises[0];
  const quickExerciseKey = quickExercise ? getExerciseKey(activeDay, activeSession, quickExerciseIndex) : "";
  const quickNote = quickExerciseKey ? exerciseNotes[quickExerciseKey] : null;
  const quickSetsDone = Number(setProgress[quickExerciseKey] || 0);
  const quickTotalSets = Number(quickExercise?.sets || 0);
  const quickSetsLeft = Math.max(quickTotalSets - quickSetsDone, 0);
  const language = appSettings.language === "es" ? "es" : "en";
  const text = UI_TEXT[language];
  const calendarLabels = {
    completed: text.calCompleted,
    trained: text.calTrained,
    missed: text.calMissed,
    rest: text.calRest,
    planned: text.calPlanned,
  };
  const activeThemeMode = appSettings.themeMode === "auto" ? getAutoTheme(clockNow.getHours()) : appSettings.themeMode;
  const isLightMode = activeThemeMode === "light";
  const themeFor = type => {
    const base = TYPE_THEME[type] || TYPE_THEME.CUSTOM;
    return isLightMode
      ? { ...base, accent: base.lightAccent, sub: base.lightSub, badge: base.lightBadge }
      : base;
  };
  const theme = themeFor(day.type);
  const greeting = text[getGreetingKey(clockNow.getHours())];
  const userName = appSettings.firstName?.trim() || appSettings.name?.trim().split(" ")[0] || "Atlas";
  const fullName = `${appSettings.firstName || ""} ${appSettings.lastName || ""}`.trim() || appSettings.name?.trim() || "Atlas";
  const userAvatar = appSettings.avatar || "";
  const displayDay = dayName => getDisplayDay(dayName, language);
  const displayDayShort = (dayName, fallback) => getDisplayDayShort(dayName, language, fallback);
  const weekHeaderLabels = getWeekHeaderLabels(language);
  const todayDisplayName = displayDay(weeklyMetrics.today);
  const featurePages = [
    { id: "today", title: text.todayCommand, label: "Today", accent: themeFor(weeklyMetrics.todayType).accent },
    { id: "body", title: text.bodyStatus, label: "Body", accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "score", title: text.atlasScore, label: "Score", accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "calendar", title: text.monthCalendar, label: "Calendar", accent: "#90C8FF" },
    { id: "prs", title: text.prTracker, label: "PRs", accent: "#FFD060" },
    { id: "fatigue", title: text.fatigueDeload, label: "Fatigue", accent: deloadWarning ? "#FFD060" : isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "goals", title: text.myGoals, label: "Goals", accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "progress", title: text.progressMemory, label: "Progress", accent: "#90C8FF" },
    { id: "badges", title: text.streakBadges, label: "Badges", accent: "#B8A0FF" },
    { id: "photos", title: text.progressPhotos, label: "Photos", accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "metrics", title: text.weeklyMetrics, label: "Metrics", accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "week", title: text.weekPlan, label: "Week", accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "water", title: text.waterTracking, label: "Water", accent: "#90C8FF" },
    { id: "coach", title: text.coachTitle, label: "Coach", accent: "#B8A0FF" },
  ];
  const activeFeature = featurePages.find(page => page.id === activeFeaturePage) || featurePages[0];
  const weeklySetProgress = days.reduce((sum, dayName) => (
    sum + workoutData[dayName].sessions.reduce((sessionSum, currentSession, sessionIndex) => (
      sessionSum + currentSession.exercises.reduce((exerciseSum, exercise, exerciseIndex) => {
        const key = getExerciseKey(dayName, sessionIndex, exerciseIndex);
        return exerciseSum + Math.min(Number(setProgress[key] || 0), Number(exercise.sets || 0));
      }, 0)
    ), 0)
  ), 0);
  const totalPhotoCount = progressPhotos.length;
  const latestPhoto = progressPhotos[0];
  const waterToday = waterLog[getDateKey()] || { glasses: 0, goal: 8 };
  const waterGlasses = Number(waterToday.glasses || 0);
  const waterGoalNum = Number(waterToday.goal || 8);
  const waterPct = Math.min(100, waterGoalNum > 0 ? Math.round((waterGlasses / waterGoalNum) * 100) : 0);
  const bmi = calculateBMI(profile.currentWeight, profile.height);
  const profileSex = profile.sex || "male";
  const bodyFatPct = calculateBodyFatPct(bmi, profile.age, profileSex);
  const ibwLb = calculateIBW(profile.height, profileSex);
  const leanMassLb = getLeanMass(profile.currentWeight, bodyFatPct);
  const daysToGoal = getDaysToGoal(goals.targetDate);
  const goalProgressPct = (() => {
    if (!goals.targetDate || !profile.startDate) return null;
    const start = new Date(profile.startDate + "T00:00:00");
    const target = new Date(goals.targetDate + "T00:00:00");
    const now = new Date();
    const total = target - start;
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, Math.round(((now - start) / total) * 100)));
  })();
  const homeMessage = getHomeMessage(weeklyMetrics.weeklyProgress, calendarLog, daysToGoal, language, todayDisplayName, weeklyMetrics.todayType);
  const coachTips = getCoachTips(profileSex, profile.age, bmi, bodyFatPct, goals.bodyTypeGoal || "athletic", language);
  const remainingExercises = Math.max(weeklyMetrics.totalExercises - weeklyMetrics.completedExercises, 0);
  const setCompletionPct = weeklyMetrics.totalSets > 0 ? Math.round((weeklySetProgress / weeklyMetrics.totalSets) * 100) : 0;
  const allExerciseRows = days.flatMap(dayName =>
    workoutData[dayName].sessions.flatMap((currentSession, sessionIndex) =>
      currentSession.exercises.map((exercise, exerciseIndex) => {
        const key = getExerciseKey(dayName, sessionIndex, exerciseIndex);
        const setsDone = Number(setProgress[key] || 0);
        const setsTotal = Number(exercise.sets || 0);

        return {
          key,
          dayName,
          sessionName: currentSession.name,
          exercise,
          checked: !!checked[key],
          setsDone,
          setsTotal,
          setsLeft: Math.max(setsTotal - setsDone, 0),
          note: exerciseNotes[key],
        };
      })
    )
  );
  const incompleteExerciseRows = allExerciseRows.filter(row => !row.checked).slice(0, 8);
  const heaviestExerciseRows = [...allExerciseRows]
    .map(row => ({ ...row, weightNumber: toNumber(row.exercise.weight) }))
    .sort((a, b) => b.weightNumber - a.weightNumber)
    .slice(0, 8);
  const noteRows = allExerciseRows.filter(row => row.note && (row.note.pain || row.note.difficulty || row.note.pr || row.note.technique));
  const calendarStatusCounts = calendarCells.filter(Boolean).reduce(
    (counts, cell) => {
      const status = getCalendarStatus(cell);
      return { ...counts, [status]: (counts[status] || 0) + 1 };
    },
    { completed: 0, trained: 0, missed: 0, rest: 0, planned: 0 }
  );
  const dayBreakdowns = days.map(dayName => {
    const currentDay = workoutData[dayName];
    const totalDayExercises = currentDay.sessions.reduce((sum, currentSession) => sum + currentSession.exercises.length, 0);
    const totalDaySets = currentDay.sessions.reduce(
      (sum, currentSession) => sum + currentSession.exercises.reduce((setSum, exercise) => setSum + Number(exercise.sets || 0), 0),
      0
    );
    const doneDayExercises = currentDay.sessions.reduce(
      (sum, currentSession, sessionIndex) =>
        sum + currentSession.exercises.filter((_, exerciseIndex) => checked[getExerciseKey(dayName, sessionIndex, exerciseIndex)]).length,
      0
    );
    const doneDaySets = currentDay.sessions.reduce(
      (sum, currentSession, sessionIndex) =>
        sum + currentSession.exercises.reduce((setSum, exercise, exerciseIndex) => {
          const key = getExerciseKey(dayName, sessionIndex, exerciseIndex);
          return setSum + Math.min(Number(setProgress[key] || 0), Number(exercise.sets || 0));
        }, 0),
      0
    );

    return {
      dayName,
      type: currentDay.type,
      label: currentDay.label,
      sessions: currentDay.sessions,
      totalDayExercises,
      totalDaySets,
      doneDayExercises,
      doneDaySets,
      progressPct: totalDayExercises > 0 ? Math.round((doneDayExercises / totalDayExercises) * 100) : 0,
    };
  });

  const openFeaturePage = id => {
    setActiveFeaturePage(id);
    setShowMenu(false);
    setScreen("feature");
  };

  const applyUserData = data => {
    const nextWorkoutData = data?.workoutData || cloneData(baseWorkoutData);
    const nextProfile = { ...DEFAULT_PROFILE, ...(data?.profile || {}) };
    const nextGoals = { ...DEFAULT_GOALS, ...(data?.goals || {}) };
    const nextAppSettings = withNameParts(data?.appSettings);

    setWorkoutData(nextWorkoutData);
    setChecked(data?.checked || {});
    setLastProgressionReview(data?.lastProgressionReview ?? null);
    setProfile(nextProfile);
    setGoals(nextGoals);
    setProgressLog(data?.progressLog || []);
    setExerciseNotes(data?.exerciseNotes || {});
    setCalendarLog(data?.calendarLog || {});
    setProgressPhotos(data?.progressPhotos || []);
    setPhotoAlbums(Array.isArray(data?.photoAlbums) ? data.photoAlbums : []);
    setCloudSettings({ ...DEFAULT_CLOUD_SETTINGS, ...(data?.cloudSettings || {}) });
    setNotificationSettings({
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...(data?.notificationSettings || {}),
      customReminders: Array.isArray(data?.notificationSettings?.customReminders) ? data.notificationSettings.customReminders : [],
    });
    setSetProgress(data?.setProgress || {});
    setAppSettings(nextAppSettings);
    setWaterLog(data?.waterLog || {});
    setActiveDay(getTodayDayName());
    setActiveSession(0);
    setActiveFeaturePage("today");
    setScreen("home");
  };

  const createUserDataFromSignup = draft => {
    const nextProfile = {
      ...DEFAULT_PROFILE,
      currentWeight: draft.currentWeight,
      startWeight: draft.currentWeight,
      targetWeight: draft.targetWeight,
      height: draft.height,
      startDate: draft.startDate || getDateKey(),
      sex: draft.sex || "male",
      age: draft.age || "30",
    };
    const nextGoals = {
      ...DEFAULT_GOALS,
      targetDate: draft.targetDate || DEFAULT_GOALS.targetDate,
      focusGoal: draft.focusGoal || DEFAULT_GOALS.focusGoal,
    };
    const firstName = (draft.firstName || "").trim();
    const lastName = (draft.lastName || "").trim();
    const nextAppSettings = {
      ...DEFAULT_APP_SETTINGS,
      firstName: firstName || "Atlas",
      lastName,
      name: `${firstName} ${lastName}`.trim() || "Atlas",
      language: draft.language || "en",
    };

    return {
      workoutData: draft.trainingPlan === "atlas" ? cloneData(baseWorkoutData) : createBlankWorkoutData(),
      checked: {},
      lastProgressionReview: null,
      profile: nextProfile,
      goals: nextGoals,
      progressLog: [],
      exerciseNotes: {},
      calendarLog: {},
      progressPhotos: [],
      photoAlbums: [],
      cloudSettings: cloneData(DEFAULT_CLOUD_SETTINGS),
      notificationSettings: cloneData(DEFAULT_NOTIFICATION_SETTINGS),
      setProgress: {},
      appSettings: nextAppSettings,
      waterLog: {},
    };
  };

  const handleSignup = async () => {
    const userId = signupDraft.userId.trim().toLowerCase();
    const password = signupDraft.password.trim();

    if (!userId || !password || !signupDraft.firstName.trim()) {
      setAuthError("Add your first name, a User ID, and a password.");
      return;
    }

    if (password.length < 4) {
      setAuthError("Use a password with at least 4 characters.");
      return;
    }

    if (users[userId]) {
      setAuthError("That User ID already exists. Log in instead.");
      return;
    }

    const data = createUserDataFromSignup(signupDraft);
    const salt = makeSalt();
    const passwordHash = await hashPassword(password, salt);
    const nextUser = {
      id: userId,
      userId,
      name: `${signupDraft.firstName.trim()} ${signupDraft.lastName.trim()}`.trim(),
      createdAt: new Date().toISOString(),
      passwordSalt: salt,
      passwordHash,
    };

    safeSave(STORAGE_KEYS.dataPrefix + userId, data);
    loadedUserRef.current = userId;
    setUsers(prev => ({ ...prev, [userId]: nextUser }));
    applyUserData(data);
    setActiveUserId(userId);
    setSignupDraft(DEFAULT_SIGNUP);
    setAuthError("");
  };

  const handleLogin = async () => {
    const userId = loginDraft.userId.trim().toLowerCase();
    const password = loginDraft.password.trim();
    const user = users[userId];

    if (!user) {
      setAuthError("User ID not found or password is incorrect.");
      return;
    }

    let verified = false;
    if (user.passwordHash) {
      const candidate = await hashPassword(password, user.passwordSalt || "");
      verified = candidate === user.passwordHash;
    } else if (typeof user.password === "string") {
      verified = user.password === password;
    }

    if (!verified) {
      setAuthError("User ID not found or password is incorrect.");
      return;
    }

    // Prefer the account's namespaced data; fall back to the legacy copy.
    const storedData =
      safeLoad(STORAGE_KEYS.dataPrefix + userId, null) || user.data || defaultUserData();

    // Upgrade legacy plaintext passwords to a salted hash on login.
    let registryUser = cleanRegistryEntry(user);
    if (!user.passwordHash) {
      const salt = makeSalt();
      registryUser = {
        ...registryUser,
        passwordSalt: salt,
        passwordHash: await hashPassword(password, salt),
      };
    }

    safeSave(STORAGE_KEYS.dataPrefix + userId, storedData);
    loadedUserRef.current = userId;
    setUsers(prev => ({ ...prev, [userId]: registryUser }));
    applyUserData(storedData);
    setActiveUserId(userId);
    setLoginDraft({ userId: "", password: "" });
    setAuthError("");
  };

  const handleLogout = () => {
    loadedUserRef.current = "";
    setActiveUserId("");
    applyUserData(defaultUserData());
    setShowMenu(false);
    setShowSettings(false);
    setShowReminders(false);
    setShowDataTools(false);
    setEditingExercise(null);
    setEditingCardio(null);
    setEditingNote(null);
    setEditingRoutine(null);
    setEditingProfile(null);
    setEditingGoals(null);
    setViewingPhoto(null);
    setLoginDraft({ userId: "", password: "" });
    setSignupDraft(DEFAULT_SIGNUP);
    setAuthError("");
    setAuthMode("login");
  };

  useEffect(() => {
    if (!activeUserId || !users[activeUserId] || loadedUserRef.current === activeUserId) return;

    loadedUserRef.current = activeUserId;

    const user = users[activeUserId];
    const storedData =
      safeLoad(STORAGE_KEYS.dataPrefix + activeUserId, null) || user.data || defaultUserData();

    safeSave(STORAGE_KEYS.dataPrefix + activeUserId, storedData);
    applyUserData(storedData);

    // Migrate legacy account records left in the registry.
    if (user.data || (typeof user.password === "string" && !user.passwordHash)) {
      (async () => {
        let migrated = cleanRegistryEntry(user);
        if (!user.passwordHash && typeof user.password === "string") {
          const salt = makeSalt();
          migrated = {
            ...migrated,
            passwordSalt: salt,
            passwordHash: await hashPassword(user.password, salt),
          };
        }
        setUsers(prev => (prev[activeUserId] ? { ...prev, [activeUserId]: migrated } : prev));
      })();
    }
  }, [activeUserId, users]);

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

  const rememberProgress = () => {
    const date = getDateKey();

    setProgressLog(prev => [
      {
        id: `manual-${Date.now()}`,
        type: "manual",
        date,
        recordedAt: new Date().toISOString(),
        weight: profile.currentWeight,
        targetWeight: profile.targetWeight,
        weeklyProgress: weeklyMetrics.weeklyProgress,
        completedExercises: weeklyMetrics.completedExercises,
        completedSessions: weeklyMetrics.completedSessions,
        completedDays: weeklyMetrics.completedDays,
        weekKey: getWorkoutWeekKey(),
      },
      ...prev,
    ].slice(0, 60));

    setProgressSaved(true);
    window.setTimeout(() => setProgressSaved(false), 1600);
  };

  const resetWeek = () => {
    rememberProgress();
    setChecked({});
  };

  const startRestTimer = seconds => {
    setRestTimer({
      secondsLeft: seconds,
      duration: seconds,
      running: true,
      label: session.name,
      endsAt: Date.now() + seconds * 1000,
      notified: false,
    });
  };

  const stopRestTimer = () => {
    setRestTimer(prev => ({ ...prev, secondsLeft: 0, running: false, endsAt: null, notified: false }));
  };

  const addWater = (amount = 1) => {
    const date = getDateKey();
    setWaterLog(prev => {
      const current = prev[date] || { glasses: 0, goal: 8 };
      return { ...prev, [date]: { ...current, glasses: Math.min(Number(current.goal), Number(current.glasses) + amount) } };
    });
  };

  const removeWater = (amount = 1) => {
    const date = getDateKey();
    setWaterLog(prev => {
      const current = prev[date] || { glasses: 0, goal: 8 };
      return { ...prev, [date]: { ...current, glasses: Math.max(0, Number(current.glasses) - amount) } };
    });
  };

  const setWaterGoalForToday = (goal) => {
    const date = getDateKey();
    setWaterLog(prev => {
      const current = prev[date] || { glasses: 0 };
      return { ...prev, [date]: { ...current, goal: Number(goal) } };
    });
  };

  const saveExerciseNote = note => {
    setExerciseNotes(prev => ({
      ...prev,
      [note.key]: {
        pain: note.pain,
        difficulty: note.difficulty,
        pr: note.pr,
        technique: note.technique,
        updatedAt: new Date().toISOString(),
      },
    }));
    setEditingNote(null);
  };

  const exportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      app: "Atlas Luthor",
      version: 1,
      data: {
        workoutData,
        checked,
        profile,
        goals,
        progressLog,
        exerciseNotes,
        calendarLog,
        progressPhotos,
        photoAlbums,
        cloudSettings,
        appSettings,
        notificationSettings,
        setProgress,
        lastProgressionReview,
      },
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `atlas-luthor-backup-${getDateKey()}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const importDataFile = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        const data = parsed.data || parsed;

        if (data.workoutData) setWorkoutData(data.workoutData);
        if (data.checked) setChecked(data.checked);
        if (data.profile) setProfile(data.profile);
        if (data.goals) setGoals(data.goals);
        if (data.progressLog) setProgressLog(data.progressLog);
        if (data.exerciseNotes) setExerciseNotes(data.exerciseNotes);
        if (data.calendarLog) setCalendarLog(data.calendarLog);
        if (data.progressPhotos) setProgressPhotos(data.progressPhotos);
        if (Array.isArray(data.photoAlbums)) setPhotoAlbums(data.photoAlbums);
        if (data.cloudSettings) setCloudSettings(data.cloudSettings);
        if (data.appSettings) setAppSettings(withNameParts(data.appSettings));
        if (data.notificationSettings) setNotificationSettings(data.notificationSettings);
        if (data.setProgress) setSetProgress(data.setProgress);
        if (data.lastProgressionReview !== undefined) setLastProgressionReview(data.lastProgressionReview);
        setShowDataTools(false);
      } catch {
        window.alert("That backup file could not be imported.");
      } finally {
        event.target.value = "";
      }
    };
    reader.readAsText(file);
  };

  const uploadCloudSync = async () => {
    if (!cloudSettings.endpoint) {
      setCloudSettings(prev => ({ ...prev, status: "Add an endpoint first" }));
      return;
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      app: "Atlas Luthor",
      version: 1,
      data: {
        workoutData,
        checked,
        profile,
        goals,
        progressLog,
        exerciseNotes,
        calendarLog,
        progressPhotos,
        photoAlbums,
        appSettings,
        notificationSettings,
        setProgress,
        lastProgressionReview,
      },
    };

    try {
      const response = await fetch(cloudSettings.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setCloudSettings(prev => ({ ...prev, status: response.ok ? "Uploaded" : `Upload failed ${response.status}` }));
    } catch {
      setCloudSettings(prev => ({ ...prev, status: "Upload failed" }));
    }
  };

  const downloadCloudSync = async () => {
    if (!cloudSettings.endpoint) {
      setCloudSettings(prev => ({ ...prev, status: "Add an endpoint first" }));
      return;
    }

    if (!window.confirm("Cloud download replaces your current data with the data from the endpoint. Continue?")) {
      return;
    }

    try {
      const response = await fetch(cloudSettings.endpoint);
      const parsed = await response.json();
      const data = parsed && typeof parsed === "object" ? parsed.data || parsed : {};

      if (!data || typeof data !== "object") {
        setCloudSettings(prev => ({ ...prev, status: "Download failed: invalid data" }));
        return;
      }

      if (data.workoutData) setWorkoutData(data.workoutData);
      if (data.checked) setChecked(data.checked);
      if (data.profile) setProfile(data.profile);
      if (data.goals) setGoals(data.goals);
      if (data.progressLog) setProgressLog(data.progressLog);
      if (data.exerciseNotes) setExerciseNotes(data.exerciseNotes);
      if (data.calendarLog) setCalendarLog(data.calendarLog);
      if (data.progressPhotos) setProgressPhotos(data.progressPhotos);
      if (Array.isArray(data.photoAlbums)) setPhotoAlbums(data.photoAlbums);
      if (data.appSettings) setAppSettings(withNameParts(data.appSettings));
      if (data.notificationSettings) setNotificationSettings(data.notificationSettings);
      if (data.setProgress) setSetProgress(data.setProgress);
      if (data.lastProgressionReview !== undefined) setLastProgressionReview(data.lastProgressionReview);
      setCloudSettings(prev => ({ ...prev, status: "Downloaded" }));
    } catch {
      setCloudSettings(prev => ({ ...prev, status: "Download failed" }));
    }
  };

  const saveProgressPhoto = () => {
    if (!photoDraft.dataUrl) return;

    setProgressPhotos(prev => [
      {
        id: `photo-${Date.now()}`,
        date: photoDraft.date || getDateKey(),
        weight: profile.currentWeight,
        note: photoDraft.note,
        album: photoDraft.album || "",
        dataUrl: photoDraft.dataUrl,
      },
      ...prev,
    ].slice(0, 24));
    setPhotoDraft({ date: getDateKey(), note: "", dataUrl: "", album: photoDraft.album || "" });
  };

  const deleteProgressPhoto = photoId => {
    setProgressPhotos(prev => prev.filter(photo => photo.id !== photoId));
    setViewingPhoto(prev => (prev && prev.id === photoId ? null : prev));
  };

  const addPhotoAlbum = () => {
    const name = albumDraft.trim();
    if (!name) return;

    setPhotoAlbums(prev => (prev.includes(name) ? prev : [...prev, name]));
    setAlbumDraft("");
  };

  const removePhotoAlbum = name => {
    setPhotoAlbums(prev => prev.filter(album => album !== name));
    setProgressPhotos(prev => prev.map(photo => (photo.album === name ? { ...photo, album: "" } : photo)));
    setAlbumFilter(prev => (prev === name ? "" : prev));
  };

  const updatePhotoAlbum = (photoId, album) => {
    setProgressPhotos(prev => prev.map(photo => (photo.id === photoId ? { ...photo, album } : photo)));
    setViewingPhoto(prev => (prev && prev.id === photoId ? { ...prev, album } : prev));
  };

  const handleAvatarPhoto = async event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await compressImage(file, 320, 0.82);
      setAppSettings(prev => ({ ...prev, avatar: dataUrl }));
    } catch {
      window.alert("That image could not be processed. Try a different photo.");
    }
  };

  const handleProgressPhoto = async event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const dataUrl = await compressImage(file, 1000, 0.78);
      setPhotoDraft(prev => ({ ...prev, dataUrl }));
    } catch {
      window.alert("That image could not be processed. Try a different photo.");
    }
  };

  async function sendAtlasNotification(title, body, sound = "chime") {
    playReminderSound(sound);

    if (typeof Notification === "undefined" || Notification.permission !== "granted") return;

    const options = {
      body,
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      tag: `atlas-${title.toLowerCase().replace(/\s+/g, "-")}`,
    };

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(title, options);
        return;
      }
    } catch {
      // Fall back to the page Notification API when the service worker is not ready.
    }

    try {
      new Notification(title, options);
    } catch {
      // Browsers can reject page notifications in limited PWA contexts.
    }
  }

  const requestNotifications = async () => {
    if (typeof Notification === "undefined") {
      setNotificationSettings(prev => ({ ...prev, enabled: false }));
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationSettings(prev => ({ ...prev, enabled: permission === "granted" }));
  };

  const addCustomReminder = () => {
    setNotificationSettings(prev => ({
      ...prev,
      customReminders: [
        ...(prev.customReminders || []),
        {
          id: `reminder-${Date.now()}`,
          label: reminderDraft.label || "Atlas Reminder",
          time: reminderDraft.time || "12:00",
          message: reminderDraft.message || "Stay on protocol.",
          sound: reminderDraft.sound || prev.sound || "chime",
          enabled: true,
          lastNotice: "",
        },
      ],
    }));
    setReminderDraft({ label: "Custom reminder", time: "12:00", message: "Stay on protocol.", sound: "chime" });
  };

  const updateCustomReminder = (id, patch) => {
    setNotificationSettings(prev => ({
      ...prev,
      customReminders: (prev.customReminders || []).map(reminder =>
        reminder.id === id ? { ...reminder, ...patch, lastNotice: patch.time ? "" : reminder.lastNotice } : reminder
      ),
    }));
  };

  const removeCustomReminder = id => {
    setNotificationSettings(prev => ({
      ...prev,
      customReminders: (prev.customReminders || []).filter(reminder => reminder.id !== id),
    }));
  };

  const updateRoutineExercise = (exerciseIndex, patch) => {
    const { dayName, sessionIndex } = editingRoutine;

    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.map((currentSession, currentSessionIndex) =>
          currentSessionIndex === sessionIndex
            ? {
                ...currentSession,
                exercises: currentSession.exercises.map((exercise, currentExerciseIndex) =>
                  currentExerciseIndex === exerciseIndex ? { ...exercise, ...patch } : exercise
                ),
              }
            : currentSession
        ),
      },
    }));
  };

  const addRoutineExercise = () => {
    const { dayName, sessionIndex, draft } = editingRoutine;
    const nextExercise = {
      name: draft.name || "New Exercise",
      sets: Number(draft.sets || 3),
      reps: draft.reps || 8,
      weight: draft.weight || "0 lb",
    };

    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.map((currentSession, currentSessionIndex) =>
          currentSessionIndex === sessionIndex
            ? { ...currentSession, exercises: [...currentSession.exercises, nextExercise] }
            : currentSession
        ),
      },
    }));
    setEditingRoutine(prev => ({ ...prev, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } }));
  };

  const removeRoutineExercise = exerciseIndex => {
    const { dayName, sessionIndex } = editingRoutine;

    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.map((currentSession, currentSessionIndex) =>
          currentSessionIndex === sessionIndex
            ? { ...currentSession, exercises: currentSession.exercises.filter((_, index) => index !== exerciseIndex) }
            : currentSession
        ),
      },
    }));
  };

  const updateRoutineSessionMeta = patch => {
    const { dayName, sessionIndex } = editingRoutine;

    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.map((currentSession, currentSessionIndex) =>
          currentSessionIndex === sessionIndex ? { ...currentSession, ...patch } : currentSession
        ),
      },
    }));
  };

  const addRoutineSession = () => {
    const { dayName } = editingRoutine;
    const nextIndex = workoutData[dayName].sessions.length;

    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: [...prev[dayName].sessions, { time: "PM", name: "New Session", warmup: null, exercises: [] }],
      },
    }));
    setEditingRoutine(prev => ({ ...prev, sessionIndex: nextIndex }));
  };

  const removeRoutineSession = () => {
    const { dayName, sessionIndex } = editingRoutine;

    if (workoutData[dayName].sessions.length <= 1) return;

    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.filter((_, index) => index !== sessionIndex),
      },
    }));
    setEditingRoutine(prev => ({ ...prev, sessionIndex: Math.max(0, prev.sessionIndex - 1) }));
  };

  const duplicateRoutineSession = () => {
    const { dayName, sessionIndex } = editingRoutine;

    setWorkoutData(prev => ({
      ...prev,
      [dayName]: {
        ...prev[dayName],
        sessions: prev[dayName].sessions.flatMap((currentSession, currentSessionIndex) =>
          currentSessionIndex === sessionIndex
            ? [currentSession, { ...cloneData(currentSession), name: `${currentSession.name} Copy` }]
            : [currentSession]
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
  };

  const rejectProgression = () => {
    setLastProgressionReview(new Date().toISOString());
  };

  const openWorkout = (dayName, options = {}) => {
    setActiveDay(dayName);
    setActiveSession(0);
    setTodayOnlyMode(!!options.todayOnly);
    setQuickMode(!!options.quick);
    setHighlightedExerciseIndex(0);
    setExpandedExerciseIndex(null);
    setScreen("workout");
  };

  return (
    <div className={`app-root ${isLightMode ? "light-mode" : "dark-mode"}`} style={{ minHeight: "100dvh", background: isLightMode ? "#F3F4F6" : "#0C0C10", color: isLightMode ? "#101015" : "#FFFFFF", fontFamily: "'Orbitron', monospace", paddingBottom: 80, position: "relative", overflowX: "hidden", isolation: "isolate" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; touch-action: manipulation; }
        button, .day-pill, .ex-card, .session-tab, label { -webkit-tap-highlight-color: transparent; }
        input, select, textarea { font-size: 16px; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

        .ambient-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background: #0C0C10; }
        .ambient-bg::before {
          content: "";
          position: absolute;
          inset: -42%;
          background:
            conic-gradient(from 145deg at 50% 50%, #0C0C10 0deg, rgba(24,28,35,0.95) 58deg, rgba(72,76,88,0.42) 112deg, #0C0C10 176deg, rgba(9,22,34,0.78) 252deg, rgba(80,84,94,0.34) 306deg, #0C0C10 360deg);
          filter: blur(44px);
          opacity: 0.78;
          transform: translate3d(-2%, -1%, 0) rotate(0deg) scale(1);
          animation: gradientFlow 22s ease-in-out infinite alternate;
        }
        .ambient-bg::after {
          content: "";
          position: absolute;
          inset: -12%;
          background:
            linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.05) 22%, transparent 39%, rgba(144,200,255,0.045) 58%, transparent 78%),
            linear-gradient(235deg, rgba(255,255,255,0.035), transparent 34%, rgba(255,255,255,0.028) 72%, transparent);
          background-size: 180% 180%, 160% 160%;
          opacity: 0.58;
          animation: gradientSheen 16s ease-in-out infinite alternate;
        }

        @keyframes gradientFlow {
          from { transform: translate3d(-3%, -2%, 0) rotate(0deg) scale(1); }
          to { transform: translate3d(3%, 2%, 0) rotate(16deg) scale(1.08); }
        }

        @keyframes gradientSheen {
          from { background-position: 0% 50%, 20% 30%; }
          to { background-position: 100% 50%, 80% 70%; }
        }

        .page-shell { width: 100%; position: relative; z-index: 1; }
        .app-header { display: flex; align-items: center; padding: calc(14px + env(safe-area-inset-top)) 14px 14px; border-bottom: 1px solid rgba(255,255,255,0.08); gap: 0; }
        .app-header-title { flex: 1; text-align: center; }
        .app-header-side { width: 44px; flex-shrink: 0; }
        .menu-button { width: 44px; height: 44px; border-radius: 12px; border: 1.5px solid rgba(255,255,255,0.13); background: rgba(255,255,255,0.05); backdrop-filter: blur(18px); display: flex; align-items: center; justify-content: center; gap: 4px; flex-direction: column; cursor: pointer; padding: 0; transition: background 0.2s, border-color 0.2s; }
        .menu-button:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.22); }
        .menu-button span { width: 16px; height: 1.5px; border-radius: 2px; background: #FFFFFF; display: block; transition: width 0.2s; }
        .menu-button span:first-child { width: 20px; }
        .menu-button span:last-child { width: 12px; }
        .day-pill { cursor: pointer; flex: 1; padding: 10px 4px; border-radius: 10px; text-align: center; border: 1px solid transparent; transition: all 0.2s; background: transparent; font-family: inherit; }
        .day-pill:focus-visible, .ex-card:focus-visible, .session-tab:focus-visible, .dark-btn:focus-visible, .primary-btn:focus-visible, .edit-btn:focus-visible, .menu-button:focus-visible, .album-chip:focus-visible { outline: 2px solid #90C8FF; outline-offset: 2px; }
        button, [role="button"], .day-pill, label.dark-btn { transition: transform 0.09s ease, border-color 0.2s ease, background 0.2s ease, opacity 0.2s ease; }
        button:active, [role="button"]:active, .day-pill:active, label.dark-btn:active { transform: scale(0.95); }
        @media (prefers-reduced-motion: reduce) {
          button:active, [role="button"]:active, .day-pill:active, label.dark-btn:active { transform: none; }
        }
        .session-tab { cursor: pointer; flex: 1; padding: 12px 10px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.08); background: rgba(20,20,24,0.78); backdrop-filter: blur(16px); transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #888; text-align: center; }
        .ex-card { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.075); background: rgba(19,19,24,0.82); backdrop-filter: blur(16px); cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .ex-card:hover { border-color: rgba(255,255,255,0.14); background: rgba(24,24,32,0.88); }
        .ex-card.done { opacity: 0.35; }
        .check { width: 26px; height: 26px; border-radius: 8px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; transition: all 0.2s; color: #000; font-weight: 700; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes waterWave {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(-10%) scaleY(1.1); }
          100% { transform: translateX(0) scaleY(1); }
        }

        @keyframes waterWave2 {
          0% { transform: translateX(0) scaleY(1); }
          50% { transform: translateX(8%) scaleY(1.08); }
          100% { transform: translateX(0) scaleY(1); }
        }

        @keyframes countdownPulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes msgGlow {
          0% { box-shadow: 0 0 0 0 rgba(144,200,255,0.25); }
          50% { box-shadow: 0 0 18px 4px rgba(144,200,255,0.12); }
          100% { box-shadow: 0 0 0 0 rgba(144,200,255,0.25); }
        }

        @keyframes dropIn {
          0% { transform: translateY(-6px) scale(0.8); opacity: 0; }
          70% { transform: translateY(2px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }

        @keyframes shimmerSlide {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes ringPop {
          0% { transform: scale(0.92); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes tipSlide {
          0% { transform: translateX(-8px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }

        .fade-up { animation: fadeUp 0.3s ease forwards; }
        .stat-box { flex: 1; background: rgba(20,20,24,0.78); border: 1.5px solid rgba(255,255,255,0.075); border-radius: 12px; padding: 14px 8px; text-align: center; backdrop-filter: blur(16px); }
        .home-card { background: rgba(19,19,24,0.82); border: 1.5px solid rgba(255,255,255,0.075); border-radius: 16px; padding: 16px; backdrop-filter: blur(18px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.035), 0 16px 48px rgba(0,0,0,0.22); }
        .metric-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }

        .primary-btn { width: 100%; border: 0; border-radius: 14px; padding: 15px 16px; background: #FFFFFF; color: #050507; font-family: 'Orbitron', monospace; font-weight: 900; letter-spacing: 2px; cursor: pointer; }
        .dark-btn { border: 1.5px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 12px 14px; background: rgba(20,20,24,0.8); backdrop-filter: blur(16px); color: #FFFFFF; font-family: 'DM Sans', sans-serif; font-weight: 700; cursor: pointer; }
        .edit-btn { border: 1px solid rgba(255,255,255,0.1); background: rgba(15,15,20,0.78); color: #888; border-radius: 8px; padding: 6px 8px; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 700; cursor: pointer; }
        .input { width: 100%; min-width: 0; max-width: 100%; border: 1.5px solid #282834; background: #0F0F14; color: #FFFFFF; border-radius: 12px; padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 700; outline: none; }
        input[type="date"].input, input[type="time"].input { -webkit-appearance: none; appearance: none; display: block; width: 100%; min-width: 0; max-width: 100%; min-height: 46px; overflow: hidden; }
        input[type="date"].input::-webkit-date-and-time-value, input[type="time"].input::-webkit-date-and-time-value { text-align: left; margin: 0; }
        input[type="date"].input::-webkit-datetime-edit, input[type="time"].input::-webkit-datetime-edit { padding: 0; }
        input[type="date"].input::-webkit-calendar-picker-indicator, input[type="time"].input::-webkit-calendar-picker-indicator { margin: 0; }
        .field-label { color: #8A8F99; font-family: 'DM Sans', sans-serif; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 6px; display: block; }
        .menu-section-label { color: #6E7480; font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 3px; margin: 4px 2px 2px; }
        .compact-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }
        .photo-strip { display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; padding-bottom: 4px; scroll-snap-type: x mandatory; }
        .photo-card { flex: 0 0 134px; min-width: 0; border: 1px solid #24242E; border-radius: 12px; overflow: hidden; background: #101015; scroll-snap-align: start; cursor: pointer; }
        .photo-card img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
        .photo-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
        .photo-tile { border: 1px solid #24242E; border-radius: 12px; overflow: hidden; background: #101015; cursor: pointer; min-width: 0; }
        .photo-tile img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
        .photo-body { padding: 8px 9px; }
        .photo-note { color: #EDEDED; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; line-height: 1.3; overflow-wrap: anywhere; }
        .photo-sub { color: #888; font-family: 'DM Sans', sans-serif; font-size: 10px; margin-top: 3px; line-height: 1.3; overflow-wrap: anywhere; }
        .album-chip { border: 1.5px solid rgba(255,255,255,0.12); background: rgba(20,20,24,0.8); color: #CFCFD6; border-radius: 999px; padding: 7px 12px; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; }
        .album-chip.active { background: #FFFFFF; color: #050507; border-color: #FFFFFF; }
        .settings-grid { display: grid; gap: 10px; }
        .setting-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; border: 1px solid #24242E; border-radius: 12px; padding: 12px; background: #101015; }
        .setting-title { color: #FFFFFF; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 800; min-width: 0; overflow-wrap: anywhere; }
        .setting-sub { color: #9CA1AC; font-family: 'DM Sans', sans-serif; font-size: 12px; line-height: 1.4; margin-top: 3px; min-width: 0; overflow-wrap: anywhere; }
        .feature-page { padding: 20px; }
        .feature-hero { background: rgba(19,19,24,0.86); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; backdrop-filter: blur(18px); margin-bottom: 14px; }
        .feature-title { font-size: 25px; color: #FFFFFF; font-weight: 900; font-family: 'Orbitron', monospace; letter-spacing: 2px; line-height: 1.05; margin-top: 8px; }
        .feature-copy { color: #9CA1AC; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.55; margin-top: 10px; }
        .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .detail-card { border: 1px solid #24242E; background: #101015; border-radius: 12px; padding: 12px; min-width: 0; }
        .detail-label { color: #8C92A0; font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 2px; margin-bottom: 5px; }
        .detail-value { color: #FFFFFF; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 900; overflow-wrap: anywhere; }
        .detail-list { display: grid; gap: 10px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid #24242E; background: #101015; border-radius: 12px; padding: 12px; font-family: 'DM Sans', sans-serif; min-width: 0; }
        .detail-row-main { color: #FFFFFF; font-size: 14px; font-weight: 900; min-width: 0; overflow-wrap: anywhere; }
        .detail-row-sub { color: #9CA1AC; font-size: 12px; line-height: 1.35; margin-top: 3px; min-width: 0; overflow-wrap: anywhere; }

        .light-mode .ambient-bg { background: #F3F4F6; }
        .light-mode .ambient-bg::before {
          background: conic-gradient(from 145deg at 50% 50%, #F5F6F8 0deg, rgba(255,255,255,0.96) 66deg, rgba(176,186,202,0.38) 126deg, #EEF0F4 186deg, rgba(168,188,214,0.34) 252deg, rgba(255,255,255,0.82) 320deg, #F5F6F8 360deg);
          opacity: 0.88;
        }
        .light-mode .ambient-bg::after {
          background:
            linear-gradient(120deg, transparent 0%, rgba(12,12,16,0.045) 22%, transparent 39%, rgba(88,153,204,0.08) 58%, transparent 78%),
            linear-gradient(235deg, rgba(255,255,255,0.45), transparent 34%, rgba(12,12,16,0.035) 72%, transparent);
        }
        .light-mode .app-header,
        .light-mode .home-card,
        .light-mode .stat-box,
        .light-mode .session-tab,
        .light-mode .ex-card,
        .light-mode .feature-hero,
        .light-mode .detail-card,
        .light-mode .detail-row,
        .light-mode .setting-row,
        .light-mode .photo-card,
        .light-mode .photo-tile,
        .light-mode .modal {
          background: rgba(255,255,255,0.92) !important;
          border-color: rgba(15,18,26,0.12) !important;
          box-shadow: 0 16px 44px rgba(20,24,36,0.08);
        }
        .light-mode .dark-btn,
        .light-mode .edit-btn,
        .light-mode .input,
        .light-mode .menu-button {
          background: rgba(255,255,255,0.78) !important;
          border-color: rgba(15,18,26,0.14) !important;
          color: #101015 !important;
        }
        .light-mode .primary-btn {
          background: #101015 !important;
          color: #FFFFFF !important;
        }
        .light-mode p,
        .light-mode h1,
        .light-mode h2,
        .light-mode h3,
        .light-mode span,
        .light-mode .detail-value,
        .light-mode .detail-row-main,
        .light-mode .setting-title {
          color: #101015 !important;
        }
        .light-mode .detail-label,
        .light-mode .detail-row-sub,
        .light-mode .setting-sub,
        .light-mode .photo-sub {
          color: #5A6270 !important;
        }
        .light-mode .photo-note { color: #101015 !important; }
        .light-mode .album-chip {
          background: rgba(255,255,255,0.78);
          border-color: rgba(15,18,26,0.16);
          color: #101015;
        }
        .light-mode .album-chip.active {
          background: #101015;
          color: #FFFFFF;
          border-color: #101015;
        }
        .light-mode .menu-button span {
          background: #101015;
        }
        .light-mode [style*="#101015"],
        .light-mode [style*="#0F0F14"],
        .light-mode [style*="#111115"],
        .light-mode [style*="#15151B"],
        .light-mode [style*="#151207"],
        .light-mode [style*="#1A1A22"],
        .light-mode [style*="#20202A"],
        .light-mode [style*="#24242E"],
        .light-mode [style*="rgb(16, 16, 21)"],
        .light-mode [style*="rgb(15, 15, 20)"],
        .light-mode [style*="rgb(17, 17, 21)"],
        .light-mode [style*="rgb(21, 18, 7)"],
        .light-mode [style*="rgb(26, 26, 34)"],
        .light-mode [style*="rgb(30, 30, 38)"] {
          background: rgba(255,255,255,0.92) !important;
          border-color: rgba(15,18,26,0.13) !important;
        }
        .light-mode .industry-mark,
        .light-mode .field-label,
        .light-mode .menu-section-label,
        .light-mode .detail-label { color: #5A6270 !important; }
        .light-mode img + p,
        .light-mode button span,
        .light-mode [style*="#101015"] p,
        .light-mode [style*="#101015"] span,
        .light-mode [style*="rgb(16, 16, 21)"] p,
        .light-mode [style*="rgb(16, 16, 21)"] span {
          color: #101015 !important;
        }

        .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.78); z-index: 20; display: flex; align-items: flex-end; justify-content: center; padding: 16px; }
        .modal { width: 100%; max-width: 520px; max-height: 82vh; overflow: auto; background: #101015; border: 1.5px solid #2A2A34; border-radius: 22px; padding: 18px; box-shadow: 0 20px 80px rgba(0,0,0,0.4); }

        @media (min-width: 760px) {
          .page-shell { max-width: 720px; margin: 0 auto; }
          .metric-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .modal-backdrop { align-items: center; }
        }

        @media (max-width: 430px) {
          .app-header { padding-left: 16px; padding-right: 16px; }
          .compact-actions { grid-template-columns: 1fr; }
          .home-card { padding: 14px; }
          .modal { border-radius: 18px; padding: 16px; }
          .setting-row { grid-template-columns: 1fr; }
          .feature-page { padding: 16px; }
          .detail-grid { grid-template-columns: 1fr; }
          .detail-row { align-items: flex-start; flex-direction: column; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ambient-bg::before,
          .ambient-bg::after,
          .fade-up {
            animation: none;
          }
        }
      `}</style>

      <div className="ambient-bg" aria-hidden="true" />

      <div className="page-shell">
        <div className="app-header">
          <div className="app-header-side" />
          <div className="app-header-title">
            <h1 style={{ fontSize: 22, fontWeight: 900, letterSpacing: 4, lineHeight: 1, fontFamily: "'Orbitron', monospace" }}>
              <span style={{ color: isLightMode ? "#101015" : "#FFFFFF" }}>ATLAS</span>{" "}
              <span style={{ color: "#90C8FF" }}>LUTHOR</span>
            </h1>
          </div>
          <div className="app-header-side" style={{ display: "flex", justifyContent: "flex-end" }}>
            {activeUserId && (
              <button className="menu-button" type="button" aria-label="Open settings menu" onClick={() => setShowMenu(true)}>
                <span />
                <span />
                <span />
              </button>
            )}
          </div>
        </div>

        {!activeUserId && authMode === "landing" && (
          <div className="fade-up feature-page">
            <div className="feature-hero">
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>
                {language === "es" ? "BIENVENIDO A ATLAS LUTHOR" : "WELCOME TO ATLAS LUTHOR"}
              </p>
              <h2 className="feature-title">{language === "es" ? "Entrena con Propósito" : "Train With Purpose"}</h2>
              <p className="feature-copy">
                {language === "es"
                  ? "Atlas Luthor convierte tu entrenamiento en una misión diaria clara. Sigue un plan estructurado, registra cada serie y mira crecer tu fuerza, tu cuerpo y tu constancia semana tras semana."
                  : "Atlas Luthor turns your training into a clear daily mission. Follow a structured plan, log every set, and watch your strength, body, and consistency climb week after week."}
              </p>
              <p className="feature-copy" style={{ marginTop: 8, fontWeight: 700 }}>
                {language === "es"
                  ? "Crea tu perfil gratis y empieza tu primera sesión hoy."
                  : "Create your free profile and start your first session today."}
              </p>
            </div>

            <div className="home-card" style={{ marginBottom: 14, display: "grid", gap: 14 }}>
              {(language === "es"
                ? [
                    { title: "Arma tu rutina", copy: "Empieza con el protocolo Push/Pull/Legs de Atlas o crea tu propia división, y edítala cuando quieras." },
                    { title: "Registra cada entreno", copy: "Marca series, usa el temporizador de descanso, agrega notas y marca récords mientras entrenas." },
                    { title: "Mira tu progreso", copy: "Calendario mensual, métricas semanales, estado corporal, fotos de progreso y un Puntaje Atlas en vivo." },
                  ]
                : [
                    { title: "Build your routine", copy: "Start with the Atlas Push/Pull/Legs protocol or create your own split, then edit it any time." },
                    { title: "Track every workout", copy: "Check off sets, run rest timers, add notes, and mark personal records as you train." },
                    { title: "See your progress", copy: "Month calendar, weekly metrics, body status, progress photos, and a live Atlas Score." },
                  ]
              ).map(item => (
                <div key={item.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ width: 9, height: 9, borderRadius: 999, background: "#90C8FF", marginTop: 6, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{item.title}</p>
                    <p style={{ fontSize: 13, color: "#888", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, marginTop: 3 }}>{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="home-card" style={{ display: "grid", gap: 10 }}>
              <button className="primary-btn" onClick={() => { setAuthMode("signup"); setAuthError(""); }}>{language === "es" ? "EMPEZAR" : "GET STARTED"}</button>
              <button className="dark-btn" onClick={() => { setAuthMode("login"); setAuthError(""); }}>{language === "es" ? "Ya tengo una cuenta" : "I already have an account"}</button>
            </div>
          </div>
        )}

        {!activeUserId && authMode !== "landing" && (
          <div className="fade-up feature-page">
            <button className="dark-btn" onClick={() => { setAuthMode("landing"); setAuthError(""); }} style={{ marginBottom: 14 }}>
              {language === "es" ? "Atrás" : "Back"}
            </button>

            <div className="feature-hero">
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>
                {authMode === "signup"
                  ? (language === "es" ? "CREAR PERFIL" : "CREATE PROFILE")
                  : (language === "es" ? "BIENVENIDO DE VUELTA" : "WELCOME BACK")}
              </p>
              <h2 className="feature-title">
                {authMode === "signup"
                  ? (language === "es" ? "Registrarse" : "Sign Up")
                  : (language === "es" ? "Iniciar sesión" : "Login")}
              </h2>
              <p className="feature-copy">
                {authMode === "signup"
                  ? (language === "es"
                    ? "Crea un perfil Atlas local para que tus entrenamientos, metas, estado corporal, fotos, notas, idioma y tema queden ligados a ti."
                    : "Create a local Atlas profile so your workout data, goals, body status, photos, notes, language, and theme stay tied to you.")
                  : (language === "es"
                    ? "Vuelve a entrar a tu perfil Atlas local y continúa desde tu propio estado del protocolo."
                    : "Log back into your local Atlas profile and continue from your own protocol state.")}
              </p>
            </div>

            {authError && (
              <div className="home-card" style={{ marginBottom: 14, borderColor: "#FFD06066" }}>
                <p style={{ color: "#FFD060", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800 }}>{authError}</p>
              </div>
            )}

            {authMode === "login" ? (
              <div className="home-card" style={{ display: "grid", gap: 12 }}>
                <label style={{ display: "block" }}>
                  <span className="field-label">{language === "es" ? "USUARIO" : "USER ID"}</span>
                  <input className="input" value={loginDraft.userId} onChange={event => setLoginDraft(prev => ({ ...prev, userId: event.target.value }))} placeholder={language === "es" ? "Usuario" : "User ID"} />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{language === "es" ? "CONTRASEÑA" : "PASSWORD"}</span>
                  <input className="input" type="password" value={loginDraft.password} onChange={event => setLoginDraft(prev => ({ ...prev, password: event.target.value }))} placeholder={language === "es" ? "Contraseña" : "Password"} />
                </label>
                <button className="primary-btn" onClick={handleLogin}>{language === "es" ? "ENTRAR" : "LOGIN"}</button>
                <button className="dark-btn" onClick={() => { setAuthMode("signup"); setAuthError(""); }}>{language === "es" ? "Crear cuenta nueva" : "Create new account"}</button>
              </div>
            ) : (
              <div className="home-card" style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <label style={{ display: "block" }}>
                    <span className="field-label">{signupDraft.language === "es" ? "NOMBRE" : "FIRST NAME"}</span>
                    <input className="input" value={signupDraft.firstName} onChange={event => setSignupDraft(prev => ({ ...prev, firstName: event.target.value }))} placeholder={signupDraft.language === "es" ? "Nombre" : "First name"} />
                  </label>
                  <label style={{ display: "block" }}>
                    <span className="field-label">{signupDraft.language === "es" ? "APELLIDO" : "LAST NAME"}</span>
                    <input className="input" value={signupDraft.lastName} onChange={event => setSignupDraft(prev => ({ ...prev, lastName: event.target.value }))} placeholder={signupDraft.language === "es" ? "Apellido" : "Last name"} />
                  </label>
                </div>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "USUARIO" : "USER ID"}</span>
                  <input className="input" value={signupDraft.userId} onChange={event => setSignupDraft(prev => ({ ...prev, userId: event.target.value }))} placeholder={signupDraft.language === "es" ? "Elige un usuario" : "Choose a User ID"} />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "CONTRASEÑA" : "PASSWORD"}</span>
                  <input className="input" type="password" value={signupDraft.password} onChange={event => setSignupDraft(prev => ({ ...prev, password: event.target.value }))} placeholder={signupDraft.language === "es" ? "Elige una contraseña" : "Choose a password"} />
                </label>

                <div style={{ border: "1.5px solid #90C8FF55", borderRadius: 14, padding: 12, display: "grid", gap: 8 }}>
                  <span className="field-label" style={{ color: "#90C8FF" }}>{signupDraft.language === "es" ? "ELIGE TU RUTINA INICIAL" : "CHOOSE YOUR STARTING ROUTINE"}</span>
                  {TRAINING_PLAN_OPTIONS.map(option => {
                    const selected = signupDraft.trainingPlan === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className="dark-btn"
                        onClick={() => setSignupDraft(prev => ({ ...prev, trainingPlan: option.value }))}
                        style={{ textAlign: "left", boxShadow: selected ? "0 0 0 2px #90C8FF" : "none" }}
                      >
                        <span style={{ display: "block", fontWeight: 800 }}>
                          {signupDraft.language === "es"
                            ? (option.value === "atlas" ? "Usar el protocolo Atlas" : "Empezar con rutina vacía")
                            : option.label}
                        </span>
                        <span style={{ display: "block", fontSize: 12, color: "#888", marginTop: 3, fontWeight: 500 }}>
                          {signupDraft.language === "es"
                            ? (option.value === "atlas"
                              ? "División Push / Pull / Legs precargada, lista para entrenar hoy."
                              : "Semana vacía. Agrega tus propios ejercicios después de registrarte.")
                            : (option.value === "atlas"
                              ? "Pre-loaded Push / Pull / Legs split, ready to train today."
                              : "Empty week. Add your own exercises after sign up.")}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <label style={{ display: "block" }}>
                    <span className="field-label">{signupDraft.language === "es" ? "SEXO" : "SEX"}</span>
                    <select className="input" value={signupDraft.sex} onChange={event => setSignupDraft(prev => ({ ...prev, sex: event.target.value }))}>
                      {GENDER_OPTIONS.map(option => <option key={option.value} value={option.value}>{signupDraft.language === "es" ? (option.value === "male" ? "Hombre" : "Mujer") : option.label}</option>)}
                    </select>
                  </label>
                  <label style={{ display: "block" }}>
                    <span className="field-label">{signupDraft.language === "es" ? "EDAD" : "AGE"}</span>
                    <select className="input" value={signupDraft.age} onChange={event => setSignupDraft(prev => ({ ...prev, age: event.target.value }))}>
                      {AGE_OPTIONS.map(option => <option key={option} value={option}>{option} {signupDraft.language === "es" ? "años" : "yrs"}</option>)}
                    </select>
                  </label>
                </div>

                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "PESO ACTUAL" : "CURRENT WEIGHT"}</span>
                  <select className="input" value={signupDraft.currentWeight} onChange={event => setSignupDraft(prev => ({ ...prev, currentWeight: event.target.value }))}>
                    {BODY_WEIGHT_OPTIONS.map(option => <option key={option} value={option}>{option} LB</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "PESO META" : "TARGET WEIGHT"}</span>
                  <select className="input" value={signupDraft.targetWeight} onChange={event => setSignupDraft(prev => ({ ...prev, targetWeight: event.target.value }))}>
                    {BODY_WEIGHT_OPTIONS.map(option => <option key={option} value={option}>{option} LB</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "ALTURA" : "HEIGHT"}</span>
                  <select className="input" value={signupDraft.height} onChange={event => setSignupDraft(prev => ({ ...prev, height: event.target.value }))}>
                    {HEIGHT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "FECHA DE INICIO" : "START DATE"}</span>
                  <input className="input" type="date" value={signupDraft.startDate} onChange={event => setSignupDraft(prev => ({ ...prev, startDate: event.target.value }))} />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "FECHA META" : "TARGET DATE"}</span>
                  <input className="input" type="date" value={signupDraft.targetDate} onChange={event => setSignupDraft(prev => ({ ...prev, targetDate: event.target.value }))} />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "META PRINCIPAL" : "MAIN GOAL"}</span>
                  <input className="input" value={signupDraft.focusGoal} onChange={event => setSignupDraft(prev => ({ ...prev, focusGoal: event.target.value }))} placeholder={signupDraft.language === "es" ? "Meta principal" : "Main goal"} />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{signupDraft.language === "es" ? "IDIOMA" : "LANGUAGE"}</span>
                  <select className="input" value={signupDraft.language} onChange={event => setSignupDraft(prev => ({ ...prev, language: event.target.value }))}>
                    {LANGUAGE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <button className="primary-btn" onClick={handleSignup}>{signupDraft.language === "es" ? "REGISTRARSE" : "SIGN UP"}</button>
                <button className="dark-btn" onClick={() => { setAuthMode("login"); setAuthError(""); }}>{signupDraft.language === "es" ? "Ya tengo una cuenta" : "I already have an account"}</button>
              </div>
            )}
          </div>
        )}

        {activeUserId && screen === "home" && (
          <div className="fade-up" style={{ padding: "20px" }}>
            {storageFull && (
              <div className="home-card" style={{ marginBottom: 14, borderColor: "#E5604D88", background: isLightMode ? "#FBEAE8" : "#1C0D0A" }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: "#E5604D", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                  {language === "es" ? "ALMACENAMIENTO LLENO" : "STORAGE FULL"}
                </p>
                <p style={{ color: isLightMode ? "#7A2A20" : "#E59A8E", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                  {language === "es"
                    ? "El almacenamiento de este dispositivo está lleno y no se pudieron guardar los cambios recientes. Exporta un respaldo y elimina algunas fotos de progreso para liberar espacio."
                    : "This device's storage is full, so recent changes could not be saved. Export a backup, then remove some progress photos to free space."}
                </p>
              </div>
            )}
            <div className="feature-hero" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <button
                  type="button"
                  aria-label="Open settings"
                  onClick={() => { setShowMenu(false); setShowSettings(true); }}
                  style={{ width: 58, height: 58, borderRadius: 999, overflow: "hidden", padding: 0, border: `2px solid ${themeFor(weeklyMetrics.todayType).accent}`, background: isLightMode ? "#E9EAEE" : "#101015", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  {userAvatar
                    ? <img src={userAvatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: "#888" }}>{userName.slice(0, 1).toUpperCase()}</span>}
                </button>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace" }}>
                    {language === "es"
                      ? ({ dark: "MODO OSCURO", light: "MODO CLARO", auto: "MODO AUTO" }[activeThemeMode] || "MODO")
                      : `${activeThemeMode.toUpperCase()} MODE`}
                  </p>
                  <h2 className="feature-title" style={{ marginTop: 4 }}>
                    {greeting}, {userName}
                  </h2>
                </div>
              </div>
              <div style={{ marginTop: 8, padding: "11px 14px", borderRadius: 12, background: isLightMode ? "rgba(144,200,255,0.12)" : "rgba(144,200,255,0.07)", border: "1px solid rgba(144,200,255,0.22)", animation: "msgGlow 3s ease-in-out infinite" }}>
                <p style={{ color: isLightMode ? "#1A3A5C" : "#B8D8FF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
                  {homeMessage}
                </p>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14, borderColor: "#2A2A34" }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                {text.today} - {displayDayShort(weeklyMetrics.today, weeklyMetrics.todayLabel)} / {weeklyMetrics.todayType}
              </p>

              <h2 style={{ fontSize: 25, fontFamily: "'Orbitron', monospace", letterSpacing: 2, marginBottom: 8 }}>
                {todayDisplayName}
              </h2>

              <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                {text.weeklyProgressIs} <span style={{ color: isLightMode ? "#101015" : "#FFFFFF", fontWeight: 800 }}>{weeklyMetrics.weeklyProgress}%</span>. {text.keepMoving}
              </p>

              <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
                {text.startToday}
              </button>
            </div>

            {typeof daysToGoal === "number" && (() => {
              const cdColor = daysToGoal <= 0 ? "#3FB98A" : daysToGoal <= 7 ? "#FFD060" : daysToGoal <= 30 ? "#90C8FF" : "#B8A0FF";
              const cdBg = daysToGoal <= 7 ? (isLightMode ? "#FEFAE8" : "#1A1400") : daysToGoal <= 30 ? (isLightMode ? "#EAF4FF" : "#0A1520") : undefined;
              const cdBorder = daysToGoal <= 0 ? "#3FB98A66" : daysToGoal <= 7 ? "#FFD06066" : daysToGoal <= 30 ? "#90C8FF44" : "#B8A0FF33";
              const pct = goalProgressPct ?? 0;
              const R = 42, circ = 2 * Math.PI * R;
              const offset = circ * (1 - pct / 100);
              return (
                <div className="home-card" style={{ marginBottom: 14, borderColor: cdBorder, background: cdBg, overflow: "hidden", animation: daysToGoal <= 7 ? "ringPop 0.5s ease" : undefined }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: cdColor, fontFamily: "'Orbitron', monospace", marginBottom: 12 }}>
                    {text.countdownTitle.toUpperCase()}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ position: "relative", flexShrink: 0, width: 96, height: 96 }}>
                      <svg width="96" height="96" viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="50" cy="50" r={R} fill="none" stroke={isLightMode ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)"} strokeWidth="6" />
                        <circle
                          cx="50" cy="50" r={R} fill="none"
                          stroke={cdColor} strokeWidth="6"
                          strokeDasharray={circ} strokeDashoffset={offset}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 6px ${cdColor}88)` }}
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: daysToGoal >= 100 ? 22 : 28, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: cdColor, lineHeight: 1, animation: daysToGoal <= 7 && daysToGoal > 0 ? "countdownPulse 2s ease-in-out infinite" : "none" }}>
                          {daysToGoal}
                        </span>
                        <span style={{ fontSize: 7, letterSpacing: 2, color: cdColor, fontFamily: "'Orbitron', monospace", marginTop: 2, opacity: 0.8 }}>
                          {text.daysLeft}
                        </span>
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ color: isLightMode ? "#101015" : "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 800, lineHeight: 1.4, marginBottom: 6 }}>
                        {goals.focusGoal}
                      </p>
                      <div style={{ width: "100%", height: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${cdColor}99, ${cdColor})`, borderRadius: 4, transition: "width 1s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 6px ${cdColor}88` }} />
                      </div>
                      <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginBottom: 4 }}>
                        {pct}% {language === "es" ? "del camino recorrido" : "of journey complete"} · {language === "es" ? "Meta:" : "Target:"} {goals.targetDate}
                      </p>
                      {daysToGoal <= 0 && (
                        <p style={{ color: "#3FB98A", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 900, letterSpacing: 1 }}>
                          {language === "es" ? "¡Meta alcanzada!" : "Goal reached!"}
                        </p>
                      )}
                      {daysToGoal <= 7 && daysToGoal > 0 && (
                        <p style={{ color: "#FFD060", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 900, letterSpacing: 1 }}>
                          {text.finalStretch}
                        </p>
                      )}
                      {daysToGoal > 7 && daysToGoal <= 30 && (
                        <p style={{ color: "#90C8FF", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800 }}>
                          {text.almostThere}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="home-card" style={{ marginBottom: 14, borderColor: waterPct >= 100 ? "#3FB98A44" : "#90C8FF22" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: waterPct >= 100 ? "#3FB98A" : "#90C8FF", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
                    {text.waterToday.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: waterPct >= 100 ? "#3FB98A" : "#90C8FF", lineHeight: 1 }}>
                    {waterGlasses}<span style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>/{waterGoalNum}</span>
                    <span style={{ fontSize: 11, color: "#666", fontWeight: 500, marginLeft: 4 }}>{text.glasses}</span>
                  </p>
                </div>
                <button className="edit-btn" onClick={() => openFeaturePage("water")} style={{ color: "#90C8FF", padding: "7px 12px" }}>
                  {language === "es" ? "Ver todo" : "Full view"} →
                </button>
              </div>
              <div style={{ display: "flex", gap: 5, marginBottom: 10, flexWrap: "wrap" }}>
                {Array.from({ length: waterGoalNum }).map((_, gi) => {
                  const filled = gi < waterGlasses;
                  return (
                    <div
                      key={gi}
                      onClick={() => filled ? removeWater() : addWater()}
                      style={{ width: `calc((100% - ${(waterGoalNum - 1) * 5}px) / ${waterGoalNum})`, minWidth: 18, height: 28, borderRadius: 6, background: filled ? (waterPct >= 100 ? "linear-gradient(180deg,#3FB98A,#1E7A56)" : "linear-gradient(180deg,#55AAEE,#1E6FAA)") : (isLightMode ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)"), border: `1px solid ${filled ? (waterPct >= 100 ? "#3FB98A66" : "#90C8FF44") : (isLightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)")}`, cursor: "pointer", transition: "all 0.25s ease", animation: filled && gi === waterGlasses - 1 ? "dropIn 0.35s ease" : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}
                    >
                      {filled ? <span style={{ opacity: 0.7 }}>💧</span> : null}
                    </div>
                  );
                })}
              </div>
              <div style={{ width: "100%", height: 8, borderRadius: 8, overflow: "hidden", background: isLightMode ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)", marginBottom: 10 }}>
                <div style={{ height: "100%", width: `${waterPct}%`, background: waterPct >= 100 ? "linear-gradient(90deg,#3FB98A,#6DD5A8)" : "linear-gradient(90deg,#1E6FAA,#55AAEE)", borderRadius: 8, transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)", boxShadow: `0 0 8px ${waterPct >= 100 ? "#3FB98A" : "#55AAEE"}66` }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="dark-btn" onClick={() => removeWater()} style={{ color: "#8A8F99", fontSize: 15 }}>
                  − {text.glassWord}
                </button>
                <button className="dark-btn" onClick={() => addWater()} style={{ color: waterPct >= 100 ? "#3FB98A" : "#90C8FF", fontSize: 15, borderColor: waterPct >= 100 ? "#3FB98A33" : "#90C8FF33" }}>
                  + {text.glassWord}
                </button>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    {text.bodyStatus.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 28, color: "#FFFFFF", fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
                    {profile.currentWeight} LB
                  </p>
                </div>

                <button className="edit-btn" onClick={() => setEditingProfile({ ...profile })}>
                  {text.edit}
                </button>
              </div>

              <div className="metric-grid">
                {[
                  { label: text.start, val: `${profile.startWeight} LB` },
                  { label: text.target, val: `${profile.targetWeight} LB` },
                  { label: text.change, val: `${signedNumber(weightChange)} LB` },
                  { label: text.toGoal, val: `${signedNumber(weightToGoal)} LB` },
                ].map(metric => (
                  <div key={metric.label} className="stat-box">
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                      {metric.val}
                    </p>
                    <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.atlasScore.toUpperCase()}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 92, height: 92, borderRadius: "50%", border: `8px solid ${isLightMode ? "#101015" : "#FFFFFF"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isLightMode ? "0 0 18px rgba(20,24,36,0.12)" : "0 0 24px rgba(255,255,255,0.12)" }}>
                  <span style={{ fontSize: 25, fontWeight: 900, fontFamily: "'Orbitron', monospace" }}>{atlasScore}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 800 }}>
                    {deloadWarning ? text.deloadActive : text.protocolStable}
                  </p>
                  <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
                    {text.avgRpe} {averageRpe || "N/A"} · PRs {prEntries.length} · {text.streak} {weeklyStreak}
                  </p>
                </div>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.monthCalendar.toUpperCase()}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6, marginBottom: 10 }}>
                {weekHeaderLabels.map((label, index) => (
                  <p key={`${label}-${index}`} style={{ color: "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
                ))}
                {calendarCells.map((cell, index) => {
                  if (!cell) return <div key={`blank-${index}`} />;

                  const todayKey = getDateKey();
                  const isToday = cell.key === todayKey;
                  const status = getCalendarStatus(cell);
                  const visual = getCalendarVisual(status, isLightMode);

                  return (
                    <div key={cell.key} title={`${cell.key} - ${status}`} style={{ aspectRatio: "1", borderRadius: 8, background: visual.bg, color: visual.fg, border: isToday ? `2px solid ${isLightMode ? "#101015" : "#FFFFFF"}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                      {cell.dayNumber}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {["completed", "trained", "missed", "rest"].map(status => {
                  const visual = getCalendarVisual(status, isLightMode);
                  return (
                    <span key={status} style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>
                      <span style={{ width: 11, height: 11, borderRadius: 3, background: visual.bg, display: "inline-block" }} />
                      {calendarLabels[status]}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.prTracker.toUpperCase()}
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {(prEntries.length ? prEntries.slice(0, 5) : [{ key: "empty", exerciseName: text.noPrsYet, sessionName: text.markPrHint, weight: "", date: "" }]).map(entry => (
                  <div key={entry.key} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: "#101015", border: "1px solid #24242E", borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 800 }}>{entry.exerciseName}</span>
                    <span style={{ color: "#888", fontSize: 12, fontWeight: 700 }}>{entry.weight} {entry.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14, borderColor: deloadWarning ? "#FFD06066" : "rgba(255,255,255,0.075)" }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: deloadWarning ? "#FFD060" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                {text.fatigueDeload.toUpperCase()}
              </p>
              <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 800 }}>
                {text.averageRpe} {averageRpe || text.noRpeNotes}
              </p>
              <p style={{ color: deloadWarning ? "#FFD060" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
                {deloadWarning ? text.deloadAdvice : text.noDeloadSignal}
              </p>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    {text.myGoals.toUpperCase()}
                  </p>
                  <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 700 }}>
                    {goals.focusGoal}
                  </p>
                </div>

                <button className="edit-btn" onClick={() => setEditingGoals({ ...goals })}>
                  {text.set}
                </button>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { label: text.weeklyProtocol, current: `${weeklyMetrics.weeklyProgress}%`, target: `${goals.weeklyProgressGoal}%`, pct: weeklyGoalPct },
                  { label: text.completedSessions, current: weeklyMetrics.completedSessions, target: goals.weeklySessionsGoal, pct: sessionsGoalPct },
                ].map(goal => (
                  <div key={goal.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: "#777", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
                      <span>{goal.label}</span>
                      <span>{goal.current} / {goal.target}</span>
                    </div>
                    <div style={{ height: 5, background: isLightMode ? "#E2E4E9" : "#1E1E26", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ width: `${goal.pct}%`, height: "100%", background: isLightMode ? "#101015" : "#FFFFFF", borderRadius: 5, transition: "width 0.3s ease" }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    {text.progressMemory.toUpperCase()}
                  </p>
                  <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                    {latestProgress
                      ? `${text.lastSaved} ${latestProgress.date}: ${latestProgress.weight} LB, ${latestProgress.weeklyProgress}%`
                      : text.noProgressSaved}
                  </p>
                </div>

                <button className="edit-btn" onClick={rememberProgress}>
                  {text.save}
                </button>
              </div>

              {progressSaved && (
                <p style={{ color: "#90C8FF", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                  {text.progressSavedMsg}
                </p>
              )}

              <div style={{ display: "grid", gap: 8 }}>
                {progressEntries.slice(0, 3).map(entry => (
                  <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: "#101015", border: "1px solid #20202A", borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: "#888", fontSize: 12, fontWeight: 700 }}>
                      {entry.date} {entry.type === "manual" ? text.savedTag : text.autoTag}
                    </span>
                    <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 800 }}>
                      {entry.weight} LB · {entry.completedExercises} {text.exercisesWord}
                    </span>
                  </div>
                ))}
              </div>

              {chartEntries.length > 0 && (
                <div style={{ display: "flex", alignItems: "end", gap: 8, height: 92, marginTop: 14, padding: "10px 8px", borderRadius: 12, border: "1px solid #20202A", background: isLightMode ? "rgba(20,24,36,0.05)" : "rgba(10,10,14,0.55)" }}>
                  {chartEntries.map(entry => {
                    const range = Math.max(maxChartWeight - minChartWeight, 1);
                    const height = 24 + ((entry.weightNumber - minChartWeight) / range) * 48;

                    return (
                      <div key={`${entry.id}-bar`} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                        <div title={`${entry.weight} LB`} style={{ height, borderRadius: "8px 8px 3px 3px", background: isLightMode ? "linear-gradient(180deg, #3A3F49, #9AA0AC)" : "linear-gradient(180deg, #FFFFFF, #777B86)", boxShadow: isLightMode ? "none" : "0 0 22px rgba(255,255,255,0.14)" }} />
                        <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 9, marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {entry.weight}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginTop: 12 }}>
                <button className="dark-btn" onClick={() => setShowDataTools(true)}>
                  {text.backup}
                </button>
                <button className="dark-btn" onClick={resetWeek}>
                  {text.resetWeek}
                </button>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.streakBadges.toUpperCase()}
              </p>
              <div className="metric-grid" style={{ marginBottom: 12 }}>
                <div className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {weeklyStreak}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {text.weekStreak}
                  </p>
                </div>
                <div className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {weeklyMetrics.completedDays}/7
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {text.daysClear}
                  </p>
                </div>
                <div className="stat-box">
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {currentWeekKey.slice(5)}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {text.weekOf}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(earnedBadges.length ? earnedBadges : [text.protocolStarted]).map(badge => (
                  <span key={badge} style={{ color: "#D8D8D8", background: "#101015", border: "1px solid #2A2A34", borderRadius: 999, padding: "7px 10px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800 }}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.progressPhotos.toUpperCase()}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: latestPhoto ? "1.15fr 0.85fr" : "1fr", gap: 12, alignItems: "stretch", marginBottom: 12 }}>
                {latestPhoto ? (
                  <img
                    src={latestPhoto.dataUrl}
                    alt={latestPhoto.note || "Latest progress"}
                    onClick={() => setViewingPhoto(latestPhoto)}
                    style={{ width: "100%", minHeight: 170, maxHeight: 230, objectFit: "cover", borderRadius: 12, border: "1px solid #24242E", display: "block", cursor: "pointer" }}
                  />
                ) : (
                  <div style={{ minHeight: 150, borderRadius: 12, border: "1px dashed #343442", display: "flex", alignItems: "center", justifyContent: "center", color: "#777", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, padding: 12, textAlign: "center" }}>
                    {text.noPhotos}
                  </div>
                )}
                <div style={{ display: "grid", gap: 10 }}>
                  <div className="detail-card">
                    <p className="detail-label">{text.total}</p>
                    <p className="detail-value">{totalPhotoCount}</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">{text.latest}</p>
                    <p className="detail-value">{latestPhoto?.date || "--"}</p>
                  </div>
                  <button className="dark-btn" onClick={() => openFeaturePage("photos")}>
                    {text.openFullPhotos}
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                <input
                  className="input"
                  type="date"
                  value={photoDraft.date}
                  onChange={event => setPhotoDraft(prev => ({ ...prev, date: event.target.value }))}
                />
                <input
                  className="input"
                  value={photoDraft.note}
                  onChange={event => setPhotoDraft(prev => ({ ...prev, note: event.target.value }))}
                  placeholder={text.photoNote}
                />
                <label className="dark-btn" style={{ textAlign: "center" }}>
                  {text.choosePhoto}
                  <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
                </label>
                {photoDraft.dataUrl && (
                  <img
                    src={photoDraft.dataUrl}
                    alt="Progress preview"
                    style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12, border: "1px solid #24242E", display: "block" }}
                  />
                )}
                {photoDraft.dataUrl && (
                  <button className="primary-btn" onClick={saveProgressPhoto}>
                    {text.savePhoto}
                  </button>
                )}
              </div>
              {progressPhotos.length > 0 && (
                <div className="photo-strip">
                  {progressPhotos.slice(0, 8).map(photo => (
                    <div key={photo.id} className="photo-card" onClick={() => setViewingPhoto(photo)}>
                      <img src={photo.dataUrl} alt={photo.note || "Progress"} />
                      <div className="photo-body">
                        <p className="photo-note">{photo.note || text.noNote}</p>
                        <p className="photo-sub">{photo.date} · {photo.weight} LB{photo.album ? ` · ${photo.album}` : ""}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {isProgressionDue(lastProgressionReview) && progressionItems.length > 0 && (
              <div className="home-card" style={{ marginBottom: 14, borderColor: "#FFD06055", background: "#151207" }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFD060", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                  {text.twoWeekUpgrade}
                </p>

                <p style={{ color: "#BFA45E", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
                  {text.progressionLead} {progressionItems.length} {text.progressionTail}
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button className="dark-btn" onClick={rejectProgression}>
                    {text.keepCurrent}
                  </button>
                  <button className="primary-btn" onClick={acceptProgression}>
                    {text.applyFive}
                  </button>
                </div>
              </div>
            )}

            <div className="metric-grid" style={{ marginBottom: 14 }}>
              {[
                { label: text.mWeekly, val: `${weeklyMetrics.weeklyProgress}%` },
                { label: text.mDone, val: weeklyMetrics.completedExercises },
                { label: text.mExercises, val: weeklyMetrics.totalExercises },
                { label: text.mSets, val: weeklyMetrics.totalSets },
                { label: text.mSessions, val: weeklyMetrics.workoutSessions },
                { label: text.mCompleted, val: weeklyMetrics.completedSessions },
                { label: text.mCardio, val: weeklyMetrics.cardioSessions },
                { label: text.mDays, val: "7" },
              ].map(metric => (
                <div key={metric.label} className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {metric.val}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="home-card">
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 12 }}>
                {text.weekPlan.toUpperCase()}
              </p>

              <div style={{ display: "grid", gap: 10 }}>
                {days.map(dayName => {
                  const currentDay = workoutData[dayName];
                  const currentTheme = themeFor(currentDay.type);

                  return (
                    <button
                      key={dayName}
                      className="dark-btn"
                      onClick={() => openWorkout(dayName)}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left" }}
                    >
                      <span>
                        <span style={{ display: "block", fontFamily: "'Orbitron', monospace", letterSpacing: 1 }}>
                          {displayDayShort(dayName, currentDay.label)} - {displayDay(dayName)}
                        </span>
                        <span style={{ display: "block", color: "#888", fontSize: 12, marginTop: 3 }}>
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

        {activeUserId && screen === "feature" && (
          <div className="fade-up feature-page">
            <button className="dark-btn" onClick={() => setScreen("home")} style={{ marginBottom: 14 }}>
              {text.backHome}
            </button>

            <div className="feature-hero" style={{ borderColor: `${activeFeature.accent}40` }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: activeFeature.accent, fontFamily: "'Orbitron', monospace" }}>
                {language === "es" ? "MÓDULO ATLAS" : "ATLAS MODULE"}
              </p>
              <h2 className="feature-title">{activeFeature.title}</h2>
              <p className="feature-copy">
                {activeFeaturePage === "today" && "The command center for the current day: start the session, jump into quick mode, and keep the week's protocol moving."}
                {activeFeaturePage === "body" && "Tracks current body weight against the starting point and target so the protocol has a visible physical direction."}
                {activeFeaturePage === "score" && "Combines weekly completion, sessions, streak, PRs, and fatigue into one performance signal."}
                {activeFeaturePage === "calendar" && "Shows the month as training status: completed, trained, missed, rest, or planned."}
                {activeFeaturePage === "prs" && "Collects every exercise marked as a PR from notes, then pairs it with the current programmed weight and date."}
                {activeFeaturePage === "fatigue" && "Uses RPE and pain notes to show weekly strain and warn when the protocol may need a lighter day."}
                {activeFeaturePage === "goals" && "Keeps weekly targets and the main focus goal visible, with progress against each target."}
                {activeFeaturePage === "progress" && "Stores body-weight and weekly-performance snapshots so progress survives beyond today's checkboxes."}
                {activeFeaturePage === "badges" && "Turns consistency into simple streaks and badges without making the app feel noisy."}
                {activeFeaturePage === "photos" && "Keeps local progress photos by date, weight, and note for visual comparison."}
                {activeFeaturePage === "metrics" && "Breaks down the full weekly workload: exercises, sets, sessions, cardio, completion, and set progress."}
                {activeFeaturePage === "week" && "Shows the full seven-day split and gives fast access to every programmed workout day."}
                {activeFeaturePage === "water" && (language === "es" ? "Registra tu hidratación diaria. El agua mejora el rendimiento, la recuperación y el metabolismo." : "Track your daily hydration. Water improves performance, recovery and metabolism.")}
                {activeFeaturePage === "coach" && (language === "es" ? "Consejos personalizados basados en tu edad, sexo, composición corporal y meta de tipo de cuerpo." : "Personalized tips based on your age, sex, body composition, and body type goal.")}
              </p>
            </div>

            {activeFeaturePage === "today" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card">
                    <p className="detail-label">DAY</p>
                    <p className="detail-value">{todayDisplayName} - {weeklyMetrics.todayType}</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">WEEKLY</p>
                    <p className="detail-value">{weeklyMetrics.weeklyProgress}%</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">DONE</p>
                    <p className="detail-value">{weeklyMetrics.completedExercises}/{weeklyMetrics.totalExercises}</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">SESSIONS</p>
                    <p className="detail-value">{weeklyMetrics.completedSessions}/{weeklyMetrics.workoutSessions}</p>
                  </div>
                </div>
                <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
                  START TODAY
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  <button className="dark-btn" onClick={resetWeek}>Reset Week</button>
                </div>
                <div className="home-card">
                  <p className="detail-label">NEXT PRIORITIES</p>
                  <div className="detail-list">
                    {(incompleteExerciseRows.length ? incompleteExerciseRows : [{ key: "done", exercise: { name: "All exercises completed", weight: "" }, dayName: weeklyMetrics.today, sessionName: "Protocol", setsDone: 0, setsTotal: 0, setsLeft: 0 }]).slice(0, 4).map(row => (
                      <div key={`${row.key}-today-priority`} className="detail-row">
                        <div>
                          <p className="detail-row-main">{row.exercise.name}</p>
                          <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} - {row.setsDone}/{row.setsTotal} sets</p>
                        </div>
                        <span style={{ color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{row.exercise.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeaturePage === "body" && (
              <div className="detail-list">
                <div className="detail-grid">
                  {[
                    { label: "CURRENT", val: `${profile.currentWeight} LB` },
                    { label: "START", val: `${profile.startWeight} LB` },
                    { label: "TARGET", val: `${profile.targetWeight} LB` },
                    { label: "CHANGE", val: `${signedNumber(weightChange)} LB` },
                    { label: "TO GOAL", val: `${signedNumber(weightToGoal)} LB` },
                    { label: "HEIGHT", val: profile.height },
                    { label: text.sexLabel.toUpperCase(), val: profileSex === "male" ? text.maleLabel : text.femaleLabel },
                    { label: text.ageLabel.toUpperCase(), val: `${profile.age || "--"} ${language === "es" ? "años" : "yrs"}` },
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
                        { label: text.leanMassLabel, val: `${leanMassLb} LB` },
                        { label: text.ibwLabel, val: `${ibwLb} LB` },
                      ].map(item => (
                        <div key={item.label} className="detail-card">
                          <p className="detail-label">{item.label}</p>
                          <p className="detail-value">{item.val}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button className="primary-btn" onClick={() => setEditingProfile({ ...profile })}>
                  EDIT BODY STATUS
                </button>
                <div className="home-card">
                  <p className="detail-label">BODY TREND</p>
                  <p className="detail-row-main">
                    {weightChange === 0 ? "Stable since start" : weightChange > 0 ? "Up from starting weight" : "Down from starting weight"}
                  </p>
                  <p className="detail-row-sub">
                    Start date {profile.startDate}. Target date {goals.targetDate}. Current gap to target is {signedNumber(weightToGoal)} LB.
                  </p>
                </div>
                <div className="detail-list">
                  {progressEntries.slice(0, 5).map(entry => (
                    <div key={`${entry.id}-body-row`} className="detail-row">
                      <div>
                        <p className="detail-row-main">{entry.date}</p>
                        <p className="detail-row-sub">{entry.type === "manual" ? "Manual body check" : "Auto progress capture"}</p>
                      </div>
                      <span style={{ color: "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{entry.weight} LB</span>
                    </div>
                  ))}
                </div>
                <div className="home-card">
                  <p className="detail-label">DAY BY DAY</p>
                  <div className="detail-list">
                    {dayBreakdowns.map(row => (
                      <div key={`${row.dayName}-metric-detail`} className="detail-row">
                        <div>
                          <p className="detail-row-main">{displayDayShort(row.dayName, row.label)} - {displayDay(row.dayName)}</p>
                          <p className="detail-row-sub">{row.doneDayExercises}/{row.totalDayExercises} exercises - {row.doneDaySets}/{row.totalDaySets} sets</p>
                        </div>
                        <span style={{ color: themeFor(row.type).accent, fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{row.progressPct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeaturePage === "score" && (
              <div className="detail-list">
                <div className="detail-card" style={{ textAlign: "center", padding: 20 }}>
                  <p style={{ color: "#FFFFFF", fontSize: 54, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>{atlasScore}</p>
                  <p className="detail-row-sub">{deloadWarning ? "Deload pressure is active" : "Protocol status stable"}</p>
                </div>
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">WEEKLY</p><p className="detail-value">{weeklyMetrics.weeklyProgress}%</p></div>
                  <div className="detail-card"><p className="detail-label">SESSIONS</p><p className="detail-value">{weeklyMetrics.completedSessions}/{weeklySessionsGoal}</p></div>
                  <div className="detail-card"><p className="detail-label">STREAK</p><p className="detail-value">{weeklyStreak}</p></div>
                  <div className="detail-card"><p className="detail-label">PRS</p><p className="detail-value">{prEntries.length}</p></div>
                  <div className="detail-card"><p className="detail-label">AVG RPE</p><p className="detail-value">{averageRpe || "N/A"}</p></div>
                  <div className="detail-card"><p className="detail-label">DELOAD</p><p className="detail-value">{deloadWarning ? "-10" : "+5"}</p></div>
                </div>
                <div className="home-card">
                  <p className="detail-label">SCORE BREAKDOWN</p>
                  <div className="detail-list">
                    <div className="detail-row"><p className="detail-row-main">Weekly completion</p><span>{Math.round(weeklyMetrics.weeklyProgress * 0.45)} pts</span></div>
                    <div className="detail-row"><p className="detail-row-main">Session target</p><span>{Math.round(Math.min(weeklyMetrics.completedSessions / weeklySessionsGoal, 1) * 25)} pts</span></div>
                    <div className="detail-row"><p className="detail-row-main">Streak pressure</p><span>{Math.min(weeklyStreak, 4) * 5} pts</span></div>
                    <div className="detail-row"><p className="detail-row-main">PR momentum</p><span>{prEntries.length * 3} pts</span></div>
                  </div>
                </div>
              </div>
            )}

            {activeFeaturePage === "calendar" && (
              <div className="detail-list">
                <div className="home-card">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
                    {weekHeaderLabels.map((label, index) => (
                      <p key={`${label}-${index}`} style={{ color: "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
                    ))}
                    {calendarCells.map((cell, index) => {
                      if (!cell) return <div key={`blank-detail-${index}`} />;
                      const isToday = cell.key === getDateKey();
                      const status = getCalendarStatus(cell);
                      const visual = getCalendarVisual(status, isLightMode);
                      return (
                        <div key={cell.key} title={`${cell.key} - ${status}`} style={{ aspectRatio: "1", borderRadius: 8, background: visual.bg, color: visual.fg, border: isToday ? `2px solid ${isLightMode ? "#101015" : "#FFFFFF"}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                          {cell.dayNumber}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                    {["completed", "trained", "missed", "rest", "planned"].map(status => {
                      const visual = getCalendarVisual(status, isLightMode);
                      return (
                        <span key={status} style={{ display: "flex", alignItems: "center", gap: 5, color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>
                          <span style={{ width: 11, height: 11, borderRadius: 3, background: visual.bg, display: "inline-block" }} />
                          {calendarLabels[status]}
                        </span>
                      );
                    })}
                  </div>
                </div>
                <div className="detail-grid">
                  {Object.entries(calendarStatusCounts).map(([status, count]) => (
                    <div key={status} className="detail-card">
                      <p className="detail-label">{status.toUpperCase()}</p>
                      <p className="detail-value">{count}</p>
                    </div>
                  ))}
                </div>
                {calendarCells.filter(Boolean).slice(-10).map(cell => {
                  const logged = calendarLog[cell.key];
                  const status = getCalendarStatus(cell);
                  return (
                    <div key={`${cell.key}-row`} className="detail-row">
                      <div>
                        <p className="detail-row-main">{cell.key} - {displayDay(cell.dayName)}</p>
                        <p className="detail-row-sub">{logged ? `${logged.completed}/${logged.total} exercises logged` : "No entry saved yet"}</p>
                      </div>
                      <span style={{ color: "#FFFFFF", fontFamily: "'Orbitron', monospace", fontSize: 10 }}>{status.toUpperCase()}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {activeFeaturePage === "prs" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">TOTAL PRS</p><p className="detail-value">{prEntries.length}</p></div>
                  <div className="detail-card"><p className="detail-label">HEAVIEST</p><p className="detail-value">{heaviestExerciseRows[0]?.exercise.weight || "--"}</p></div>
                </div>
                {(prEntries.length ? prEntries : [{ key: "empty-pr", exerciseName: "No PRs marked yet", sessionName: "Open Notes on an exercise and mark PR", weight: "", date: "" }]).map(entry => (
                  <div key={entry.key} className="detail-row">
                    <div>
                      <p className="detail-row-main">{entry.exerciseName}</p>
                      <p className="detail-row-sub">{entry.dayName ? displayDay(entry.dayName) : "PR"} - {entry.sessionName}</p>
                    </div>
                    <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{entry.weight} {entry.date}</span>
                  </div>
                ))}
                <div className="home-card">
                  <p className="detail-label">HEAVIEST PROGRAMMED LOADS</p>
                  <div className="detail-list">
                    {heaviestExerciseRows.slice(0, 5).map(row => (
                      <div key={`${row.key}-heavy`} className="detail-row">
                        <div>
                          <p className="detail-row-main">{row.exercise.name}</p>
                          <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName}</p>
                        </div>
                        <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{row.exercise.weight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeaturePage === "fatigue" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">AVG RPE</p><p className="detail-value">{averageRpe || "N/A"}</p></div>
                  <div className="detail-card"><p className="detail-label">HIGH NOTES</p><p className="detail-value">{highFatigueNotes}</p></div>
                  <div className="detail-card"><p className="detail-label">DELOAD</p><p className="detail-value">{deloadWarning ? "ACTIVE" : "CLEAR"}</p></div>
                  <div className="detail-card"><p className="detail-label">THIS WEEK</p><p className="detail-value">{currentWeekKey.slice(5)}</p></div>
                </div>
                <div className="home-card" style={{ borderColor: deloadWarning ? "#FFD06066" : "rgba(255,255,255,0.075)" }}>
                  <p className="detail-row-main">{deloadWarning ? "Lower load, reduce intensity, or add recovery." : "No fatigue warning from the current notes."}</p>
                  <p className="detail-row-sub">Pain marked Sharp/Stop or RPE 9-10 raises the warning signal.</p>
                </div>
                <div className="home-card">
                  <p className="detail-label">RECENT NOTE SIGNALS</p>
                  <div className="detail-list">
                    {(noteRows.length ? noteRows : [{ key: "empty-note", exercise: { name: "No exercise notes yet" }, dayName: "Notes", sessionName: "Add pain/RPE from any exercise", note: {} }]).slice(0, 6).map(row => (
                      <div key={`${row.key}-fatigue-note`} className="detail-row">
                        <div>
                          <p className="detail-row-main">{row.exercise.name}</p>
                          <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} - Pain {row.note?.pain || "N/A"} - RPE {row.note?.difficulty || "N/A"}</p>
                        </div>
                        <span style={{ color: row.note?.pr ? "#FFD060" : "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{row.note?.pr ? "PR" : "NOTE"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeaturePage === "goals" && (
              <div className="detail-list">
                <div className="home-card">
                  <p className="detail-label">MAIN FOCUS</p>
                  <p className="detail-row-main">{goals.focusGoal}</p>
                  <p className="detail-row-sub">Target date: {goals.targetDate}</p>
                </div>
                {[{ label: "Weekly protocol", current: `${weeklyMetrics.weeklyProgress}%`, target: `${goals.weeklyProgressGoal}%`, pct: weeklyGoalPct }, { label: "Completed sessions", current: weeklyMetrics.completedSessions, target: goals.weeklySessionsGoal, pct: sessionsGoalPct }].map(goal => (
                  <div key={goal.label} className="detail-card">
                    <p className="detail-label">{goal.label.toUpperCase()}</p>
                    <p className="detail-value">{goal.current} / {goal.target}</p>
                    <div style={{ height: 6, background: isLightMode ? "#E2E4E9" : "#1E1E26", borderRadius: 6, overflow: "hidden", marginTop: 10 }}>
                      <div style={{ width: `${goal.pct}%`, height: "100%", background: isLightMode ? "#101015" : "#FFFFFF", borderRadius: 6 }} />
                    </div>
                  </div>
                ))}
                <button className="primary-btn" onClick={() => setEditingGoals({ ...goals })}>SET MY GOALS</button>
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">REMAINING EXERCISES</p><p className="detail-value">{remainingExercises}</p></div>
                  <div className="detail-card"><p className="detail-label">SET COMPLETION</p><p className="detail-value">{setCompletionPct}%</p></div>
                </div>
              </div>
            )}

            {activeFeaturePage === "progress" && (
              <div className="detail-list">
                <div className="compact-actions">
                  <button className="primary-btn" onClick={rememberProgress}>SAVE PROGRESS</button>
                  <button className="dark-btn" onClick={() => setShowDataTools(true)}>Backup</button>
                  <button className="dark-btn" onClick={resetWeek}>Reset Week</button>
                </div>
                {chartEntries.length > 0 && (
                  <div className="home-card" style={{ display: "flex", alignItems: "end", gap: 8, height: 130 }}>
                    {chartEntries.map(entry => {
                      const range = Math.max(maxChartWeight - minChartWeight, 1);
                      const height = 34 + ((entry.weightNumber - minChartWeight) / range) * 66;
                      return (
                        <div key={`${entry.id}-feature-bar`} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                          <div title={`${entry.weight} LB`} style={{ height, borderRadius: "8px 8px 3px 3px", background: isLightMode ? "linear-gradient(180deg, #3A3F49, #9AA0AC)" : "linear-gradient(180deg, #FFFFFF, #777B86)" }} />
                          <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 9, marginTop: 5 }}>{entry.weight}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {progressEntries.slice(0, 12).map(entry => (
                  <div key={`${entry.id}-feature`} className="detail-row">
                    <div>
                      <p className="detail-row-main">{entry.date} - {entry.type === "manual" ? "Manual save" : "Auto snapshot"}</p>
                      <p className="detail-row-sub">{entry.completedExercises} exercises - {entry.completedSessions} sessions - week {entry.weekKey}</p>
                    </div>
                    <span style={{ color: "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{entry.weight} LB</span>
                  </div>
                ))}
              </div>
            )}

            {activeFeaturePage === "badges" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">WEEK STREAK</p><p className="detail-value">{weeklyStreak}</p></div>
                  <div className="detail-card"><p className="detail-label">DAYS CLEAR</p><p className="detail-value">{weeklyMetrics.completedDays}/7</p></div>
                  <div className="detail-card"><p className="detail-label">WEEK OF</p><p className="detail-value">{currentWeekKey.slice(5)}</p></div>
                  <div className="detail-card"><p className="detail-label">BADGES</p><p className="detail-value">{earnedBadges.length || 1}</p></div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(earnedBadges.length ? earnedBadges : ["Protocol Started"]).map(badge => (
                    <span key={badge} style={{ color: "#D8D8D8", background: "#101015", border: "1px solid #2A2A34", borderRadius: 999, padding: "9px 12px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeFeaturePage === "photos" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">PHOTOS</p><p className="detail-value">{totalPhotoCount}</p></div>
                  <div className="detail-card"><p className="detail-label">ALBUMS</p><p className="detail-value">{photoAlbums.length}</p></div>
                </div>

                <div className="home-card">
                  <p className="detail-label">ALBUMS</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
                    <button
                      className={`album-chip${albumFilter === "" ? " active" : ""}`}
                      onClick={() => setAlbumFilter("")}
                    >
                      All ({progressPhotos.length})
                    </button>
                    {photoAlbums.map(album => (
                      <button
                        key={album}
                        className={`album-chip${albumFilter === album ? " active" : ""}`}
                        onClick={() => setAlbumFilter(album)}
                      >
                        {album} ({progressPhotos.filter(photo => photo.album === album).length})
                      </button>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 8, marginTop: 12 }}>
                    <input className="input" value={albumDraft} onChange={event => setAlbumDraft(event.target.value)} placeholder="New album name" />
                    <button className="dark-btn" onClick={addPhotoAlbum}>Create</button>
                  </div>
                  {albumFilter && (
                    <button className="edit-btn" onClick={() => removePhotoAlbum(albumFilter)} style={{ marginTop: 10, color: "#E5604D" }}>
                      Delete album "{albumFilter}"
                    </button>
                  )}
                </div>

                <div className="home-card">
                  <p className="detail-label">ADD PHOTO</p>
                  <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
                    <label style={{ display: "block" }}>
                      <span className="field-label">DATE</span>
                      <input className="input" type="date" value={photoDraft.date} onChange={event => setPhotoDraft(prev => ({ ...prev, date: event.target.value }))} />
                    </label>
                    <label style={{ display: "block" }}>
                      <span className="field-label">NOTE</span>
                      <input className="input" value={photoDraft.note} onChange={event => setPhotoDraft(prev => ({ ...prev, note: event.target.value }))} placeholder="What does this photo show?" />
                    </label>
                    <label style={{ display: "block" }}>
                      <span className="field-label">ALBUM</span>
                      <select className="input" value={photoDraft.album} onChange={event => setPhotoDraft(prev => ({ ...prev, album: event.target.value }))}>
                        <option value="">No album</option>
                        {photoAlbums.map(album => <option key={album} value={album}>{album}</option>)}
                      </select>
                    </label>
                    <label className="dark-btn" style={{ textAlign: "center" }}>
                      Choose Photo
                      <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
                    </label>
                    {photoDraft.dataUrl && <img src={photoDraft.dataUrl} alt="Progress preview" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12, border: "1px solid #24242E", display: "block" }} />}
                    {photoDraft.dataUrl && <button className="primary-btn" onClick={saveProgressPhoto}>SAVE PHOTO</button>}
                  </div>
                </div>

                {(() => {
                  const shownPhotos = albumFilter ? progressPhotos.filter(photo => photo.album === albumFilter) : progressPhotos;

                  if (shownPhotos.length === 0) {
                    return (
                      <div className="home-card">
                        <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>
                          {albumFilter ? "No photos in this album yet." : text.noPhotos}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="photo-grid">
                      {shownPhotos.map(photo => (
                        <div key={`${photo.id}-feature`} className="photo-tile" onClick={() => setViewingPhoto(photo)}>
                          <img src={photo.dataUrl} alt={photo.note || "Progress"} />
                          <div className="photo-body">
                            <p className="photo-note">{photo.note || "No note"}</p>
                            <p className="photo-sub">{photo.date} · {photo.weight} LB{photo.album ? ` · ${photo.album}` : ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeFeaturePage === "metrics" && (
              <div className="detail-list">
                <div className="detail-grid">
                  {[
                    { label: "WEEKLY", val: `${weeklyMetrics.weeklyProgress}%` },
                    { label: "DONE", val: weeklyMetrics.completedExercises },
                    { label: "EXERCISES", val: weeklyMetrics.totalExercises },
                    { label: "SETS", val: weeklyMetrics.totalSets },
                    { label: "SET PROGRESS", val: `${weeklySetProgress}/${weeklyMetrics.totalSets}` },
                    { label: "SESSIONS", val: weeklyMetrics.workoutSessions },
                    { label: "COMPLETED", val: weeklyMetrics.completedSessions },
                    { label: "CARDIO", val: weeklyMetrics.cardioSessions },
                  ].map(metric => (
                    <div key={metric.label} className="detail-card">
                      <p className="detail-label">{metric.label}</p>
                      <p className="detail-value">{metric.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeFeaturePage === "week" && (
              <div className="detail-list">
                {days.map(dayName => {
                  const currentDay = workoutData[dayName];
                  const currentTheme = themeFor(currentDay.type);
                  const dayExercises = currentDay.sessions.reduce((sum, currentSession) => sum + currentSession.exercises.length, 0);
                  const daySets = currentDay.sessions.reduce((sum, currentSession) => sum + currentSession.exercises.reduce((setSum, exercise) => setSum + Number(exercise.sets || 0), 0), 0);

                  return (
                    <div key={`${dayName}-feature`} className="detail-row">
                      <div>
                        <p className="detail-row-main">{displayDayShort(dayName, currentDay.label)} - {displayDay(dayName)}</p>
                        <p className="detail-row-sub">{currentDay.sessions.map(item => item.name).join(" / ")} - {dayExercises} exercises - {daySets} sets</p>
                      </div>
                      <button className="edit-btn" onClick={() => openWorkout(dayName)} style={{ color: currentTheme.accent }}>
                        {currentDay.type}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeFeaturePage === "water" && (() => {
              const wColor = waterPct >= 100 ? "#3FB98A" : "#55AAEE";
              const wColorDark = waterPct >= 100 ? "#1E7A56" : "#1E6FAA";
              const hydrationStatus = waterPct >= 100 ? (language === "es" ? "ÓPTIMO" : "OPTIMAL") : waterPct >= 75 ? (language === "es" ? "CASI" : "ALMOST") : waterPct >= 50 ? (language === "es" ? "MODERADO" : "MODERATE") : waterPct >= 25 ? (language === "es" ? "BAJO" : "LOW") : (language === "es" ? "HIDRATARSE" : "HYDRATE");
              const hydrationColor = waterPct >= 100 ? "#3FB98A" : waterPct >= 75 ? "#90C8FF" : waterPct >= 50 ? "#FFD060" : waterPct >= 25 ? "#FF9860" : "#FF6060";
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
              const R2 = 70, circ2 = 2 * Math.PI * R2;
              const offset2 = circ2 * (1 - waterPct / 100);
              return (
                <div className="detail-list">
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 4 }}>
                    <div style={{ position: "relative", width: 160, height: 160, flexShrink: 0, margin: "0 auto" }}>
                      <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="80" cy="80" r={R2} fill="none" stroke={isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"} strokeWidth="10" />
                        <circle
                          cx="80" cy="80" r={R2} fill="none"
                          stroke={wColor} strokeWidth="10"
                          strokeDasharray={circ2} strokeDashoffset={offset2}
                          strokeLinecap="round"
                          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)", filter: `drop-shadow(0 0 8px ${wColor}AA)` }}
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 10, letterSpacing: 3, color: hydrationColor, fontFamily: "'Orbitron', monospace", marginBottom: 2 }}>{hydrationStatus}</span>
                        <span style={{ fontSize: 48, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: wColor, lineHeight: 1 }}>{waterGlasses}</span>
                        <span style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>/ {waterGoalNum} {text.glasses}</span>
                        <span style={{ fontSize: 13, fontWeight: 900, color: wColor, fontFamily: "'Orbitron', monospace", marginTop: 4 }}>{waterPct}%</span>
                      </div>
                    </div>
                  </div>

                  {waterPct >= 100 && (
                    <div style={{ textAlign: "center", padding: "6px 16px 2px", background: "linear-gradient(135deg, rgba(63,185,138,0.15), rgba(30,122,86,0.1))", borderRadius: 12, border: "1px solid #3FB98A44" }}>
                      <p style={{ color: "#3FB98A", fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, letterSpacing: 2 }}>
                        {language === "es" ? "¡META ALCANZADA!" : "GOAL ACHIEVED!"}
                        {waterStreakDays > 1 && <span style={{ fontSize: 11, color: "#FFD060", marginLeft: 8 }}>🔥 {waterStreakDays} {language === "es" ? "días seguidos" : "day streak"}</span>}
                      </p>
                    </div>
                  )}

                  {waterStreakDays > 0 && waterPct < 100 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: isLightMode ? "rgba(255,208,96,0.1)" : "rgba(255,208,96,0.08)", borderRadius: 10, border: "1px solid rgba(255,208,96,0.25)" }}>
                      <span style={{ fontSize: 18 }}>🔥</span>
                      <p style={{ color: "#FFD060", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 800 }}>
                        {waterStreakDays} {language === "es" ? `día${waterStreakDays > 1 ? "s" : ""} de racha consecutiva` : `day hydration streak`}
                      </p>
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {Array.from({ length: waterGoalNum }).map((_, gi) => {
                      const filled = gi < waterGlasses;
                      return (
                        <div
                          key={gi}
                          onClick={() => filled ? removeWater() : addWater()}
                          title={filled ? (language === "es" ? "Quitar vaso" : "Remove glass") : (language === "es" ? "Agregar vaso" : "Add glass")}
                          style={{ flex: "1 0 auto", minWidth: 32, maxWidth: 48, height: 44, borderRadius: 8, cursor: "pointer", position: "relative", overflow: "hidden", border: `1.5px solid ${filled ? wColor + "55" : (isLightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)")}`, background: filled ? (isLightMode ? "rgba(85,170,238,0.15)" : "rgba(85,170,238,0.12)") : (isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)"), transition: "all 0.2s ease", animation: filled && gi === waterGlasses - 1 ? "dropIn 0.35s ease" : "none", display: "flex", alignItems: "flex-end", justifyContent: "center" }}
                        >
                          {filled && (
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "70%", background: `linear-gradient(180deg, ${wColor}66, ${wColorDark}99)`, borderRadius: "0 0 6px 6px" }}>
                              <div style={{ position: "absolute", top: -4, left: "-50%", width: "200%", height: 8, background: `${wColor}55`, borderRadius: "50%", animation: "waterWave 2s ease-in-out infinite" }} />
                            </div>
                          )}
                          <span style={{ position: "relative", fontSize: 14, zIndex: 1, paddingBottom: 4 }}>{filled ? "💧" : ""}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <button className="dark-btn" onClick={() => removeWater()} style={{ padding: "16px 10px", fontSize: 18, fontWeight: 900, color: "#8A8F99" }}>
                      − {text.glassWord}
                    </button>
                    <button className="primary-btn" onClick={() => addWater()} style={{ padding: "16px 10px", fontSize: 18, fontWeight: 900, background: waterPct >= 100 ? "#3FB98A" : "#FFFFFF", color: "#050507" }}>
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
                            style={{ padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${sel ? "#90C8FF88" : (isLightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)")}`, background: sel ? (isLightMode ? "rgba(144,200,255,0.15)" : "rgba(144,200,255,0.12)") : "transparent", color: sel ? "#90C8FF" : "#888", fontFamily: "'Orbitron', monospace", fontSize: 12, fontWeight: 900, cursor: "pointer", boxShadow: sel ? "0 0 8px #90C8FF33" : "none" }}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                      {language === "es" ? "HISTORIAL RECIENTE" : "RECENT HISTORY"}
                    </p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {Object.entries(waterLog)
                        .sort((a, b) => b[0].localeCompare(a[0]))
                        .slice(0, 7)
                        .map(([date, entry]) => {
                          const g = Number(entry.glasses || 0);
                          const gl = Number(entry.goal || 8);
                          const pctH = Math.min(100, gl > 0 ? Math.round((g / gl) * 100) : 0);
                          const hColor = pctH >= 100 ? "#3FB98A" : pctH >= 75 ? "#90C8FF" : pctH >= 50 ? "#FFD060" : "#FF9860";
                          const isToday = date === getDateKey();
                          return (
                            <div key={date} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 12, background: isLightMode ? "rgba(0,0,0,0.035)" : "rgba(255,255,255,0.04)", border: `1px solid ${isToday ? "#90C8FF33" : "transparent"}` }}>
                              <div style={{ minWidth: 68 }}>
                                <p style={{ fontSize: 11, fontWeight: 700, color: isToday ? "#90C8FF" : "#888", fontFamily: "'DM Sans', sans-serif" }}>
                                  {isToday ? (language === "es" ? "HOY" : "TODAY") : date}
                                </p>
                              </div>
                              <div style={{ flex: 1, height: 6, borderRadius: 6, overflow: "hidden", background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
                                <div style={{ width: `${pctH}%`, height: "100%", background: `linear-gradient(90deg, ${hColor}88, ${hColor})`, borderRadius: 6, transition: "width 0.6s ease" }} />
                              </div>
                              <div style={{ minWidth: 52, textAlign: "right" }}>
                                <p style={{ fontSize: 12, fontWeight: 900, color: hColor, fontFamily: "'Orbitron', monospace" }}>{g}/{gl}</p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  <div className="home-card" style={{ borderColor: "#90C8FF22", background: isLightMode ? "rgba(144,200,255,0.05)" : "rgba(144,200,255,0.04)" }}>
                    <p style={{ fontSize: 10, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                      {language === "es" ? "POR QUÉ IMPORTA" : "WHY IT MATTERS"}
                    </p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {(language === "es" ? [
                        { icon: "💪", text: "Mejora la fuerza y resistencia muscular hasta un 10-15%." },
                        { icon: "⚡", text: "Aumenta el enfoque mental y reduce la fatiga durante el entrenamiento." },
                        { icon: "🔥", text: "Acelera el metabolismo y optimiza la quema de grasa." },
                        { icon: "🛌", text: "Mejora la recuperación muscular y el sueño reparador." },
                      ] : [
                        { icon: "💪", text: "Boosts muscle strength and endurance by up to 10-15%." },
                        { icon: "⚡", text: "Improves mental focus and reduces fatigue during training." },
                        { icon: "🔥", text: "Speeds up metabolism and optimizes fat burning." },
                        { icon: "🛌", text: "Enhances muscle recovery and restorative sleep." },
                      ]).map((item, ii) => (
                        <div key={ii} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                          <p style={{ color: isLightMode ? "#2A3A4A" : "#B8D0E8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>{item.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeFeaturePage === "coach" && (() => {
              const bmiCategory = bmi <= 0 ? null : bmi < 18.5 ? { label: language === "es" ? "Bajo Peso" : "Underweight", color: "#90C8FF" } : bmi < 25 ? { label: language === "es" ? "Normal" : "Normal", color: "#3FB98A" } : bmi < 30 ? { label: language === "es" ? "Sobrepeso" : "Overweight", color: "#FFD060" } : { label: language === "es" ? "Obeso" : "Obese", color: "#FF6060" };
              const bfCategory = bodyFatPct <= 0 ? null : profileSex === "male"
                ? (bodyFatPct < 6 ? { label: language === "es" ? "Atleta" : "Athletic", color: "#90C8FF" } : bodyFatPct < 14 ? { label: language === "es" ? "En Forma" : "Fit", color: "#3FB98A" } : bodyFatPct < 25 ? { label: language === "es" ? "Normal" : "Normal", color: "#FFD060" } : { label: language === "es" ? "Exceso" : "Excess", color: "#FF6060" })
                : (bodyFatPct < 14 ? { label: language === "es" ? "Atleta" : "Athletic", color: "#90C8FF" } : bodyFatPct < 21 ? { label: language === "es" ? "En Forma" : "Fit", color: "#3FB98A" } : bodyFatPct < 32 ? { label: language === "es" ? "Normal" : "Normal", color: "#FFD060" } : { label: language === "es" ? "Exceso" : "Excess", color: "#FF6060" });
              const bodyTypeConfig = {
                lean: { icon: "🔥", desc: language === "es" ? "Déficit calórico + cardio HIIT" : "Caloric deficit + HIIT cardio", color: "#FF9860" },
                athletic: { icon: "⚡", desc: language === "es" ? "Mantenimiento + alta proteína" : "Maintenance + high protein", color: "#90C8FF" },
                muscular: { icon: "💪", desc: language === "es" ? "Superávit + compuestos pesados" : "Caloric surplus + heavy compounds", color: "#B8A0FF" },
                maintain: { icon: "🎯", desc: language === "es" ? "Consistencia y balance calórico" : "Consistency and caloric balance", color: "#3FB98A" },
              };
              const selectedGoal = goals.bodyTypeGoal || "athletic";
              const tipIcons = ["💡", "🥩", "🏋️", "😴", "🧠", "⚡", "🔥", "🎯"];
              return (
                <div className="detail-list">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    {[
                      { label: text.bmiLabel, val: bmi > 0 ? String(bmi) : "N/A", sub: bmiCategory?.label, color: bmiCategory?.color || "#8A8F99" },
                      { label: text.bodyFatLabel, val: bmi > 0 ? `${bodyFatPct}%` : "N/A", sub: bfCategory?.label, color: bfCategory?.color || "#8A8F99" },
                      { label: text.leanMassLabel, val: bmi > 0 ? `${leanMassLb} lb` : "N/A", sub: language === "es" ? "masa activa" : "active mass", color: "#90C8FF" },
                      { label: text.ibwLabel, val: ibwLb > 0 ? `${ibwLb} lb` : "N/A", sub: language === "es" ? "objetivo Devine" : "Devine formula", color: "#B8A0FF" },
                    ].map(item => (
                      <div key={item.label} style={{ padding: "16px 14px", borderRadius: 14, background: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: `1.5px solid ${item.color}33` }}>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>{item.label}</p>
                        <p style={{ fontSize: 26, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: item.color, lineHeight: 1, marginBottom: 4 }}>{item.val}</p>
                        {item.sub && <p style={{ fontSize: 10, color: item.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, opacity: 0.85 }}>{item.sub}</p>}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 14, background: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", alignItems: "center" }}>
                    <span style={{ fontSize: 28 }}>{profileSex === "male" ? "♂️" : "♀️"}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 16, fontWeight: 900, color: isLightMode ? "#101015" : "#FFFFFF", fontFamily: "'DM Sans', sans-serif" }}>
                        {profileSex === "male" ? text.maleLabel : text.femaleLabel} · {profile.age || "--"} {language === "es" ? "años" : "yrs"}
                      </p>
                      <p style={{ fontSize: 11, color: "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                        {profile.height} · {profile.currentWeight} lb
                      </p>
                    </div>
                    <button className="edit-btn" onClick={() => setEditingProfile({ ...profile })} style={{ padding: "7px 12px" }}>
                      {text.edit}
                    </button>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, letterSpacing: 3, color: "#B8A0FF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                      {text.bodyTypeLabel.toUpperCase()}
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {BODY_TYPE_GOAL_OPTIONS.map(option => {
                        const selected = selectedGoal === option.value;
                        const cfg = bodyTypeConfig[option.value];
                        const label = language === "es"
                          ? ({ lean: "Definir", athletic: "Atlético", muscular: "Muscular", maintain: "Mantener" }[option.value] || option.label)
                          : ({ lean: "Lean Cut", athletic: "Athletic", muscular: "Bulk", maintain: "Maintain" }[option.value] || option.label);
                        return (
                          <button
                            key={option.value}
                            onClick={() => setGoals(prev => ({ ...prev, bodyTypeGoal: option.value }))}
                            style={{ padding: "14px 12px", borderRadius: 14, border: `2px solid ${selected ? cfg.color : (isLightMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.08)")}`, background: selected ? `${cfg.color}14` : "transparent", cursor: "pointer", textAlign: "left", boxShadow: selected ? `0 0 16px ${cfg.color}33` : "none", transition: "all 0.2s ease" }}
                          >
                            <span style={{ fontSize: 22, display: "block", marginBottom: 6 }}>{cfg.icon}</span>
                            <p style={{ fontSize: 13, fontWeight: 900, color: selected ? cfg.color : (isLightMode ? "#101015" : "#FFFFFF"), fontFamily: "'DM Sans', sans-serif", marginBottom: 3 }}>{label}</p>
                            <p style={{ fontSize: 10, color: selected ? cfg.color : "#888", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.3, opacity: selected ? 0.9 : 0.7 }}>{cfg.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ background: isLightMode ? "rgba(184,160,255,0.06)" : "rgba(184,160,255,0.05)", borderRadius: 16, border: "1px solid #B8A0FF33", padding: "16px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 20 }}>{bodyTypeConfig[selectedGoal]?.icon}</span>
                      <p style={{ fontSize: 10, letterSpacing: 3, color: "#B8A0FF", fontFamily: "'Orbitron', monospace" }}>
                        {text.tipsTitle.toUpperCase()}
                      </p>
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                      {coachTips.map((tip, index) => (
                        <div key={index} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 12px", borderRadius: 12, background: isLightMode ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.03)", border: `1px solid ${isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`, animation: `tipSlide 0.3s ease ${index * 0.06}s both` }}>
                          <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{tipIcons[index % tipIcons.length]}</span>
                          <p style={{ color: isLightMode ? "#1A1A2E" : "#D0D0E0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.6 }}>{tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="dark-btn" onClick={() => setEditingGoals({ ...goals })} style={{ borderColor: "#B8A0FF33", color: "#B8A0FF" }}>
                    {language === "es" ? "Cambiar Meta de Cuerpo" : "Change Body Type Goal"}
                  </button>
                </div>
              );
            })()}
          </div>
        )}

        {activeUserId && screen === "workout" && (
          <>
            <div style={{ padding: "14px 20px 0" }}>
              <button
                className="dark-btn"
                onClick={() => {
                  setTodayOnlyMode(false);
                  setScreen("home");
                }}
              >
                {text.backHome}
              </button>
            </div>

            {!todayOnlyMode && (
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ display: "flex", gap: 6, background: "#111115", borderRadius: 14, padding: "8px 8px" }}>
                {days.map(d => {
                  const isActive = d === activeDay;
                  const t = themeFor(workoutData[d].type);

                  return (
                    <button
                      key={d}
                      type="button"
                      className="day-pill"
                      aria-label={`${displayDay(d)} - ${workoutData[d].type}`}
                      aria-pressed={isActive}
                      style={isActive ? { background: t.badge, border: `1.5px solid ${t.accent}50` } : {}}
                      onClick={() => {
                        setActiveDay(d);
                        setActiveSession(0);
                        setExpandedExerciseIndex(null);
                      }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: isActive ? t.accent : "#6E7480", fontFamily: "'Orbitron', monospace" }}>
                        {displayDayShort(d, workoutData[d].label)}
                      </div>
                      <div style={{ fontSize: 8, color: isActive ? t.sub : "#5A5F6A", marginTop: 3, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {workoutData[d].type.slice(0, 3)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
            )}

            <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                  {displayDay(activeDay).toUpperCase()}
                </span>
                <span style={{ fontSize: 11, letterSpacing: 2, color: "#7C828E", fontFamily: "'Orbitron', monospace" }}>
                  {" "}- {day.type}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {total > 0 && (
                  <div style={{ fontSize: 13, color: "#888", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                    <span style={{ color: theme.accent, fontWeight: 700 }}>{done}</span> / {total} {text.doneWord}
                  </div>
                )}
                {total > 0 && (
                  <button
                    className="edit-btn"
                    onClick={() => setQuickMode(prev => !prev)}
                    style={quickMode ? { color: theme.accent, borderColor: theme.accent + "66" } : {}}
                  >
                    {quickMode ? text.full : text.quick}
                  </button>
                )}
                <button
                  className="edit-btn"
                  onClick={() => setEditingRoutine({ dayName: activeDay, sessionIndex: activeSession, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } })}
                >
                  {text.editDay}
                </button>
              </div>
            </div>

            {total > 0 && (
              <div style={{ padding: "10px 20px 0" }}>
                <div style={{ height: 4, background: "#1E1E26", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: theme.accent, borderRadius: 4, transition: "width 0.4s ease" }} />
                </div>
              </div>
            )}

            {total > 0 && (
              <div style={{ padding: "16px 20px 0" }}>
                <div className="home-card" style={{ padding: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
                        {text.restTimer}
                      </p>
                      <p style={{ fontSize: 13, color: "#888", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                        {restTimer.running ? text.recoverNext : text.startAfterSet}
                      </p>
                    </div>

                    <div style={{ position: "relative", width: 112, height: 112, flexShrink: 0 }}>
                      <svg viewBox="0 0 112 112" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                        <circle
                          cx="56"
                          cy="56"
                          r={restTimerRadius}
                          fill="none"
                          stroke="rgba(255,255,255,0.08)"
                          strokeWidth="9"
                        />
                        <circle
                          cx="56"
                          cy="56"
                          r={restTimerRadius}
                          fill="none"
                          stroke={theme.accent}
                          strokeWidth="9"
                          strokeLinecap="round"
                          strokeDasharray={restTimerCircumference}
                          strokeDashoffset={restTimerOffset}
                          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.2s ease", filter: `drop-shadow(0 0 10px ${theme.accent}55)` }}
                        />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                        <p style={{ fontSize: 23, color: "#FFFFFF", fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
                          {formatTimer(restTimer.secondsLeft)}
                        </p>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: "#888", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                          {restTimer.running ? text.restWord : text.readyWord}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                    {[60, 90, 120].map(seconds => (
                      <button key={seconds} className="dark-btn" onClick={() => startRestTimer(seconds)} style={{ padding: "10px 8px" }}>
                        {seconds}s
                      </button>
                    ))}
                  </div>

                  {restTimer.secondsLeft > 0 && (
                    <button className="edit-btn" onClick={stopRestTimer} style={{ width: "100%", marginTop: 10, padding: 10 }}>
                      {text.stopTimer}
                    </button>
                  )}
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

            {quickMode && quickExercise && (
              <div className="fade-up" style={{ padding: "20px" }}>
                <div className="home-card" style={{ minHeight: 360, display: "grid", alignContent: "center", gap: 16 }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                    {text.quickSession}
                  </p>
                  <h2 style={{ fontSize: 26, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 }}>
                    {quickExercise.name}
                  </h2>
                  <div className="metric-grid">
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickExercise.weight}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.weightWord}</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickExercise.sets}x{quickExercise.reps}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.mSets}</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsDone}/{quickTotalSets}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.mDone}</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsLeft}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.leftCap}</p>
                    </div>
                  </div>
                  {quickNote && (
                    <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                      {quickNote.pr ? "PR · " : ""}{quickNote.difficulty ? `RPE ${quickNote.difficulty} · ` : ""}{quickNote.technique || quickNote.pain}
                    </p>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    <button className="dark-btn" onClick={() => updateSetCount(quickExerciseIndex, -1)}>
                      {text.minusSet}
                    </button>
                    <button className="primary-btn" onClick={() => updateSetCount(quickExerciseIndex, 1)}>
                      {text.plusSet}
                    </button>
                  </div>
                  <button className="dark-btn" onClick={() => toggleExercise(quickExerciseIndex)}>
                    {text.markExerciseDone}
                  </button>
                  <button
                    className="dark-btn"
                    onClick={() =>
                      setEditingNote({
                        key: quickExerciseKey,
                        name: quickExercise.name,
                        pain: quickNote?.pain || "",
                        difficulty: quickNote?.difficulty || "",
                        pr: !!quickNote?.pr,
                        technique: quickNote?.technique || "",
                      })
                    }
                  >
                    {text.notesWord}
                  </button>
                  <button className="dark-btn" onClick={() => setQuickMode(false)}>
                    {text.fullSession}
                  </button>
                </div>
              </div>
            )}

            {!quickMode && (
            <div key={`${activeDay}-${activeSession}`} className="fade-up" style={{ padding: "20px 20px 0" }}>
              {session.warmup && (
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 14, border: "1.5px solid #1E1E26", background: "#0F0F14", marginBottom: 16 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#1A1A22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                    ⚡
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 9, letterSpacing: 3, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
                      {text.cardioWarmup}
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
                    {text.edit}
                  </button>
                </div>
              )}

              {session.rest && (
                <div style={{ textAlign: "center", padding: "50px 20px", border: "1.5px solid #1A1A22", borderRadius: 16, background: "#0F0F14" }}>
                  <div style={{ fontSize: 42, marginBottom: 14 }}>🌙</div>
                  <p style={{ fontSize: 14, letterSpacing: 4, color: "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                    {text.recoveryMode}
                  </p>
                  <p style={{ fontSize: 15, color: "#9CA1AC", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
                    {text.restEatRebuild}
                  </p>
                </div>
              )}

              {session.exercises.map((ex, i) => {
                const key = `${activeDay}-${activeSession}-${i}`;
                const isDone = !!checked[key];
                const note = exerciseNotes[key];
                const hasNote = note && (note.pain || note.difficulty || note.pr || note.technique);
                const setsDone = Number(setProgress[key] || 0);
                const totalExerciseSets = Number(ex.sets || 0);
                const setsLeft = Math.max(totalExerciseSets - setsDone, 0);
                const isExpanded = expandedExerciseIndex === i && !isDone;

                if (isExpanded) {
                  const setCompPct2 = totalExerciseSets > 0 ? Math.round((setsDone / totalExerciseSets) * 100) : 0;
                  return (
                    <div
                      key={i}
                      className="home-card fade-up"
                      style={{ marginBottom: 12, borderColor: theme.accent, boxShadow: `0 0 32px ${theme.accent}2A, inset 0 0 0 1px ${theme.accent}22`, padding: "18px 18px 16px", background: isLightMode ? "#FFFFFF" : `linear-gradient(135deg, rgba(19,19,24,0.98) 0%, rgba(12,12,16,0.99) 100%)` }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                            <div style={{ width: 6, height: 6, borderRadius: "50%", background: theme.accent, boxShadow: `0 0 8px ${theme.accent}` }} />
                            <p style={{ fontSize: 9, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                              {language === "es" ? "EJERCICIO ACTIVO" : "ACTIVE EXERCISE"}
                            </p>
                          </div>
                          <h3 style={{ fontSize: 21, fontWeight: 900, fontFamily: "'DM Sans', sans-serif", color: isLightMode ? "#101015" : "#FFFFFF", lineHeight: 1.2 }}>
                            {ex.name}
                          </h3>
                        </div>
                        <button className="edit-btn" onClick={() => setExpandedExerciseIndex(null)} style={{ flexShrink: 0, marginLeft: 10, color: "#888" }}>
                          ↑ {language === "es" ? "Colapsar" : "Collapse"}
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                        <div style={{ padding: "12px 8px", borderRadius: 12, background: isLightMode ? "rgba(0,0,0,0.04)" : `${theme.accent}10`, border: `1px solid ${theme.accent}33`, textAlign: "center" }}>
                          <p style={{ fontSize: 22, fontWeight: 900, color: theme.accent, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{ex.weight}</p>
                          <p style={{ fontSize: 8, letterSpacing: 2, color: "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{text.weightWord}</p>
                        </div>
                        <div style={{ padding: "12px 8px", borderRadius: 12, background: isLightMode ? "rgba(0,0,0,0.04)" : `${theme.accent}10`, border: `1px solid ${theme.accent}33`, textAlign: "center" }}>
                          <p style={{ fontSize: 22, fontWeight: 900, color: theme.accent, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{ex.sets}×{ex.reps}</p>
                          <p style={{ fontSize: 8, letterSpacing: 2, color: "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{text.mSets}×{text.repsWord}</p>
                        </div>
                        <div style={{ padding: "12px 8px", borderRadius: 12, background: setsDone === totalExerciseSets && totalExerciseSets > 0 ? `${theme.accent}22` : (isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"), border: `1px solid ${setsDone === totalExerciseSets && totalExerciseSets > 0 ? theme.accent : "rgba(255,255,255,0.07)"}`, textAlign: "center" }}>
                          <p style={{ fontSize: 22, fontWeight: 900, color: setsDone === totalExerciseSets && totalExerciseSets > 0 ? theme.accent : "#FFFFFF", fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{setCompPct2}%</p>
                          <p style={{ fontSize: 8, letterSpacing: 2, color: "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{language === "es" ? "HECHO" : "DONE"}</p>
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>{text.mSets} {setsDone}/{totalExerciseSets}</span>
                          <span style={{ color: setsLeft === 0 ? "#3FB98A" : theme.accent, fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900 }}>
                            {setsLeft === 0 ? (language === "es" ? "✓ COMPLETO" : "✓ COMPLETE") : `${setsLeft} ${text.leftWord}`}
                          </span>
                        </div>
                        <div style={{ display: "flex", gap: 5 }}>
                          {Array.from({ length: totalExerciseSets }).map((_, si) => (
                            <div
                              key={si}
                              onClick={() => updateSetCount(i, si < setsDone ? -1 : 1)}
                              style={{ flex: 1, height: 10, borderRadius: 6, background: si < setsDone ? theme.accent : (isLightMode ? "#E2E4E9" : "#2A2A34"), transition: "background 0.3s ease", cursor: "pointer", boxShadow: si < setsDone ? `0 0 6px ${theme.accent}88` : "none" }}
                            />
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        <button
                          className="dark-btn"
                          onClick={() => updateSetCount(i, -1)}
                          style={{ padding: "14px 10px", fontSize: 16, fontWeight: 900, color: "#8A8F99" }}
                        >
                          {text.minusSet}
                        </button>
                        <button
                          style={{ padding: "14px 10px", fontSize: 16, fontWeight: 900, borderRadius: 14, border: 0, background: theme.accent, color: isLightMode ? "#FFFFFF" : "#050507", fontFamily: "'Orbitron', monospace", cursor: "pointer", letterSpacing: 1 }}
                          onClick={() => updateSetCount(i, 1)}
                        >
                          {text.plusSet}
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <button
                          className="dark-btn"
                          onClick={() => setEditingNote({ key, name: ex.name, pain: note?.pain || "", difficulty: note?.difficulty || "", pr: !!note?.pr, technique: note?.technique || "" })}
                          style={{ color: hasNote ? theme.accent : "#666", borderColor: hasNote ? `${theme.accent}44` : undefined }}
                        >
                          {text.notesWord} {hasNote ? "✓" : ""}
                        </button>
                        <button
                          className="dark-btn"
                          onClick={() => toggleExercise(i)}
                          style={{ color: "#3FB98A", borderColor: "#3FB98A33" }}
                        >
                          {text.markExerciseDone}
                        </button>
                      </div>
                      {hasNote && (
                        <div style={{ marginTop: 10, padding: "8px 10px", borderRadius: 10, background: `${theme.accent}10`, border: `1px solid ${theme.accent}22` }}>
                          <p style={{ color: theme.accent, fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800 }}>
                            {note.pr ? "⭐ PR · " : ""}{note.difficulty ? `RPE ${note.difficulty} · ` : ""}{note.technique || note.pain}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={i}
                    className={`ex-card${isDone ? " done" : ""}`}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isDone}
                    aria-label={`${ex.name}, ${isDone ? "completed" : "not completed"}`}
                    onClick={() => {
                      if (!isDone) {
                        setExpandedExerciseIndex(i);
                        setHighlightedExerciseIndex(i);
                      } else {
                        toggleExercise(i);
                      }
                    }}
                    onKeyDown={event => {
                      if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) {
                        event.preventDefault();
                        if (!isDone) setExpandedExerciseIndex(i);
                        else toggleExercise(i);
                      }
                    }}
                    style={highlightedExerciseIndex === i && !isDone ? { borderColor: theme.accent, boxShadow: `0 0 22px ${theme.accent}22` } : {}}
                  >
                    <div
                      className="check"
                      style={isDone ? { background: theme.accent, borderColor: theme.accent, color: isLightMode ? "#FFFFFF" : "#000" } : {}}
                      onClick={event => { event.stopPropagation(); toggleExercise(i); }}
                    >
                      {isDone ? "✓" : ""}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: isDone ? "#555" : "#FFFFFF", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ex.name}
                      </p>
                      <p style={{ fontSize: 12, color: isDone ? "#6E7480" : "#888", marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
                        {ex.sets} {text.setsWord} x {ex.reps} {text.repsWord}
                      </p>
                      <p style={{ fontSize: 11, color: isDone ? "#6E7480" : "#AAAAAA", marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                        {text.mSets} {setsDone}/{totalExerciseSets} · {setsLeft} {text.leftWord}
                      </p>
                      {hasNote && (
                        <p style={{ fontSize: 11, color: isDone ? "#6E7480" : theme.accent, marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {note.pr ? "PR · " : ""}{note.difficulty ? `RPE ${note.difficulty} · ` : ""}{note.technique || note.pain || (language === "es" ? "Notas guardadas" : "Notes saved")}
                        </p>
                      )}
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                      <button
                        className="edit-btn"
                        onClick={event => {
                          event.stopPropagation();
                          updateSetCount(i, 1);
                          if (!isDone) setExpandedExerciseIndex(i);
                        }}
                        style={{ color: theme.accent }}
                      >
                        +Set
                      </button>
                      <button
                        className="edit-btn"
                        onClick={event => {
                          event.stopPropagation();
                          updateSetCount(i, -1);
                        }}
                      >
                        -Set
                      </button>
                    </div>

                    <button
                      className="edit-btn"
                      onClick={event => {
                        event.stopPropagation();
                        setEditingNote({
                          key,
                          name: ex.name,
                          pain: note?.pain || "",
                          difficulty: note?.difficulty || "",
                          pr: !!note?.pr,
                          technique: note?.technique || "",
                        });
                      }}
                      style={{ color: hasNote ? theme.accent : "#888" }}
                    >
                      {text.notesWord}
                    </button>

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
                      style={{ padding: "6px 12px", borderRadius: 8, background: isDone ? (isLightMode ? "#E2E4E9" : "#111") : theme.badge, border: `1px solid ${isDone ? (isLightMode ? "#D5D7DD" : "#222") : theme.accent + "40"}`, cursor: "pointer" }}
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
                    { label: text.mExercises, val: total },
                    { label: text.totalSets, val: session.exercises.reduce((a, e) => a + e.sets, 0) },
                    { label: text.progressWord, val: `${pct}%` },
                  ].map(s => (
                    <div key={s.label} className="stat-box">
                      <p style={{ fontSize: 22, fontWeight: 700, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                        {s.val}
                      </p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            )}
          </>
        )}
      </div>

      {showMenu && (
        <div className="modal-backdrop">
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 13, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                  {text.atlasMenu}
                </p>
                <p style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                  {text.signedInAs} {userName}
                </p>
              </div>
              <button className="edit-btn" onClick={() => setShowMenu(false)} style={{ padding: "8px 12px" }}>
                {text.close}
              </button>
            </div>

            <p className="menu-section-label">{text.workoutWord}</p>
            <div style={{ display: "grid", gap: 8, marginBottom: 18, marginTop: 6 }}>
              <button
                className="primary-btn"
                onClick={() => {
                  setShowMenu(false);
                  openWorkout(weeklyMetrics.today);
                }}
              >
                {text.startToday}
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setEditingRoutine({ dayName: activeDay, sessionIndex: activeSession, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } });
                }}
              >
                {text.manageWorkouts}
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  resetWeek();
                  setShowMenu(false);
                }}
              >
                {text.resetWeek}
              </button>
            </div>

            <p className="menu-section-label">{text.pages.toUpperCase()}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8, marginBottom: 18, marginTop: 6 }}>
              {featurePages.map(page => (
                <button
                  key={page.id}
                  className="dark-btn"
                  onClick={() => openFeaturePage(page.id)}
                  style={{ padding: "11px 8px", display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-start" }}
                >
                  <span style={{ width: 18, height: 3, borderRadius: 2, background: page.accent, display: "block" }} />
                  <span style={{ fontWeight: 800, fontSize: 13 }}>{page.label}</span>
                </button>
              ))}
            </div>

            <p className="menu-section-label">{text.appWord}</p>
            <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setShowSettings(true);
                }}
              >
                {text.settings}
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setShowReminders(true);
                }}
              >
                {text.reminders}
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setShowDataTools(true);
                }}
              >
                {text.backupSync}
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              {text.settings.toUpperCase()}
            </p>

            <div className="settings-grid">
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 66, height: 66, borderRadius: 999, overflow: "hidden", border: "1.5px solid #2A2A34", background: "#101015", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {appSettings.avatar
                    ? <img src={appSettings.avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 24, color: "#888" }}>{userName.slice(0, 1).toUpperCase()}</span>}
                </div>
                <div style={{ display: "grid", gap: 8, flex: 1, minWidth: 0 }}>
                  <label className="dark-btn" style={{ textAlign: "center" }}>
                    {appSettings.avatar
                      ? (language === "es" ? "Cambiar foto de perfil" : "Change Profile Photo")
                      : (language === "es" ? "Agregar foto de perfil" : "Add Profile Photo")}
                    <input type="file" accept="image/*" onChange={handleAvatarPhoto} style={{ display: "none" }} />
                  </label>
                  {appSettings.avatar && (
                    <button className="edit-btn" onClick={() => setAppSettings(prev => ({ ...prev, avatar: "" }))}>
                      {language === "es" ? "Quitar foto" : "Remove Photo"}
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ display: "block" }}>
                  <span className="field-label">{language === "es" ? "NOMBRE" : "FIRST NAME"}</span>
                  <input
                    className="input"
                    value={appSettings.firstName}
                    onChange={event => setAppSettings(prev => ({ ...prev, firstName: event.target.value }))}
                    placeholder={language === "es" ? "Nombre" : "First name"}
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{language === "es" ? "APELLIDO" : "LAST NAME"}</span>
                  <input
                    className="input"
                    value={appSettings.lastName}
                    onChange={event => setAppSettings(prev => ({ ...prev, lastName: event.target.value }))}
                    placeholder={language === "es" ? "Apellido" : "Last name"}
                  />
                </label>
              </div>
              <select
                className="input"
                value={appSettings.language}
                onChange={event => setAppSettings(prev => ({ ...prev, language: event.target.value }))}
              >
                {LANGUAGE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <select
                className="input"
                value={appSettings.themeMode}
                onChange={event => setAppSettings(prev => ({ ...prev, themeMode: event.target.value }))}
              >
                {THEME_MODE_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
              <p className="setting-sub">{text.lightStarts}</p>

              <div className="setting-row">
                <div>
                  <p className="setting-title">{language === "es" ? "Notificaciones" : "Notifications"}</p>
                  <p className="setting-sub">
                    {notificationSettings.enabled
                      ? (language === "es" ? "Activadas" : "Enabled")
                      : (language === "es" ? "Permiso no activado" : "Permission not enabled")}
                  </p>
                </div>
                <button className="dark-btn" onClick={requestNotifications}>
                  {language === "es" ? "Activar" : "Enable"}
                </button>
              </div>
              <p className="setting-sub">
                {language === "es"
                  ? "Los recordatorios solo se disparan mientras la app está abierta. Una notificación en segundo plano necesitaría un servidor de push."
                  : "Reminders only fire while the app is open. Background notifications would need a push server."}
              </p>

              <input
                className="input"
                type="time"
                value={notificationSettings.workoutTime}
                onChange={event => setNotificationSettings(prev => ({ ...prev, workoutTime: event.target.value, lastWorkoutNotice: "" }))}
              />
              <input
                className="input"
                value={notificationSettings.workoutMessage}
                onChange={event => setNotificationSettings(prev => ({ ...prev, workoutMessage: event.target.value }))}
                placeholder={language === "es" ? "Mensaje de notificación de entreno" : "Workout notification message"}
              />
              <input
                className="input"
                type="time"
                value={notificationSettings.restTime}
                onChange={event => setNotificationSettings(prev => ({ ...prev, restTime: event.target.value, lastRestNotice: "" }))}
              />
              <input
                className="input"
                value={notificationSettings.restMessage}
                onChange={event => setNotificationSettings(prev => ({ ...prev, restMessage: event.target.value }))}
                placeholder={language === "es" ? "Mensaje de notificación de descanso" : "Recovery notification message"}
              />
              <select
                className="input"
                value={notificationSettings.sound}
                onChange={event => setNotificationSettings(prev => ({ ...prev, sound: event.target.value }))}
              >
                {SOUND_OPTIONS.map(option => (
                  <option key={option} value={option}>{option} tone</option>
                ))}
              </select>

              <button className="dark-btn" onClick={() => playReminderSound(notificationSettings.sound)}>
                {language === "es" ? "Probar tono" : "Test Tone"}
              </button>

              <div className="setting-row">
                <div>
                  <p className="setting-title">{language === "es" ? "Respuesta al tocar" : "Tap feedback"}</p>
                  <p className="setting-sub">
                    {language === "es"
                      ? "Sonido y vibración al tocar un control."
                      : "Click sound and vibration when you tap a control."}
                  </p>
                </div>
                <button
                  className="dark-btn"
                  onClick={() => setAppSettings(prev => ({ ...prev, tapFeedback: prev.tapFeedback === false }))}
                >
                  {appSettings.tapFeedback === false ? (language === "es" ? "No" : "Off") : (language === "es" ? "Sí" : "On")}
                </button>
              </div>

              <button className="dark-btn" onClick={() => {
                setShowSettings(false);
                setShowReminders(true);
              }}>
                {language === "es" ? "Recordatorios personalizados" : "Custom Reminders"}
              </button>
              <button className="dark-btn" onClick={() => {
                setShowSettings(false);
                setShowDataTools(true);
              }}>
                {language === "es" ? "Respaldo / Sincronización" : "Backup / Cloud Sync"}
              </button>
              <button className="dark-btn" onClick={handleLogout}>
                {text.logout}
              </button>
              <button className="dark-btn" onClick={() => setShowSettings(false)}>
                {text.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {showReminders && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              CUSTOM REMINDERS
            </p>

            <div className="settings-grid">
              {(notificationSettings.customReminders || []).map(reminder => (
                <div key={reminder.id} className="setting-row">
                  <div>
                    <p className="setting-title">{reminder.label}</p>
                    <p className="setting-sub">{reminder.time} - {reminder.message} - {reminder.sound}</p>
                  </div>
                  <div style={{ display: "grid", gap: 8 }}>
                    <button className="edit-btn" onClick={() => updateCustomReminder(reminder.id, { enabled: !reminder.enabled })}>
                      {reminder.enabled ? "On" : "Off"}
                    </button>
                    <button className="edit-btn" onClick={() => removeCustomReminder(reminder.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <input
                className="input"
                value={reminderDraft.label}
                onChange={event => setReminderDraft(prev => ({ ...prev, label: event.target.value }))}
                placeholder="Reminder title"
              />
              <input
                className="input"
                type="time"
                value={reminderDraft.time}
                onChange={event => setReminderDraft(prev => ({ ...prev, time: event.target.value }))}
              />
              <input
                className="input"
                value={reminderDraft.message}
                onChange={event => setReminderDraft(prev => ({ ...prev, message: event.target.value }))}
                placeholder="Reminder message"
              />
              <select
                className="input"
                value={reminderDraft.sound}
                onChange={event => setReminderDraft(prev => ({ ...prev, sound: event.target.value }))}
              >
                {SOUND_OPTIONS.map(option => (
                  <option key={option} value={option}>{option} tone</option>
                ))}
              </select>
              <button className="primary-btn" onClick={addCustomReminder}>
                ADD REMINDER
              </button>
              <button className="dark-btn" onClick={() => setShowReminders(false)}>
                {text.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingExercise && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              EDIT WEIGHT
            </p>

            <h3 style={{ fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
              {editingExercise.name}
            </h3>

            <select
              className="input"
              value={editingExercise.weight}
              onChange={event => setEditingExercise(prev => ({ ...prev, weight: event.target.value }))}
            >
              {Array.from(new Set([editingExercise.weight, ...WEIGHT_OPTIONS])).map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingExercise(null)}>
                {text.cancel}
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  updateExerciseWeight(editingExercise);
                  setEditingExercise(null);
                }}
              >
                {text.save}
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

              <select
                className="input"
                value={editingCardio.duration}
                onChange={event => setEditingCardio(prev => ({ ...prev, duration: event.target.value }))}
              >
                {Array.from(new Set([editingCardio.duration, ...CARDIO_OPTIONS])).map(option => (
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
      )}

      {editingNote && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              EXERCISE NOTES
            </p>

            <h3 style={{ fontFamily: "'DM Sans', sans-serif", marginBottom: 14 }}>
              {editingNote.name}
            </h3>

            <div style={{ display: "grid", gap: 10 }}>
              <select
                className="input"
                value={editingNote.pain}
                onChange={event => setEditingNote(prev => ({ ...prev, pain: event.target.value }))}
              >
                {PAIN_OPTIONS.map(option => (
                  <option key={option || "empty"} value={option}>{option || "Pain / discomfort"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingNote.difficulty}
                onChange={event => setEditingNote(prev => ({ ...prev, difficulty: event.target.value }))}
              >
                {RPE_OPTIONS.map(option => (
                  <option key={option || "empty"} value={option}>{option ? `RPE ${option}` : "Difficulty 1-10"}</option>
                ))}
              </select>

              <input
                className="input"
                value={editingNote.technique}
                onChange={event => setEditingNote(prev => ({ ...prev, technique: event.target.value }))}
                placeholder="Technique notes"
              />

              <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                <input
                  type="checkbox"
                  checked={editingNote.pr}
                  onChange={event => setEditingNote(prev => ({ ...prev, pr: event.target.checked }))}
                />
                Mark as PR
              </label>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingNote(null)}>
                {text.cancel}
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1 }}
                onClick={() => saveExerciseNote(editingNote)}
              >
                {text.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDataTools && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              BACKUP / RESTORE
            </p>

            <p style={{ color: "#777", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
              Export your weights, goals, checks, notes, and progress history to a JSON file. Import restores data from a previous backup.
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <button className="primary-btn" onClick={exportData}>
                Export Progress
              </button>

              <label className="dark-btn" style={{ textAlign: "center" }}>
                Import Backup
                <input
                  type="file"
                  accept="application/json"
                  onChange={importDataFile}
                  style={{ display: "none" }}
                />
              </label>

              <p style={{ color: "#FFD060", fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.5 }}>
                Cloud sync sends your data to the endpoint you enter, with no built-in
                authentication. Only use an endpoint you control and trust. Download replaces
                your current data.
              </p>

              <input
                className="input"
                value={cloudSettings.endpoint}
                onChange={event => setCloudSettings(prev => ({ ...prev, endpoint: event.target.value }))}
                placeholder="Cloud sync endpoint URL"
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                <button className="dark-btn" onClick={uploadCloudSync}>
                  Cloud Upload
                </button>
                <button className="dark-btn" onClick={downloadCloudSync}>
                  Cloud Download
                </button>
              </div>

              <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                Cloud status: {cloudSettings.status}
              </p>

              <button className="dark-btn" onClick={() => setShowDataTools(false)}>
                {text.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingRoutine && (() => {
        const routineDay = workoutData[editingRoutine.dayName];
        const safeSessionIndex = Math.min(editingRoutine.sessionIndex, routineDay.sessions.length - 1);
        const routineSession = routineDay.sessions[safeSessionIndex];

        return (
        <div className="modal-backdrop">
          <div className="modal">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <p style={{ fontSize: 13, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                  MANAGE WORKOUTS
                </p>
                <p style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                  Add, edit, or remove exercises and sessions.
                </p>
              </div>
              <button className="edit-btn" onClick={() => setEditingRoutine(null)} style={{ padding: "8px 12px" }}>
                {text.doneBtn}
              </button>
            </div>

            <p className="menu-section-label">DAY</p>
            <select
              className="input"
              style={{ marginTop: 6, marginBottom: 16 }}
              value={editingRoutine.dayName}
              onChange={event => setEditingRoutine(prev => ({ ...prev, dayName: event.target.value, sessionIndex: 0 }))}
            >
              {days.map(dayName => (
                <option key={dayName} value={dayName}>{getDisplayDay(dayName, language)} — {workoutData[dayName].type}</option>
              ))}
            </select>

            <p className="menu-section-label">SESSION</p>
            <div style={{ display: "grid", gap: 8, marginTop: 6, marginBottom: 16 }}>
              <select
                className="input"
                value={safeSessionIndex}
                onChange={event => setEditingRoutine(prev => ({ ...prev, sessionIndex: Number(event.target.value) }))}
              >
                {routineDay.sessions.map((currentSession, index) => (
                  <option key={`${currentSession.name}-${index}`} value={index}>{index + 1}. {currentSession.time} — {currentSession.name}</option>
                ))}
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 8 }}>
                <label style={{ display: "block" }}>
                  <span className="field-label">SESSION NAME</span>
                  <input
                    className="input"
                    value={routineSession?.name || ""}
                    onChange={event => updateRoutineSessionMeta({ name: event.target.value })}
                    placeholder="Session name"
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">TIME</span>
                  <select
                    className="input"
                    value={routineSession?.time || "AM"}
                    onChange={event => updateRoutineSessionMeta({ time: event.target.value })}
                  >
                    {Array.from(new Set([routineSession?.time || "AM", "AM", "PM", "FULL"])).map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                <button className="dark-btn" onClick={addRoutineSession}>Add Session</button>
                <button className="dark-btn" onClick={duplicateRoutineSession}>Duplicate</button>
                <button
                  className="dark-btn"
                  onClick={removeRoutineSession}
                  disabled={routineDay.sessions.length <= 1}
                  style={routineDay.sessions.length <= 1 ? { opacity: 0.4 } : { color: "#E5604D" }}
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="menu-section-label">EXERCISES</p>
            <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
              {(routineSession?.exercises || []).length === 0 && (
                <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "10px 2px" }}>
                  No exercises in this session yet. Add one below.
                </p>
              )}
              {(routineSession?.exercises || []).map((exercise, exerciseIndex) => (
                <div key={`${exercise.name}-${exerciseIndex}`} style={{ border: "1px solid #24242E", borderRadius: 12, padding: 12, display: "grid", gap: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="field-label" style={{ marginBottom: 0 }}>EXERCISE {exerciseIndex + 1}</span>
                    <button className="edit-btn" onClick={() => removeRoutineExercise(exerciseIndex)} style={{ color: "#E5604D" }}>
                      Remove
                    </button>
                  </div>
                  <input className="input" value={exercise.name} onChange={event => updateRoutineExercise(exerciseIndex, { name: event.target.value })} placeholder="Exercise name" />
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                    <select className="input" value={exercise.sets} onChange={event => updateRoutineExercise(exerciseIndex, { sets: event.target.value })}>
                      {SET_OPTIONS.map(option => <option key={option} value={option}>{option} sets</option>)}
                    </select>
                    <select className="input" value={exercise.reps} onChange={event => updateRoutineExercise(exerciseIndex, { reps: event.target.value })}>
                      {Array.from(new Set([String(exercise.reps), ...REP_OPTIONS])).map(option => <option key={option} value={option}>{option} reps</option>)}
                    </select>
                    <select className="input" value={exercise.weight} onChange={event => updateRoutineExercise(exerciseIndex, { weight: event.target.value })}>
                      {Array.from(new Set([exercise.weight, ...WEIGHT_OPTIONS])).map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <p className="menu-section-label" style={{ marginTop: 16 }}>ADD EXERCISE</p>
            <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 8 }}>
                <select
                  className="input"
                  value={exerciseFilterMuscle}
                  onChange={event => setExerciseFilterMuscle(event.target.value)}
                >
                  {EXERCISE_MUSCLE_GROUPS.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                <select
                  className="input"
                  value={editingRoutine.draft.name}
                  onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, name: event.target.value } }))}
                >
                  <option value="">{language === "es" ? "Seleccionar ejercicio" : "Select exercise"}</option>
                  {(exerciseFilterMuscle === "All"
                    ? Object.values(COMMON_EXERCISES).flat()
                    : (COMMON_EXERCISES[exerciseFilterMuscle] || [])
                  ).map(ex => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>
              <input
                className="input"
                value={editingRoutine.draft.name}
                onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, name: event.target.value } }))}
                placeholder={language === "es" ? "O escribe el nombre del ejercicio" : "Or type a custom exercise name"}
              />
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                <select className="input" value={editingRoutine.draft.sets} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, sets: event.target.value } }))}>
                  {SET_OPTIONS.map(option => <option key={option} value={option}>{option} sets</option>)}
                </select>
                <select className="input" value={editingRoutine.draft.reps} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, reps: event.target.value } }))}>
                  {REP_OPTIONS.map(option => <option key={option} value={option}>{option} reps</option>)}
                </select>
                <select className="input" value={editingRoutine.draft.weight} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, weight: event.target.value } }))}>
                  {WEIGHT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                </select>
              </div>
              <button className="primary-btn" onClick={addRoutineExercise}>
                {language === "es" ? "Agregar Ejercicio" : "Add Exercise"}
              </button>
              <button className="dark-btn" onClick={() => setEditingRoutine(null)}>
                {text.doneBtn}
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {editingProfile && (() => {
        const editBmi = calculateBMI(editingProfile.currentWeight, editingProfile.height);
        const editBf = calculateBodyFatPct(editBmi, editingProfile.age, editingProfile.sex || "male");
        const editIbw = calculateIBW(editingProfile.height, editingProfile.sex || "male");
        const editLean = getLeanMass(editingProfile.currentWeight, editBf);
        return (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              {language === "es" ? "EDITAR ESTADO CORPORAL" : "EDIT BODY STATUS"}
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
                    {GENDER_OPTIONS.map(option => (
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
                    {Array.from(new Set([editingProfile.age || "30", ...AGE_OPTIONS])).map(option => (
                      <option key={option} value={option}>{option} {language === "es" ? "años" : "yrs"}</option>
                    ))}
                  </select>
                </label>
              </div>

              <select
                className="input"
                value={editingProfile.currentWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, currentWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.currentWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} LB {language === "es" ? "actual" : "current"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.startWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, startWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.startWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} LB {language === "es" ? "inicio" : "start"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.targetWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, targetWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.targetWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} LB {language === "es" ? "meta" : "target"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.height}
                onChange={event => setEditingProfile(prev => ({ ...prev, height: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.height, ...HEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>

              <input
                className="input"
                type="date"
                value={editingProfile.startDate}
                onChange={event => setEditingProfile(prev => ({ ...prev, startDate: event.target.value }))}
                placeholder="Start date"
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
                      { label: text.leanMassLabel, val: `${editLean} LB` },
                      { label: text.ibwLabel, val: `${editIbw} LB` },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 16, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>{item.val}</p>
                        <p style={{ fontSize: 9, letterSpacing: 1, color: "#666", fontFamily: "'Orbitron', monospace", marginTop: 3 }}>{item.label}</p>
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
      })()}

      {editingGoals && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              {language === "es" ? "DEFINIR MIS METAS" : "SET MY GOALS"}
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <input
                className="input"
                value={editingGoals.focusGoal}
                onChange={event => setEditingGoals(prev => ({ ...prev, focusGoal: event.target.value }))}
                placeholder={language === "es" ? "Meta principal" : "Main goal"}
              />

              <label style={{ display: "block" }}>
                <span className="field-label">{text.bodyTypeLabel.toUpperCase()}</span>
                <select
                  className="input"
                  value={editingGoals.bodyTypeGoal || "athletic"}
                  onChange={event => setEditingGoals(prev => ({ ...prev, bodyTypeGoal: event.target.value }))}
                >
                  {BODY_TYPE_GOAL_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === "es"
                        ? ({ lean: "Definir / Cortar", athletic: "Recomposición Atlética", muscular: "Ganar Músculo / Volumen", maintain: "Mantener & Tonificar" }[option.value] || option.label)
                        : option.label}
                    </option>
                  ))}
                </select>
              </label>

              <select
                className="input"
                value={editingGoals.weeklyProgressGoal}
                onChange={event => setEditingGoals(prev => ({ ...prev, weeklyProgressGoal: event.target.value }))}
              >
                {Array.from(new Set([editingGoals.weeklyProgressGoal, ...PROGRESS_GOAL_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option}% weekly goal</option>
                ))}
              </select>

              <select
                className="input"
                value={editingGoals.weeklySessionsGoal}
                onChange={event => setEditingGoals(prev => ({ ...prev, weeklySessionsGoal: event.target.value }))}
              >
                {Array.from(new Set([editingGoals.weeklySessionsGoal, ...SESSION_GOAL_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} sessions</option>
                ))}
              </select>

              <input
                className="input"
                type="date"
                value={editingGoals.targetDate}
                onChange={event => setEditingGoals(prev => ({ ...prev, targetDate: event.target.value }))}
                placeholder="Target date"
              />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingGoals(null)}>
                {text.cancel}
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  setGoals(editingGoals);
                  setEditingGoals(null);
                }}
              >
                {text.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewingPhoto && (
        <div className="modal-backdrop" onClick={() => setViewingPhoto(null)}>
          <div className="modal" onClick={event => event.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 13, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                VIEW PHOTO
              </p>
              <button className="edit-btn" onClick={() => setViewingPhoto(null)} style={{ padding: "8px 12px" }}>
                {text.close}
              </button>
            </div>

            <img
              src={viewingPhoto.dataUrl}
              alt={viewingPhoto.note || "Progress photo"}
              style={{ width: "100%", maxHeight: "52vh", objectFit: "contain", borderRadius: 12, border: "1px solid #24242E", background: "#050507", display: "block" }}
            />

            <div className="detail-grid" style={{ marginTop: 12 }}>
              <div className="detail-card"><p className="detail-label">DATE</p><p className="detail-value">{viewingPhoto.date}</p></div>
              <div className="detail-card"><p className="detail-label">WEIGHT</p><p className="detail-value">{viewingPhoto.weight} LB</p></div>
            </div>

            <div className="detail-card" style={{ marginTop: 10 }}>
              <p className="detail-label">NOTE</p>
              <p className="detail-value" style={{ fontSize: 14 }}>{viewingPhoto.note || "No note"}</p>
            </div>

            <label style={{ display: "block", marginTop: 10 }}>
              <span className="field-label">ALBUM</span>
              <select
                className="input"
                value={viewingPhoto.album || ""}
                onChange={event => updatePhotoAlbum(viewingPhoto.id, event.target.value)}
              >
                <option value="">No album</option>
                {photoAlbums.map(album => <option key={album} value={album}>{album}</option>)}
              </select>
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setViewingPhoto(null)}>
                {text.close}
              </button>
              <button className="dark-btn" style={{ flex: 1, color: "#E5604D" }} onClick={() => deleteProgressPhoto(viewingPhoto.id)}>
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
