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
  workout: "atlas-luthor-workout-data",
  checked: "atlas-luthor-checked",
  lastProgression: "atlas-luthor-last-progression-review",
  profile: "atlas-luthor-profile",
  goals: "atlas-luthor-goals",
  progressLog: "atlas-luthor-progress-log",
  exerciseNotes: "atlas-luthor-exercise-notes",
  calendarLog: "atlas-luthor-calendar-log",
  progressPhotos: "atlas-luthor-progress-photos",
  photoAlbums: "atlas-luthor-photo-albums",
  cloudSettings: "atlas-luthor-cloud-settings",
  notificationSettings: "atlas-luthor-notification-settings",
  setProgress: "atlas-luthor-set-progress",
  appSettings: "atlas-luthor-app-settings",
  users: "atlas-luthor-users",
  activeUser: "atlas-luthor-active-user",
};

const DEFAULT_PROFILE = {
  currentWeight: "197",
  startWeight: "197",
  targetWeight: "185",
  height: "5'9\"",
  startDate: "2026-03-23",
};

const DEFAULT_GOALS = {
  weeklyProgressGoal: "90",
  weeklySessionsGoal: "10",
  targetDate: "2026-04-09",
  focusGoal: "Build strength and finish the protocol",
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

const DEFAULT_APP_SETTINGS = {
  firstName: "Atlas",
  lastName: "",
  name: "Atlas",
  avatar: "",
  language: "en",
  themeMode: "auto",
};

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
  language: "en",
  trainingPlan: "blank",
};

