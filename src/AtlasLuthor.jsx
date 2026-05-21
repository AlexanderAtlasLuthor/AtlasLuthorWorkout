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
  profile: "atlas-luthor-profile",
  goals: "atlas-luthor-goals",
  progressLog: "atlas-luthor-progress-log",
  exerciseNotes: "atlas-luthor-exercise-notes",
  calendarLog: "atlas-luthor-calendar-log",
  progressPhotos: "atlas-luthor-progress-photos",
  cloudSettings: "atlas-luthor-cloud-settings",
  notificationSettings: "atlas-luthor-notification-settings",
  setProgress: "atlas-luthor-set-progress",
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
  const [profile, setProfile] = useState(() => safeLoad(STORAGE_KEYS.profile, DEFAULT_PROFILE));
  const [goals, setGoals] = useState(() => safeLoad(STORAGE_KEYS.goals, DEFAULT_GOALS));
  const [progressLog, setProgressLog] = useState(() => safeLoad(STORAGE_KEYS.progressLog, []));
  const [exerciseNotes, setExerciseNotes] = useState(() => safeLoad(STORAGE_KEYS.exerciseNotes, {}));
  const [calendarLog, setCalendarLog] = useState(() => safeLoad(STORAGE_KEYS.calendarLog, {}));
  const [progressPhotos, setProgressPhotos] = useState(() => safeLoad(STORAGE_KEYS.progressPhotos, []));
  const [cloudSettings, setCloudSettings] = useState(() => safeLoad(STORAGE_KEYS.cloudSettings, DEFAULT_CLOUD_SETTINGS));
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
  const [progressSaved, setProgressSaved] = useState(false);
  const [todayOnlyMode, setTodayOnlyMode] = useState(false);
  const [quickMode, setQuickMode] = useState(false);
  const [highlightedExerciseIndex, setHighlightedExerciseIndex] = useState(0);
  const [photoDraft, setPhotoDraft] = useState({ date: getDateKey(), note: "", dataUrl: "" });
  const [reminderDraft, setReminderDraft] = useState({ label: "Custom reminder", time: "12:00", message: "Stay on protocol.", sound: "chime" });
  const [restTimer, setRestTimer] = useState({ secondsLeft: 0, duration: 0, running: false, label: "", endsAt: null, notified: false });
  const notifiedTimersRef = useRef(new Set());

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
    window.localStorage.setItem(STORAGE_KEYS.cloudSettings, JSON.stringify(cloudSettings));
  }, [cloudSettings]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.notificationSettings, JSON.stringify(notificationSettings));
  }, [notificationSettings]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEYS.setProgress, JSON.stringify(setProgress));
  }, [setProgress]);

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

  useEffect(() => {
    if (isProgressionDue(lastProgressionReview)) {
      setShowProgression(true);
    }
  }, [lastProgressionReview]);

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
          notificationSettings.workoutMessage || `Today is ${weeklyMetrics.today} / ${weeklyMetrics.todayType}. Protocol ready.`,
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
        cloudSettings,
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
        if (data.cloudSettings) setCloudSettings(data.cloudSettings);
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
        dataUrl: photoDraft.dataUrl,
      },
      ...prev,
    ].slice(0, 12));
    setPhotoDraft({ date: getDateKey(), note: "", dataUrl: "" });
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

  const moveRoutineSession = direction => {
    const { dayName, sessionIndex } = editingRoutine;
    const currentDayIndex = days.indexOf(dayName);
    const nextDayName = days[currentDayIndex + direction];

    if (!nextDayName) return;

    setWorkoutData(prev => {
      const movingSession = prev[dayName].sessions[sessionIndex];

      return {
        ...prev,
        [dayName]: {
          ...prev[dayName],
          sessions: prev[dayName].sessions.filter((_, index) => index !== sessionIndex),
        },
        [nextDayName]: {
          ...prev[nextDayName],
          sessions: [...prev[nextDayName].sessions, movingSession],
        },
      };
    });
    setEditingRoutine(prev => ({ ...prev, dayName: nextDayName, sessionIndex: workoutData[nextDayName].sessions.length }));
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

  const openWorkout = (dayName, options = {}) => {
    setActiveDay(dayName);
    setActiveSession(0);
    setTodayOnlyMode(!!options.todayOnly);
    setQuickMode(!!options.quick);
    setHighlightedExerciseIndex(0);
    setScreen("workout");
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#0C0C10", color: "#FFFFFF", fontFamily: "'Orbitron', monospace", paddingBottom: 80, position: "relative", overflowX: "hidden", isolation: "isolate" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
        .input { width: 100%; border: 1.5px solid #282834; background: #0F0F14; color: #FFFFFF; border-radius: 12px; padding: 12px; font-family: 'DM Sans', sans-serif; font-weight: 700; outline: none; }
        .compact-actions { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 10px; }
        .photo-strip { display: flex; gap: 10px; margin-top: 12px; overflow-x: auto; padding-bottom: 4px; scroll-snap-type: x mandatory; }
        .photo-card { flex: 0 0 118px; min-width: 0; border: 1px solid #24242E; border-radius: 10px; overflow: hidden; background: #101015; scroll-snap-align: start; }
        .photo-card img { width: 100%; aspect-ratio: 1; object-fit: cover; display: block; }
        .photo-meta { color: #888; font-family: 'DM Sans', sans-serif; font-size: 10px; padding: 7px; line-height: 1.25; overflow-wrap: anywhere; }
        .settings-grid { display: grid; gap: 10px; }
        .setting-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; align-items: center; border: 1px solid #24242E; border-radius: 12px; padding: 12px; background: #101015; }
        .setting-title { color: #FFFFFF; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 800; min-width: 0; overflow-wrap: anywhere; }
        .setting-sub { color: #777; font-family: 'DM Sans', sans-serif; font-size: 12px; line-height: 1.4; margin-top: 3px; min-width: 0; overflow-wrap: anywhere; }

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
          <button className="menu-button" type="button" aria-label="Open settings menu" onClick={() => setShowMenu(true)}>
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
                <div style={{ width: 92, height: 92, borderRadius: "50%", border: "8px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(255,255,255,0.12)" }}>
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
                {["S", "M", "T", "W", "T", "F", "S"].map((label, index) => (
                  <p key={`${label}-${index}`} style={{ color: "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
                ))}
                {calendarCells.map((cell, index) => {
                  if (!cell) return <div key={`blank-${index}`} />;

                  const logged = calendarLog[cell.key];
                  const isPast = cell.key < getDateKey();
                  const status = logged?.status || (isPast ? "missed" : "planned");
                  const statusColor = {
                    completed: "#FFFFFF",
                    trained: "#90C8FF",
                    missed: "#553333",
                    rest: "#666",
                    planned: "#24242E",
                  }[status];

                  return (
                    <div key={cell.key} title={status} style={{ aspectRatio: "1", borderRadius: 8, border: `1px solid ${statusColor}`, background: status === "completed" ? "#FFFFFF" : "#101015", color: status === "completed" ? "#050507" : "#888", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 900 }}>
                      {cell.dayNumber}
                    </div>
                  );
                })}
              </div>
              <p style={{ color: "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                White completed · Blue trained · Red missed
              </p>
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
                    <div style={{ height: 5, background: "#1E1E26", borderRadius: 5, overflow: "hidden" }}>
                      <div style={{ width: `${goal.pct}%`, height: "100%", background: "#FFFFFF", borderRadius: 5, transition: "width 0.3s ease" }} />
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
                <div style={{ display: "flex", alignItems: "end", gap: 8, height: 92, marginTop: 14, padding: "10px 8px", borderRadius: 12, border: "1px solid #20202A", background: "rgba(10,10,14,0.55)" }}>
                  {chartEntries.map(entry => {
                    const range = Math.max(maxChartWeight - minChartWeight, 1);
                    const height = 24 + ((entry.weightNumber - minChartWeight) / range) * 48;

                    return (
                      <div key={`${entry.id}-bar`} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                        <div title={`${entry.weight} LB`} style={{ height, borderRadius: "8px 8px 3px 3px", background: "linear-gradient(180deg, #FFFFFF, #777B86)", boxShadow: "0 0 22px rgba(255,255,255,0.14)" }} />
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
                PROGRESS PHOTOS
              </p>
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
                  {progressPhotos.slice(0, 6).map(photo => (
                    <div key={photo.id} className="photo-card">
                      <img src={photo.dataUrl} alt={photo.note || "Progress"} />
                      <p className="photo-meta">
                        {photo.date} · {photo.weight} LB
                      </p>
                    </div>
                  ))}
                </div>
              )}
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
            )}

            <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>
                  {todayOnlyMode ? "TODAY ONLY" : activeDay.toUpperCase()}
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
            )}
          </>
        )}
      </div>

      {showMenu && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              ATLAS MENU
            </p>

            <div className="settings-grid">
              <button
                className="primary-btn"
                onClick={() => {
                  setShowMenu(false);
                  setShowSettings(true);
                }}
              >
                SETTINGS
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
                  setEditingRoutine({ dayName: activeDay, sessionIndex: activeSession, draft: { name: "", sets: "3", reps: "8", weight: "0 lb" } });
                }}
              >
                Edit Routine
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
              <button
                className="dark-btn"
                onClick={() => {
                  setShowMenu(false);
                  openWorkout(weeklyMetrics.today, { todayOnly: true, quick: true });
                }}
              >
                Quick Today
              </button>
              <button className="dark-btn" onClick={() => {
                resetWeek();
                setShowMenu(false);
              }}>
                Reset Week
              </button>
              <button className="dark-btn" onClick={() => setShowMenu(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              SETTINGS
            </p>

            <div className="settings-grid">
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

      {editingRoutine && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              ROUTINE EDITOR
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10, marginBottom: 12 }}>
              <select
                className="input"
                value={editingRoutine.dayName}
                onChange={event => setEditingRoutine(prev => ({ ...prev, dayName: event.target.value, sessionIndex: 0 }))}
              >
                {days.map(dayName => (
                  <option key={dayName} value={dayName}>{dayName}</option>
                ))}
              </select>
              <select
                className="input"
                value={editingRoutine.sessionIndex}
                onChange={event => setEditingRoutine(prev => ({ ...prev, sessionIndex: Number(event.target.value) }))}
              >
                {workoutData[editingRoutine.dayName].sessions.map((currentSession, index) => (
                  <option key={`${currentSession.name}-${index}`} value={index}>{currentSession.time} {currentSession.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              {workoutData[editingRoutine.dayName].sessions[editingRoutine.sessionIndex]?.exercises.map((exercise, exerciseIndex) => (
                <div key={`${exercise.name}-${exerciseIndex}`} style={{ border: "1px solid #24242E", borderRadius: 12, padding: 10, display: "grid", gap: 8 }}>
                  <input className="input" value={exercise.name} onChange={event => updateRoutineExercise(exerciseIndex, { name: event.target.value })} />
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
                  <button className="edit-btn" onClick={() => removeRoutineExercise(exerciseIndex)}>
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
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
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                <button className="dark-btn" onClick={() => moveRoutineSession(-1)}>Move Prev</button>
                <button className="dark-btn" onClick={duplicateRoutineSession}>Duplicate</button>
                <button className="dark-btn" onClick={() => moveRoutineSession(1)}>Move Next</button>
              </div>
              <button className="dark-btn" onClick={() => setEditingRoutine(null)}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

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