const WEIGHT_OPTIONS = Array.from({ length: 61 }, (_, index) => `${index * 5} lb`);
const BODY_WEIGHT_OPTIONS = Array.from({ length: 121 }, (_, index) => String(120 + index));
const HEIGHT_OPTIONS = ["5'0\"", "5'1\"", "5'2\"", "5'3\"", "5'4\"", "5'5\"", "5'6\"", "5'7\"", "5'8\"", "5'9\"", "5'10\"", "5'11\"", "6'0\"", "6'1\"", "6'2\"", "6'3\"", "6'4\""];
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
  },
  es: {
    goodMorning: "Buenos días",
    goodNight: "Buenas noches",
    todayCommand: "Comando de Hoy",
    bodyStatus: "Estado Corporal",
    atlasScore: "Puntaje Atlas",
    monthCalendar: "Calendario Mensual",
    prTracker: "Récords Personales",
    fatigueDeload: "Fatiga / Deload",
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

function getDateKey() {
  return new Date().toISOString().slice(0, 10);
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
  const map = ["Domingo", "Lunes", "Martes", "MiÃ©rcoles", "Jueves", "Viernes", "SÃ¡bado"];
  return map[date.getDay()];
}

function getAutoTheme(hour = new Date().getHours()) {
  return hour >= 13 ? "dark" : "light";
}

function getGreetingKey(hour = new Date().getHours()) {
  return hour >= 18 ? "goodNight" : "goodMorning";
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
  const [checked, setChecked] = useState(() => safeLoad(STORAGE_KEYS.checked, {}));
  const [workoutData, setWorkoutData] = useState(() => safeLoad(STORAGE_KEYS.workout, baseWorkoutData));
  const [editingExercise, setEditingExercise] = useState(null);
  const [editingCardio, setEditingCardio] = useState(null);
  const [lastProgressionReview, setLastProgressionReview] = useState(() =>
    safeLoad(STORAGE_KEYS.lastProgression, null)
  );
  const [profile, setProfile] = useState(() => safeLoad(STORAGE_KEYS.profile, DEFAULT_PROFILE));
  const [goals, setGoals] = useState(() => safeLoad(STORAGE_KEYS.goals, DEFAULT_GOALS));
  const [progressLog, setProgressLog] = useState(() => safeLoad(STORAGE_KEYS.progressLog, []));
  const [exerciseNotes, setExerciseNotes] = useState(() => safeLoad(STORAGE_KEYS.exerciseNotes, {}));
  const [calendarLog, setCalendarLog] = useState(() => safeLoad(STORAGE_KEYS.calendarLog, {}));
  const [progressPhotos, setProgressPhotos] = useState(() => safeLoad(STORAGE_KEYS.progressPhotos, []));
  const [photoAlbums, setPhotoAlbums] = useState(() => safeLoad(STORAGE_KEYS.photoAlbums, []));
  const [cloudSettings, setCloudSettings] = useState(() => safeLoad(STORAGE_KEYS.cloudSettings, DEFAULT_CLOUD_SETTINGS));
  const [appSettings, setAppSettings] = useState(() => ({
    ...DEFAULT_APP_SETTINGS,
    ...safeLoad(STORAGE_KEYS.appSettings, DEFAULT_APP_SETTINGS),
  }));
  const [notificationSettings, setNotificationSettings] = useState(() => {
    const saved = safeLoad(STORAGE_KEYS.notificationSettings, DEFAULT_NOTIFICATION_SETTINGS);

    return {
      ...DEFAULT_NOTIFICATION_SETTINGS,
      ...saved,
      customReminders: Array.isArray(saved.customReminders) ? saved.customReminders : [],
    };
  });
  const [setProgress, setSetProgress] = useState(() => safeLoad(STORAGE_KEYS.setProgress, {}));
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
  const notifiedTimersRef = useRef(new Set());
  const loadedUserRef = useRef("");

  const day = workoutData[activeDay];
  const session = day.sessions[Math.min(activeSession, day.sessions.length - 1)];

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.activeUser, JSON.stringify(activeUserId));
  }, [activeUserId]);

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
    window.localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.goals, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.progressLog, JSON.stringify(progressLog));
  }, [progressLog]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.exerciseNotes, JSON.stringify(exerciseNotes));
  }, [exerciseNotes]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.calendarLog, JSON.stringify(calendarLog));
  }, [calendarLog]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.progressPhotos, JSON.stringify(progressPhotos));
  }, [progressPhotos]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.photoAlbums, JSON.stringify(photoAlbums));
  }, [photoAlbums]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.cloudSettings, JSON.stringify(cloudSettings));
  }, [cloudSettings]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.appSettings, JSON.stringify(appSettings));
  }, [appSettings]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.notificationSettings, JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.setProgress, JSON.stringify(setProgress));
  }, [setProgress]);

  useEffect(() => {
    if (!activeUserId || !users[activeUserId]) return;

    setUsers(prev => ({
      ...prev,
      [activeUserId]: {
        ...prev[activeUserId],
        name: `${appSettings.firstName || ""} ${appSettings.lastName || ""}`.trim() || appSettings.name || "Atlas",
        updatedAt: new Date().toISOString(),
        data: {
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
        },
      },
    }));
  }, [
    activeUserId,
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
    const status = dayExercises === 0 ? "rest" : dayDone === dayExercises ? "completed" : dayDone > 0 ? "trained" : "missed";

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
      const logged = calendarLog[cell.key];
      const isPast = cell.key < getDateKey();
      const status = logged?.status || (isPast ? "missed" : "planned");
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
    const nextAppSettings = { ...DEFAULT_APP_SETTINGS, ...(data?.appSettings || {}) };

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
    };
  };

  const handleSignup = () => {
    const userId = signupDraft.userId.trim().toLowerCase();
    const password = signupDraft.password.trim();

    if (!userId || !password || !signupDraft.firstName.trim()) {
      setAuthError("Add your first name, a User ID, and a password.");
      return;
    }

    if (users[userId]) {
      setAuthError("That User ID already exists. Log in instead.");
      return;
    }

    const data = createUserDataFromSignup(signupDraft);
    const nextUser = {
      id: userId,
      userId,
      password,
      name: `${signupDraft.firstName.trim()} ${signupDraft.lastName.trim()}`.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      data,
    };

    setUsers(prev => ({ ...prev, [userId]: nextUser }));
    applyUserData(data);
    setActiveUserId(userId);
    setAuthError("");
  };

  const handleLogin = () => {
    const userId = loginDraft.userId.trim().toLowerCase();
    const password = loginDraft.password.trim();
    const user = users[userId];

    if (!user || user.password !== password) {
      setAuthError("User ID not found or password is incorrect.");
      return;
    }

    applyUserData(user.data);
    setActiveUserId(userId);
    setAuthError("");
  };

  const handleLogout = () => {
    setShowMenu(false);
    setShowSettings(false);
    setActiveUserId("");
    loadedUserRef.current = "";
    setLoginDraft({ userId: "", password: "" });
    setAuthMode("login");
    setScreen("home");
  };

  useEffect(() => {
    if (!activeUserId || !users[activeUserId] || loadedUserRef.current === activeUserId) return;

    loadedUserRef.current = activeUserId;
    applyUserData(users[activeUserId].data);
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
        if (data.appSettings) setAppSettings({ ...DEFAULT_APP_SETTINGS, ...data.appSettings });
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

    try {
      const response = await fetch(cloudSettings.endpoint);
      const parsed = await response.json();
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
      if (data.appSettings) setAppSettings({ ...DEFAULT_APP_SETTINGS, ...data.appSettings });
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

  const handleAvatarPhoto = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAppSettings(prev => ({ ...prev, avatar: String(reader.result) }));
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleProgressPhoto = event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhotoDraft(prev => ({ ...prev, dataUrl: String(reader.result) }));
      event.target.value = "";
    };
    reader.readAsDataURL(file);
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
        .app-header { position: relative; padding: calc(56px + env(safe-area-inset-top)) 20px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .industry-mark { font-size: 10px; letter-spacing: 4px; color: #A7A7AD; font-family: 'Orbitron', monospace; margin-bottom: 18px; font-weight: 900; }
        .menu-button { position: absolute; top: calc(16px + env(safe-area-inset-top)); right: 16px; width: 44px; height: 44px; border-radius: 13px; border: 1.5px solid rgba(255,255,255,0.12); background: rgba(12,12,16,0.72); backdrop-filter: blur(18px); display: inline-flex; align-items: center; justify-content: center; gap: 4px; flex-direction: column; cursor: pointer; }
        .menu-button span { width: 18px; height: 2px; border-radius: 2px; background: #FFFFFF; display: block; }
        .day-pill { cursor: pointer; flex: 1; padding: 10px 4px; border-radius: 10px; text-align: center; border: 1px solid transparent; transition: all 0.2s; }
        .session-tab { cursor: pointer; flex: 1; padding: 12px 10px; border-radius: 10px; border: 1.5px solid rgba(255,255,255,0.08); background: rgba(20,20,24,0.78); backdrop-filter: blur(16px); transition: all 0.2s; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; color: #888; text-align: center; }
        .ex-card { display: flex; align-items: center; gap: 14px; padding: 16px; border-radius: 14px; border: 1.5px solid rgba(255,255,255,0.075); background: rgba(19,19,24,0.82); backdrop-filter: blur(16px); cursor: pointer; transition: all 0.2s; margin-bottom: 10px; }
        .ex-card:hover { border-color: rgba(255,255,255,0.14); background: rgba(24,24,32,0.88); }
        .ex-card.done { opacity: 0.35; }
        .check { width: 26px; height: 26px; border-radius: 8px; border: 2px solid #333; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px; transition: all 0.2s; color: #000; font-weight: 700; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
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
        .setting-sub { color: #777; font-family: 'DM Sans', sans-serif; font-size: 12px; line-height: 1.4; margin-top: 3px; min-width: 0; overflow-wrap: anywhere; }
        .feature-page { padding: 20px; }
        .feature-hero { background: rgba(19,19,24,0.86); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 18px; backdrop-filter: blur(18px); margin-bottom: 14px; }
        .feature-title { font-size: 25px; color: #FFFFFF; font-weight: 900; font-family: 'Orbitron', monospace; letter-spacing: 2px; line-height: 1.05; margin-top: 8px; }
        .feature-copy { color: #777; font-family: 'DM Sans', sans-serif; font-size: 14px; line-height: 1.55; margin-top: 10px; }
        .detail-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .detail-card { border: 1px solid #24242E; background: #101015; border-radius: 12px; padding: 12px; min-width: 0; }
        .detail-label { color: #666; font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 2px; margin-bottom: 5px; }
        .detail-value { color: #FFFFFF; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 900; overflow-wrap: anywhere; }
        .detail-list { display: grid; gap: 10px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid #24242E; background: #101015; border-radius: 12px; padding: 12px; font-family: 'DM Sans', sans-serif; min-width: 0; }
        .detail-row-main { color: #FFFFFF; font-size: 14px; font-weight: 900; min-width: 0; overflow-wrap: anywhere; }
        .detail-row-sub { color: #777; font-size: 12px; line-height: 1.35; margin-top: 3px; min-width: 0; overflow-wrap: anywhere; }

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
        .light-mode [style*="#24242E"] {
          background: rgba(255,255,255,0.86) !important;
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
          <button className="menu-button" type="button" aria-label="Open settings menu" onClick={() => setShowMenu(true)} style={!activeUserId ? { display: "none" } : {}}>
            <span />
            <span />
            <span />
          </button>
          <p className="industry-mark">
            FUENMAYOR INDUSTRIES
          </p>
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
            {profile.startDate} - {goals.targetDate} · {profile.currentWeight} LB · {profile.height}
          </p>
        </div>

        {!activeUserId && authMode === "landing" && (
          <div className="fade-up feature-page">
            <div className="feature-hero">
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>
                WELCOME TO ATLAS LUTHOR
              </p>
              <h2 className="feature-title">Train With Purpose</h2>
              <p className="feature-copy">
                Atlas Luthor turns your training into a clear daily mission. Follow a structured plan, log every set, and watch your strength, body, and consistency climb week after week.
              </p>
              <p className="feature-copy" style={{ marginTop: 8, fontWeight: 700 }}>
                Create your free profile and start your first session today.
              </p>
            </div>

            <div className="home-card" style={{ marginBottom: 14, display: "grid", gap: 14 }}>
              {[
                { title: "Build your routine", copy: "Start with the Atlas Push/Pull/Legs protocol or create your own split, then edit it any time." },
                { title: "Track every workout", copy: "Check off sets, run rest timers, add notes, and mark personal records as you train." },
                { title: "See your progress", copy: "Month calendar, weekly metrics, body status, progress photos, and a live Atlas Score." },
              ].map(item => (
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
              <button className="primary-btn" onClick={() => { setAuthMode("signup"); setAuthError(""); }}>GET STARTED</button>
              <button className="dark-btn" onClick={() => { setAuthMode("login"); setAuthError(""); }}>I already have an account</button>
            </div>
          </div>
        )}

        {!activeUserId && authMode !== "landing" && (
          <div className="fade-up feature-page">
            <button className="dark-btn" onClick={() => { setAuthMode("landing"); setAuthError(""); }} style={{ marginBottom: 14 }}>
              Back
            </button>

            <div className="feature-hero">
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>
                {authMode === "signup" ? "CREATE PROFILE" : "WELCOME BACK"}
              </p>
              <h2 className="feature-title">{authMode === "signup" ? "Sign Up" : "Login"}</h2>
              <p className="feature-copy">
                {authMode === "signup"
                  ? "Create a local Atlas profile so your workout data, goals, body status, photos, notes, language, and theme stay tied to you."
                  : "Log back into your local Atlas profile and continue from your own protocol state."}
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
                  <span className="field-label">USER ID</span>
                  <input className="input" value={loginDraft.userId} onChange={event => setLoginDraft(prev => ({ ...prev, userId: event.target.value }))} placeholder="User ID" />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">PASSWORD</span>
                  <input className="input" type="password" value={loginDraft.password} onChange={event => setLoginDraft(prev => ({ ...prev, password: event.target.value }))} placeholder="Password" />
                </label>
                <button className="primary-btn" onClick={handleLogin}>LOGIN</button>
                <button className="dark-btn" onClick={() => { setAuthMode("signup"); setAuthError(""); }}>Create new account</button>
              </div>
            ) : (
              <div className="home-card" style={{ display: "grid", gap: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <label style={{ display: "block" }}>
                    <span className="field-label">FIRST NAME</span>
                    <input className="input" value={signupDraft.firstName} onChange={event => setSignupDraft(prev => ({ ...prev, firstName: event.target.value }))} placeholder="First name" />
                  </label>
                  <label style={{ display: "block" }}>
                    <span className="field-label">LAST NAME</span>
                    <input className="input" value={signupDraft.lastName} onChange={event => setSignupDraft(prev => ({ ...prev, lastName: event.target.value }))} placeholder="Last name" />
                  </label>
                </div>
                <label style={{ display: "block" }}>
                  <span className="field-label">USER ID</span>
                  <input className="input" value={signupDraft.userId} onChange={event => setSignupDraft(prev => ({ ...prev, userId: event.target.value }))} placeholder="Choose a User ID" />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">PASSWORD</span>
                  <input className="input" type="password" value={signupDraft.password} onChange={event => setSignupDraft(prev => ({ ...prev, password: event.target.value }))} placeholder="Choose a password" />
                </label>

                <div style={{ border: "1.5px solid #90C8FF55", borderRadius: 14, padding: 12, display: "grid", gap: 8 }}>
                  <span className="field-label" style={{ color: "#90C8FF" }}>CHOOSE YOUR STARTING ROUTINE</span>
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
                        <span style={{ display: "block", fontWeight: 800 }}>{option.label}</span>
                        <span style={{ display: "block", fontSize: 12, color: "#888", marginTop: 3, fontWeight: 500 }}>
                          {option.value === "atlas"
                            ? "Pre-loaded Push / Pull / Legs split, ready to train today."
                            : "Empty week. Add your own exercises after sign up."}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <label style={{ display: "block" }}>
                  <span className="field-label">CURRENT WEIGHT</span>
                  <select className="input" value={signupDraft.currentWeight} onChange={event => setSignupDraft(prev => ({ ...prev, currentWeight: event.target.value }))}>
                    {BODY_WEIGHT_OPTIONS.map(option => <option key={option} value={option}>{option} LB</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">TARGET WEIGHT</span>
                  <select className="input" value={signupDraft.targetWeight} onChange={event => setSignupDraft(prev => ({ ...prev, targetWeight: event.target.value }))}>
                    {BODY_WEIGHT_OPTIONS.map(option => <option key={option} value={option}>{option} LB</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">HEIGHT</span>
                  <select className="input" value={signupDraft.height} onChange={event => setSignupDraft(prev => ({ ...prev, height: event.target.value }))}>
                    {HEIGHT_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                  </select>
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">START DATE</span>
                  <input className="input" type="date" value={signupDraft.startDate} onChange={event => setSignupDraft(prev => ({ ...prev, startDate: event.target.value }))} />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">TARGET DATE</span>
                  <input className="input" type="date" value={signupDraft.targetDate} onChange={event => setSignupDraft(prev => ({ ...prev, targetDate: event.target.value }))} />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">MAIN GOAL</span>
                  <input className="input" value={signupDraft.focusGoal} onChange={event => setSignupDraft(prev => ({ ...prev, focusGoal: event.target.value }))} placeholder="Main goal" />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">LANGUAGE</span>
                  <select className="input" value={signupDraft.language} onChange={event => setSignupDraft(prev => ({ ...prev, language: event.target.value }))}>
                    {LANGUAGE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                </label>
                <button className="primary-btn" onClick={handleSignup}>SIGN UP</button>
                <button className="dark-btn" onClick={() => { setAuthMode("login"); setAuthError(""); }}>I already have an account</button>
              </div>
            )}
          </div>
        )}

        {activeUserId && screen === "home" && (
          <div className="fade-up" style={{ padding: "20px" }}>
            <div className="feature-hero" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <div
                  onClick={() => { setShowMenu(false); setShowSettings(true); }}
                  style={{ width: 58, height: 58, borderRadius: 999, overflow: "hidden", border: `2px solid ${themeFor(weeklyMetrics.todayType).accent}`, background: isLightMode ? "#E9EAEE" : "#101015", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  {userAvatar
                    ? <img src={userAvatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 22, color: "#888" }}>{userName.slice(0, 1).toUpperCase()}</span>}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace" }}>
                    {activeThemeMode.toUpperCase()} MODE
                  </p>
                  <h2 className="feature-title" style={{ marginTop: 4 }}>
                    {greeting}, {userName}
                  </h2>
                </div>
              </div>
              <p className="feature-copy">
                {language === "es"
                  ? `Hoy es ${todayDisplayName}. Tu protocolo ${weeklyMetrics.todayType} está listo con ${weeklyMetrics.weeklyProgress}% de progreso semanal.`
                  : `Today is ${todayDisplayName}. Your ${weeklyMetrics.todayType} protocol is ready with ${weeklyMetrics.weeklyProgress}% weekly progress.`}
              </p>
            </div>

            <div className="home-card" style={{ marginBottom: 14, borderColor: "#2A2A34" }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                TODAY - {displayDayShort(weeklyMetrics.today, weeklyMetrics.todayLabel)} / {weeklyMetrics.todayType}
              </p>

              <h2 style={{ fontSize: 25, fontFamily: "'Orbitron', monospace", letterSpacing: 2, marginBottom: 8 }}>
                {todayDisplayName}
              </h2>

              <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                Weekly progress is at <span style={{ color: "#FFFFFF", fontWeight: 800 }}>{weeklyMetrics.weeklyProgress}%</span>. Keep the protocol moving.
              </p>

              <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
                START TODAY
              </button>

              <div className="compact-actions">
                <button className="dark-btn" onClick={() => openWorkout(weeklyMetrics.today, { todayOnly: true })}>
                  Today Only
                </button>
                <button className="dark-btn" onClick={() => openWorkout(weeklyMetrics.today, { todayOnly: true, quick: true })}>
                  Quick
                </button>
                <button className="dark-btn" onClick={resetWeek}>
                  Reset Week
                </button>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    BODY STATUS
                  </p>
                  <p style={{ fontSize: 28, color: "#FFFFFF", fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
                    {profile.currentWeight} LB
                  </p>
                </div>

                <button className="edit-btn" onClick={() => setEditingProfile({ ...profile })}>
                  Edit
                </button>
              </div>

              <div className="metric-grid">
                {[
                  { label: "START", val: `${profile.startWeight} LB` },
                  { label: "TARGET", val: `${profile.targetWeight} LB` },
                  { label: "CHANGE", val: `${signedNumber(weightChange)} LB` },
                  { label: "TO GOAL", val: `${signedNumber(weightToGoal)} LB` },
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
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                ATLAS SCORE
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 92, height: 92, borderRadius: "50%", border: `8px solid ${isLightMode ? "#101015" : "#FFFFFF"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isLightMode ? "0 0 18px rgba(20,24,36,0.12)" : "0 0 24px rgba(255,255,255,0.12)" }}>
                  <span style={{ fontSize: 25, fontWeight: 900, fontFamily: "'Orbitron', monospace" }}>{atlasScore}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 800 }}>
                    {deloadWarning ? "Deload warning active" : "Protocol status stable"}
                  </p>
                  <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
                    Avg RPE {averageRpe || "N/A"} · PRs {prEntries.length} · Streak {weeklyStreak}
                  </p>
                </div>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                MONTH CALENDAR
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6, marginBottom: 10 }}>
                {weekHeaderLabels.map((label, index) => (
                  <p key={`${label}-${index}`} style={{ color: "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
                ))}
                {calendarCells.map((cell, index) => {
                  if (!cell) return <div key={`blank-${index}`} />;

                  const logged = calendarLog[cell.key];
                  const todayKey = getDateKey();
                  const isPast = cell.key < todayKey;
                  const isToday = cell.key === todayKey;
                  const status = logged?.status || (isPast ? "missed" : "planned");
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
                      {CALENDAR_STATUS[status].label}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                PR TRACKER
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {(prEntries.length ? prEntries.slice(0, 5) : [{ key: "empty", exerciseName: "No PRs marked yet", sessionName: "Use Notes > Mark as PR", weight: "", date: "" }]).map(entry => (
                  <div key={entry.key} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: "#101015", border: "1px solid #24242E", borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 800 }}>{entry.exerciseName}</span>
                    <span style={{ color: "#888", fontSize: 12, fontWeight: 700 }}>{entry.weight} {entry.date}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14, borderColor: deloadWarning ? "#FFD06066" : "rgba(255,255,255,0.075)" }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: deloadWarning ? "#FFD060" : "#777", fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                FATIGUE / DELOAD
              </p>
              <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 800 }}>
                Average RPE: {averageRpe || "No RPE notes yet"}
              </p>
              <p style={{ color: deloadWarning ? "#FFD060" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
                {deloadWarning ? "Consider lowering load, adding rest, or keeping sets submaximal." : "No deload signal from current notes."}
              </p>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    MY GOALS
                  </p>
                  <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 700 }}>
                    {goals.focusGoal}
                  </p>
                </div>

                <button className="edit-btn" onClick={() => setEditingGoals({ ...goals })}>
                  Set
                </button>
              </div>

              <div style={{ display: "grid", gap: 12 }}>
                {[
                  { label: "Weekly protocol", current: `${weeklyMetrics.weeklyProgress}%`, target: `${goals.weeklyProgressGoal}%`, pct: weeklyGoalPct },
                  { label: "Completed sessions", current: weeklyMetrics.completedSessions, target: goals.weeklySessionsGoal, pct: sessionsGoalPct },
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
                  <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    PROGRESS MEMORY
                  </p>
                  <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                    {latestProgress
                      ? `Last saved ${latestProgress.date}: ${latestProgress.weight} LB, ${latestProgress.weeklyProgress}% weekly.`
                      : "No progress saved yet."}
                  </p>
                </div>

                <button className="edit-btn" onClick={rememberProgress}>
                  Save
                </button>
              </div>

              {progressSaved && (
                <p style={{ color: "#90C8FF", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700, marginBottom: 10 }}>
                  Progress saved.
                </p>
              )}

              <div style={{ display: "grid", gap: 8 }}>
                {progressEntries.slice(0, 3).map(entry => (
                  <div key={entry.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: "#101015", border: "1px solid #20202A", borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: "#888", fontSize: 12, fontWeight: 700 }}>
                      {entry.date} {entry.type === "manual" ? "SAVED" : "AUTO"}
                    </span>
                    <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 800 }}>
                      {entry.weight} LB · {entry.completedExercises} exercises
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
                  Backup
                </button>
                <button className="dark-btn" onClick={resetWeek}>
                  Reset Week
                </button>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                STREAK / BADGES
              </p>
              <div className="metric-grid" style={{ marginBottom: 12 }}>
                <div className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {weeklyStreak}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    WEEK STREAK
                  </p>
                </div>
                <div className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {weeklyMetrics.completedDays}/7
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    DAYS CLEAR
                  </p>
                </div>
                <div className="stat-box">
                  <p style={{ fontSize: 16, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                    {currentWeekKey.slice(5)}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    WEEK OF
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(earnedBadges.length ? earnedBadges : ["Protocol Started"]).map(badge => (
                  <span key={badge} style={{ color: "#D8D8D8", background: "#101015", border: "1px solid #2A2A34", borderRadius: 999, padding: "7px 10px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800 }}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: "#777", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
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
                    <p className="detail-label">TOTAL</p>
                    <p className="detail-value">{totalPhotoCount}</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">LATEST</p>
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
                  placeholder="Photo note"
                />
                <label className="dark-btn" style={{ textAlign: "center" }}>
                  Choose Photo
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
                    Save Photo
                  </button>
                )}
              </div>
              {progressPhotos.length > 0 && (
                <div className="photo-strip">
                  {progressPhotos.slice(0, 8).map(photo => (
                    <div key={photo.id} className="photo-card" onClick={() => setViewingPhoto(photo)}>
                      <img src={photo.dataUrl} alt={photo.note || "Progress"} />
                      <div className="photo-body">
                        <p className="photo-note">{photo.note || "No note"}</p>
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
                  2-WEEK UPGRADE
                </p>

                <p style={{ color: "#BFA45E", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
                  Two weeks in. You can add +5 lb to all {progressionItems.length} exercises, or keep your current weights. Nothing changes unless you pick one.
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button className="dark-btn" onClick={rejectProgression}>
                    Keep current
                  </button>
                  <button className="primary-btn" onClick={acceptProgression}>
                    Apply +5 lb
                  </button>
                </div>
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

        {activeUserId && screen === "feature" && (
          <div className="fade-up feature-page">
            <button className="dark-btn" onClick={() => setScreen("home")} style={{ marginBottom: 14 }}>
              Back Home
            </button>

            <div className="feature-hero" style={{ borderColor: `${activeFeature.accent}40` }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: activeFeature.accent, fontFamily: "'Orbitron', monospace" }}>
                ATLAS MODULE
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
                <div className="compact-actions">
                  <button className="dark-btn" onClick={() => openWorkout(weeklyMetrics.today, { todayOnly: true })}>Today Only</button>
                  <button className="dark-btn" onClick={() => openWorkout(weeklyMetrics.today, { todayOnly: true, quick: true })}>Quick Mode</button>
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
                  ].map(metric => (
                    <div key={metric.label} className="detail-card">
                      <p className="detail-label">{metric.label}</p>
                      <p className="detail-value">{metric.val}</p>
                    </div>
                  ))}
                </div>
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
                      const logged = calendarLog[cell.key];
                      const todayKey = getDateKey();
                      const isPast = cell.key < todayKey;
                      const isToday = cell.key === todayKey;
                      const status = logged?.status || (isPast ? "missed" : "planned");
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
                          {CALENDAR_STATUS[status].label}
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
                  const isPast = cell.key < getDateKey();
                  const status = logged?.status || (isPast ? "missed" : "planned");
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
                Back Home
              </button>
            </div>

            {!todayOnlyMode && (
            <div style={{ padding: "16px 16px 0" }}>
              <div style={{ display: "flex", gap: 6, background: "#111115", borderRadius: 14, padding: "8px 8px" }}>
                {days.map(d => {
                  const isActive = d === activeDay;
                  const t = themeFor(workoutData[d].type);

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
                        {displayDayShort(d, workoutData[d].label)}
                      </div>
                      <div style={{ fontSize: 8, color: isActive ? t.sub : "#333", marginTop: 3, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                        {workoutData[d].type.slice(0, 3)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            )}

            <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                  {todayOnlyMode ? "TODAY ONLY" : displayDay(activeDay).toUpperCase()}
                </span>
                <span style={{ fontSize: 11, letterSpacing: 2, color: "#444", fontFamily: "'Orbitron', monospace" }}>
                  {" "}- {day.type}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                {total > 0 && (
                  <div style={{ fontSize: 13, color: "#666", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                    <span style={{ color: theme.accent, fontWeight: 700 }}>{done}</span> / {total} done
                  </div>
                )}
                <button
                  className="edit-btn"
                  onClick={() => setEditingRoutine({ dayName: activeDay, sessionIndex: activeSession, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } })}
                >
                  Edit Day
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
                        REST TIMER
                      </p>
                      <p style={{ fontSize: 13, color: "#666", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                        {restTimer.running ? "Recover, then attack the next set." : "Start after a hard set."}
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
                        <p style={{ fontSize: 9, letterSpacing: 2, color: "#666", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                          {restTimer.running ? "REST" : "READY"}
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
                      Stop Timer
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
                    QUICK SESSION
                  </p>
                  <h2 style={{ fontSize: 26, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 }}>
                    {quickExercise.name}
                  </h2>
                  <div className="metric-grid">
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickExercise.weight}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>WEIGHT</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickExercise.sets}x{quickExercise.reps}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>SETS</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsDone}/{quickTotalSets}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>DONE</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsLeft}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>LEFT</p>
                    </div>
                  </div>
                  {quickNote && (
                    <p style={{ color: "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                      {quickNote.pr ? "PR · " : ""}{quickNote.difficulty ? `RPE ${quickNote.difficulty} · ` : ""}{quickNote.technique || quickNote.pain}
                    </p>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                    <button className="dark-btn" onClick={() => updateSetCount(quickExerciseIndex, -1)}>
                      - Set
                    </button>
                    <button className="primary-btn" onClick={() => updateSetCount(quickExerciseIndex, 1)}>
                      + Set
                    </button>
                  </div>
                  <button className="dark-btn" onClick={() => toggleExercise(quickExerciseIndex)}>
                    Mark Exercise Done
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
                    Notes
                  </button>
                  <button className="dark-btn" onClick={() => setQuickMode(false)}>
                    Full Session
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
                const note = exerciseNotes[key];
                const hasNote = note && (note.pain || note.difficulty || note.pr || note.technique);
                const setsDone = Number(setProgress[key] || 0);
                const totalExerciseSets = Number(ex.sets || 0);
                const setsLeft = Math.max(totalExerciseSets - setsDone, 0);

                return (
                  <div
                    key={i}
                    className={`ex-card${isDone ? " done" : ""}`}
                    onClick={() => toggleExercise(i)}
                    style={highlightedExerciseIndex === i && !isDone ? { borderColor: theme.accent, boxShadow: `0 0 22px ${theme.accent}22` } : {}}
                  >
                    <div className="check" style={isDone ? { background: theme.accent, borderColor: theme.accent, color: isLightMode ? "#FFFFFF" : "#000" } : {}}>
                      {isDone ? "✓" : ""}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: isDone ? "#555" : "#FFFFFF", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ex.name}
                      </p>
                      <p style={{ fontSize: 12, color: isDone ? "#383838" : "#666", marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
                        {ex.sets} sets x {ex.reps} reps
                      </p>
                      <p style={{ fontSize: 11, color: isDone ? "#444" : "#AAAAAA", marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                        Sets {setsDone}/{totalExerciseSets} · {setsLeft} left
                      </p>
                      {hasNote && (
                        <p style={{ fontSize: 11, color: isDone ? "#444" : theme.accent, marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {note.pr ? "PR · " : ""}{note.difficulty ? `RPE ${note.difficulty} · ` : ""}{note.technique || note.pain || "Notes saved"}
                        </p>
                      )}
                    </div>

                    <div style={{ display: "grid", gap: 6 }}>
                      <button
                        className="edit-btn"
                        onClick={event => {
                          event.stopPropagation();
                          updateSetCount(i, 1);
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
                      style={{ color: hasNote ? theme.accent : "#777" }}
                    >
                      Notes
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
                  ATLAS MENU
                </p>
                <p style={{ fontSize: 12, color: "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                  Signed in as {userName}
                </p>
              </div>
              <button className="edit-btn" onClick={() => setShowMenu(false)} style={{ padding: "8px 12px" }}>
                Close
              </button>
            </div>

            <p className="menu-section-label">WORKOUT</p>
            <div style={{ display: "grid", gap: 8, marginBottom: 18, marginTop: 6 }}>
              <button
                className="primary-btn"
                onClick={() => {
                  setShowMenu(false);
                  openWorkout(weeklyMetrics.today);
                }}
              >
                START TODAY
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setEditingRoutine({ dayName: activeDay, sessionIndex: activeSession, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } });
                }}
              >
                Manage Workouts
              </button>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <button
                  className="dark-btn"
                  onClick={() => {
                    setShowMenu(false);
                    openWorkout(weeklyMetrics.today, { todayOnly: true, quick: true });
                  }}
                >
                  Quick Today
                </button>
                <button
                  className="dark-btn"
                  onClick={() => {
                    resetWeek();
                    setShowMenu(false);
                  }}
                >
                  Reset Week
                </button>
              </div>
            </div>

            <p className="menu-section-label">PAGES</p>
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

            <p className="menu-section-label">APP</p>
            <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setShowSettings(true);
                }}
              >
                Settings
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setShowReminders(true);
                }}
              >
                Reminders
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  setShowDataTools(true);
                }}
              >
                Backup / Sync
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
                    {appSettings.avatar ? "Change Profile Photo" : "Add Profile Photo"}
                    <input type="file" accept="image/*" onChange={handleAvatarPhoto} style={{ display: "none" }} />
                  </label>
                  {appSettings.avatar && (
                    <button className="edit-btn" onClick={() => setAppSettings(prev => ({ ...prev, avatar: "" }))}>
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <label style={{ display: "block" }}>
                  <span className="field-label">FIRST NAME</span>
                  <input
                    className="input"
                    value={appSettings.firstName}
                    onChange={event => setAppSettings(prev => ({ ...prev, firstName: event.target.value }))}
                    placeholder="First name"
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">LAST NAME</span>
                  <input
                    className="input"
                    value={appSettings.lastName}
                    onChange={event => setAppSettings(prev => ({ ...prev, lastName: event.target.value }))}
                    placeholder="Last name"
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
                  <p className="setting-title">Notifications</p>
                  <p className="setting-sub">{notificationSettings.enabled ? "Enabled" : "Permission not enabled"}</p>
                </div>
                <button className="dark-btn" onClick={requestNotifications}>
                  Enable
                </button>
              </div>

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
                placeholder="Workout notification message"
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
                placeholder="Recovery notification message"
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
                Test Tone
              </button>
              <button className="dark-btn" onClick={() => {
                setShowSettings(false);
                setShowReminders(true);
              }}>
                Custom Reminders
              </button>
              <button className="dark-btn" onClick={() => {
                setShowSettings(false);
                setShowDataTools(true);
              }}>
                Backup / Cloud Sync
              </button>
              <button className="dark-btn" onClick={handleLogout}>
                Logout
              </button>
              <button className="dark-btn" onClick={() => setShowSettings(false)}>
                Close
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
                Close
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
                Cancel
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1 }}
                onClick={() => saveExerciseNote(editingNote)}
              >
                Save
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
                Close
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
                Done
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
              <input className="input" value={editingRoutine.draft.name} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, name: event.target.value } }))} placeholder="New exercise name" />
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
                Add Exercise
              </button>
              <button className="dark-btn" onClick={() => setEditingRoutine(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
        );
      })()}

      {editingProfile && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              EDIT BODY STATUS
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <select
                className="input"
                value={editingProfile.currentWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, currentWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.currentWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} LB current</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.startWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, startWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.startWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} LB start</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.targetWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, targetWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.targetWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} LB target</option>
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
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingProfile(null)}>
                Cancel
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  setProfile(editingProfile);
                  setEditingProfile(null);
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {editingGoals && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              SET MY GOALS
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <input
                className="input"
                value={editingGoals.focusGoal}
                onChange={event => setEditingGoals(prev => ({ ...prev, focusGoal: event.target.value }))}
                placeholder="Main goal"
              />

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
                Cancel
              </button>
              <button
                className="primary-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  setGoals(editingGoals);
                  setEditingGoals(null);
                }}
              >
                Save
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
                Close
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
                Close
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
