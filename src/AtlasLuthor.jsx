import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  formatWeight, formatWeightDelta, formatHeight, formatExerciseWeight,
  formatDistance, formatMeasure, parseHeightInches,
  getBodyWeightOptions, getHeightOptions, getExerciseWeightOptions,
  measureInputToInches, distanceInputToMiles, measureUnit, distanceUnit, inToCm,
  weightUnit, kgToLb, lbToKg,
} from "./lib/units.js";
import {
  calcBMR, calcTDEE, goalCalorieTarget, macroSplit, sumDayMacros,
  FOOD_DB, MEALS, ACTIVITY_LEVELS,
} from "./lib/nutrition.js";
import {
  CARDIO_TYPES, cardioTypeInfo, cardioTypeLabel, estimateCardioCalories, formatPace,
} from "./lib/cardio.js";
import { navyBodyFat, MEASUREMENT_FIELDS } from "./lib/bodyComp.js";
import {
  estimate1RM, estimate1RMFromExercise, parseWeightNumber, parseRepsNumber,
  exerciseVolume, isNewPR,
} from "./lib/strength.js";
import { getExerciseCues } from "./lib/exerciseInfo.js";
import { renderShareCard } from "./lib/shareCard.js";

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
  activityLevel: "auto",
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
  unitSystem: "imperial",
  restSeconds: 90,
  meditationGoalMin: 10,
  meditationPractice: "pranayama",
  meditationDurationMin: 10,
  meditationIntervalBellMin: 0,
  meditationVoice: true,
  meditationSound: "off",
  meditationVoiceVolume: 0.95,
  meditationTummoAck: false,
  meditationReflections: {},
  background: {
    type: "default",
    color: "#0C0C10",
    gradientFrom: "#0C0C10",
    gradientTo: "#1A1A3E",
    gradientAngle: 180,
    photo: "",
  },
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
    foodLog: {},
    customFoods: [],
    recentFoods: [],
    cardioLog: {},
    measurementLog: {},
    exercisePerformance: {},
    challenges: [],
    meditationLog: {},
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
const EXERCISE_GROUP_LOOKUP = (() => {
  const map = {};
  Object.entries(COMMON_EXERCISES).forEach(([group, list]) => {
    list.forEach(name => { map[name.toLowerCase()] = group; });
  });
  return map;
})();
// Maps an exercise name onto a muscle group, with a loose contains-match
// fallback so routine variations still land in a sensible bucket.
function muscleGroupFor(name) {
  if (!name) return "Other";
  const key = String(name).toLowerCase().trim();
  if (EXERCISE_GROUP_LOOKUP[key]) return EXERCISE_GROUP_LOOKUP[key];
  for (const known of Object.keys(EXERCISE_GROUP_LOOKUP)) {
    if (key.includes(known)) return EXERCISE_GROUP_LOOKUP[known];
  }
  return "Other";
}
const SET_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8].map(String);
const REP_OPTIONS = [4, 5, 6, 8, 10, 12, 15, 20, "3x3", "AMRAP"].map(String);
const RPE_OPTIONS = ["", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const PAIN_OPTIONS = ["", "None", "Tight", "Mild", "Moderate", "Sharp", "Stop"];
const PROGRESS_GOAL_OPTIONS = ["70", "75", "80", "85", "90", "95", "100"];
const SESSION_GOAL_OPTIONS = Array.from({ length: 90 }, (_, i) => String(i + 1));
const CARDIO_OPTIONS = ["", "10 min", "15 min", "20 min", "Run 1 mile", "Stairs Level 5", "Row Machine 15 min"];
const SOUND_OPTIONS = ["silent", "chime", "pulse", "bell"];
const MEDITATION_PRACTICES = {
  pranayama: {
    en: "Pranayama", es: "Pranayama",
    enSub: "Breath control",
    esSub: "Control de respiración",
    enDesc: "Conscious breath ratios to regulate the nervous system. Inhale 4, hold 2, exhale 6.",
    esDesc: "Ratios conscientes de respiración para regular el sistema nervioso. Inhala 4, mantén 2, exhala 6.",
    accent: "#90C8FF",
    minMin: 5, maxMin: 45, defaultMin: 10, defaultIntervalBellMin: 0,
    cycleSec: 12,
    phases: [
      { sec: 4, en: "Inhale", es: "Inhala" },
      { sec: 2, en: "Hold", es: "Mantén" },
      { sec: 6, en: "Exhale", es: "Exhala" },
    ],
    showBreathCircle: true,
    showBreathCounter: false,
    script: {
      // Short phrases with 10-15 s of silence between, so you actually have
      // time to do what the voice asks before the next instruction arrives.
      opening: [
        { atSec: 2, es: "Siéntate cómodo, columna recta.", en: "Sit comfortably, spine straight." },
        { atSec: 13, es: "Cierra los ojos, suelta los hombros.", en: "Close your eyes, relax your shoulders." },
        { atSec: 24, es: "Empezamos a respirar juntos.", en: "We'll breathe together now." },
      ],
      // openingEndsAtSec is when the breath cycle cues are allowed to start.
      // Kept around 30 s so the user can begin practicing quickly. Cycle cues
      // are then spoken for two full breath cycles only, then the circle
      // becomes the silent guide.
      openingEndsAtSec: 32,
      cycleCues: {
        speakCycles: 2,
        phaseCues: [
          { es: "Inhala", en: "Inhale" },
          { es: "Mantén", en: "Hold" },
          { es: "Exhala lento", en: "Exhale slowly" },
        ],
      },
      reminders: {
        everyMin: 4,
        cues: [
          { es: "Suave, sin forzar.", en: "Soft, without forcing." },
          { es: "Si te mareas, baja el ritmo.", en: "If you feel dizzy, slow down." },
          { es: "Sigue el círculo.", en: "Follow the circle." },
        ],
      },
      closing: [
        { secondsBeforeEnd: 32, es: "Vamos a cerrar.", en: "Let's close." },
        { secondsBeforeEnd: 16, es: "Última respiración consciente.", en: "Last conscious breath." },
        { secondsBeforeEnd: 4, es: "Abre los ojos cuando estés listo.", en: "Open your eyes when ready." },
      ],
    },
  },
  vipassana: {
    en: "Vipassana", es: "Vipassana",
    enSub: "Insight meditation",
    esSub: "Observación profunda",
    enDesc: "Observe sensations as they arise and pass, without reacting. No breath manipulation — just watch.",
    esDesc: "Observa las sensaciones que surgen y se van, sin reaccionar. Sin control de respiración — solo observa.",
    accent: "#3FB98A",
    minMin: 10, maxMin: 90, defaultMin: 20, defaultIntervalBellMin: 5,
    cycleSec: 0,
    phases: [],
    showBreathCircle: false,
    showBreathCounter: false,
    script: {
      opening: [
        { atSec: 2, es: "Siéntate erguido y cierra los ojos.", en: "Sit upright and close your eyes." },
        { atSec: 13, es: "Lleva la atención a tu respiración natural.", en: "Bring attention to your natural breath." },
        { atSec: 25, es: "Observa, sin cambiar nada.", en: "Observe, without changing anything." },
      ],
      openingEndsAtSec: 32,
      cycleCues: null,
      reminders: {
        everyMin: 5,
        cues: [
          { es: "Si surge una sensación, nómbrala. Déjala pasar.", en: "If a sensation arises, name it. Let it pass." },
          { es: "Vuelve siempre a la respiración natural.", en: "Always return to natural breath." },
          { es: "No reacciones. Solo observa.", en: "Don't react. Just observe." },
          { es: "Sin juzgar, sin perseguir.", en: "Without judging, without chasing." },
        ],
      },
      closing: [
        { secondsBeforeEnd: 40, es: "Vamos a cerrar.", en: "Let's close." },
        { secondsBeforeEnd: 24, es: "Lleva la atención a todo el cuerpo.", en: "Bring attention to the whole body." },
        { secondsBeforeEnd: 10, es: "Siente el contacto con el asiento.", en: "Feel the contact with your seat." },
        { secondsBeforeEnd: 3, es: "Abre los ojos cuando estés listo.", en: "Open your eyes when ready." },
      ],
    },
  },
  zazen: {
    en: "Zazen", es: "Zazen",
    enSub: "Seated stability",
    esSub: "Estabilidad sentada",
    enDesc: "Just sitting. Count each exhale from 1 to 10, then start over. The counter shows your number.",
    esDesc: "Solo sentarse. Cuenta cada exhalación de 1 a 10 y reinicia. El contador muestra tu número.",
    accent: "#FFD060",
    minMin: 10, maxMin: 60, defaultMin: 25, defaultIntervalBellMin: 0,
    cycleSec: 10,
    phases: [
      { sec: 4, en: "Inhale", es: "Inhala" },
      { sec: 6, en: "Exhale · count", es: "Exhala · cuenta" },
    ],
    showBreathCircle: true,
    showBreathCounter: true,
    script: {
      opening: [
        { atSec: 2, es: "Manos en mudra cósmico: izquierda sobre derecha.", en: "Hands in cosmic mudra: left over right." },
        { atSec: 14, es: "Columna recta, ojos semi-abiertos al suelo.", en: "Spine straight, eyes half-open to the floor." },
        { atSec: 25, es: "Cuenta cada exhalación, del uno al diez.", en: "Count each exhale, from one to ten." },
      ],
      openingEndsAtSec: 34,
      cycleCues: null,
      reminders: {
        everyMin: 5,
        cues: [
          { es: "Si pierdes la cuenta, empieza en uno.", en: "If you lose count, start at one." },
          { es: "Sin frustración. Solo siéntate.", en: "No frustration. Just sit." },
          { es: "Solo respira. Solo cuenta.", en: "Just breathe. Just count." },
        ],
      },
      closing: [
        { secondsBeforeEnd: 28, es: "Vamos a cerrar.", en: "Let's close." },
        { secondsBeforeEnd: 14, es: "Termina el ciclo que estás contando.", en: "Finish the cycle you're counting." },
        { secondsBeforeEnd: 4, es: "Junta las manos. Haz una leve inclinación.", en: "Hands together. A slight bow." },
      ],
    },
  },
  tummo: {
    en: "Tummo", es: "Tummo",
    enSub: "Inner heat (advanced)",
    esSub: "Calor interno (avanzado)",
    enDesc: "Tibetan vase breathing with heat visualization. Deep inhale, long hold visualizing fire at the navel, slow exhale.",
    esDesc: "Respiración de vasija tibetana con visualización de calor. Inhala profundo, mantén largo visualizando fuego en el ombligo, exhala lento.",
    accent: "#FF9860",
    minMin: 5, maxMin: 30, defaultMin: 10, defaultIntervalBellMin: 0,
    cycleSec: 20,
    phases: [
      { sec: 4, en: "Deep inhale", es: "Inhala profundo" },
      { sec: 12, en: "Hold · feel heat", es: "Mantén · siente calor" },
      { sec: 4, en: "Slow exhale", es: "Exhala lento" },
    ],
    showBreathCircle: true,
    showBreathCounter: false,
    safetyEs: "Práctica avanzada. NO la hagas con presión baja, embarazada, en el agua, conduciendo, o con condiciones cardíacas. Detente si te mareas.",
    safetyEn: "Advanced practice. DO NOT do this with low blood pressure, pregnant, in water, while driving, or with heart conditions. Stop if you feel dizzy.",
    script: {
      opening: [
        { atSec: 2, es: "Tummo. Si te mareas, detente.", en: "Tummo. If you feel dizzy, stop." },
        { atSec: 13, es: "Siéntate erguido, cierra los ojos.", en: "Sit upright, close your eyes." },
        { atSec: 24, es: "Visualiza una llama en tu ombligo.", en: "Visualize a flame at your navel." },
      ],
      openingEndsAtSec: 32,
      cycleCues: {
        speakCycles: 2,
        phaseCues: [
          { es: "Inhala profundo", en: "Deep inhale" },
          { es: "Mantén, siente el calor", en: "Hold, feel the heat" },
          { es: "Suelta lento", en: "Release slowly" },
        ],
      },
      reminders: {
        everyMin: 4,
        cues: [
          { es: "El calor crece con cada retención.", en: "Heat grows with each hold." },
          { es: "Si necesitas, acorta la retención.", en: "If needed, shorten the hold." },
        ],
      },
      closing: [
        { secondsBeforeEnd: 32, es: "Última retención.", en: "Last hold." },
        { secondsBeforeEnd: 14, es: "Suelta despacio. El calor permanece.", en: "Release slowly. The heat remains." },
        { secondsBeforeEnd: 3, es: "Respira normal. Abre los ojos.", en: "Breathe normally. Open your eyes." },
      ],
    },
  },
};
const MEDITATION_PRACTICE_KEYS = Object.keys(MEDITATION_PRACTICES);
const AMBIENT_SOUND_OPTIONS = ["off", "rain", "ocean", "om", "metronome"];

// Voice + ambient sound helpers. The Web Speech and Web Audio APIs are
// browser-native, so no audio assets are bundled.
function speakMeditationCue(text, language, voiceEnabled, volume) {
  if (!voiceEnabled || !text) return;
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  // Cancel any in-progress or queued utterance before speaking the new one.
  // Without this, cues pile up in the speechSynthesis queue and play
  // back-to-back, which feels rushed and stacked.
  try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === "es" ? "es-ES" : "en-US";
  utterance.rate = 0.8;
  utterance.pitch = 0.95;
  utterance.volume = Math.max(0, Math.min(1, Number(volume) || 0.95));
  window.speechSynthesis.speak(utterance);
}

function cancelMeditationSpeech() {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  try { window.speechSynthesis.cancel(); } catch { /* ignore */ }
}

function meditationVibrate(pattern) {
  if (typeof navigator === "undefined" || !navigator.vibrate) return;
  try { navigator.vibrate(pattern); } catch { /* ignore */ }
}

function startMeditationAmbient(type) {
  if (!type || type === "off") return null;
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.connect(ctx.destination);
  masterGain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 1.5);

  const sources = [];

  if (type === "rain") {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2200;
    filter.Q.value = 0.7;
    source.connect(filter);
    filter.connect(masterGain);
    source.start();
    sources.push(source);
  } else if (type === "ocean") {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600;
    filter.Q.value = 1.2;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    source.connect(filter);
    filter.connect(masterGain);
    source.start();
    lfo.start();
    sources.push(source, lfo);
  } else if (type === "om") {
    masterGain.gain.linearRampToValueAtTime(0.10, ctx.currentTime + 1.5);
    const o1 = ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.value = 110;
    const o2 = ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = 110.6;
    const o3 = ctx.createOscillator();
    o3.type = "sine";
    o3.frequency.value = 220;
    const harmGain = ctx.createGain();
    harmGain.gain.value = 0.22;
    o3.connect(harmGain);
    harmGain.connect(masterGain);
    o1.connect(masterGain);
    o2.connect(masterGain);
    o1.start();
    o2.start();
    o3.start();
    sources.push(o1, o2, o3);
  } else if (type === "metronome") {
    // Slow meditative tick at 60 BPM. We schedule individual short
    // oscillator pulses ahead in audio-clock time so the timing is sample
    // accurate even when JS is busy. A setInterval re-schedules every
    // second so the queue always has ~3 s of ticks ahead.
    masterGain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + 0.6);
    const intervalSec = 1.0; // 60 BPM
    let active = true;
    let nextTime = ctx.currentTime + 0.4;

    const scheduleClick = when => {
      if (!active) return;
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = 1200;
      const env = ctx.createGain();
      env.gain.setValueAtTime(0, when);
      env.gain.linearRampToValueAtTime(0.18, when + 0.001);
      env.gain.exponentialRampToValueAtTime(0.001, when + 0.05);
      osc.connect(env);
      env.connect(masterGain);
      osc.start(when);
      osc.stop(when + 0.06);
    };

    const fill = () => {
      const horizon = ctx.currentTime + 3;
      while (nextTime < horizon) {
        scheduleClick(nextTime);
        nextTime += intervalSec;
      }
    };
    fill();
    const schedulerId = window.setInterval(fill, 1000);

    sources.push({
      stop() {
        active = false;
        window.clearInterval(schedulerId);
      },
    });
  }

  return {
    stop() {
      try {
        masterGain.gain.cancelScheduledValues(ctx.currentTime);
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      } catch { /* ignore */ }
      window.setTimeout(() => {
        sources.forEach(s => { try { s.stop(); } catch { /* ignore */ } });
        try { ctx.close(); } catch { /* ignore */ }
      }, 500);
    },
  };
}
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
    currentLabel: "CURRENT",
    heightLabel: "HEIGHT",
    editBodyStatus: "EDIT BODY STATUS",
    bodyTrend: "BODY TREND",
    stableSinceStart: "Stable since start",
    upFromStarting: "Up from starting weight",
    downFromStarting: "Down from starting weight",
    manualBodyCheck: "Manual body check",
    autoProgressCapture: "Auto progress capture",
    dayByDay: "DAY BY DAY",
    scoreBreakdown: "SCORE BREAKDOWN",
    weeklyCompletion: "Weekly completion",
    sessionTarget: "Session target",
    streakPressure: "Streak pressure",
    prMomentum: "PR momentum",
    streakLabel: "STREAK",
    prsLabel: "PRS",
    avgRpeLabel: "AVG RPE",
    deloadLabel: "DELOAD",
    exercisesLogged: "exercises logged",
    noEntrySaved: "No entry saved yet",
    totalPrs: "TOTAL PRS",
    heaviestLabel: "HEAVIEST",
    heaviestLoads: "HEAVIEST PROGRAMMED LOADS",
    highNotes: "HIGH NOTES",
    thisWeek: "THIS WEEK",
    lowerLoadAdvice: "Lower load, reduce intensity, or add recovery.",
    noFatigueWarning: "No fatigue warning from the current notes.",
    painSignalNote: "Pain marked Sharp/Stop or RPE 9-10 raises the warning signal.",
    recentSignals: "RECENT NOTE SIGNALS",
    deloadActiveVal: "ACTIVE",
    deloadClearVal: "CLEAR",
    noExerciseNotes: "No exercise notes yet",
    addPainRPE: "Add pain/RPE from any exercise",
    mainFocus: "MAIN FOCUS",
    targetDateSub: "Target date:",
    setMyGoals: "SET MY GOALS",
    remainingExercises: "REMAINING EXERCISES",
    setCompletionLabel: "SET COMPLETION",
    saveProgress: "SAVE PROGRESS",
    manualSave: "Manual save",
    autoSnapshot: "Auto snapshot",
    badgesLabel: "BADGES",
    photosLabel: "PHOTOS",
    albumsLabel: "ALBUMS",
    addPhotoLabel: "ADD PHOTO",
    dateField: "DATE",
    noteField: "NOTE",
    albumField: "ALBUM",
    noAlbum: "No album",
    newAlbumPlaceholder: "New album name",
    addPhotoBtn: "Add Photo",
    newAlbumBtn: "New Album",
    newAlbumTitle: "New Album",
    noAlbumsHint: "No albums yet. Create one to group your progress photos.",
    restTimerSub: "Default rest started automatically after every set.",
    createBtn: "Create",
    deleteAlbumBtn: "Delete album",
    noPhotosInAlbum: "No photos in this album yet.",
    setProgressLabel: "SET PROGRESS",
    manageWorkoutsSub: "Add, edit, or remove exercises and sessions.",
    addExerciseSection: "ADD EXERCISE",
    noExercisesYet: "No exercises in this session yet. Add one below.",
    exerciseLabel: "EXERCISE",
    removeBtn: "Remove",
    exerciseNamePlaceholder: "Exercise name",
    daySection: "DAY",
    sessionSection: "SESSION",
    sessionNameField: "SESSION NAME",
    timeField: "TIME",
    addSessionBtn: "Add Session",
    duplicateBtn: "Duplicate",
    deleteBtn: "Delete",
    sessionNamePlaceholder: "Session name",
    repsLabel: "REPS",
    customReminders: "CUSTOM REMINDERS",
    reminderTitlePlaceholder: "Reminder title",
    reminderMessagePlaceholder: "Reminder message",
    addReminderBtn: "ADD REMINDER",
    reminderOn: "On",
    reminderOff: "Off",
    editWeight: "EDIT WEIGHT",
    weekWord: "week",
    sessionsWord: "sessions",
    featDescToday: "The command center for the current day: start the session, jump into quick mode, and keep the week's protocol moving.",
    featDescBody: "Tracks current body weight against the starting point and target so the protocol has a visible physical direction.",
    featDescScore: "Combines weekly completion, sessions, streak, PRs, and fatigue into one performance signal.",
    featDescCalendar: "Shows the month as training status: completed, trained, missed, rest, or planned.",
    featDescPrs: "Collects every exercise marked as a PR from notes, then pairs it with the current programmed weight and date.",
    featDescFatigue: "Uses RPE and pain notes to show weekly strain and warn when the protocol may need a lighter day.",
    featDescGoals: "Keeps weekly targets and the main focus goal visible, with progress against each target.",
    featDescProgress: "Stores body-weight and weekly-performance snapshots so progress survives beyond today's checkboxes.",
    featDescBadges: "Turns consistency into simple streaks and badges without making the app feel noisy.",
    featDescPhotos: "Keeps local progress photos by date, weight, and note for visual comparison.",
    featDescMetrics: "Breaks down the full weekly workload: exercises, sets, sessions, cardio, completion, and set progress.",
    featDescWeek: "Shows the full seven-day split and gives fast access to every programmed workout day.",
    featDescNutrition: "Logs meals, calories and macros against a daily target built from your body data and goal.",
    featDescCardio: "Tracks standalone cardio sessions with distance, pace and estimated calories burned.",
    featDescChallenges: "Personal challenges tracked locally from your training, hydration and cardio logs.",
    unitSystem: "Units",
    metric: "Metric (kg, cm)",
    imperial: "Imperial (lb, in)",
    unitSystemSub: "Switches how weight, height and distance are shown. Stored data is not changed.",
    nutrition: "Nutrition",
    nutritionToday: "Nutrition Today",
    calories: "Calories",
    caloriesLabel: "CALORIES",
    protein: "Protein",
    carbs: "Carbs",
    fat: "Fat",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snack",
    addFood: "Add Food",
    customFood: "Custom Food",
    recentFoods: "Recent",
    calorieTarget: "Calorie Target",
    dailyTarget: "Daily Target",
    serving: "Serving",
    quantity: "Qty",
    bmrLabel: "BMR",
    tdeeLabel: "TDEE",
    macroSplit: "Macro Targets",
    caloriesLeft: "left",
    caloriesOver: "over",
    searchFood: "Search foods",
    activityLevel: "Activity Level",
    activitySedentary: "Sedentary",
    activityLight: "Lightly active",
    activityModerate: "Moderately active",
    activityActive: "Very active",
    activityAthlete: "Athlete",
    noFoodToday: "No food logged today.",
    foodName: "Food name",
    saveFood: "Save Food",
    nutritionHistory: "Recent Days",
    cardio: "Cardio",
    cardioType: "Activity",
    duration: "Duration",
    distance: "Distance",
    pace: "Pace",
    caloriesBurned: "Burned",
    addCardioSession: "Log Cardio",
    weeklyCardio: "This Week",
    cardioSessions: "Sessions",
    noCardioYet: "No cardio logged yet.",
    minutesShort: "min",
    cardioHistory: "Cardio History",
    measurements: "Measurements",
    neck: "Neck",
    chest: "Chest",
    waist: "Waist",
    hips: "Hips",
    arms: "Arms",
    thighs: "Thighs",
    calves: "Calves",
    addMeasurement: "Log Measurements",
    navyBodyFat: "Body Fat (Navy)",
    measurementHistory: "Measurement History",
    noMeasurements: "No measurements logged yet.",
    latestMeasure: "Latest",
    estimatedOneRM: "Est. 1RM",
    newPR: "NEW PERSONAL RECORD",
    volumeTrends: "Volume Trends",
    muscleBalance: "Muscle Group Balance",
    formCues: "Form Cues",
    personalBest: "Best",
    totalVolume: "Weekly Volume",
    viewCues: "Form cues",
    share: "Share",
    shareProgress: "Share Progress",
    shareCard: "Share Image",
    shareCopied: "Summary copied to clipboard.",
    challenges: "Challenges",
    newChallenge: "New Challenge",
    challengeTarget: "Target",
    challengeMetric: "Track",
    challengeWorkouts: "Workout days",
    challengeWater: "Water goal days",
    challengeCardio: "Cardio sessions",
    createChallenge: "Create Challenge",
    activeChallenges: "Active Challenges",
    noChallenges: "No challenges yet. Set one to stay accountable.",
    challengeDays: "Days",
    challengeDone: "Challenge complete!",
    challengeTitle: "Challenge name",
    beforeAfter: "Before / After",
    photoBefore: "Before",
    photoAfter: "After",
    dragToCompare: "Drag the slider to compare",
    comparePhotos: "Compare Photos",
    photoPrev: "Previous",
    photoNext: "Next",
    addFirstPhoto: "Tap to add your first progress photo",
    photoCount: "photos",
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
    currentLabel: "ACTUAL",
    heightLabel: "ALTURA",
    editBodyStatus: "EDITAR ESTADO CORPORAL",
    bodyTrend: "TENDENCIA CORPORAL",
    stableSinceStart: "Estable desde el inicio",
    upFromStarting: "Subiendo desde el peso inicial",
    downFromStarting: "Bajando desde el peso inicial",
    manualBodyCheck: "Revisión corporal manual",
    autoProgressCapture: "Captura automática de progreso",
    dayByDay: "DÍA A DÍA",
    scoreBreakdown: "DESGLOSE DEL PUNTAJE",
    weeklyCompletion: "Cumplimiento semanal",
    sessionTarget: "Meta de sesiones",
    streakPressure: "Presión de racha",
    prMomentum: "Impulso de récords",
    streakLabel: "RACHA",
    prsLabel: "RÉCORDS",
    avgRpeLabel: "RPE PROM.",
    deloadLabel: "DESCARGA",
    exercisesLogged: "ejercicios registrados",
    noEntrySaved: "Aún no hay entrada guardada",
    totalPrs: "RÉCORDS TOTALES",
    heaviestLabel: "MÁS PESADO",
    heaviestLoads: "CARGAS PROGRAMADAS MÁS PESADAS",
    highNotes: "NOTAS ALTAS",
    thisWeek: "ESTA SEMANA",
    lowerLoadAdvice: "Baja la carga, reduce la intensidad o agrega recuperación.",
    noFatigueWarning: "Sin alerta de fatiga en las notas actuales.",
    painSignalNote: "Dolor Agudo/Parar o RPE 9-10 activa la señal de alerta.",
    recentSignals: "SEÑALES RECIENTES",
    deloadActiveVal: "ACTIVO",
    deloadClearVal: "DESPEJADO",
    noExerciseNotes: "Aún no hay notas de ejercicios",
    addPainRPE: "Agrega dolor/RPE en cualquier ejercicio",
    mainFocus: "ENFOQUE PRINCIPAL",
    targetDateSub: "Fecha meta:",
    setMyGoals: "DEFINIR MIS METAS",
    remainingExercises: "EJERCICIOS RESTANTES",
    setCompletionLabel: "SERIES COMPLETADAS",
    saveProgress: "GUARDAR PROGRESO",
    manualSave: "Guardado manual",
    autoSnapshot: "Captura automática",
    badgesLabel: "INSIGNIAS",
    photosLabel: "FOTOS",
    albumsLabel: "ÁLBUMES",
    addPhotoLabel: "AGREGAR FOTO",
    dateField: "FECHA",
    noteField: "NOTA",
    albumField: "ÁLBUM",
    noAlbum: "Sin álbum",
    newAlbumPlaceholder: "Nombre del álbum",
    addPhotoBtn: "Agregar Foto",
    newAlbumBtn: "Nuevo Álbum",
    newAlbumTitle: "Nuevo Álbum",
    noAlbumsHint: "Aún no tienes álbumes. Crea uno para agrupar tus fotos de progreso.",
    restTimerSub: "Descanso por defecto que inicia automáticamente tras cada serie.",
    createBtn: "Crear",
    deleteAlbumBtn: "Eliminar álbum",
    noPhotosInAlbum: "Aún no hay fotos en este álbum.",
    setProgressLabel: "PROGRESO DE SERIES",
    manageWorkoutsSub: "Agrega, edita o elimina ejercicios y sesiones.",
    addExerciseSection: "AGREGAR EJERCICIO",
    noExercisesYet: "Aún no hay ejercicios en esta sesión. Agrega uno abajo.",
    exerciseLabel: "EJERCICIO",
    removeBtn: "Eliminar",
    exerciseNamePlaceholder: "Nombre del ejercicio",
    daySection: "DÍA",
    sessionSection: "SESIÓN",
    sessionNameField: "NOMBRE DE SESIÓN",
    timeField: "HORA",
    addSessionBtn: "Agregar Sesión",
    duplicateBtn: "Duplicar",
    deleteBtn: "Eliminar",
    sessionNamePlaceholder: "Nombre de la sesión",
    repsLabel: "REPS",
    customReminders: "RECORDATORIOS PERSONALIZADOS",
    reminderTitlePlaceholder: "Título del recordatorio",
    reminderMessagePlaceholder: "Mensaje del recordatorio",
    addReminderBtn: "AGREGAR RECORDATORIO",
    reminderOn: "Activo",
    reminderOff: "Inactivo",
    editWeight: "EDITAR PESO",
    weekWord: "semana",
    sessionsWord: "sesiones",
    featDescToday: "El centro de mando del día actual: inicia la sesión, entra al modo rápido y mantén el protocolo semanal en movimiento.",
    featDescBody: "Rastrea el peso corporal actual contra el punto de inicio y la meta para que el protocolo tenga una dirección física visible.",
    featDescScore: "Combina cumplimiento semanal, sesiones, racha, récords y fatiga en una sola señal de rendimiento.",
    featDescCalendar: "Muestra el mes como estado de entrenamiento: completado, entrenado, perdido, descanso o planeado.",
    featDescPrs: "Reúne cada ejercicio marcado como récord en las notas y lo empareja con el peso programado actual y la fecha.",
    featDescFatigue: "Usa notas de RPE y dolor para mostrar la carga semanal y avisar cuando el protocolo puede necesitar un día más ligero.",
    featDescGoals: "Mantiene visibles las metas semanales y el objetivo principal, con progreso hacia cada meta.",
    featDescProgress: "Guarda instantáneas de peso corporal y rendimiento semanal para que el progreso sobreviva más allá de los checkboxes de hoy.",
    featDescBadges: "Convierte la constancia en rachas e insignias simples sin hacer la app ruidosa.",
    featDescPhotos: "Guarda fotos de progreso locales por fecha, peso y nota para comparación visual.",
    featDescMetrics: "Desglosa la carga semanal completa: ejercicios, series, sesiones, cardio, completados y progreso de series.",
    featDescWeek: "Muestra la división completa de siete días y da acceso rápido a cada día de entrenamiento programado.",
    featDescNutrition: "Registra comidas, calorías y macros contra una meta diaria calculada con tus datos y tu objetivo.",
    featDescCardio: "Registra sesiones de cardio con distancia, ritmo y calorías estimadas quemadas.",
    featDescChallenges: "Retos personales calculados localmente desde tu entrenamiento, hidratación y cardio.",
    unitSystem: "Unidades",
    metric: "Métrico (kg, cm)",
    imperial: "Imperial (lb, in)",
    unitSystemSub: "Cambia cómo se muestran peso, altura y distancia. Los datos guardados no cambian.",
    nutrition: "Nutrición",
    nutritionToday: "Nutrición Hoy",
    calories: "Calorías",
    caloriesLabel: "CALORÍAS",
    protein: "Proteína",
    carbs: "Carbohidratos",
    fat: "Grasa",
    breakfast: "Desayuno",
    lunch: "Almuerzo",
    dinner: "Cena",
    snack: "Snack",
    addFood: "Agregar Alimento",
    customFood: "Alimento Personalizado",
    recentFoods: "Recientes",
    calorieTarget: "Meta de Calorías",
    dailyTarget: "Meta Diaria",
    serving: "Porción",
    quantity: "Cant.",
    bmrLabel: "TMB",
    tdeeLabel: "GET",
    macroSplit: "Metas de Macros",
    caloriesLeft: "restantes",
    caloriesOver: "de más",
    searchFood: "Buscar alimentos",
    activityLevel: "Nivel de Actividad",
    activitySedentary: "Sedentario",
    activityLight: "Poco activo",
    activityModerate: "Moderadamente activo",
    activityActive: "Muy activo",
    activityAthlete: "Atleta",
    noFoodToday: "No has registrado comida hoy.",
    foodName: "Nombre del alimento",
    saveFood: "Guardar Alimento",
    nutritionHistory: "Días Recientes",
    cardio: "Cardio",
    cardioType: "Actividad",
    duration: "Duración",
    distance: "Distancia",
    pace: "Ritmo",
    caloriesBurned: "Quemadas",
    addCardioSession: "Registrar Cardio",
    weeklyCardio: "Esta Semana",
    cardioSessions: "Sesiones",
    noCardioYet: "Aún no hay cardio registrado.",
    minutesShort: "min",
    cardioHistory: "Historial de Cardio",
    measurements: "Medidas",
    neck: "Cuello",
    chest: "Pecho",
    waist: "Cintura",
    hips: "Cadera",
    arms: "Brazos",
    thighs: "Muslos",
    calves: "Pantorrillas",
    addMeasurement: "Registrar Medidas",
    navyBodyFat: "Grasa Corporal (Navy)",
    measurementHistory: "Historial de Medidas",
    noMeasurements: "Aún no hay medidas registradas.",
    latestMeasure: "Última",
    estimatedOneRM: "1RM Est.",
    newPR: "NUEVO RÉCORD PERSONAL",
    volumeTrends: "Tendencia de Volumen",
    muscleBalance: "Balance por Grupo Muscular",
    formCues: "Indicaciones de Técnica",
    personalBest: "Mejor",
    totalVolume: "Volumen Semanal",
    viewCues: "Técnica",
    share: "Compartir",
    shareProgress: "Compartir Progreso",
    shareCard: "Compartir Imagen",
    shareCopied: "Resumen copiado al portapapeles.",
    challenges: "Retos",
    newChallenge: "Nuevo Reto",
    challengeTarget: "Meta",
    challengeMetric: "Medir",
    challengeWorkouts: "Días de entreno",
    challengeWater: "Días de meta de agua",
    challengeCardio: "Sesiones de cardio",
    createChallenge: "Crear Reto",
    activeChallenges: "Retos Activos",
    noChallenges: "Aún no hay retos. Crea uno para mantener el compromiso.",
    challengeDays: "Días",
    challengeDone: "¡Reto completado!",
    challengeTitle: "Nombre del reto",
    beforeAfter: "Antes / Después",
    photoBefore: "Antes",
    photoAfter: "Después",
    dragToCompare: "Desliza para comparar",
    comparePhotos: "Comparar Fotos",
    photoPrev: "Anterior",
    photoNext: "Siguiente",
    addFirstPhoto: "Toca para agregar tu primera foto de progreso",
    photoCount: "fotos",
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
  if (typeof daysToGoal === "number" && daysToGoal > 0 && daysToGoal <= 7) return isEs ? `Solo ${daysToGoal} días para tu meta. Termina fuerte — cada serie cuenta.` : `Only ${daysToGoal} days left. Leave nothing on the table.`;
  if (typeof daysToGoal === "number" && daysToGoal > 0 && daysToGoal <= 30) return isEs ? `${daysToGoal} días para tu meta. No pierdas el momentum.` : `${daysToGoal} days to your goal. Don't lose the momentum.`;
  if (missedStreak >= 3) return isEs ? "Han pasado varios días. El cuerpo se adapta — pero solo si entrenas. Vuelve hoy." : "It's been a few days. Fitness is built in the gym, not planned there. Get back today.";
  if (weeklyProgress >= 95) return isEs ? "¡Semana casi perfecta! Cierra al 100% y demuestra lo que eres." : "Dominant week. Close it at 100% and cement the standard.";
  if (weeklyProgress >= 70) return isEs ? "¡Sólida semana! Una o dos sesiones más y cierras fuerte." : "Strong week. One more session and you close it right.";
  if (weeklyProgress >= 40) return isEs ? "Buen ritmo esta semana. Sigue acumulando — la consistencia es todo." : "Good rhythm this week. Keep stacking sessions — consistency wins.";
  if (hasTrainedToday) return isEs ? "¡Ya entrenaste hoy! El trabajo está hecho. Descansa y recupérate." : "You already trained today. Work is done — rest and recover.";
  const type = todayType || "TRAINING";
  const day = todayDisplayName || (isEs ? "Hoy" : "Today");
  return isEs ? `Es día de ${type}. Ejecuta el protocolo y sé mejor que ayer.` : `${day} is ${type} day. Execute the protocol and be better than yesterday.`;
}

// Builds the Coach recommendations as themed sections (nutrition, training,
// cardio, recovery). Each tip uses the user's real numbers when available so
// the advice is specific instead of generic.
function getCoachTips({ sex, age, bmi, bodyFatPct, bodyTypeGoal, language, weightLb, tdee, calorieTarget, macros }) {
  const isEs = language === "es";
  const t = (es, en) => (isEs ? es : en);
  const ageNum = Number(age) || 25;
  const weight = Number(weightLb) || 0;
  const goal = bodyTypeGoal || "athletic";
  const hasNumbers = calorieTarget > 0 && macros && macros.protein > 0;
  const sections = [];

  const nutrition = [];
  if (hasNumbers) {
    const goalNote =
      goal === "lean" ? t("un déficit de ~400 kcal para perder grasa sin sacrificar músculo", "a ~400 kcal deficit to lose fat without sacrificing muscle")
      : goal === "muscular" ? t("un superávit de ~350 kcal para ganar músculo magro", "a ~350 kcal surplus to build lean muscle")
      : goal === "athletic" ? t("un déficit ligero para recomposición corporal", "a slight deficit for body recomposition")
      : t("calorías de mantenimiento", "maintenance calories");
    nutrition.push(t(
      `Tu objetivo es ~${calorieTarget.toLocaleString()} kcal/día (${goalNote}). Tu gasto diario estimado es ~${tdee.toLocaleString()} kcal.`,
      `Your target is ~${calorieTarget.toLocaleString()} kcal/day (${goalNote}). Your estimated daily burn is ~${tdee.toLocaleString()} kcal.`
    ));
    nutrition.push(t(
      `Proteína: ${macros.protein} g al día. Repártela en 4 comidas de ~${Math.round(macros.protein / 4)} g para maximizar la síntesis muscular.`,
      `Protein: ${macros.protein} g per day. Split it across 4 meals of ~${Math.round(macros.protein / 4)} g to maximize muscle synthesis.`
    ));
    nutrition.push(t(
      `Carbohidratos ${macros.carbs} g y grasas ${macros.fat} g. Concentra los carbohidratos antes y después de entrenar.`,
      `Carbs ${macros.carbs} g and fats ${macros.fat} g. Concentrate carbs before and after training.`
    ));
  } else {
    nutrition.push(t(
      "Completa peso, altura, edad y sexo en tu perfil para desbloquear tus calorías y macros exactos.",
      "Fill in weight, height, age and sex in your profile to unlock your exact calories and macros."
    ));
  }
  if (weight > 0) {
    const liters = Math.max(2, Math.round((weight * 0.5 / 33.814) * 10) / 10);
    nutrition.push(t(
      `Bebe ~${liters} L de agua al día. La deshidratación puede reducir tu fuerza hasta un 10%.`,
      `Drink ~${liters} L of water a day. Dehydration can cut your strength by up to 10%.`
    ));
  }
  sections.push({ title: t("NUTRICIÓN", "NUTRITION"), accent: "#3FB98A", tips: nutrition });

  const training = [];
  if (goal === "lean") {
    training.push(t("Mantén las cargas pesadas (6–10 reps). Bajar el peso en déficit le dice al cuerpo que puede soltar músculo.", "Keep loads heavy (6–10 reps). Cutting weight in a deficit tells your body it can shed muscle."));
    training.push(t("Descansa 60–90 s entre series para mantener alta la densidad e intensidad del entrenamiento.", "Rest 60–90 s between sets to keep training density and intensity high."));
  } else if (goal === "muscular") {
    training.push(t("Prioriza los compuestos pesados: Sentadilla, Press de Banca, Peso Muerto, Remo y Press Militar.", "Prioritize heavy compounds: Squat, Bench Press, Deadlift, Row and Overhead Press."));
    training.push(t("Sobrecarga progresiva: sube peso o repeticiones cada 1–2 semanas. Sin progresión no hay crecimiento.", "Progressive overload: add weight or reps every 1–2 weeks. No progression, no growth."));
    training.push(t("Descansa 2–3 min en los ejercicios pesados para mover la máxima carga posible.", "Rest 2–3 min on heavy lifts so you can move the most load possible."));
  } else if (goal === "athletic") {
    training.push(t("Combina 4 días de fuerza con 2 de cardio para un físico atlético y equilibrado.", "Combine 4 strength days with 2 cardio days for a balanced athletic build."));
    training.push(t("Alterna semanas de fuerza (4–6 reps) e hipertrofia (8–12 reps) para ganar fuerza y tamaño.", "Alternate strength weeks (4–6 reps) and hypertrophy weeks (8–12 reps) to build both strength and size."));
  } else {
    training.push(t("Entrena cada grupo muscular 2 veces por semana para conservar fuerza y masa.", "Train each muscle group twice a week to preserve strength and mass."));
    training.push(t("Varía la intensidad cada 4–6 semanas para evitar el estancamiento.", "Vary intensity every 4–6 weeks to prevent plateaus."));
  }
  training.push(t("Registra cada serie en la app: lo que se mide, mejora.", "Log every set in the app: what gets measured improves."));
  sections.push({ title: t("ENTRENAMIENTO", "TRAINING"), accent: "#90C8FF", tips: training });

  const cardio = [];
  if (goal === "lean" || bmi > 27) {
    cardio.push(t("HIIT 2–3 días/semana: quema grasa y protege el músculo mejor que el cardio largo y lento.", "HIIT 2–3 days/week: it burns fat and protects muscle better than long slow cardio."));
    cardio.push(t("Apunta a 8–10k pasos diarios. El movimiento de baja intensidad acelera la pérdida de grasa sin afectar la recuperación.", "Aim for 8–10k daily steps. Low-intensity movement speeds fat loss without hurting recovery."));
  } else if (goal === "muscular") {
    cardio.push(t("Limita el cardio a 1–2 sesiones cortas/semana para no comprometer la ganancia muscular.", "Limit cardio to 1–2 short sessions/week so it doesn't compromise muscle gain."));
    cardio.push(t("Usa cardio ligero en los días de descanso para mejorar la recuperación y la salud cardiovascular.", "Use light cardio on rest days to support recovery and heart health."));
  } else {
    cardio.push(t("2–3 sesiones de cardio/semana mantienen tu corazón fuerte y tu resistencia alta.", "2–3 cardio sessions/week keep your heart strong and your endurance high."));
    cardio.push(t("Mezcla un día intenso (HIIT) y uno moderado (zona 2) para lo mejor de ambos mundos.", "Mix one intense day (HIIT) with one moderate day (zone 2) for the best of both."));
  }
  sections.push({ title: t("CARDIO", "CARDIO"), accent: "#FF9860", tips: cardio });

  const recovery = [];
  recovery.push(t("Duerme 7–9 h. La mayor parte de la síntesis muscular y la recuperación ocurren mientras duermes.", "Sleep 7–9 h. Most muscle synthesis and recovery happen while you sleep."));
  if (ageNum >= 40) {
    recovery.push(t("A los 40+: dedica 10 min diarios a movilidad. Las articulaciones importan tanto como el músculo.", "Age 40+: spend 10 min a day on mobility. Joints matter as much as muscle."));
    recovery.push(t("Programa una semana de descarga cada 4–5 semanas; la recuperación se hace más lenta con la edad.", "Schedule a deload week every 4–5 weeks; recovery slows down with age."));
  } else if (ageNum < 25) {
    recovery.push(t("Tu recuperación es rápida: puedes entrenar más seguido y fuerte, pero no descuides el sueño.", "Your recovery is fast: you can train more often and harder, but don't skip sleep."));
    recovery.push(t("Haz una semana de descarga cada 6–8 semanas para consolidar tus ganancias.", "Take a deload week every 6–8 weeks to lock in your gains."));
  } else {
    recovery.push(t("Programa una semana de descarga cada 5–6 semanas para evitar el sobreentrenamiento.", "Schedule a deload week every 5–6 weeks to avoid overtraining."));
  }
  if (sex === "female") {
    recovery.push(t("El entrenamiento de fuerza tonifica y fortalece los huesos sin generar volumen excesivo.", "Strength training tones you and strengthens your bones without adding excess bulk."));
  }
  if (bodyFatPct > 0) {
    if ((sex === "male" && bodyFatPct >= 25) || (sex === "female" && bodyFatPct >= 32)) {
      recovery.push(t("Tu grasa corporal está alta: prioriza el déficit calórico y la fuerza antes de buscar ganar músculo.", "Your body fat is high: prioritize a calorie deficit and strength work before chasing muscle gain."));
    } else if ((sex === "male" && bodyFatPct < 14) || (sex === "female" && bodyFatPct < 21)) {
      recovery.push(t("Estás muy definido: asegúrate de comer suficiente para sostener el rendimiento y las hormonas.", "You're very lean: make sure you eat enough to sustain performance and hormones."));
    }
  }
  sections.push({ title: t("RECUPERACIÓN", "RECOVERY"), accent: "#B8A0FF", tips: recovery });

  return sections;
}

// Estimates the user's activity level from their weekly training schedule so
// the calorie target reflects how much they actually train. Two-a-day weeks
// (sessions well beyond training days) bump the level up one tier.
function deriveActivityLevel(trainingDays, trainingSessions) {
  let level;
  if (trainingDays <= 0) level = "sedentary";
  else if (trainingDays <= 2) level = "light";
  else if (trainingDays <= 5) level = "moderate";
  else level = "active";

  if (trainingDays >= 4 && trainingSessions >= trainingDays * 2) {
    const index = ACTIVITY_LEVELS.indexOf(level);
    level = ACTIVITY_LEVELS[Math.min(index + 1, ACTIVITY_LEVELS.length - 1)];
  }

  return level;
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
  // Language is derived early because the meditation timer effect (defined
  // further down) reads it from its closure — keeping it here avoids a
  // temporal-dead-zone crash on first render.
  const language = appSettings.language === "es" ? "es" : "en";
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
  const [photoDraft, setPhotoDraft] = useState({ date: getDateKey(), note: "", dataUrl: "", album: "", weight: "" });
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [comparePos, setComparePos] = useState(50);
  const [compareAId, setCompareAId] = useState("");
  const [compareBId, setCompareBId] = useState("");
  const [albumFilter, setAlbumFilter] = useState("");
  const [albumDraft, setAlbumDraft] = useState("");
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [reminderDraft, setReminderDraft] = useState({ label: "Custom reminder", time: "12:00", message: "Stay on protocol.", sound: "chime" });
  const [restTimer, setRestTimer] = useState({ secondsLeft: 0, duration: 0, running: false, label: "", endsAt: null, notified: false });
  const [clockNow, setClockNow] = useState(() => new Date());
  const [waterLog, setWaterLog] = useState({});
  const [foodLog, setFoodLog] = useState({});
  const [customFoods, setCustomFoods] = useState([]);
  const [recentFoods, setRecentFoods] = useState([]);
  const [cardioLog, setCardioLog] = useState({});
  const [measurementLog, setMeasurementLog] = useState({});
  const [exercisePerformance, setExercisePerformance] = useState({});
  const [challenges, setChallenges] = useState([]);
  const [meditationLog, setMeditationLog] = useState({});
  const [medTimer, setMedTimer] = useState({
    running: false,
    practice: "pranayama",
    durationSec: 600,
    endsAt: 0,
    remainingMs: 0,
    intervalBellMin: 0,
  });
  const [medTick, setMedTick] = useState(0);
  const [medCompleted, setMedCompleted] = useState(null);
  const [medReflection, setMedReflection] = useState("");
  const [medShowAdjustments, setMedShowAdjustments] = useState(false);
  const medSpokenRef = useRef(new Set());
  const medAmbientRef = useRef(null);
  const medLastBellSecRef = useRef(0);
  const [expandedExerciseIndex, setExpandedExerciseIndex] = useState(null);
  const [exerciseFilterMuscle, setExerciseFilterMuscle] = useState("All");
  const [addFoodTarget, setAddFoodTarget] = useState(null);
  const [foodSearch, setFoodSearch] = useState("");
  const [customFoodDraft, setCustomFoodDraft] = useState({ name: "", kcal: "", protein: "", carbs: "", fat: "" });
  const [cardioDraft, setCardioDraft] = useState({ type: "run", durationMin: "", distance: "", note: "" });
  const [editingMeasurements, setEditingMeasurements] = useState(null);
  const [challengeDraft, setChallengeDraft] = useState({ title: "", metric: "workouts", target: "12", days: "30" });
  const [prToast, setPrToast] = useState("");
  const [toast, setToast] = useState("");
  const [cuesExerciseIndex, setCuesExerciseIndex] = useState(null);
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
      foodLog,
      customFoods,
      recentFoods,
      cardioLog,
      measurementLog,
      exercisePerformance,
      challenges,
      meditationLog,
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
    foodLog,
    customFoods,
    recentFoods,
    cardioLog,
    measurementLog,
    exercisePerformance,
    challenges,
    meditationLog,
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

  // Wall-clock-driven meditation session. The timer derives secondsLeft from
  // endsAt - Date.now() so it stays accurate when the tab is in the
  // background. Each tick checks for opening/cycle/reminder/closing voice
  // cues and rings interval bells as configured.
  useEffect(() => {
    if (!medTimer.running || !medTimer.endsAt) return undefined;

    const def = MEDITATION_PRACTICES[medTimer.practice] || MEDITATION_PRACTICES.pranayama;
    const voiceOn = appSettings.meditationVoice !== false;
    const voiceVol = appSettings.meditationVoiceVolume;

    const openingEndSec = def.script.openingEndsAtSec
      || (def.script.opening.length > 0 ? def.script.opening[def.script.opening.length - 1].atSec + 8 : 0);
    const firstClose = def.script.closing[0];
    const closingStartSec = firstClose ? medTimer.durationSec - firstClose.secondsBeforeEnd - 4 : medTimer.durationSec;

    const handleCues = (elapsed, secondsLeft) => {
      // Opening cues — fire as elapsed crosses each cue's atSec.
      def.script.opening.forEach((cue, i) => {
        if (elapsed >= cue.atSec && elapsed < cue.atSec + 2) {
          const key = `opening-${i}`;
          if (!medSpokenRef.current.has(key)) {
            medSpokenRef.current.add(key);
            speakMeditationCue(language === "es" ? cue.es : cue.en, language, voiceOn, voiceVol);
          }
        }
      });

      // Cycle cues — only after opening ends, for the next N full breath
      // cycles. Each phase boundary gets a short cue (e.g. "Inhala") so the
      // user learns the rhythm, then the voice goes silent and the
      // breathing circle becomes the guide.
      if (def.script.cycleCues && def.cycleSec > 0 && elapsed >= openingEndSec) {
        const sinceOpening = elapsed - openingEndSec;
        const cycleNum = Math.floor(sinceOpening / def.cycleSec);
        if (cycleNum < def.script.cycleCues.speakCycles) {
          const cyclePos = sinceOpening % def.cycleSec;
          let phaseStart = 0;
          for (let pi = 0; pi < def.phases.length; pi += 1) {
            if (cyclePos >= phaseStart && cyclePos < phaseStart + 2) {
              const key = `cycle-${cycleNum}-${pi}`;
              if (!medSpokenRef.current.has(key)) {
                medSpokenRef.current.add(key);
                const cue = def.script.cycleCues.phaseCues[pi];
                if (cue) speakMeditationCue(language === "es" ? cue.es : cue.en, language, voiceOn, voiceVol);
                if (pi === 0) meditationVibrate(60);
              }
              break;
            }
            phaseStart += def.phases[pi].sec;
          }
        }
      }

      // Reminders during the core practice. A single everyMin schedule
      // rotates through the cue array so the same line never repeats twice
      // in a row.
      if (def.script.reminders && def.script.reminders.everyMin > 0 && elapsed > openingEndSec && elapsed < closingStartSec) {
        const everySec = def.script.reminders.everyMin * 60;
        const since = elapsed - openingEndSec;
        if (since > 0 && since % everySec === 0) {
          const tick = Math.floor(since / everySec);
          const key = `reminder-${tick}`;
          if (!medSpokenRef.current.has(key)) {
            medSpokenRef.current.add(key);
            const cues = def.script.reminders.cues || [];
            if (cues.length > 0) {
              const cue = cues[(tick - 1) % cues.length];
              speakMeditationCue(language === "es" ? cue.es : cue.en, language, voiceOn, voiceVol);
            }
          }
        }
      }

      // Closing cues (anchored to time-from-end).
      def.script.closing.forEach((cue, i) => {
        if (secondsLeft <= cue.secondsBeforeEnd && secondsLeft > cue.secondsBeforeEnd - 2) {
          const key = `closing-${i}`;
          if (!medSpokenRef.current.has(key)) {
            medSpokenRef.current.add(key);
            speakMeditationCue(language === "es" ? cue.es : cue.en, language, voiceOn, voiceVol);
          }
        }
      });
    };

    const tick = () => {
      const now = Date.now();
      const secondsLeft = Math.max(0, Math.ceil((medTimer.endsAt - now) / 1000));
      const elapsed = medTimer.durationSec - secondsLeft;

      if (secondsLeft <= 0) {
        const totalMin = Math.max(1, Math.round(medTimer.durationSec / 60));
        logMeditationSession(totalMin, medTimer.practice);
        playReminderSound("bell");
        meditationVibrate([400, 100, 400]);
        cancelMeditationSpeech();
        setMedCompleted({ durationMin: totalMin, practice: medTimer.practice, at: Date.now() });
        setMedTimer(prev => ({ ...prev, running: false, endsAt: 0, remainingMs: 0 }));
        return;
      }

      handleCues(elapsed, secondsLeft);

      // Interval bell. Sound once each time elapsed crosses N minutes,
      // skipping the last ~5 s so it never collides with the end-of-session
      // bell. Tracked in a ref because the effect closure can't see fresh
      // state updates without re-firing.
      if (medTimer.intervalBellMin > 0 && elapsed > 0 && secondsLeft > 5) {
        const bellEvery = medTimer.intervalBellMin * 60;
        const targetTick = Math.floor(elapsed / bellEvery);
        const lastTick = Math.floor(medLastBellSecRef.current / bellEvery);
        if (targetTick > lastTick) {
          playReminderSound("chime");
          meditationVibrate(180);
          medLastBellSecRef.current = elapsed;
        }
      }

      setMedTick(t => (t + 1) & 0xffff);
    };

    tick(); // run once immediately for snappy UI
    const intervalId = window.setInterval(tick, 500);
    return () => window.clearInterval(intervalId);
    // logMeditationSession is stable in effect; eslint exhaustive-deps off.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [medTimer.running, medTimer.endsAt, medTimer.practice, medTimer.durationSec, medTimer.intervalBellMin, language, appSettings.meditationVoice, appSettings.meditationVoiceVolume]);

  // Ambient background sound (rain/ocean/om) created via WebAudio while a
  // meditation session is running. No audio files are bundled — everything
  // is synthesized at runtime.
  useEffect(() => {
    if (!medTimer.running) return undefined;
    const type = appSettings.meditationSound || "off";
    if (type === "off") return undefined;
    const ambient = startMeditationAmbient(type);
    medAmbientRef.current = ambient;
    return () => {
      if (medAmbientRef.current) {
        medAmbientRef.current.stop();
        medAmbientRef.current = null;
      }
    };
  }, [medTimer.running, appSettings.meditationSound]);

  // Restore the user's last-used practice / duration / interval bell after
  // their account data is loaded.
  useEffect(() => {
    if (!activeUserId) return;
    setMedTimer(prev => {
      if (prev.running) return prev;
      const practiceKey = MEDITATION_PRACTICES[appSettings.meditationPractice]
        ? appSettings.meditationPractice
        : "pranayama";
      const def = MEDITATION_PRACTICES[practiceKey];
      const durationMin = Math.min(def.maxMin, Math.max(def.minMin, Number(appSettings.meditationDurationMin) || def.defaultMin));
      const durationSec = durationMin * 60;
      return {
        ...prev,
        practice: practiceKey,
        durationSec,
        endsAt: 0,
        remainingMs: 0,
        intervalBellMin: Math.max(0, Number(appSettings.meditationIntervalBellMin) || 0),
      };
    });
  }, [activeUserId, appSettings.meditationPractice, appSettings.meditationDurationMin, appSettings.meditationIntervalBellMin]);


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

  // Records a completed exercise into per-exercise performance history and
  // auto-flags a PR when the estimated 1RM beats the stored best.
  const recordExerciseCompletion = (exercise, key) => {
    if (!exercise || !exercise.name) return;
    const est1RM = estimate1RMFromExercise(exercise.weight, exercise.reps);
    if (est1RM <= 0) return;

    const name = exercise.name;
    const newRecord = isNewPR(est1RM, exercisePerformance[name]);
    const historyEntry = {
      date: getDateKey(),
      weight: parseWeightNumber(exercise.weight),
      reps: parseRepsNumber(exercise.reps),
      est1RM,
    };

    setExercisePerformance(prev => {
      const record = prev[name];
      return {
        ...prev,
        [name]: {
          best1RM: Math.max(est1RM, record?.best1RM || 0),
          bestWeight: Math.max(historyEntry.weight, record?.bestWeight || 0),
          bestReps: Math.max(historyEntry.reps, record?.bestReps || 0),
          history: [historyEntry, ...((record && record.history) || [])].slice(0, 30),
        },
      };
    });

    if (newRecord) {
      setExerciseNotes(prev => ({
        ...prev,
        [key]: { ...(prev[key] || {}), pr: true, updatedAt: new Date().toISOString() },
      }));
      setPrToast(name);
      window.setTimeout(() => setPrToast(""), 2600);
    }
  };

  const updateSetCount = (exerciseIndex, delta) => {
    const key = getExerciseKey(activeDay, activeSession, exerciseIndex);
    const exercise = session.exercises[exerciseIndex];
    const totalSets = Number(exercise?.sets || 0);
    const currentSets = Number(setProgress[key] || 0);
    const nextSets = Math.max(0, Math.min(totalSets, currentSets + delta));
    const nextSetProgress = { ...setProgress, [key]: nextSets };
    const nextChecked = { ...checked };
    const wasChecked = !!checked[key];

    if (totalSets > 0 && nextSets >= totalSets) {
      nextChecked[key] = true;
      if (!wasChecked) recordExerciseCompletion(exercise, key);
      const nextIndex = session.exercises.findIndex((_, index) => index > exerciseIndex && !nextChecked[getExerciseKey(activeDay, activeSession, index)]);
      setHighlightedExerciseIndex(nextIndex >= 0 ? nextIndex : exerciseIndex);
      startRestTimer(restSecondsSetting);
    } else {
      nextChecked[key] = false;
      setHighlightedExerciseIndex(exerciseIndex);
      if (delta > 0) startRestTimer(restSecondsSetting);
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
      recordExerciseCompletion(session.exercises[exerciseIndex], key);
      const nextIndex = session.exercises.findIndex((_, index) => index > exerciseIndex && !nextChecked[getExerciseKey(activeDay, activeSession, index)]);
      setHighlightedExerciseIndex(nextIndex >= 0 ? nextIndex : exerciseIndex);
      startRestTimer(restSecondsSetting);
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
    let trainingDays = 0;
    let trainingSessions = 0;

    days.forEach(dayName => {
      let dayExercises = 0;
      let dayDone = 0;

      workoutData[dayName].sessions.forEach((currentSession, sessionIndex) => {
        if (!currentSession.rest) workoutSessions += 1;
        if (!currentSession.rest && currentSession.exercises.length > 0) trainingSessions += 1;
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

      if (dayExercises > 0) {
        trainingDays += 1;
      }

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
      trainingDays,
      trainingSessions,
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
  const meditationGoalMin = Math.max(1, Number(appSettings.meditationGoalMin) || 10);
  const meditationStats = useMemo(() => {
    const todayKey = getDateKey();
    const sumMinutes = list => (Array.isArray(list) ? list : []).reduce((sum, item) => sum + (Number(item.durationMin) || 0), 0);
    const todayMinutes = sumMinutes(meditationLog[todayKey]);
    let totalSessions = 0;
    let totalMinutes = 0;
    Object.values(meditationLog).forEach(list => {
      if (!Array.isArray(list)) return;
      totalSessions += list.length;
      totalMinutes += sumMinutes(list);
    });
    // Daily streak: consecutive days back from today that hit the goal.
    let streak = 0;
    for (let offset = 0; offset < 365; offset += 1) {
      const day = new Date();
      day.setDate(day.getDate() - offset);
      const key = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
      const minutes = sumMinutes(meditationLog[key]);
      if (minutes >= meditationGoalMin) {
        streak += 1;
      } else if (offset === 0) {
        // Today not yet at goal — don't break the prior streak.
        continue;
      } else {
        break;
      }
    }
    return { todayMinutes, totalSessions, totalMinutes, streak };
  }, [meditationLog, meditationGoalMin]);
  const earnedBadges = [
    weeklyMetrics.weeklyProgress >= 100 ? (appSettings.language === "es" ? "Protocolo Completo" : "Protocol Clear") : null,
    weeklyMetrics.completedSessions >= weeklySessionsGoal ? (appSettings.language === "es" ? "Cazador de Sesiones" : "Session Hunter") : null,
    weeklyStreak >= 2 ? (appSettings.language === "es" ? `Racha de ${weeklyStreak} Semanas` : `${weeklyStreak} Week Streak`) : null,
    progressEntries.some(entry => entry.type === "manual") ? (appSettings.language === "es" ? "Progreso Registrado" : "Progress Logged") : null,
  ].filter(Boolean);
  const restTimerRadius = 44;
  const restTimerCircumference = 2 * Math.PI * restTimerRadius;
  const restTimerProgress = restTimer.duration > 0 ? restTimer.secondsLeft / restTimer.duration : 0;
  const restTimerOffset = restTimerCircumference * (1 - restTimerProgress);
  const restSecondsSetting = Number(appSettings.restSeconds) || 90;
  const restPresets = [...new Set([60, 90, 120, restSecondsSetting])].sort((a, b) => a - b);
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
  const text = UI_TEXT[language];
  const calendarLabels = {
    completed: text.calCompleted,
    trained: text.calTrained,
    missed: text.calMissed,
    rest: text.calRest,
    planned: text.calPlanned,
  };
  const activeThemeMode = appSettings.themeMode === "auto" ? getAutoTheme(clockNow.getHours()) : appSettings.themeMode;
  // When a custom background (color/gradient/photo) is active, force dark
  // styling so cards stay translucent and the chosen background shows
  // through. In light mode all cards are opaque white, which would cover
  // a photo with rectangles.
  const _bgType = appSettings.background && appSettings.background.type;
  const isLightMode = _bgType && _bgType !== "default" ? false : activeThemeMode === "light";
  const themeFor = type => {
    const base = TYPE_THEME[type] || TYPE_THEME.CUSTOM;
    return isLightMode
      ? { ...base, accent: base.lightAccent, sub: base.lightSub, badge: base.lightBadge }
      : base;
  };
  const theme = themeFor(day.type);
  const unitSystem = appSettings.unitSystem === "metric" ? "metric" : "imperial";
  const fmtW = lb => formatWeight(lb, unitSystem);
  const fmtWDelta = lb => formatWeightDelta(lb, unitSystem);
  const fmtH = h => formatHeight(h, unitSystem);
  const fmtExW = w => formatExerciseWeight(w, unitSystem);
  const fmtDist = mi => formatDistance(mi, unitSystem);
  const fmtMeasure = inches => formatMeasure(inches, unitSystem);
  const greeting = text[getGreetingKey(clockNow.getHours())];
  const userName = appSettings.firstName?.trim() || appSettings.name?.trim().split(" ")[0] || "Atlas";
  const fullName = `${appSettings.firstName || ""} ${appSettings.lastName || ""}`.trim() || appSettings.name?.trim() || "Atlas";
  const userAvatar = appSettings.avatar || "";
  const displayDay = dayName => getDisplayDay(dayName, language);
  const displayDayShort = (dayName, fallback) => getDisplayDayShort(dayName, language, fallback);
  const weekHeaderLabels = getWeekHeaderLabels(language);
  const todayDisplayName = displayDay(weeklyMetrics.today);
  const featurePageLabels = language === "es"
    ? { today:"Hoy", body:"Cuerpo", score:"Puntaje", calendar:"Calendario", prs:"Récords",
        fatigue:"Fatiga", goals:"Metas", progress:"Progreso", badges:"Insignias",
        photos:"Fotos", metrics:"Métricas", week:"Semana", water:"Agua", coach:"Coach",
        nutrition:"Nutrición", cardio:"Cardio", challenges:"Retos", meditation:"Meditación" }
    : { today:"Today", body:"Body", score:"Score", calendar:"Calendar", prs:"PRs",
        fatigue:"Fatigue", goals:"Goals", progress:"Progress", badges:"Badges",
        photos:"Photos", metrics:"Metrics", week:"Week", water:"Water", coach:"Coach",
        nutrition:"Nutrition", cardio:"Cardio", challenges:"Challenges", meditation:"Meditation" };
  const featurePages = [
    { id: "today", title: text.todayCommand, label: featurePageLabels.today, accent: themeFor(weeklyMetrics.todayType).accent },
    { id: "body", title: text.bodyStatus, label: featurePageLabels.body, accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "nutrition", title: text.nutrition, label: featurePageLabels.nutrition, accent: "#3FB98A" },
    { id: "cardio", title: text.cardio, label: featurePageLabels.cardio, accent: "#FF9860" },
    { id: "score", title: text.atlasScore, label: featurePageLabels.score, accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "calendar", title: text.monthCalendar, label: featurePageLabels.calendar, accent: "#90C8FF" },
    { id: "prs", title: text.prTracker, label: featurePageLabels.prs, accent: "#FFD060" },
    { id: "fatigue", title: text.fatigueDeload, label: featurePageLabels.fatigue, accent: deloadWarning ? "#FFD060" : isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "goals", title: text.myGoals, label: featurePageLabels.goals, accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "challenges", title: text.challenges, label: featurePageLabels.challenges, accent: "#B8A0FF" },
    { id: "progress", title: text.progressMemory, label: featurePageLabels.progress, accent: "#90C8FF" },
    { id: "badges", title: text.streakBadges, label: featurePageLabels.badges, accent: "#B8A0FF" },
    { id: "photos", title: text.progressPhotos, label: featurePageLabels.photos, accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "metrics", title: text.weeklyMetrics, label: featurePageLabels.metrics, accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "week", title: text.weekPlan, label: featurePageLabels.week, accent: isLightMode ? "#0C0C10" : "#FFFFFF" },
    { id: "water", title: text.waterTracking, label: featurePageLabels.water, accent: "#90C8FF" },
    { id: "coach", title: text.coachTitle, label: featurePageLabels.coach, accent: "#B8A0FF" },
    { id: "meditation", title: language === "es" ? "Meditación" : "Meditation", label: featurePageLabels.meditation, accent: "#B8A0FF" },
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
  const heightInches = parseHeightInches(profile.height);
  const nutritionBMR = calcBMR({ weightLb: profile.currentWeight, heightInches, age: profile.age, sex: profileSex });
  const autoActivityLevel = deriveActivityLevel(weeklyMetrics.trainingDays, weeklyMetrics.trainingSessions);
  const isAutoActivity = !ACTIVITY_LEVELS.includes(profile.activityLevel);
  const effectiveActivityLevel = isAutoActivity ? autoActivityLevel : profile.activityLevel;
  const nutritionTDEE = calcTDEE(nutritionBMR, effectiveActivityLevel);
  const calorieTarget = goalCalorieTarget(nutritionTDEE, goals.bodyTypeGoal || "athletic");
  const macroTargets = macroSplit(calorieTarget, goals.bodyTypeGoal || "athletic");
  const todayFood = foodLog[getDateKey()] || {};
  const todayMacros = sumDayMacros(todayFood);
  const todayCardio = cardioLog[getDateKey()] || [];
  const weeklyCardio = useMemo(() => {
    const weekKey = getWorkoutWeekKey();
    const totals = { sessions: 0, minutes: 0, distance: 0, calories: 0 };
    Object.entries(cardioLog).forEach(([date, list]) => {
      if (getWorkoutWeekKey(new Date(`${date}T00:00:00`)) !== weekKey) return;
      (list || []).forEach(item => {
        totals.sessions += 1;
        totals.minutes += Number(item.durationMin) || 0;
        totals.distance += Number(item.distance) || 0;
        totals.calories += Number(item.calories) || 0;
      });
    });
    return totals;
  }, [cardioLog]);
  const measurementEntries = useMemo(
    () => Object.entries(measurementLog)
      .map(([date, values]) => ({ date, ...values }))
      .sort((a, b) => b.date.localeCompare(a.date)),
    [measurementLog]
  );
  const latestMeasurement = measurementEntries[0] || null;
  const navyBodyFatPct = latestMeasurement
    ? navyBodyFat({ sex: profileSex, heightIn: heightInches, neckIn: latestMeasurement.neck, waistIn: latestMeasurement.waist, hipIn: latestMeasurement.hips })
    : 0;
  const volumeByGroup = useMemo(() => {
    const groups = {};
    days.forEach(dayName => {
      workoutData[dayName].sessions.forEach((currentSession, sessionIndex) => {
        currentSession.exercises.forEach((exercise, exerciseIndex) => {
          const key = getExerciseKey(dayName, sessionIndex, exerciseIndex);
          const setsDone = Math.min(Number(setProgress[key] || 0), Number(exercise.sets || 0));
          const used = checked[key] ? Number(exercise.sets || 0) : setsDone;
          if (used <= 0) return;
          const volume = exerciseVolume(used, exercise.reps, exercise.weight);
          if (volume <= 0) return;
          const group = muscleGroupFor(exercise.name);
          groups[group] = (groups[group] || 0) + volume;
        });
      });
    });
    return groups;
  }, [workoutData, setProgress, checked]);
  const weeklyVolume = Object.values(volumeByGroup).reduce((sum, value) => sum + value, 0);
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
  const coachTips = getCoachTips({
    sex: profileSex,
    age: profile.age,
    bmi,
    bodyFatPct,
    bodyTypeGoal: goals.bodyTypeGoal || "athletic",
    language,
    weightLb: profile.currentWeight,
    tdee: nutritionTDEE,
    calorieTarget,
    macros: macroTargets,
  });
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
    setFoodLog(data?.foodLog || {});
    setCustomFoods(Array.isArray(data?.customFoods) ? data.customFoods : []);
    setRecentFoods(Array.isArray(data?.recentFoods) ? data.recentFoods : []);
    setCardioLog(data?.cardioLog || {});
    setMeasurementLog(data?.measurementLog || {});
    setExercisePerformance(data?.exercisePerformance || {});
    setChallenges(Array.isArray(data?.challenges) ? data.challenges : []);
    setMeditationLog(data?.meditationLog && typeof data.meditationLog === "object" ? data.meditationLog : {});
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
      foodLog: {},
      customFoods: [],
      recentFoods: [],
      cardioLog: {},
      measurementLog: {},
      exercisePerformance: {},
      challenges: [],
      meditationLog: {},
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

  const speakMedCueOnce = (cueKey, cue) => {
    if (!cue) return;
    if (medSpokenRef.current.has(cueKey)) return;
    medSpokenRef.current.add(cueKey);
    speakMeditationCue(language === "es" ? cue.es : cue.en, language, appSettings.meditationVoice, appSettings.meditationVoiceVolume);
  };

  const startMeditation = (practice, durationMin, intervalBellMin) => {
    const practiceKey = MEDITATION_PRACTICES[practice] ? practice : "pranayama";
    const def = MEDITATION_PRACTICES[practiceKey];
    const safeMin = Math.min(def.maxMin, Math.max(def.minMin, Number(durationMin) || def.defaultMin));
    const durationSec = Math.max(1, Math.round(safeMin * 60));
    const bellMin = Math.max(0, Math.min(60, Number(intervalBellMin) || 0));

    cancelMeditationSpeech();
    medSpokenRef.current = new Set();
    medLastBellSecRef.current = 0;
    setMedCompleted(null);
    setMedReflection("");

    setMedTimer({
      running: true,
      practice: practiceKey,
      durationSec,
      endsAt: Date.now() + durationSec * 1000,
      remainingMs: 0,
      intervalBellMin: bellMin,
    });
    setAppSettings(prev => ({
      ...prev,
      meditationPractice: practiceKey,
      meditationDurationMin: safeMin,
      meditationIntervalBellMin: bellMin,
    }));

    playReminderSound("bell");
    meditationVibrate([200, 80, 200]);
    // Speak the first opening cue inside the click handler so iOS Safari
    // allows subsequent speechSynthesis calls without further user gestures.
    if (appSettings.meditationVoice && def.script.opening[0]) {
      const first = def.script.opening[0];
      if (first.atSec === 0 || first.atSec === 1) {
        medSpokenRef.current.add("opening-0");
        speakMeditationCue(language === "es" ? first.es : first.en, language, true, appSettings.meditationVoiceVolume);
      } else {
        // Warm up the speech engine so later cues fire on iOS.
        speakMeditationCue(" ", language, true, 0.01);
      }
    }
  };

  const pauseMeditation = () => {
    setMedTimer(prev => {
      if (prev.running && prev.endsAt) {
        const remainingMs = Math.max(0, prev.endsAt - Date.now());
        cancelMeditationSpeech();
        return { ...prev, running: false, endsAt: 0, remainingMs };
      }
      if (!prev.running && prev.remainingMs > 0) {
        return { ...prev, running: true, endsAt: Date.now() + prev.remainingMs, remainingMs: 0 };
      }
      return prev;
    });
  };

  const stopMeditation = () => {
    cancelMeditationSpeech();
    medSpokenRef.current = new Set();
    setMedTimer(prev => ({ ...prev, running: false, endsAt: 0, remainingMs: 0 }));
  };

  const logMeditationSession = (durationMin, practice, note) => {
    const date = getDateKey();
    const entry = {
      id: `med-${Date.now()}`,
      durationMin,
      mode: practice,
      note: note || "",
      completedAt: new Date().toISOString(),
    };
    setMeditationLog(prev => {
      const list = Array.isArray(prev[date]) ? prev[date] : [];
      return { ...prev, [date]: [entry, ...list] };
    });
  };

  const saveMedReflection = () => {
    const trimmed = (medReflection || "").trim();
    if (!trimmed || !medCompleted) return;
    setMeditationLog(prev => {
      const date = getDateKey();
      const list = Array.isArray(prev[date]) ? prev[date] : [];
      if (list.length === 0) return prev;
      const [latest, ...rest] = list;
      return { ...prev, [date]: [{ ...latest, note: trimmed }, ...rest] };
    });
    setMedCompleted(null);
    setMedReflection("");
  };

  const addMeditationReminder = () => {
    const id = `med-reminder-${Date.now()}`;
    const label = language === "es" ? "Meditar" : "Meditate";
    const time = "21:00";
    const message = language === "es" ? "Hora de tu meditación diaria." : "Time for your daily meditation.";
    setNotificationSettings(prev => {
      const current = Array.isArray(prev.customReminders) ? prev.customReminders : [];
      if (current.some(r => r.message === message && r.time === time)) return prev;
      return {
        ...prev,
        customReminders: [...current, { id, label, time, message, sound: "bell", enabled: true }],
      };
    });
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

  const pushRecentFood = food => {
    setRecentFoods(prev => [food, ...prev.filter(item => item.id !== food.id)].slice(0, 20));
  };

  const addFoodEntry = (meal, food) => {
    const date = getDateKey();
    const entry = {
      entryId: `food-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      id: food.id || food.name,
      name: food.name,
      kcal: Number(food.kcal) || 0,
      protein: Number(food.protein) || 0,
      carbs: Number(food.carbs) || 0,
      fat: Number(food.fat) || 0,
      qty: Number(food.qty) || 1,
    };
    setFoodLog(prev => {
      const day = prev[date] || {};
      return { ...prev, [date]: { ...day, [meal]: [...(day[meal] || []), entry] } };
    });
    pushRecentFood({ id: entry.id, name: entry.name, kcal: entry.kcal, protein: entry.protein, carbs: entry.carbs, fat: entry.fat });
  };

  const removeFoodEntry = (date, meal, entryId) => {
    setFoodLog(prev => {
      const day = prev[date];
      if (!day) return prev;
      return { ...prev, [date]: { ...day, [meal]: (day[meal] || []).filter(item => item.entryId !== entryId) } };
    });
  };

  const addCustomFood = () => {
    const name = customFoodDraft.name.trim();
    if (!name) return;
    const food = {
      id: `custom-${Date.now()}`,
      name,
      kcal: Number(customFoodDraft.kcal) || 0,
      protein: Number(customFoodDraft.protein) || 0,
      carbs: Number(customFoodDraft.carbs) || 0,
      fat: Number(customFoodDraft.fat) || 0,
      serving: "1 serving",
      custom: true,
    };
    setCustomFoods(prev => [food, ...prev].slice(0, 60));
    if (addFoodTarget) addFoodEntry(addFoodTarget, { ...food, qty: 1 });
    setCustomFoodDraft({ name: "", kcal: "", protein: "", carbs: "", fat: "" });
  };

  const addCardioSession = () => {
    const durationMin = Number(cardioDraft.durationMin) || 0;
    if (durationMin <= 0) return;
    const date = getDateKey();
    const entry = {
      id: `cardio-${Date.now()}`,
      type: cardioDraft.type,
      durationMin,
      distance: distanceInputToMiles(cardioDraft.distance, unitSystem),
      calories: estimateCardioCalories(cardioDraft.type, durationMin, profile.currentWeight),
      note: cardioDraft.note || "",
    };
    setCardioLog(prev => ({ ...prev, [date]: [entry, ...(prev[date] || [])] }));
    setCardioDraft({ type: cardioDraft.type, durationMin: "", distance: "", note: "" });
  };

  const removeCardioSession = (date, id) => {
    setCardioLog(prev => {
      const list = (prev[date] || []).filter(item => item.id !== id);
      const next = { ...prev };
      if (list.length) next[date] = list;
      else delete next[date];
      return next;
    });
  };

  const saveMeasurements = draft => {
    const date = draft.date || getDateKey();
    const values = {};
    MEASUREMENT_FIELDS.forEach(field => {
      const inches = measureInputToInches(draft[field], unitSystem);
      if (inches > 0) values[field] = Math.round(inches * 10) / 10;
    });
    setMeasurementLog(prev => ({ ...prev, [date]: values }));
    setEditingMeasurements(null);
  };

  const addChallenge = () => {
    const title = challengeDraft.title.trim();
    const target = Number(challengeDraft.target) || 0;
    if (!title || target <= 0) return;
    const end = new Date();
    end.setDate(end.getDate() + (Number(challengeDraft.days) || 30));
    setChallenges(prev => [{
      id: `challenge-${Date.now()}`,
      title,
      metric: challengeDraft.metric,
      target,
      startDate: getDateKey(),
      endDate: end.toISOString().slice(0, 10),
    }, ...prev]);
    setChallengeDraft({ title: "", metric: "workouts", target: "12", days: "30" });
  };

  const removeChallenge = id => {
    setChallenges(prev => prev.filter(item => item.id !== id));
  };

  // Computes local challenge progress from the training, hydration and
  // cardio logs within the challenge window.
  const computeChallengeProgress = challenge => {
    const inRange = date => date >= challenge.startDate && date <= challenge.endDate;
    if (challenge.metric === "water") {
      return Object.entries(waterLog).filter(([date, entry]) =>
        inRange(date) && Number(entry.glasses || 0) >= Number(entry.goal || 8)).length;
    }
    if (challenge.metric === "cardio") {
      return Object.entries(cardioLog).reduce((sum, [date, list]) =>
        inRange(date) ? sum + (list?.length || 0) : sum, 0);
    }
    return Object.entries(calendarLog).filter(([date, entry]) =>
      inRange(date) && (entry.status === "completed" || entry.status === "trained")).length;
  };

  const flashToast = message => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const shareWorkoutSummary = async () => {
    const summary = language === "es"
      ? `Atlas Luthor — Puntaje ${atlasScore}/100\nProgreso semanal: ${weeklyMetrics.weeklyProgress}%\nSesiones: ${weeklyMetrics.completedSessions} · Racha: ${weeklyStreak} sem · PRs: ${prEntries.length}`
      : `Atlas Luthor — Score ${atlasScore}/100\nWeekly progress: ${weeklyMetrics.weeklyProgress}%\nSessions: ${weeklyMetrics.completedSessions} · Streak: ${weeklyStreak} wk · PRs: ${prEntries.length}`;
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title: "Atlas Luthor", text: summary });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(summary);
      flashToast(text.shareCopied);
    } catch {
      // Clipboard can be unavailable in some contexts; fail quietly.
    }
  };

  const shareProgressCard = async () => {
    const blob = await renderShareCard({
      subtitle: language === "es" ? "Progreso Semanal" : "Weekly Progress",
      score: atlasScore,
      stats: [
        { label: language === "es" ? "Semana" : "Week", value: `${weeklyMetrics.weeklyProgress}%` },
        { label: language === "es" ? "Racha" : "Streak", value: weeklyStreak },
        { label: "PRs", value: prEntries.length },
      ],
      message: goals.focusGoal,
    });
    if (!blob) return;
    const file = new File([blob], "atlas-progress.png", { type: "image/png" });
    try {
      if (typeof navigator !== "undefined" && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Atlas Luthor" });
        return;
      }
    } catch {
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "atlas-progress.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
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
        waterLog,
        foodLog,
        customFoods,
        recentFoods,
        cardioLog,
        measurementLog,
        exercisePerformance,
        challenges,
        meditationLog,
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
        if (data.waterLog) setWaterLog(data.waterLog);
        if (data.foodLog) setFoodLog(data.foodLog);
        if (Array.isArray(data.customFoods)) setCustomFoods(data.customFoods);
        if (Array.isArray(data.recentFoods)) setRecentFoods(data.recentFoods);
        if (data.cardioLog) setCardioLog(data.cardioLog);
        if (data.measurementLog) setMeasurementLog(data.measurementLog);
        if (data.exercisePerformance) setExercisePerformance(data.exercisePerformance);
        if (Array.isArray(data.challenges)) setChallenges(data.challenges);
        if (data.meditationLog && typeof data.meditationLog === "object") setMeditationLog(data.meditationLog);
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
        waterLog,
        foodLog,
        customFoods,
        recentFoods,
        cardioLog,
        measurementLog,
        exercisePerformance,
        challenges,
        meditationLog,
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
      if (data.waterLog) setWaterLog(data.waterLog);
      if (data.foodLog) setFoodLog(data.foodLog);
      if (Array.isArray(data.customFoods)) setCustomFoods(data.customFoods);
      if (Array.isArray(data.recentFoods)) setRecentFoods(data.recentFoods);
      if (data.cardioLog) setCardioLog(data.cardioLog);
      if (data.measurementLog) setMeasurementLog(data.measurementLog);
      if (data.exercisePerformance) setExercisePerformance(data.exercisePerformance);
      if (Array.isArray(data.challenges)) setChallenges(data.challenges);
      if (data.meditationLog && typeof data.meditationLog === "object") setMeditationLog(data.meditationLog);
      setCloudSettings(prev => ({ ...prev, status: "Downloaded" }));
    } catch {
      setCloudSettings(prev => ({ ...prev, status: "Download failed" }));
    }
  };

  const saveProgressPhoto = () => {
    if (!photoDraft.dataUrl) return;

    const typedWeight = String(photoDraft.weight).trim();
    const weightLb = typedWeight === ""
      ? Number(profile.currentWeight) || 0
      : (unitSystem === "metric" ? kgToLb(Number(typedWeight)) : Number(typedWeight));

    setProgressPhotos(prev => [
      {
        id: `photo-${Date.now()}`,
        date: photoDraft.date || getDateKey(),
        weight: Math.round((Number(weightLb) || 0) * 10) / 10,
        note: photoDraft.note,
        album: photoDraft.album || "",
        dataUrl: photoDraft.dataUrl,
      },
      ...prev,
    ].slice(0, 24));
    setPhotoDraft({ date: getDateKey(), note: "", dataUrl: "", album: photoDraft.album || "", weight: "" });
    setShowPhotoModal(false);
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
    setShowAlbumModal(false);
    setAlbumFilter(name);
    setPhotoDraft(prev => ({ ...prev, album: name }));
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

  const handleBackgroundPhoto = async event => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      // Compress to ~1400 px for a phone-sized background that still looks
      // sharp without inflating localStorage.
      const dataUrl = await compressImage(file, 1400, 0.78);
      setAppSettings(prev => ({
        ...prev,
        background: { ...(prev.background || {}), type: "photo", photo: dataUrl },
      }));
    } catch {
      window.alert(language === "es" ? "No pudimos procesar esa imagen." : "That image could not be processed.");
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

  // Custom background (color / gradient / photo) set in Settings. Falls back
  // to the theme default when type is "default" or unset.
  const defaultBgColor = isLightMode ? "#E8EDF5" : "#0C0C10";
  const bgConfig = appSettings.background || { type: "default" };
  const customBgStyle = (() => {
    if (bgConfig.type === "color" && bgConfig.color) {
      return { background: bgConfig.color };
    }
    if (bgConfig.type === "gradient" && bgConfig.gradientFrom && bgConfig.gradientTo) {
      const angle = Number.isFinite(Number(bgConfig.gradientAngle)) ? Number(bgConfig.gradientAngle) : 180;
      return { background: `linear-gradient(${angle}deg, ${bgConfig.gradientFrom}, ${bgConfig.gradientTo})` };
    }
    if (bgConfig.type === "photo" && bgConfig.photo) {
      return {
        // Stack a 35% black overlay on top of the photo so text stays
        // readable regardless of how bright the chosen image is.
        backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${bgConfig.photo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: defaultBgColor,
      };
    }
    return { background: defaultBgColor };
  })();

  return (
    <div className={`app-root ${isLightMode ? "light-mode" : "dark-mode"}`} style={{ minHeight: "100dvh", color: isLightMode ? "#101015" : "#FFFFFF", fontFamily: "'Orbitron', monospace", paddingBottom: 80, position: "relative", overflowX: "hidden", isolation: "isolate", ...customBgStyle }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; touch-action: manipulation; }
        button, .day-pill, .ex-card, .session-tab, label { -webkit-tap-highlight-color: transparent; }
        input, select, textarea { font-size: 16px; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 2px; }

        .ambient-bg { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; background: #0C0C10; }
        .ambient-bg.custom-bg::before, .ambient-bg.custom-bg::after { display: none !important; }
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

        /* Meditation breathing animations. Each keyframe matches the
           phase ratios of its practice. Vipassana shows no breath
           animation (just the timer), so it has no class here. */
        @keyframes medBreathPranayama {
          0% { transform: scale(0.85); opacity: 0.85; }
          33% { transform: scale(1.05); opacity: 1; }   /* 4s inhale of 12s */
          50% { transform: scale(1.05); opacity: 1; }   /* 2s hold */
          100% { transform: scale(0.85); opacity: 0.85; } /* 6s exhale */
        }
        @keyframes medBreathZazen {
          0%, 100% { transform: scale(0.85); opacity: 0.85; }
          40% { transform: scale(1.05); opacity: 1; }   /* 4s in, 6s out of 10s */
        }
        @keyframes medBreathTummo {
          0% { transform: scale(0.85); opacity: 0.85; }
          20% { transform: scale(1.1); opacity: 1; }    /* 4s strong inhale */
          80% { transform: scale(1.1); opacity: 1; }    /* 12s hold (heat) */
          100% { transform: scale(0.85); opacity: 0.85; } /* 4s slow exhale */
        }
        .med-breath { transform-origin: center; }
        .med-breath-pranayama { animation: medBreathPranayama 12s ease-in-out infinite; }
        .med-breath-zazen { animation: medBreathZazen 10s ease-in-out infinite; }
        .med-breath-tummo { animation: medBreathTummo 20s ease-in-out infinite; }

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
        .stat-box { flex: 1; background: linear-gradient(165deg, rgba(33,33,41,0.86) 0%, rgba(15,15,20,0.86) 100%); border: 1.5px solid rgba(255,255,255,0.09); border-radius: 12px; padding: 14px 8px; text-align: center; backdrop-filter: blur(16px); box-shadow: inset 0 1px 0 rgba(255,255,255,0.05); }
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
        .detail-card { border: 1px solid #26262F; background: linear-gradient(165deg, #18181F 0%, #101015 100%); border-radius: 12px; padding: 12px; min-width: 0; box-shadow: inset 0 1px 0 rgba(255,255,255,0.04); }
        .detail-label { color: #8C92A0; font-family: 'Orbitron', monospace; font-size: 9px; letter-spacing: 2px; margin-bottom: 5px; }
        .detail-value { color: #FFFFFF; font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: 900; overflow-wrap: anywhere; }
        .detail-list { display: grid; gap: 10px; }
        .detail-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid #24242E; background: #101015; border-radius: 12px; padding: 12px; font-family: 'DM Sans', sans-serif; min-width: 0; }
        .detail-row-main { color: #FFFFFF; font-size: 14px; font-weight: 900; min-width: 0; overflow-wrap: anywhere; }
        .detail-row-sub { color: #9CA1AC; font-size: 12px; line-height: 1.35; margin-top: 3px; min-width: 0; overflow-wrap: anywhere; }

        /* ── LIGHT MODE ─────────────────────────────────── */
        /* Page background — cool-white with a subtle blue-grey tint */
        .light-mode .ambient-bg { background: #E8EDF5; }
        .light-mode .ambient-bg::before {
          background:
            radial-gradient(ellipse 90% 55% at 50% 0%, rgba(144,200,255,0.18) 0%, transparent 65%),
            radial-gradient(ellipse 55% 40% at 85% 90%, rgba(184,160,255,0.1) 0%, transparent 55%),
            linear-gradient(180deg, #ECF0F8 0%, #E4E9F3 100%);
          opacity: 1;
        }
        .light-mode .ambient-bg::after { background: none; }

        /* ── Cards & surfaces ────────────────────────────── */
        .light-mode .app-header {
          background: rgba(236,240,248,0.96) !important;
          border-bottom-color: rgba(0,0,0,0.08) !important;
          box-shadow: 0 1px 0 rgba(0,0,0,0.06) !important;
          backdrop-filter: blur(20px);
        }
        .light-mode .home-card {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.07) !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04) !important;
        }
        .light-mode .stat-box {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.07) !important;
          box-shadow: 0 2px 12px rgba(0,0,0,0.07) !important;
        }
        .light-mode .feature-hero {
          background: #FFFFFF !important;
          border-width: 2px !important;
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
        }
        .light-mode .detail-card {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.07) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06) !important;
        }
        .light-mode .detail-row {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.07) !important;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05) !important;
        }
        .light-mode .setting-row {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.07) !important;
          box-shadow: 0 1px 6px rgba(0,0,0,0.05) !important;
        }
        .light-mode .photo-card, .light-mode .photo-tile {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.08) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.07) !important;
        }
        .light-mode .modal {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.1) !important;
          box-shadow: 0 20px 60px rgba(0,0,0,0.2) !important;
        }

        /* ── Exercise & session tabs ─────────────────────── */
        .light-mode .ex-card {
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.08) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06) !important;
        }
        .light-mode .ex-card:hover { border-color: rgba(0,0,0,0.14) !important; background: #FAFBFF !important; }
        .light-mode .ex-card.done { opacity: 0.42; }
        .light-mode .session-tab {
          background: rgba(0,0,0,0.04) !important;
          border-color: rgba(0,0,0,0.09) !important;
          color: #8A8F99 !important;
        }
        .light-mode .check { border-color: rgba(0,0,0,0.22) !important; background: transparent !important; }

        /* ── Buttons ─────────────────────────────────────── */
        .light-mode .primary-btn {
          background: linear-gradient(135deg, #1A1D26 0%, #2C3044 100%) !important;
          color: #FFFFFF !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.22) !important;
        }
        .light-mode .dark-btn {
          background: rgba(0,0,0,0.05) !important;
          border-color: rgba(0,0,0,0.12) !important;
          color: #1E2030 !important;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .light-mode .edit-btn {
          background: rgba(0,0,0,0.04) !important;
          border-color: rgba(0,0,0,0.11) !important;
          color: #5A6270 !important;
        }
        .light-mode .input {
          background: rgba(0,0,0,0.03) !important;
          border-color: rgba(0,0,0,0.14) !important;
          color: #101015 !important;
        }
        .light-mode .menu-button {
          background: rgba(0,0,0,0.05) !important;
          border-color: rgba(0,0,0,0.12) !important;
        }
        .light-mode .menu-button span { background: #1E2030; }

        /* ── Album chips ─────────────────────────────────── */
        .light-mode .album-chip {
          background: rgba(255,255,255,0.9);
          border-color: rgba(0,0,0,0.12);
          color: #1E2030;
        }
        .light-mode .album-chip.active { background: #1E2030; color: #FFFFFF; border-color: #1E2030; }

        /* ── Text hierarchy ──────────────────────────────── */
        .light-mode p,
        .light-mode h1,
        .light-mode h2,
        .light-mode h3,
        .light-mode span,
        .light-mode .detail-value,
        .light-mode .detail-row-main,
        .light-mode .setting-title { color: #1E2030 !important; }
        .light-mode .detail-label,
        .light-mode .detail-row-sub,
        .light-mode .setting-sub,
        .light-mode .photo-sub,
        .light-mode .feature-copy { color: #5A6270 !important; }
        .light-mode .feature-title { color: #1E2030 !important; }
        .light-mode .photo-note { color: #1E2030 !important; }
        .light-mode .field-label,
        .light-mode .menu-section-label,
        .light-mode .industry-mark,
        .light-mode .detail-label { color: #7A8090 !important; }

        /* ── Dark background overrides ───────────────────── */
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
          background: #FFFFFF !important;
          border-color: rgba(0,0,0,0.07) !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
        }
        .light-mode img + p,
        .light-mode button span,
        .light-mode [style*="#101015"] p,
        .light-mode [style*="#101015"] span,
        .light-mode [style*="rgb(16, 16, 21)"] p,
        .light-mode [style*="rgb(16, 16, 21)"] span { color: #1E2030 !important; }

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

      <div
        className={`ambient-bg${bgConfig.type && bgConfig.type !== "default" ? " custom-bg" : ""}`}
        aria-hidden="true"
        style={bgConfig.type && bgConfig.type !== "default" ? customBgStyle : undefined}
      />

      {prToast && (
        <div style={{ position: "fixed", left: "50%", transform: "translateX(-50%)", top: "calc(14px + env(safe-area-inset-top))", zIndex: 60, background: "#FFD060", color: "#1A1400", padding: "11px 18px", borderRadius: 999, fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, letterSpacing: 1, boxShadow: "0 10px 34px rgba(0,0,0,0.45)", maxWidth: "90vw", textAlign: "center" }}>
          ⭐ {text.newPR} · {prToast}
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", left: "50%", transform: "translateX(-50%)", top: "calc(14px + env(safe-area-inset-top))", zIndex: 60, background: "#90C8FF", color: "#06182B", padding: "11px 18px", borderRadius: 999, fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, letterSpacing: 1, boxShadow: "0 10px 34px rgba(0,0,0,0.45)", maxWidth: "90vw", textAlign: "center" }}>
          {toast}
        </div>
      )}

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
                    <p style={{ fontSize: 13, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, marginTop: 3 }}>{item.copy}</p>
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
                        <span style={{ display: "block", fontSize: 12, color: isLightMode ? "#7A8090" : "#888", marginTop: 3, fontWeight: 500 }}>
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
            <div style={{ marginBottom: 14, padding: "20px 20px 18px", background: isLightMode ? "#FFFFFF" : "rgba(19,19,24,0.86)", border: isLightMode ? `1.5px solid ${themeFor(weeklyMetrics.todayType).accent}` : `1.5px solid rgba(255,255,255,0.08)`, borderRadius: 18, backdropFilter: "blur(18px)", boxShadow: isLightMode ? `0 4px 20px rgba(0,0,0,0.08), inset 0 0 0 1px ${themeFor(weeklyMetrics.todayType).accent}22` : "none" }}>
              <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                <button
                  type="button"
                  aria-label="Open settings"
                  onClick={() => { setShowMenu(false); setShowSettings(true); }}
                  style={{ width: 80, height: 80, borderRadius: 999, overflow: "hidden", padding: 0, border: `3px solid ${themeFor(weeklyMetrics.todayType).accent}`, background: isLightMode ? "#E9EAEE" : "#0C0C14", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: `0 0 0 1px rgba(0,0,0,0.3)` }}
                >
                  {userAvatar
                    ? <img src={userAvatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 28, color: isLightMode ? "#7A8090" : "#888" }}>{userName.slice(0, 1).toUpperCase()}</span>}
                </button>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 9, letterSpacing: 4, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", marginBottom: 6, textTransform: "uppercase" }}>
                    {greeting}
                  </p>
                  <h2 style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: isLightMode ? "#101015" : "#FFFFFF", lineHeight: 1, letterSpacing: 1, margin: 0 }}>
                    {userName}
                  </h2>
                </div>
              </div>
              <div style={{ height: 1, background: isLightMode ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.06)", margin: "16px 0 12px" }} />
              <p style={{ color: isLightMode ? "#5A6270" : "#9CA1AC", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                {homeMessage}
              </p>
            </div>

            <div className="home-card" style={{ marginBottom: 14, borderColor: isLightMode ? `${themeFor(weeklyMetrics.todayType).accent}60` : "#2A2A34", borderTopWidth: isLightMode ? 3 : 1.5, borderTopColor: isLightMode ? themeFor(weeklyMetrics.todayType).accent : undefined }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", marginBottom: 8 }}>
                {text.today} - {displayDayShort(weeklyMetrics.today, weeklyMetrics.todayLabel)} / {weeklyMetrics.todayType}
              </p>

              <h2 style={{ fontSize: 25, fontFamily: "'Orbitron', monospace", letterSpacing: 2, marginBottom: 8 }}>
                {todayDisplayName}
              </h2>

              <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 16 }}>
                {text.weeklyProgressIs} <span style={{ color: isLightMode ? "#101015" : "#FFFFFF", fontWeight: 800 }}>{weeklyMetrics.weeklyProgress}%</span>. {text.keepMoving}
              </p>

              <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
                {text.startToday}
              </button>
            </div>

            {typeof daysToGoal === "number" && daysToGoal > 0 && (() => {
              const cdColor = daysToGoal <= 7 ? "#FFD060" : daysToGoal <= 30 ? "#90C8FF" : isLightMode ? "#101015" : "#FFFFFF";
              const cdBorderColor = daysToGoal <= 7 ? "rgba(255,208,96,0.3)" : daysToGoal <= 30 ? "rgba(144,200,255,0.2)" : "rgba(255,255,255,0.075)";
              const pct = goalProgressPct ?? 0;
              return (
                <div className="home-card" style={{ marginBottom: 14, borderColor: cdBorderColor }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                    <p style={{ fontSize: 10, letterSpacing: 3, color: daysToGoal <= 7 ? "#FFD060" : daysToGoal <= 30 ? "#90C8FF" : "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                      {text.countdownTitle.toUpperCase()}
                    </p>
                    <p style={{ fontSize: 10, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", letterSpacing: 1 }}>{goals.targetDate}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 14 }}>
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ fontSize: daysToGoal >= 100 ? 52 : 64, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: cdColor, lineHeight: 1, animation: daysToGoal <= 7 ? "countdownPulse 2s ease-in-out infinite" : "none" }}>
                        {daysToGoal}
                      </p>
                      <p style={{ fontSize: 9, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", marginTop: 4 }}>
                        {text.daysLeft}
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                      <p style={{ color: isLightMode ? "#101015" : "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 700, lineHeight: 1.4, marginBottom: 4 }}>
                        {goals.focusGoal}
                      </p>
                      {daysToGoal <= 7 && <p style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 9, letterSpacing: 2, fontWeight: 900 }}>{text.finalStretch.toUpperCase()}</p>}
                      {daysToGoal > 7 && daysToGoal <= 30 && <p style={{ color: "#90C8FF", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>{text.almostThere}</p>}
                    </div>
                  </div>
                  <div style={{ width: "100%", height: 8, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: cdColor, borderRadius: 6, transition: "width 1s ease", boxShadow: `0 0 10px ${cdColor}77` }} />
                  </div>
                  <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 11, marginTop: 5 }}>
                    {pct}% {language === "es" ? "completado" : "complete"}
                  </p>
                </div>
              );
            })()}

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    {text.waterToday.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: waterPct >= 100 ? "#3FB98A" : "#90C8FF", lineHeight: 1 }}>
                    {waterGlasses}<span style={{ fontSize: 14, color: isLightMode ? "#7A8090" : "#666", fontWeight: 400 }}>/{waterGoalNum}</span>
                  </p>
                </div>
                <button className="edit-btn" onClick={() => openFeaturePage("water")} style={{ color: "#90C8FF" }}>
                  {language === "es" ? "Ver" : "View"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 4, marginBottom: 10 }}>
                {Array.from({ length: waterGoalNum }).map((_, gi) => {
                  const filled = gi < waterGlasses;
                  const wAccent = waterPct >= 100 ? "#3FB98A" : "#90C8FF";
                  return (
                    <div
                      key={gi}
                      onClick={() => filled ? removeWater() : addWater()}
                      style={{ flex: 1, height: 24, borderRadius: 4, background: filled ? wAccent : (isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"), cursor: "pointer", transition: "background 0.2s ease" }}
                    />
                  );
                })}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <button className="dark-btn" onClick={() => removeWater()} style={{ color: isLightMode ? "#7A8090" : "#8A8F99" }}>
                  − {text.glassWord}
                </button>
                <button className="dark-btn" onClick={() => addWater()} style={{ color: waterPct >= 100 ? "#3FB98A" : "#90C8FF" }}>
                  + {text.glassWord}
                </button>
              </div>
            </div>

            {(() => {
              const selectedPractice = MEDITATION_PRACTICES[medTimer.practice] || MEDITATION_PRACTICES.pranayama;
              const medAccent = meditationStats.todayMinutes >= meditationGoalMin ? "#3FB98A" : selectedPractice.accent;
              const medPct = Math.min(100, Math.round((meditationStats.todayMinutes / meditationGoalMin) * 100));
              const quickPresets = [
                Math.max(selectedPractice.minMin, 5),
                selectedPractice.defaultMin,
                Math.min(selectedPractice.maxMin, 20),
              ].filter((v, i, a) => a.indexOf(v) === i).slice(0, 3);
              return (
                <div className="home-card" style={{ marginBottom: 14, borderColor: medTimer.running ? `${medAccent}55` : undefined }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div>
                      <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                        {language === "es" ? "MEDITACIÓN HOY" : "MEDITATION TODAY"}
                      </p>
                      <p style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: medAccent, lineHeight: 1 }}>
                        {meditationStats.todayMinutes}<span style={{ fontSize: 14, color: isLightMode ? "#7A8090" : "#666", fontWeight: 400 }}>/{meditationGoalMin} min</span>
                      </p>
                      <p style={{ fontSize: 11, color: selectedPractice.accent, fontFamily: "'DM Sans', sans-serif", fontWeight: 700, marginTop: 4 }}>
                        {language === "es" ? selectedPractice.es : selectedPractice.en} · {language === "es" ? selectedPractice.esSub : selectedPractice.enSub}
                      </p>
                      {meditationStats.streak > 0 && (
                        <p style={{ fontSize: 10, color: "#FFD060", fontFamily: "'Orbitron', monospace", marginTop: 4, letterSpacing: 1 }}>
                          {meditationStats.streak} {language === "es" ? "DÍAS SEGUIDOS" : "DAY STREAK"}
                        </p>
                      )}
                    </div>
                    <button className="edit-btn" onClick={() => openFeaturePage("meditation")} style={{ color: medAccent }}>
                      {language === "es" ? "Ver" : "View"}
                    </button>
                  </div>
                  <div style={{ height: 8, borderRadius: 5, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 12 }}>
                    <div style={{ width: `${medPct}%`, height: "100%", background: medAccent, borderRadius: 5, transition: "width 0.4s ease" }} />
                  </div>
                  {medTimer.running ? (
                    (() => {
                      const remaining = medTimer.endsAt > 0 ? Math.max(0, Math.ceil((medTimer.endsAt - Date.now()) / 1000)) : 0;
                      const rm = Math.floor(remaining / 60);
                      const rs = remaining % 60;
                      const _ = medTick; void _;
                      return (
                        <button className="primary-btn" style={{ width: "100%" }} onClick={() => openFeaturePage("meditation")}>
                          {selectedPractice && (language === "es" ? selectedPractice.es : selectedPractice.en)} · {rm}:{String(rs).padStart(2, "0")} {language === "es" ? "restantes" : "remaining"}
                        </button>
                      );
                    })()
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${quickPresets.length}, 1fr)`, gap: 8 }}>
                      {quickPresets.map(min => (
                        <button
                          key={min}
                          className="dark-btn"
                          onClick={() => { startMeditation(medTimer.practice, min, medTimer.intervalBellMin); openFeaturePage("meditation"); }}
                          style={{ color: medAccent, borderColor: `${medAccent}33` }}
                        >
                          + {min} min
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    {text.nutritionToday.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: "#3FB98A", lineHeight: 1 }}>
                    {todayMacros.kcal}<span style={{ fontSize: 14, color: isLightMode ? "#7A8090" : "#666", fontWeight: 400 }}>/{calorieTarget}</span>
                  </p>
                </div>
                <button className="edit-btn" onClick={() => openFeaturePage("nutrition")} style={{ color: "#3FB98A" }}>
                  {language === "es" ? "Ver" : "View"}
                </button>
              </div>
              <div style={{ height: 8, borderRadius: 5, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 10 }}>
                <div style={{ width: `${calorieTarget > 0 ? Math.min(100, Math.round((todayMacros.kcal / calorieTarget) * 100)) : 0}%`, height: "100%", background: todayMacros.kcal > calorieTarget && calorieTarget > 0 ? "#E5604D" : "#3FB98A", borderRadius: 5, transition: "width 0.4s ease" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { label: text.protein, val: todayMacros.protein, target: macroTargets.protein, color: "#90C8FF" },
                  { label: text.carbs, val: todayMacros.carbs, target: macroTargets.carbs, color: "#FFD060" },
                  { label: text.fat, val: todayMacros.fat, target: macroTargets.fat, color: "#FF9860" },
                ].map(macro => (
                  <div key={macro.label} style={{ textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: macro.color }}>
                      {macro.val}<span style={{ fontSize: 10, color: "#8A8F99" }}>/{macro.target}</span>
                    </p>
                    <p style={{ fontSize: 9, letterSpacing: 1, color: "#8A8F99", fontFamily: "'Orbitron', monospace", marginTop: 3 }}>{macro.label.toUpperCase()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    {text.bodyStatus.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 28, color: "#FFFFFF", fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
                    {fmtW(profile.currentWeight)}
                  </p>
                </div>

                <button className="edit-btn" onClick={() => setEditingProfile({ ...profile })}>
                  {text.edit}
                </button>
              </div>

              <div className="metric-grid">
                {[
                  { label: text.start, val: fmtW(profile.startWeight) },
                  { label: text.target, val: fmtW(profile.targetWeight) },
                  { label: text.change, val: fmtWDelta(weightChange) },
                  { label: text.toGoal, val: fmtWDelta(weightToGoal) },
                ].map(metric => (
                  <div key={metric.label} className="stat-box">
                    <p style={{ fontSize: 17, fontWeight: 700, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                      {metric.val}
                    </p>
                    <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.atlasScore.toUpperCase()}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 92, height: 92, borderRadius: "50%", border: `8px solid ${isLightMode ? themeFor(weeklyMetrics.todayType).accent : "#FFFFFF"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: isLightMode ? `0 0 20px ${themeFor(weeklyMetrics.todayType).accent}44` : "0 0 24px rgba(255,255,255,0.12)" }}>
                  <span style={{ fontSize: 25, fontWeight: 900, fontFamily: "'Orbitron', monospace" }}>{atlasScore}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, fontWeight: 800 }}>
                    {deloadWarning ? text.deloadActive : text.protocolStable}
                  </p>
                  <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 5 }}>
                    {text.avgRpe} {averageRpe || "N/A"} · PRs {prEntries.length} · {text.streak} {weeklyStreak}
                  </p>
                </div>
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.monthCalendar.toUpperCase()}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6, marginBottom: 10 }}>
                {weekHeaderLabels.map((label, index) => (
                  <p key={`${label}-${index}`} style={{ color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
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
                    <span key={status} style={{ display: "flex", alignItems: "center", gap: 5, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>
                      <span style={{ width: 11, height: 11, borderRadius: 3, background: visual.bg, display: "inline-block" }} />
                      {calendarLabels[status]}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.prTracker.toUpperCase()}
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {(prEntries.length ? prEntries.slice(0, 5) : [{ key: "empty", exerciseName: text.noPrsYet, sessionName: text.markPrHint, weight: "", date: "" }]).map(entry => (
                  <div key={entry.key} style={{ display: "flex", justifyContent: "space-between", gap: 10, background: "#101015", border: "1px solid #24242E", borderRadius: 10, padding: 10, fontFamily: "'DM Sans', sans-serif" }}>
                    <span style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 800 }}>{entry.exerciseName}</span>
                    <span style={{ color: isLightMode ? "#7A8090" : "#888", fontSize: 12, fontWeight: 700 }}>{fmtExW(entry.weight)} {entry.date}</span>
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
                  <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
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

              <div style={{ display: "grid", gap: 14 }}>
                {[
                  { label: text.weeklyProtocol, current: `${weeklyMetrics.weeklyProgress}%`, target: `${goals.weeklyProgressGoal}%`, pct: weeklyGoalPct, color: "#90C8FF" },
                  { label: text.completedSessions, current: weeklyMetrics.completedSessions, target: goals.weeklySessionsGoal, pct: sessionsGoalPct, color: "#3FB98A" },
                ].map(goal => (
                  <div key={goal.label}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700, marginBottom: 7 }}>
                      <span style={{ color: isLightMode ? "#5A6270" : "#9CA1AC" }}>{goal.label}</span>
                      <span style={{ color: goal.color }}>{goal.current} / {goal.target}</span>
                    </div>
                    <div style={{ height: 9, background: isLightMode ? "#E2E4E9" : "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden" }}>
                      <div style={{ width: `${goal.pct}%`, height: "100%", background: goal.color, borderRadius: 6, transition: "width 0.4s ease", boxShadow: `0 0 10px ${goal.color}77` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                    {text.progressMemory.toUpperCase()}
                  </p>
                  <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                    {latestProgress
                      ? `${text.lastSaved} ${latestProgress.date}: ${fmtW(latestProgress.weight)}, ${latestProgress.weeklyProgress}%`
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
                    <span style={{ color: isLightMode ? "#7A8090" : "#888", fontSize: 12, fontWeight: 700 }}>
                      {entry.date} {entry.type === "manual" ? text.savedTag : text.autoTag}
                    </span>
                    <span style={{ color: "#FFFFFF", fontSize: 12, fontWeight: 800 }}>
                      {fmtW(entry.weight)} · {entry.completedExercises} {text.exercisesWord}
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
                        <div title={fmtW(entry.weight)} style={{ height, maxWidth: 46, margin: "0 auto", borderRadius: "8px 8px 3px 3px", background: "linear-gradient(180deg, #90C8FF, #5C93C8)", boxShadow: "0 0 18px rgba(144,200,255,0.3)" }} />
                        <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 9, marginTop: 5, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {fmtW(entry.weight)}
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
              <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                {text.streakBadges.toUpperCase()}
              </p>
              <div className="metric-grid" style={{ marginBottom: 12 }}>
                <div className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 900, color: "#FFD060", fontFamily: "'Orbitron', monospace" }}>
                    {weeklyStreak}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {text.weekStreak}
                  </p>
                </div>
                <div className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 900, color: "#3FB98A", fontFamily: "'Orbitron', monospace" }}>
                    {weeklyMetrics.completedDays}/7
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {text.daysClear}
                  </p>
                </div>
                <div className="stat-box">
                  <p style={{ fontSize: 16, fontWeight: 900, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>
                    {currentWeekKey.slice(5)}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {text.weekOf}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {(earnedBadges.length ? earnedBadges : [text.protocolStarted]).map(badge => (
                  <span key={badge} style={{ color: "#FFD060", background: "rgba(255,208,96,0.08)", border: "1px solid rgba(255,208,96,0.32)", borderRadius: 999, padding: "7px 11px", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 800 }}>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            <div className="home-card" style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                  {text.progressPhotos.toUpperCase()}
                </p>
                <button className="edit-btn" onClick={() => openFeaturePage("photos")} style={{ color: "#90C8FF" }}>
                  {language === "es" ? "Ver todo" : "View all"}
                </button>
              </div>

              {latestPhoto ? (
                <div
                  onClick={() => setViewingPhoto(latestPhoto)}
                  style={{ position: "relative", borderRadius: 14, overflow: "hidden", cursor: "pointer", border: "1px solid #24242E" }}
                >
                  <img src={latestPhoto.dataUrl} alt={latestPhoto.note || "Latest progress"} style={{ width: "100%", height: 250, objectFit: "cover", display: "block" }} />
                  <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(8,8,12,0.72)", color: "#FFFFFF", borderRadius: 999, padding: "5px 11px", fontFamily: "'Orbitron', monospace", fontSize: 10, fontWeight: 900, letterSpacing: 1, backdropFilter: "blur(6px)" }}>
                    {totalPhotoCount} {text.photoCount}
                  </span>
                  <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "36px 14px 13px", background: "linear-gradient(transparent, rgba(6,6,10,0.92))" }}>
                    <p style={{ fontSize: 9, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.latest.toUpperCase()}</p>
                    <p style={{ fontSize: 17, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>
                      {latestPhoto.date} · {fmtW(latestPhoto.weight)}
                    </p>
                    {latestPhoto.note && (
                      <p style={{ fontSize: 12, color: "#C8D0DC", fontFamily: "'DM Sans', sans-serif", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{latestPhoto.note}</p>
                    )}
                  </div>
                </div>
              ) : (
                <label style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, minHeight: 190, borderRadius: 14, border: `1.5px dashed ${isLightMode ? "rgba(0,0,0,0.18)" : "#3A3A46"}`, cursor: "pointer", textAlign: "center", padding: 20 }}>
                  <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke={isLightMode ? "#9AA0AC" : "#5A5F6A"} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L19 6h2a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z" />
                    <circle cx="13" cy="13" r="4" />
                  </svg>
                  <p style={{ color: isLightMode ? "#5A6270" : "#9CA1AC", fontFamily: "'DM Sans', sans-serif", fontWeight: 800, fontSize: 14 }}>{text.addFirstPhoto}</p>
                  <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
                </label>
              )}

              {progressPhotos.length > 1 && (
                <div className="photo-strip">
                  {progressPhotos.slice(0, 10).map(photo => (
                    <div key={photo.id} onClick={() => setViewingPhoto(photo)} style={{ flex: "0 0 76px", cursor: "pointer", scrollSnapAlign: "start" }}>
                      <img src={photo.dataUrl} alt={photo.note || "Progress"} style={{ width: 76, height: 76, objectFit: "cover", borderRadius: 10, border: "1px solid #24242E", display: "block" }} />
                      <p style={{ fontSize: 9, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", marginTop: 4, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{photo.date?.slice(5) || ""}</p>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input className="input" type="date" value={photoDraft.date} onChange={event => setPhotoDraft(prev => ({ ...prev, date: event.target.value }))} />
                  <label className="dark-btn" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {photoDraft.dataUrl ? (language === "es" ? "Cambiar foto" : "Change photo") : text.choosePhoto}
                    <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
                  </label>
                </div>
                <input className="input" value={photoDraft.note} onChange={event => setPhotoDraft(prev => ({ ...prev, note: event.target.value }))} placeholder={text.photoNote} />
                {photoDraft.dataUrl && (
                  <>
                    <img src={photoDraft.dataUrl} alt="Progress preview" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 12, border: "1px solid #24242E", display: "block" }} />
                    <button className="primary-btn" onClick={saveProgressPhoto}>{text.savePhoto}</button>
                  </>
                )}
              </div>
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
                { label: text.mWeekly, val: `${weeklyMetrics.weeklyProgress}%`, color: "#90C8FF" },
                { label: text.mDone, val: weeklyMetrics.completedExercises, color: "#3FB98A" },
                { label: text.mExercises, val: weeklyMetrics.totalExercises, color: null },
                { label: text.mSets, val: weeklyMetrics.totalSets, color: null },
                { label: text.mSessions, val: weeklyMetrics.workoutSessions, color: null },
                { label: text.mCompleted, val: weeklyMetrics.completedSessions, color: "#3FB98A" },
                { label: text.mCardio, val: weeklyMetrics.cardioSessions, color: "#FF9860" },
                { label: text.mDays, val: "7", color: "#FFD060" },
              ].map(metric => (
                <div key={metric.label} className="stat-box">
                  <p style={{ fontSize: 22, fontWeight: 900, color: metric.color || (isLightMode ? "#101015" : "#FFFFFF"), fontFamily: "'Orbitron', monospace" }}>
                    {metric.val}
                  </p>
                  <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                    {metric.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="home-card">
              <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 12 }}>
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
                        <span style={{ display: "block", color: isLightMode ? "#7A8090" : "#888", fontSize: 12, marginTop: 3 }}>
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

            <div className="feature-hero" style={{ borderColor: isLightMode ? activeFeature.accent : `${activeFeature.accent}40` }}>
              <p style={{ fontSize: 10, letterSpacing: 3, color: activeFeature.accent, fontFamily: "'Orbitron', monospace" }}>
                {language === "es" ? "MÓDULO ATLAS" : "ATLAS MODULE"}
              </p>
              <h2 className="feature-title">{activeFeature.title}</h2>
              <p className="feature-copy">
                {activeFeaturePage === "today" && text.featDescToday}
                {activeFeaturePage === "body" && text.featDescBody}
                {activeFeaturePage === "score" && text.featDescScore}
                {activeFeaturePage === "calendar" && text.featDescCalendar}
                {activeFeaturePage === "prs" && text.featDescPrs}
                {activeFeaturePage === "fatigue" && text.featDescFatigue}
                {activeFeaturePage === "goals" && text.featDescGoals}
                {activeFeaturePage === "progress" && text.featDescProgress}
                {activeFeaturePage === "badges" && text.featDescBadges}
                {activeFeaturePage === "photos" && text.featDescPhotos}
                {activeFeaturePage === "metrics" && text.featDescMetrics}
                {activeFeaturePage === "week" && text.featDescWeek}
                {activeFeaturePage === "water" && (language === "es" ? "Registra tu hidratación diaria. El agua mejora el rendimiento, la recuperación y el metabolismo." : "Track your daily hydration. Water improves performance, recovery and metabolism.")}
                {activeFeaturePage === "coach" && (language === "es" ? "Consejos personalizados basados en tu edad, sexo, composición corporal y meta de tipo de cuerpo." : "Personalized tips based on your age, sex, body composition, and body type goal.")}
                {activeFeaturePage === "nutrition" && text.featDescNutrition}
                {activeFeaturePage === "cardio" && text.featDescCardio}
                {activeFeaturePage === "challenges" && text.featDescChallenges}
                {activeFeaturePage === "meditation" && (language === "es"
                  ? "Temporizador con guía de respiración. Sesiones cortas todos los días bajan el estrés y aceleran la recuperación."
                  : "Timer with a breathing guide. Short daily sessions lower stress and speed recovery.")}
              </p>
            </div>

            {activeFeaturePage === "today" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card">
                    <p className="detail-label">{text.daySection}</p>
                    <p className="detail-value" style={{ color: themeFor(weeklyMetrics.todayType).accent }}>{todayDisplayName} - {weeklyMetrics.todayType}</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">{text.mWeekly}</p>
                    <p className="detail-value" style={{ color: "#90C8FF" }}>{weeklyMetrics.weeklyProgress}%</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">{text.mDone}</p>
                    <p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedExercises}/{weeklyMetrics.totalExercises}</p>
                  </div>
                  <div className="detail-card">
                    <p className="detail-label">{text.mSessions}</p>
                    <p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedSessions}/{weeklyMetrics.workoutSessions}</p>
                  </div>
                </div>
                <button className="primary-btn" onClick={() => openWorkout(weeklyMetrics.today)}>
                  {text.startToday}
                </button>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                  <button className="dark-btn" onClick={resetWeek}>{text.resetWeek}</button>
                </div>
                <div className="home-card">
                  <p className="detail-label">{language === "es" ? "PRÓXIMAS PRIORIDADES" : "NEXT PRIORITIES"}</p>
                  <div className="detail-list">
                    {(incompleteExerciseRows.length ? incompleteExerciseRows : [{ key: "done", exercise: { name: language === "es" ? "Todos los ejercicios completados" : "All exercises completed", weight: "" }, dayName: weeklyMetrics.today, sessionName: language === "es" ? "Protocolo" : "Protocol", setsDone: 0, setsTotal: 0, setsLeft: 0 }]).slice(0, 4).map(row => (
                      <div key={`${row.key}-today-priority`} className="detail-row">
                        <div>
                          <p className="detail-row-main">{row.exercise.name}</p>
                          <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} - {row.setsDone}/{row.setsTotal} {text.setsWord}</p>
                        </div>
                        <span style={{ color: themeFor(weeklyMetrics.todayType).accent, fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtExW(row.exercise.weight)}</span>
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
                    { label: text.currentLabel, val: fmtW(profile.currentWeight) },
                    { label: text.start, val: fmtW(profile.startWeight) },
                    { label: text.target, val: fmtW(profile.targetWeight) },
                    { label: text.change, val: fmtWDelta(weightChange) },
                    { label: text.toGoal, val: fmtWDelta(weightToGoal) },
                    { label: text.heightLabel, val: fmtH(profile.height) },
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
                    {language === "es"
                      ? `Fecha inicio ${profile.startDate}. Fecha meta ${goals.targetDate}. Diferencia actual a la meta: ${fmtWDelta(weightToGoal)}.`
                      : `Start date ${profile.startDate}. Target date ${goals.targetDate}. Current gap to target is ${fmtWDelta(weightToGoal)}.`}
                  </p>
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
            )}

            {activeFeaturePage === "score" && (
              <div className="detail-list">
                {(() => {
                  const scoreColor = atlasScore >= 80 ? "#3FB98A" : atlasScore >= 50 ? "#90C8FF" : "#FFD060";
                  return (
                    <div className="detail-card" style={{ textAlign: "center", padding: "24px 20px", borderColor: `${scoreColor}55` }}>
                      <p style={{ color: scoreColor, fontSize: 58, fontFamily: "'Orbitron', monospace", fontWeight: 900, lineHeight: 1, textShadow: `0 0 28px ${scoreColor}55` }}>{atlasScore}</p>
                      <div style={{ height: 6, borderRadius: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden", margin: "12px auto 10px", maxWidth: 220 }}>
                        <div style={{ width: `${atlasScore}%`, height: "100%", background: scoreColor, borderRadius: 4, boxShadow: `0 0 10px ${scoreColor}88` }} />
                      </div>
                      <p className="detail-row-sub">{deloadWarning ? text.deloadActive : text.protocolStable}</p>
                    </div>
                  );
                })()}
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">{text.mWeekly}</p><p className="detail-value" style={{ color: "#90C8FF" }}>{weeklyMetrics.weeklyProgress}%</p></div>
                  <div className="detail-card"><p className="detail-label">{text.mSessions}</p><p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedSessions}/{weeklySessionsGoal}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.streakLabel}</p><p className="detail-value" style={{ color: "#FFD060" }}>{weeklyStreak}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.prsLabel}</p><p className="detail-value" style={{ color: "#FFD060" }}>{prEntries.length}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.avgRpeLabel}</p><p className="detail-value">{averageRpe || "N/A"}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.deloadLabel}</p><p className="detail-value" style={{ color: deloadWarning ? "#E5604D" : "#3FB98A" }}>{deloadWarning ? "-10" : "+5"}</p></div>
                </div>
                <div className="home-card">
                  <p className="detail-label">{text.scoreBreakdown}</p>
                  <div className="detail-list">
                    <div className="detail-row"><p className="detail-row-main">{text.weeklyCompletion}</p><span>{Math.round(weeklyMetrics.weeklyProgress * 0.45)} pts</span></div>
                    <div className="detail-row"><p className="detail-row-main">{text.sessionTarget}</p><span>{Math.round(Math.min(weeklyMetrics.completedSessions / weeklySessionsGoal, 1) * 25)} pts</span></div>
                    <div className="detail-row"><p className="detail-row-main">{text.streakPressure}</p><span>{Math.min(weeklyStreak, 4) * 5} pts</span></div>
                    <div className="detail-row"><p className="detail-row-main">{text.prMomentum}</p><span>{prEntries.length * 3} pts</span></div>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <button className="dark-btn" onClick={shareWorkoutSummary}>{text.shareProgress}</button>
                  <button className="primary-btn" onClick={shareProgressCard}>{text.shareCard}</button>
                </div>
              </div>
            )}

            {activeFeaturePage === "calendar" && (
              <div className="detail-list">
                <div className="home-card">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 6 }}>
                    {weekHeaderLabels.map((label, index) => (
                      <p key={`${label}-${index}`} style={{ color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", fontSize: 10, textAlign: "center" }}>{label}</p>
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
                        <span key={status} style={{ display: "flex", alignItems: "center", gap: 5, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 11, fontWeight: 700 }}>
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
                        <p className="detail-row-sub">{logged ? `${logged.completed}/${logged.total} ${text.exercisesLogged}` : text.noEntrySaved}</p>
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
                  <div className="detail-card"><p className="detail-label">{text.totalPrs}</p><p className="detail-value">{prEntries.length}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.heaviestLabel}</p><p className="detail-value">{heaviestExerciseRows[0] ? fmtExW(heaviestExerciseRows[0].exercise.weight) : "--"}</p></div>
                </div>
                {(prEntries.length ? prEntries : [{ key: "empty-pr", exerciseName: text.noPrsYet, sessionName: text.markPrHint, weight: "", date: "" }]).map(entry => (
                  <div key={entry.key} className="detail-row">
                    <div>
                      <p className="detail-row-main">{entry.exerciseName}</p>
                      <p className="detail-row-sub">{entry.dayName ? displayDay(entry.dayName) : "PR"} — {entry.sessionName}</p>
                    </div>
                    <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtExW(entry.weight)} {entry.date}</span>
                  </div>
                ))}
                <div className="home-card">
                  <p className="detail-label">{text.heaviestLoads}</p>
                  <div className="detail-list">
                    {heaviestExerciseRows.slice(0, 5).map(row => (
                      <div key={`${row.key}-heavy`} className="detail-row">
                        <div>
                          <p className="detail-row-main">{row.exercise.name}</p>
                          <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} · {text.estimatedOneRM} {fmtW(estimate1RMFromExercise(row.exercise.weight, row.exercise.reps))}</p>
                        </div>
                        <span style={{ color: "#FFD060", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtExW(row.exercise.weight)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeaturePage === "fatigue" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">{text.avgRpeLabel}</p><p className="detail-value">{averageRpe || "N/A"}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.highNotes}</p><p className="detail-value">{highFatigueNotes}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.deloadLabel}</p><p className="detail-value">{deloadWarning ? text.deloadActiveVal : text.deloadClearVal}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.thisWeek}</p><p className="detail-value">{currentWeekKey.slice(5)}</p></div>
                </div>
                <div className="home-card" style={{ borderColor: deloadWarning ? "#FFD06066" : "rgba(255,255,255,0.075)" }}>
                  <p className="detail-row-main">{deloadWarning ? text.lowerLoadAdvice : text.noFatigueWarning}</p>
                  <p className="detail-row-sub">{text.painSignalNote}</p>
                </div>
                <div className="home-card">
                  <p className="detail-label">{text.recentSignals}</p>
                  <div className="detail-list">
                    {(noteRows.length ? noteRows : [{ key: "empty-note", exercise: { name: text.noExerciseNotes }, dayName: language === "es" ? "Notas" : "Notes", sessionName: text.addPainRPE, note: {} }]).slice(0, 6).map(row => (
                      <div key={`${row.key}-fatigue-note`} className="detail-row">
                        <div>
                          <p className="detail-row-main">{row.exercise.name}</p>
                          <p className="detail-row-sub">{displayDay(row.dayName)} - {row.sessionName} - {language === "es" ? "Dolor" : "Pain"} {row.note?.pain || "N/A"} - RPE {row.note?.difficulty || "N/A"}</p>
                        </div>
                        <span style={{ color: row.note?.pr ? "#FFD060" : "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{row.note?.pr ? "PR" : (language === "es" ? "NOTA" : "NOTE")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeFeaturePage === "goals" && (
              <div className="detail-list">
                <div className="home-card">
                  <p className="detail-label">{text.mainFocus}</p>
                  <p className="detail-row-main">{goals.focusGoal}</p>
                  <p className="detail-row-sub">{text.targetDateSub} {goals.targetDate}</p>
                </div>
                {[{ label: text.weeklyProtocol, current: `${weeklyMetrics.weeklyProgress}%`, target: `${goals.weeklyProgressGoal}%`, pct: weeklyGoalPct, color: "#90C8FF" }, { label: text.completedSessions, current: weeklyMetrics.completedSessions, target: goals.weeklySessionsGoal, pct: sessionsGoalPct, color: "#3FB98A" }].map(goal => (
                  <div key={goal.label} className="detail-card">
                    <p className="detail-label">{goal.label.toUpperCase()}</p>
                    <p className="detail-value" style={{ color: goal.color }}>{goal.current} / {goal.target}</p>
                    <div style={{ height: 9, background: isLightMode ? "#E2E4E9" : "rgba(255,255,255,0.07)", borderRadius: 6, overflow: "hidden", marginTop: 10 }}>
                      <div style={{ width: `${goal.pct}%`, height: "100%", background: goal.color, borderRadius: 6, transition: "width 0.4s ease", boxShadow: `0 0 10px ${goal.color}77` }} />
                    </div>
                  </div>
                ))}
                <button className="primary-btn" onClick={() => setEditingGoals({ ...goals })}>{text.setMyGoals}</button>
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">{text.remainingExercises}</p><p className="detail-value">{remainingExercises}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.setCompletionLabel}</p><p className="detail-value">{setCompletionPct}%</p></div>
                </div>
              </div>
            )}

            {activeFeaturePage === "progress" && (
              <div className="detail-list">
                <div className="compact-actions">
                  <button className="primary-btn" onClick={rememberProgress}>{text.saveProgress}</button>
                  <button className="dark-btn" onClick={() => setShowDataTools(true)}>{text.backup}</button>
                  <button className="dark-btn" onClick={resetWeek}>{text.resetWeek}</button>
                </div>
                {chartEntries.length > 0 && (
                  <div className="home-card" style={{ display: "flex", alignItems: "end", gap: 8, height: 130 }}>
                    {chartEntries.map(entry => {
                      const range = Math.max(maxChartWeight - minChartWeight, 1);
                      const height = 34 + ((entry.weightNumber - minChartWeight) / range) * 66;
                      return (
                        <div key={`${entry.id}-feature-bar`} style={{ flex: 1, minWidth: 0, textAlign: "center" }}>
                          <div title={fmtW(entry.weight)} style={{ height, maxWidth: 52, margin: "0 auto", borderRadius: "8px 8px 3px 3px", background: "linear-gradient(180deg, #90C8FF, #5C93C8)", boxShadow: "0 0 18px rgba(144,200,255,0.3)" }} />
                          <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 9, marginTop: 5 }}>{fmtW(entry.weight)}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
                {progressEntries.slice(0, 12).map(entry => (
                  <div key={`${entry.id}-feature`} className="detail-row">
                    <div>
                      <p className="detail-row-main">{entry.date} - {entry.type === "manual" ? text.manualSave : text.autoSnapshot}</p>
                      <p className="detail-row-sub">{entry.completedExercises} {text.exercisesWord} - {entry.completedSessions} {text.sessionsWord} - {text.weekWord} {entry.weekKey}</p>
                    </div>
                    <span style={{ color: "#90C8FF", fontFamily: "'Orbitron', monospace", fontSize: 11 }}>{fmtW(entry.weight)}</span>
                  </div>
                ))}
              </div>
            )}

            {activeFeaturePage === "badges" && (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">{text.weekStreak}</p><p className="detail-value" style={{ color: "#FFD060" }}>{weeklyStreak}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.daysClear}</p><p className="detail-value" style={{ color: "#3FB98A" }}>{weeklyMetrics.completedDays}/7</p></div>
                  <div className="detail-card"><p className="detail-label">{text.weekOf}</p><p className="detail-value" style={{ color: "#90C8FF" }}>{currentWeekKey.slice(5)}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.badgesLabel}</p><p className="detail-value" style={{ color: "#B8A0FF" }}>{earnedBadges.length || 1}</p></div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {(earnedBadges.length ? earnedBadges : [text.protocolStarted]).map(badge => (
                    <span key={badge} style={{ color: "#FFD060", background: "rgba(255,208,96,0.08)", border: "1px solid rgba(255,208,96,0.32)", borderRadius: 999, padding: "9px 13px", fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 900 }}>
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeFeaturePage === "photos" && (() => {
              const photosByDate = [...progressPhotos].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
              const cmpA = progressPhotos.find(p => p.id === compareAId) || photosByDate[0];
              const cmpB = progressPhotos.find(p => p.id === compareBId) || photosByDate[photosByDate.length - 1];
              const cmpDelta = cmpA && cmpB ? Math.round((toNumber(cmpB.weight) - toNumber(cmpA.weight)) * 10) / 10 : 0;
              const updateComparePos = event => {
                const rect = event.currentTarget.getBoundingClientRect();
                if (!rect.width) return;
                const pos = ((event.clientX - rect.left) / rect.width) * 100;
                setComparePos(Math.max(0, Math.min(100, pos)));
              };
              return (
              <div className="detail-list">
                <div className="detail-grid">
                  <div className="detail-card"><p className="detail-label">{text.photosLabel}</p><p className="detail-value" style={{ color: "#90C8FF" }}>{totalPhotoCount}</p></div>
                  <div className="detail-card"><p className="detail-label">{text.albumsLabel}</p><p className="detail-value" style={{ color: "#B8A0FF" }}>{photoAlbums.length}</p></div>
                </div>

                {progressPhotos.length >= 2 && cmpA && cmpB && (
                  <div className="home-card">
                    <p className="detail-label">{text.beforeAfter.toUpperCase()}</p>
                    <div
                      onPointerDown={event => {
                        try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* unsupported */ }
                        updateComparePos(event);
                      }}
                      onPointerMove={event => { if (event.buttons === 1) updateComparePos(event); }}
                      style={{ position: "relative", width: "100%", aspectRatio: "1", borderRadius: 14, overflow: "hidden", marginTop: 10, cursor: "ew-resize", touchAction: "none", userSelect: "none", border: "1px solid #24242E", background: "#050507" }}
                    >
                      <img src={cmpB.dataUrl} draggable={false} alt="After" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}>
                        <img src={cmpA.dataUrl} draggable={false} alt="Before" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ position: "absolute", top: 0, bottom: 0, left: `${comparePos}%`, width: 3, background: "#FFFFFF", transform: "translateX(-50%)", boxShadow: "0 0 14px rgba(0,0,0,0.7)" }}>
                        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
                          <div style={{ width: 2.5, height: 13, borderRadius: 2, background: "#101015" }} />
                          <div style={{ width: 2.5, height: 13, borderRadius: 2, background: "#101015" }} />
                        </div>
                      </div>
                      <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(8,8,12,0.74)", color: "#90C8FF", borderRadius: 999, padding: "5px 11px", fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 900, letterSpacing: 2, backdropFilter: "blur(6px)" }}>{text.photoBefore.toUpperCase()}</span>
                      <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(8,8,12,0.74)", color: "#3FB98A", borderRadius: 999, padding: "5px 11px", fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 900, letterSpacing: 2, backdropFilter: "blur(6px)" }}>{text.photoAfter.toUpperCase()}</span>
                    </div>
                    <p style={{ textAlign: "center", fontSize: 11, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>{text.dragToCompare}</p>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>{text.photoBefore.toUpperCase()}</p>
                        <p style={{ fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{cmpA.date} · {fmtW(cmpA.weight)}</p>
                      </div>
                      <div style={{ minWidth: 0, textAlign: "right" }}>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: "#3FB98A", fontFamily: "'Orbitron', monospace" }}>{text.photoAfter.toUpperCase()}</p>
                        <p style={{ fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{cmpB.date} · {fmtW(cmpB.weight)}</p>
                      </div>
                    </div>
                    {cmpDelta !== 0 && (
                      <p style={{ textAlign: "center", marginTop: 8, fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 14, color: cmpDelta < 0 ? "#3FB98A" : "#FF9860" }}>
                        {fmtWDelta(cmpDelta)}
                      </p>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                      <select className="input" value={cmpA.id} onChange={event => setCompareAId(event.target.value)}>
                        {photosByDate.map(photo => <option key={photo.id} value={photo.id}>{photo.date}</option>)}
                      </select>
                      <select className="input" value={cmpB.id} onChange={event => setCompareBId(event.target.value)}>
                        {photosByDate.map(photo => <option key={photo.id} value={photo.id}>{photo.date}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                <div className="home-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                    <p className="detail-label" style={{ margin: 0 }}>{text.albumsLabel}</p>
                    <button
                      className="album-chip"
                      onClick={() => { setAlbumDraft(""); setShowAlbumModal(true); }}
                      style={{ display: "flex", alignItems: "center", gap: 5 }}
                    >
                      <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 900 }}>+</span> {text.newAlbumBtn}
                    </button>
                  </div>
                  {photoAlbums.length === 0 ? (
                    <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 10 }}>
                      {text.noAlbumsHint}
                    </p>
                  ) : (
                    <>
                      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                        <button
                          className={`album-chip${albumFilter === "" ? " active" : ""}`}
                          onClick={() => setAlbumFilter("")}
                        >
                          {language === "es" ? "Todos" : "All"} ({progressPhotos.length})
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
                      {albumFilter && (
                        <button className="edit-btn" onClick={() => removePhotoAlbum(albumFilter)} style={{ marginTop: 10, color: "#E5604D" }}>
                          {text.deleteAlbumBtn} "{albumFilter}"
                        </button>
                      )}
                    </>
                  )}
                </div>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setPhotoDraft({ date: getDateKey(), note: "", dataUrl: "", album: albumFilter || "", weight: "" });
                    setShowPhotoModal(true);
                  }}
                >
                  + {text.addPhotoBtn}
                </button>

                {(() => {
                  const shownPhotos = albumFilter ? progressPhotos.filter(photo => photo.album === albumFilter) : progressPhotos;

                  if (shownPhotos.length === 0) {
                    return (
                      <div className="home-card">
                        <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>
                          {albumFilter ? text.noPhotosInAlbum : text.noPhotos}
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
                            <p className="photo-note">{photo.note || text.noNote}</p>
                            <p className="photo-sub">{photo.date} · {fmtW(photo.weight)}{photo.album ? ` · ${photo.album}` : ""}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
              );
            })()}

            {activeFeaturePage === "metrics" && (
              <div className="detail-list">
                <div className="detail-grid">
                  {[
                    { label: text.mWeekly, val: `${weeklyMetrics.weeklyProgress}%`, color: "#90C8FF" },
                    { label: text.mDone, val: weeklyMetrics.completedExercises, color: "#3FB98A" },
                    { label: text.mExercises, val: weeklyMetrics.totalExercises, color: null },
                    { label: text.mSets, val: weeklyMetrics.totalSets, color: null },
                    { label: text.setProgressLabel, val: `${weeklySetProgress}/${weeklyMetrics.totalSets}`, color: "#90C8FF" },
                    { label: text.mSessions, val: weeklyMetrics.workoutSessions, color: null },
                    { label: text.mCompleted, val: weeklyMetrics.completedSessions, color: "#3FB98A" },
                    { label: text.mCardio, val: weeklyMetrics.cardioSessions, color: "#FF9860" },
                  ].map(metric => (
                    <div key={metric.label} className="detail-card">
                      <p className="detail-label">{metric.label}</p>
                      <p className="detail-value" style={metric.color ? { color: metric.color } : undefined}>{metric.val}</p>
                    </div>
                  ))}
                </div>

                <div className="home-card">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <p className="detail-label">{text.muscleBalance.toUpperCase()}</p>
                    <p style={{ fontSize: 11, color: "#B8A0FF", fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                      {text.totalVolume}: {Math.round(weeklyVolume).toLocaleString()}
                    </p>
                  </div>
                  <div style={{ display: "grid", gap: 9, marginTop: 12 }}>
                    {Object.entries(volumeByGroup).sort((a, b) => b[1] - a[1]).map(([group, vol]) => {
                      const pct = weeklyVolume > 0 ? Math.round((vol / weeklyVolume) * 100) : 0;
                      return (
                        <div key={group}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: isLightMode ? "#5A6270" : "#8A8F99", marginBottom: 4 }}>
                            <span>{group}</span><span>{pct}%</span>
                          </div>
                          <div style={{ height: 7, borderRadius: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: "#B8A0FF", borderRadius: 4, transition: "width 0.4s ease" }} />
                          </div>
                        </div>
                      );
                    })}
                    {weeklyVolume === 0 && (
                      <p style={{ color: "#8A8F99", fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                        {language === "es" ? "Completa series para ver tu volumen y balance muscular." : "Complete sets to see your volume and muscle balance."}
                      </p>
                    )}
                  </div>
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
                        <p className="detail-row-sub">{currentDay.sessions.map(item => item.name).join(" / ")} - {dayExercises} {text.exercisesWord} - {daySets} {text.setsWord}</p>
                      </div>
                      <button className="edit-btn" onClick={() => openWorkout(dayName)} style={{ color: currentTheme.accent }}>
                        {currentDay.type}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {activeFeaturePage === "nutrition" && (() => {
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
                        {(language === "es" ? "Automático" : "Automatic")} · {text[`activity${autoActivityLevel.charAt(0).toUpperCase()}${autoActivityLevel.slice(1)}`]}
                      </option>
                      {ACTIVITY_LEVELS.map(level => (
                        <option key={level} value={level}>
                          {text[`activity${level.charAt(0).toUpperCase()}${level.slice(1)}`]}
                        </option>
                      ))}
                    </select>
                    <p style={{ fontSize: 12, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 8, lineHeight: 1.5 }}>
                      {isAutoActivity
                        ? (language === "es"
                            ? `Calculado desde tu protocolo: ${weeklyMetrics.trainingDays} días y ${weeklyMetrics.trainingSessions} sesiones por semana. Tu meta de calorías se ajusta sola cuando cambias tu rutina.`
                            : `Calculated from your protocol: ${weeklyMetrics.trainingDays} days and ${weeklyMetrics.trainingSessions} sessions per week. Your calorie goal updates itself when your routine changes.`)
                        : (language === "es"
                            ? "Definido manualmente. Elige Automático para que se ajuste a tu entrenamiento real."
                            : "Set manually. Choose Automatic to match your actual training.")}
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
                              <p className="detail-row-main" style={{ fontSize: 12, color: isToday ? "#3FB98A" : undefined }}>{isToday ? (language === "es" ? "HOY" : "TODAY") : date}</p>
                              <span style={{ color: "#3FB98A", fontFamily: "'Orbitron', monospace", fontSize: 12 }}>{totals.kcal} kcal</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}

            {activeFeaturePage === "cardio" && (() => {
              const cardioDays = Object.entries(cardioLog).sort((a, b) => b[0].localeCompare(a[0])).slice(0, 14);
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

                  {cardioDays.length === 0 && (
                    <p style={{ color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>{text.noCardioYet}</p>
                  )}
                  {cardioDays.map(([date, list]) => (
                    <div key={date} className="home-card">
                      <p className="detail-label">{date === getDateKey() ? (language === "es" ? "HOY" : "TODAY") : date}</p>
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
            })()}

            {activeFeaturePage === "challenges" && (() => {
              const metricLabels = { workouts: text.challengeWorkouts, water: text.challengeWater, cardio: text.challengeCardio };
              return (
                <div className="detail-list">
                  <div className="home-card">
                    <p className="detail-label">{text.newChallenge.toUpperCase()}</p>
                    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                      <input className="input" value={challengeDraft.title} onChange={event => setChallengeDraft(prev => ({ ...prev, title: event.target.value }))} placeholder={text.challengeTitle} />
                      <select className="input" value={challengeDraft.metric} onChange={event => setChallengeDraft(prev => ({ ...prev, metric: event.target.value }))}>
                        <option value="workouts">{text.challengeWorkouts}</option>
                        <option value="water">{text.challengeWater}</option>
                        <option value="cardio">{text.challengeCardio}</option>
                      </select>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <label style={{ display: "block" }}>
                          <span className="field-label">{text.challengeTarget.toUpperCase()}</span>
                          <input className="input" type="number" inputMode="numeric" value={challengeDraft.target} onChange={event => setChallengeDraft(prev => ({ ...prev, target: event.target.value }))} />
                        </label>
                        <label style={{ display: "block" }}>
                          <span className="field-label">{text.challengeDays.toUpperCase()}</span>
                          <input className="input" type="number" inputMode="numeric" value={challengeDraft.days} onChange={event => setChallengeDraft(prev => ({ ...prev, days: event.target.value }))} />
                        </label>
                      </div>
                      <button className="primary-btn" onClick={addChallenge}>{text.createChallenge}</button>
                    </div>
                  </div>

                  {challenges.length === 0 && (
                    <p style={{ color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>{text.noChallenges}</p>
                  )}
                  {challenges.map(challenge => {
                    const progress = computeChallengeProgress(challenge);
                    const pct = challenge.target > 0 ? Math.min(100, Math.round((progress / challenge.target) * 100)) : 0;
                    const done = progress >= challenge.target;
                    return (
                      <div key={challenge.id} className="home-card" style={{ borderColor: done ? "#3FB98A66" : undefined }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                          <div style={{ minWidth: 0 }}>
                            <p className="detail-row-main">{challenge.title}</p>
                            <p className="detail-row-sub">{metricLabels[challenge.metric]} · {challenge.startDate} - {challenge.endDate}</p>
                          </div>
                          <button className="edit-btn" onClick={() => removeChallenge(challenge.id)} style={{ color: "#E5604D", flexShrink: 0 }}>{text.removeBtn}</button>
                        </div>
                        <div style={{ height: 8, borderRadius: 5, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: done ? "#3FB98A" : "#B8A0FF", borderRadius: 5, transition: "width 0.4s ease" }} />
                        </div>
                        <p style={{ marginTop: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: done ? "#3FB98A" : "#8A8F99" }}>
                          {progress} / {challenge.target} · {pct}%{done ? ` · ${text.challengeDone}` : ""}
                        </p>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {activeFeaturePage === "water" && (() => {
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
              return (
                <div className="detail-list">
                  <div className="detail-grid">
                    <div className="detail-card">
                      <p className="detail-label">{text.waterToday.toUpperCase()}</p>
                      <p className="detail-value" style={{ color: wAccent }}>{waterGlasses}/{waterGoalNum}</p>
                      <p style={{ fontSize: 10, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", marginTop: 4, letterSpacing: 1 }}>{text.glasses.toUpperCase()}</p>
                    </div>
                    <div className="detail-card">
                      <p className="detail-label">{language === "es" ? "COMPLETADO" : "COMPLETED"}</p>
                      <p className="detail-value" style={{ color: wAccent }}>{waterPct}%</p>
                      {waterStreakDays > 0 && <p style={{ fontSize: 10, color: "#FFD060", fontFamily: "'Orbitron', monospace", marginTop: 4, letterSpacing: 1 }}>{waterStreakDays} {language === "es" ? "DÍAS SEGUIDOS" : "DAY STREAK"}</p>}
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
                        {language === "es" ? "META DIARIA ALCANZADA" : "DAILY GOAL REACHED"}
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
                      {language === "es" ? "HISTORIAL RECIENTE" : "RECENT HISTORY"}
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
                                  {isToday ? (language === "es" ? "HOY" : "TODAY") : date}
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
                      {language === "es" ? "POR QUÉ IMPORTA" : "WHY IT MATTERS"}
                    </p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {(language === "es" ? [
                        "Mejora la fuerza y resistencia muscular hasta un 10-15%.",
                        "Aumenta el enfoque mental y reduce la fatiga durante el entrenamiento.",
                        "Acelera el metabolismo y optimiza la quema de grasa.",
                        "Mejora la recuperación muscular post-entrenamiento.",
                      ] : [
                        "Boosts muscle strength and endurance by up to 10-15%.",
                        "Improves mental focus and reduces fatigue during training.",
                        "Speeds up metabolism and optimizes fat burning.",
                        "Enhances muscle recovery post-workout.",
                      ]).map((line, ii) => (
                        <div key={ii} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#90C8FF", marginTop: 5, flexShrink: 0 }} />
                          <p style={{ color: isLightMode ? "#2A3A4A" : "#B8C8D8", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.55 }}>{line}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}

            {activeFeaturePage === "coach" && (() => {
              const bmiCategory = bmi <= 0 ? null : bmi < 18.5 ? { label: language === "es" ? "Bajo Peso" : "Underweight", color: "#90C8FF" } : bmi < 25 ? { label: language === "es" ? "Normal" : "Normal", color: "#3FB98A" } : bmi < 30 ? { label: language === "es" ? "Sobrepeso" : "Overweight", color: "#FFD060" } : { label: language === "es" ? "Obeso" : "Obese", color: "#FF9860" };
              const bfCategory = bodyFatPct <= 0 ? null : profileSex === "male"
                ? (bodyFatPct < 14 ? { label: language === "es" ? "En Forma" : "Fit", color: "#3FB98A" } : bodyFatPct < 25 ? { label: language === "es" ? "Normal" : "Normal", color: "#FFD060" } : { label: language === "es" ? "Alto" : "High", color: "#FF9860" })
                : (bodyFatPct < 21 ? { label: language === "es" ? "En Forma" : "Fit", color: "#3FB98A" } : bodyFatPct < 32 ? { label: language === "es" ? "Normal" : "Normal", color: "#FFD060" } : { label: language === "es" ? "Alto" : "High", color: "#FF9860" });
              const selectedGoal = goals.bodyTypeGoal || "athletic";
              const goalColors = { lean: "#FF9860", athletic: "#90C8FF", muscular: "#B8A0FF", maintain: "#3FB98A" };
              const goalAccent = goalColors[selectedGoal] || "#90C8FF";
              return (
                <div className="detail-list">
                  <div className="detail-grid">
                    {[
                      { label: text.bmiLabel, val: bmi > 0 ? String(bmi) : "—", sub: bmiCategory?.label || "", color: bmiCategory?.color || "#8A8F99" },
                      { label: text.bodyFatLabel, val: bmi > 0 ? `${bodyFatPct}%` : "—", sub: bfCategory?.label || "", color: bfCategory?.color || "#8A8F99" },
                      { label: text.leanMassLabel, val: bmi > 0 ? fmtW(leanMassLb) : "—", sub: language === "es" ? "MASA ACTIVA" : "ACTIVE MASS", color: "#90C8FF" },
                      { label: text.ibwLabel, val: ibwLb > 0 ? fmtW(ibwLb) : "—", sub: language === "es" ? "FÓRMULA DEVINE" : "DEVINE FORMULA", color: "#B8A0FF" },
                    ].map(item => (
                      <div key={item.label} className="detail-card">
                        <p className="detail-label">{item.label}</p>
                        <p className="detail-value" style={{ color: item.color }}>{item.val}</p>
                        {item.sub && <p style={{ fontSize: 9, letterSpacing: 1, color: item.color, fontFamily: "'Orbitron', monospace", marginTop: 4, opacity: 0.8 }}>{item.sub}</p>}
                      </div>
                    ))}
                  </div>

                  <div className="detail-row">
                    <div>
                      <p className="detail-row-main">{profileSex === "male" ? text.maleLabel : text.femaleLabel} · {profile.age || "--"} {language === "es" ? "años" : "yrs"}</p>
                      <p className="detail-row-sub">{fmtH(profile.height)} · {fmtW(profile.currentWeight)}</p>
                    </div>
                    <button className="edit-btn" onClick={() => setEditingProfile({ ...profile })}>{text.edit}</button>
                  </div>

                  <div>
                    <p style={{ fontSize: 10, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
                      {text.bodyTypeLabel.toUpperCase()}
                    </p>
                    <div style={{ display: "grid", gap: 8 }}>
                      {BODY_TYPE_GOAL_OPTIONS.map(option => {
                        const selected = selectedGoal === option.value;
                        const acc = goalColors[option.value] || "#90C8FF";
                        const label = language === "es"
                          ? ({ lean: "Definir / Cortar", athletic: "Recomposición Atlética", muscular: "Ganar Músculo", maintain: "Mantener & Tonificar" }[option.value] || option.label)
                          : option.label;
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
            })()}

            {activeFeaturePage === "meditation" && (() => {
              const def = MEDITATION_PRACTICES[medTimer.practice] || MEDITATION_PRACTICES.pranayama;
              const accent = def.accent;
              const isRunning = medTimer.running && medTimer.endsAt > 0;
              const isPaused = !medTimer.running && medTimer.remainingMs > 0;
              const _tick = medTick; // dep so we recompute on each tick
              void _tick;
              const secondsLeft = isRunning
                ? Math.max(0, Math.ceil((medTimer.endsAt - Date.now()) / 1000))
                : isPaused
                  ? Math.ceil(medTimer.remainingMs / 1000)
                  : medTimer.durationSec;
              const elapsedSec = medTimer.durationSec - secondsLeft;
              const progressPct = medTimer.durationSec > 0 ? Math.min(100, Math.round((elapsedSec / medTimer.durationSec) * 100)) : 0;
              const cycleSec = def.cycleSec;
              // The breath cycle (visual + voice) only starts after the
              // opening narration ends. During the opening the circle stays
              // static and no phase label or counter shows, so the visuals
              // never disagree with what the voice is saying.
              const openingEndSec = def.script && def.script.openingEndsAtSec
                ? def.script.openingEndsAtSec
                : 0;
              const breathActive = isRunning && elapsedSec >= openingEndSec;
              const breathElapsed = breathActive ? elapsedSec - openingEndSec : 0;
              const cyclePos = cycleSec > 0 ? breathElapsed % cycleSec : 0;
              let phaseLabel = "";
              if (cycleSec > 0 && breathActive) {
                let phaseStart = 0;
                for (const phase of def.phases) {
                  if (cyclePos < phaseStart + phase.sec) {
                    phaseLabel = language === "es" ? phase.es : phase.en;
                    break;
                  }
                  phaseStart += phase.sec;
                }
              }
              const breathCount = def.showBreathCounter && cycleSec > 0 && breathActive
                ? ((Math.floor(breathElapsed / cycleSec) % 10) + 1)
                : 0;
              const mmss = sec => {
                const m = Math.floor(sec / 60);
                const s = sec % 60;
                return `${m}:${String(s).padStart(2, "0")}`;
              };
              const ringR = 64;
              const ringC = 2 * Math.PI * ringR;
              const todayPct = Math.min(100, Math.round((meditationStats.todayMinutes / meditationGoalMin) * 100));
              const currentMin = Math.round(medTimer.durationSec / 60);
              const tummoBlocked = medTimer.practice === "tummo" && !appSettings.meditationTummoAck;

              // Last 30 days for the heatmap (~5 rows × 7 cols).
              const heatDays = (() => {
                const arr = [];
                for (let i = 34; i >= 0; i -= 1) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  const list = Array.isArray(meditationLog[key]) ? meditationLog[key] : [];
                  const minutes = list.reduce((s, x) => s + (Number(x.durationMin) || 0), 0);
                  arr.push({ key, minutes, isToday: i === 0 });
                }
                return arr;
              })();
              const heatMax = Math.max(meditationGoalMin, ...heatDays.map(d => d.minutes));
              const heatColor = m => {
                if (!m) return isLightMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.05)";
                const ratio = Math.min(1, m / heatMax);
                if (m >= meditationGoalMin) return "#3FB98A";
                const alpha = 0.3 + ratio * 0.6;
                return `${accent}${Math.round(alpha * 255).toString(16).padStart(2, "0")}`;
              };

              const perPracticeStats = MEDITATION_PRACTICE_KEYS.map(key => {
                let sessions = 0;
                let minutes = 0;
                Object.values(meditationLog).forEach(list => {
                  if (!Array.isArray(list)) return;
                  list.forEach(item => {
                    if (item.mode === key) {
                      sessions += 1;
                      minutes += Number(item.durationMin) || 0;
                    }
                  });
                });
                return { key, def: MEDITATION_PRACTICES[key], sessions, minutes };
              });

              const todaySessions = meditationLog[getDateKey()] || [];
              const recentDays = (() => {
                const arr = [];
                for (let i = 0; i < 7; i += 1) {
                  const d = new Date();
                  d.setDate(d.getDate() - i);
                  const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
                  const list = Array.isArray(meditationLog[key]) ? meditationLog[key] : [];
                  const minutes = list.reduce((sum, item) => sum + (Number(item.durationMin) || 0), 0);
                  arr.push({ key, minutes, sessions: list.length });
                }
                return arr;
              })();

              return (
                <div className="detail-list">
                  {/* TOP: stats — keeps the score-style summary up high. */}
                  <div className="detail-grid">
                    <div className="detail-card"><p className="detail-label">{language === "es" ? "HOY" : "TODAY"}</p><p className="detail-value" style={{ color: accent }}>{meditationStats.todayMinutes} <span style={{ fontSize: 14, color: "#8A8F99", fontWeight: 400 }}>/ {meditationGoalMin} min</span></p></div>
                    <div className="detail-card"><p className="detail-label">{language === "es" ? "RACHA" : "STREAK"}</p><p className="detail-value" style={{ color: "#FFD060" }}>{meditationStats.streak} {language === "es" ? "días" : "days"}</p></div>
                    <div className="detail-card"><p className="detail-label">{language === "es" ? "SESIONES" : "SESSIONS"}</p><p className="detail-value">{meditationStats.totalSessions}</p></div>
                    <div className="detail-card"><p className="detail-label">{language === "es" ? "TOTAL MIN" : "TOTAL MIN"}</p><p className="detail-value">{meditationStats.totalMinutes}</p></div>
                  </div>

                  {/* PRACTICE PICKER — 2x2 compact grid. */}
                  <div className="home-card">
                    <p className="detail-label">{language === "es" ? "PRÁCTICA" : "PRACTICE"}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                      {MEDITATION_PRACTICE_KEYS.map(key => {
                        const p = MEDITATION_PRACTICES[key];
                        const isSel = medTimer.practice === key;
                        return (
                          <button
                            key={key}
                            className="dark-btn"
                            disabled={isRunning}
                            onClick={() => {
                              setMedTimer(prev => ({
                                ...prev,
                                practice: key,
                                durationSec: p.defaultMin * 60,
                                endsAt: 0,
                                remainingMs: 0,
                                intervalBellMin: p.defaultIntervalBellMin,
                              }));
                              setAppSettings(prev => ({
                                ...prev,
                                meditationPractice: key,
                                meditationDurationMin: p.defaultMin,
                                meditationIntervalBellMin: p.defaultIntervalBellMin,
                              }));
                            }}
                            style={{
                              textAlign: "left",
                              borderColor: isSel ? `${p.accent}66` : undefined,
                              boxShadow: isSel ? `inset 0 0 0 1px ${p.accent}44` : "none",
                              opacity: isRunning && !isSel ? 0.4 : 1,
                              padding: "12px 12px",
                            }}
                            aria-label={`${language === "es" ? p.es : p.en} ${language === "es" ? p.esSub : p.enSub}`}
                          >
                            <span style={{ display: "block", fontWeight: 900, fontSize: 14, color: isSel ? p.accent : (isLightMode ? "#101015" : "#FFFFFF"), fontFamily: "'DM Sans', sans-serif" }}>
                              {language === "es" ? p.es : p.en}
                            </span>
                            <span style={{ display: "block", fontSize: 11, color: isSel ? p.accent : "#8A8F99", marginTop: 3, fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
                              {language === "es" ? p.esSub : p.enSub}
                            </span>
                            <span style={{ display: "block", fontSize: 10, letterSpacing: 1, color: isSel ? p.accent : "#8A8F99", marginTop: 6, fontFamily: "'Orbitron', monospace", fontWeight: 800 }}>
                              {p.minMin}-{p.maxMin} MIN
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    <p style={{ fontSize: 12, color: isLightMode ? "#5A6270" : "#9CA1AC", marginTop: 12, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                      {language === "es" ? def.esDesc : def.enDesc}
                    </p>
                  </div>

                  {/* TUMMO SAFETY — only when Tummo is selected. SVG icon, no emoji. */}
                  {def.safetyEs && (
                    <div className="home-card" style={{ borderColor: "#FF986055", background: isLightMode ? "rgba(255,152,96,0.08)" : "rgba(255,152,96,0.06)" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF9860" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                          <line x1="12" y1="9" x2="12" y2="13" />
                          <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 10, letterSpacing: 3, color: "#FF9860", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                            {language === "es" ? "SEGURIDAD" : "SAFETY"}
                          </p>
                          <p style={{ color: isLightMode ? "#7A3A20" : "#FFC8A0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                            {language === "es" ? def.safetyEs : def.safetyEn}
                          </p>
                          {!appSettings.meditationTummoAck && (
                            <button
                              className="dark-btn"
                              style={{ marginTop: 10, color: "#FF9860", borderColor: "#FF986044" }}
                              onClick={() => setAppSettings(prev => ({ ...prev, meditationTummoAck: true }))}
                            >
                              {language === "es" ? "Entiendo las advertencias" : "I understand the warnings"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TIMER CARD — the main action, prominent. */}
                  <div className="home-card" style={{ borderColor: isRunning ? `${accent}99` : `${accent}33`, padding: "22px 18px", background: isLightMode ? `linear-gradient(180deg, #FFFFFF, ${accent}08)` : `linear-gradient(180deg, rgba(19,19,24,0.96), ${accent}10)` }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 10, letterSpacing: 3, color: accent, fontFamily: "'Orbitron', monospace" }}>
                          {(language === "es" ? def.es : def.en).toUpperCase()}
                        </p>
                        <p style={{ fontSize: 12, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
                          {currentMin} min · {language === "es" ? def.esSub : def.enSub}
                        </p>
                      </div>
                      {appSettings.meditationVoice && (
                        <span style={{ fontSize: 9, letterSpacing: 2, color: accent, fontFamily: "'Orbitron', monospace", padding: "4px 8px", border: `1px solid ${accent}44`, borderRadius: 999 }}>
                          {language === "es" ? "VOZ ON" : "VOICE ON"}
                        </span>
                      )}
                    </div>

                    <div
                      style={{ position: "relative", width: "100%", maxWidth: 240, aspectRatio: "1", margin: "0 auto" }}
                      role="img"
                      aria-label={isRunning ? (language === "es" ? `Sesión en curso, ${mmss(secondsLeft)} restantes` : `Session running, ${mmss(secondsLeft)} remaining`) : (language === "es" ? "Timer de meditación detenido" : "Meditation timer stopped")}
                    >
                      <svg viewBox="0 0 160 160" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                        <circle cx="80" cy="80" r={ringR} fill="none" stroke={isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"} strokeWidth="8" />
                        <circle cx="80" cy="80" r={ringR} fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeDasharray={ringC} strokeDashoffset={ringC * (1 - progressPct / 100)} style={{ transition: "stroke-dashoffset 0.9s linear" }} />
                      </svg>
                      <div
                        className={breathActive && def.showBreathCircle ? `med-breath med-breath-${medTimer.practice}` : ""}
                        style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: accent, pointerEvents: "none" }}
                      >
                        {breathActive && def.showBreathCounter && breathCount > 0 ? (
                          <>
                            <p style={{ fontSize: 64, fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1, color: "#FFFFFF" }}>{breathCount}</p>
                            <p style={{ fontSize: 14, fontWeight: 800, fontFamily: "'Orbitron', monospace", marginTop: 6, opacity: 0.75 }}>{mmss(secondsLeft)}</p>
                          </>
                        ) : (
                          <>
                            <p style={{ fontSize: 42, fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{mmss(secondsLeft)}</p>
                            {breathActive && def.showBreathCircle && phaseLabel && (
                              <p style={{ fontSize: 12, letterSpacing: 3, marginTop: 8, fontFamily: "'Orbitron', monospace", fontWeight: 800, opacity: 0.9 }}>{phaseLabel.toUpperCase()}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {isRunning ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                        <button className="dark-btn" onClick={pauseMeditation} aria-label={language === "es" ? "Pausar" : "Pause"}>
                          ❙❙ {language === "es" ? "Pausar" : "Pause"}
                        </button>
                        <button className="dark-btn" onClick={stopMeditation} style={{ color: "#E5604D" }} aria-label={language === "es" ? "Detener" : "Stop"}>
                          ■ {language === "es" ? "Detener" : "Stop"}
                        </button>
                      </div>
                    ) : isPaused ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                        <button className="primary-btn" onClick={pauseMeditation}>
                          ▶ {language === "es" ? "Continuar" : "Resume"}
                        </button>
                        <button className="dark-btn" onClick={stopMeditation} style={{ color: "#E5604D" }}>
                          ■ {language === "es" ? "Detener" : "Stop"}
                        </button>
                      </div>
                    ) : (
                      <button
                        className="primary-btn"
                        style={{ marginTop: 16, width: "100%", opacity: tummoBlocked ? 0.5 : 1, cursor: tummoBlocked ? "not-allowed" : "pointer" }}
                        disabled={tummoBlocked}
                        onClick={() => startMeditation(medTimer.practice, currentMin, medTimer.intervalBellMin)}
                      >
                        ▶ {language === "es" ? "Empezar sesión guiada" : "Start guided session"}
                      </button>
                    )}
                  </div>

                  {/* COMPLETION + REFLECTION */}
                  {medCompleted && !isRunning && (
                    <div className="home-card" style={{ borderColor: "#3FB98A66", background: isLightMode ? "rgba(63,185,138,0.08)" : "rgba(63,185,138,0.06)" }}>
                      <p style={{ fontSize: 10, letterSpacing: 3, color: "#3FB98A", fontFamily: "'Orbitron', monospace", marginBottom: 6 }}>
                        {language === "es" ? "SESIÓN COMPLETA" : "SESSION DONE"}
                      </p>
                      <p style={{ color: isLightMode ? "#1A3A2A" : "#A8E0C0", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
                        {language === "es"
                          ? `Guardamos ${medCompleted.durationMin} min de ${MEDITATION_PRACTICES[medCompleted.practice]?.es || ""} en tu historial.`
                          : `Logged ${medCompleted.durationMin} min of ${MEDITATION_PRACTICES[medCompleted.practice]?.en || ""} to your history.`}
                      </p>
                      <label style={{ display: "block", marginTop: 12 }}>
                        <span className="field-label">{language === "es" ? "REFLEXIÓN (OPCIONAL)" : "REFLECTION (OPTIONAL)"}</span>
                        <input
                          className="input"
                          value={medReflection}
                          onChange={event => setMedReflection(event.target.value)}
                          placeholder={language === "es" ? "¿Cómo te sientes?" : "How do you feel?"}
                          maxLength={140}
                        />
                      </label>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                        <button className="dark-btn" onClick={() => { setMedCompleted(null); setMedReflection(""); }}>
                          {language === "es" ? "Saltar" : "Skip"}
                        </button>
                        <button className="primary-btn" onClick={saveMedReflection} disabled={!medReflection.trim()} style={{ opacity: medReflection.trim() ? 1 : 0.4 }}>
                          {language === "es" ? "Guardar nota" : "Save note"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ADJUSTMENTS — collapsed by default to keep the page tight. */}
                  <div className="home-card">
                    <button
                      onClick={() => setMedShowAdjustments(v => !v)}
                      style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", padding: 0, color: accent, cursor: "pointer", font: "inherit" }}
                      aria-expanded={medShowAdjustments}
                    >
                      <span style={{ fontSize: 10, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 800 }}>
                        {language === "es" ? "AJUSTES" : "ADJUSTMENTS"}
                      </span>
                      <span>{medShowAdjustments ? "↑" : "↓"}</span>
                    </button>

                    {medShowAdjustments && (
                      <div style={{ display: "grid", gap: 16, marginTop: 14 }}>
                        {/* Duration */}
                        <div>
                          <p className="detail-label">{language === "es" ? "DURACIÓN" : "DURATION"}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                            <input
                              type="range"
                              min={def.minMin}
                              max={def.maxMin}
                              step="1"
                              value={currentMin}
                              disabled={isRunning}
                              onChange={event => {
                                const minutes = Number(event.target.value);
                                setMedTimer(prev => ({ ...prev, durationSec: minutes * 60, remainingMs: 0 }));
                                setAppSettings(prev => ({ ...prev, meditationDurationMin: minutes }));
                              }}
                              style={{ flex: 1, accentColor: accent }}
                              aria-label={language === "es" ? "Duración en minutos" : "Duration in minutes"}
                            />
                            <span style={{ minWidth: 64, textAlign: "right", color: accent, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>{currentMin} min</span>
                          </div>
                        </div>

                        {/* Interval bell */}
                        <div>
                          <p className="detail-label">{language === "es" ? "CAMPANA DURANTE LA SESIÓN" : "INTERVAL BELL"}</p>
                          <p style={{ fontSize: 12, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 4, lineHeight: 1.4 }}>
                            {language === "es" ? "Tono cada N minutos. Útil para Vipassana." : "Chime every N minutes. Useful for Vipassana."}
                          </p>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8, alignItems: "center" }}>
                            {[0, 1, 2, 5, 10].map(min => {
                              const isSel = medTimer.intervalBellMin === min;
                              return (
                                <button
                                  key={min}
                                  disabled={isRunning}
                                  onClick={() => {
                                    setMedTimer(prev => ({ ...prev, intervalBellMin: min }));
                                    setAppSettings(prev => ({ ...prev, meditationIntervalBellMin: min }));
                                  }}
                                  style={{ padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${isSel ? `${accent}66` : (isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)")}`, background: isSel ? (isLightMode ? `${accent}15` : `${accent}18`) : "transparent", color: isSel ? accent : "#888", fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, cursor: isRunning ? "not-allowed" : "pointer", opacity: isRunning ? 0.5 : 1 }}
                                >
                                  {min === 0 ? "Off" : `${min} min`}
                                </button>
                              );
                            })}
                            <button
                              className="edit-btn"
                              onClick={() => { playReminderSound("chime"); meditationVibrate(120); }}
                              style={{ color: accent }}
                              aria-label={language === "es" ? "Probar tono" : "Test chime"}
                            >
                              ▶ {language === "es" ? "Probar" : "Test"}
                            </button>
                          </div>
                        </div>

                        {/* Ambient sound */}
                        <div>
                          <p className="detail-label">{language === "es" ? "SONIDO AMBIENTE" : "AMBIENT SOUND"}</p>
                          <p style={{ fontSize: 12, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 4, lineHeight: 1.4 }}>
                            {language === "es" ? "Generado en el dispositivo. Bajo volumen, no compite con la voz." : "Generated on-device. Low volume, doesn't fight the voice."}
                          </p>
                          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                            {AMBIENT_SOUND_OPTIONS.map(snd => {
                              const isSel = (appSettings.meditationSound || "off") === snd;
                              const label = {
                                off: language === "es" ? "Apagado" : "Off",
                                rain: language === "es" ? "Lluvia" : "Rain",
                                ocean: language === "es" ? "Océano" : "Ocean",
                                om: language === "es" ? "Drone Om" : "Om Drone",
                                metronome: language === "es" ? "Metrónomo" : "Metronome",
                              }[snd];
                              return (
                                <button
                                  key={snd}
                                  onClick={() => setAppSettings(prev => ({ ...prev, meditationSound: snd }))}
                                  style={{ padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${isSel ? `${accent}66` : (isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)")}`, background: isSel ? (isLightMode ? `${accent}15` : `${accent}18`) : "transparent", color: isSel ? accent : "#888", fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, cursor: "pointer" }}
                                >
                                  {label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Voice guidance toggle */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                          <div style={{ minWidth: 0 }}>
                            <p className="detail-label">{language === "es" ? "VOZ GUÍA" : "VOICE GUIDE"}</p>
                            <p style={{ fontSize: 12, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 4, lineHeight: 1.4 }}>
                              {language === "es" ? "Te enseña la práctica con instrucciones habladas. Pausa o detén para silenciar." : "Teaches the practice with spoken instructions. Pause or stop to silence."}
                            </p>
                          </div>
                          <button
                            className="dark-btn"
                            onClick={() => setAppSettings(prev => ({ ...prev, meditationVoice: prev.meditationVoice === false }))}
                            style={{ color: appSettings.meditationVoice ? accent : "#8A8F99", borderColor: appSettings.meditationVoice ? `${accent}44` : undefined, flexShrink: 0 }}
                            aria-pressed={!!appSettings.meditationVoice}
                          >
                            {appSettings.meditationVoice ? (language === "es" ? "Activada" : "On") : (language === "es" ? "Apagada" : "Off")}
                          </button>
                        </div>

                        {/* Daily goal */}
                        <div>
                          <p className="detail-label">{language === "es" ? "META DIARIA" : "DAILY GOAL"}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
                            <input
                              type="range"
                              min="1"
                              max="60"
                              step="1"
                              value={meditationGoalMin}
                              onChange={event => setAppSettings(prev => ({ ...prev, meditationGoalMin: Number(event.target.value) }))}
                              style={{ flex: 1, accentColor: accent }}
                              aria-label={language === "es" ? "Meta diaria en minutos" : "Daily goal in minutes"}
                            />
                            <span style={{ minWidth: 56, textAlign: "right", color: accent, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>{meditationGoalMin} min</span>
                          </div>
                          <div style={{ height: 6, borderRadius: 4, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden", marginTop: 10 }}>
                            <div style={{ width: `${todayPct}%`, height: "100%", background: accent, borderRadius: 4, transition: "width 0.4s ease" }} />
                          </div>
                          <p style={{ fontSize: 11, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 6 }}>
                            {meditationStats.todayMinutes} / {meditationGoalMin} min · {todayPct}%
                          </p>
                        </div>

                        {/* Daily reminder shortcut */}
                        <button className="dark-btn" onClick={addMeditationReminder} style={{ color: accent }}>
                          + {language === "es" ? "Agregar recordatorio diario a las 21:00" : "Add daily reminder at 21:00"}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* HEATMAP — last 35 days. */}
                  {(() => {
                    const hasAnyMeditation = heatDays.some(d => d.minutes > 0);
                    return (
                      <div className="home-card">
                        <p className="detail-label">{language === "es" ? "ÚLTIMAS 5 SEMANAS" : "LAST 5 WEEKS"}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 10 }}>
                          {heatDays.map(day => {
                            const dayNum = Number(day.key.slice(-2));
                            const isGoalMet = day.minutes >= meditationGoalMin;
                            const hasData = day.minutes > 0;
                            const numberColor = isGoalMet
                              ? "#FFFFFF"
                              : hasData
                                ? (isLightMode ? "#101015" : "#FFFFFF")
                                : (isLightMode ? "rgba(0,0,0,0.32)" : "rgba(255,255,255,0.32)");
                            const isFirstOfMonth = dayNum === 1;
                            return (
                              <div
                                key={day.key}
                                title={`${day.key}: ${day.minutes} min`}
                                style={{
                                  aspectRatio: "1",
                                  borderRadius: 4,
                                  background: heatColor(day.minutes),
                                  border: day.isToday
                                    ? `2px solid ${accent}`
                                    : isFirstOfMonth
                                      ? `1px solid ${isLightMode ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.22)"}`
                                      : `1px solid ${isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.07)"}`,
                                  boxShadow: day.isToday ? `0 0 8px ${accent}55` : "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <span style={{ fontSize: 11, fontWeight: 700, fontFamily: "'Orbitron', monospace", color: numberColor, lineHeight: 1 }}>
                                  {dayNum}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {hasAnyMeditation ? (
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 10, color: "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                            <span>{language === "es" ? "MENOS" : "LESS"}</span>
                            <span>{language === "es" ? "MÁS" : "MORE"}</span>
                          </div>
                        ) : (
                          <p style={{ marginTop: 10, fontSize: 12, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5, textAlign: "center" }}>
                            {language === "es"
                              ? "Tu calendario aparece aquí cuando completas tu primera sesión. El cuadro con borde es hoy."
                              : "Your calendar appears here after your first session. The bordered square is today."}
                          </p>
                        )}
                      </div>
                    );
                  })()}

                  {/* PER-PRACTICE BREAKDOWN */}
                  <div className="home-card">
                    <p className="detail-label">{language === "es" ? "POR PRÁCTICA" : "BY PRACTICE"}</p>
                    <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
                      {perPracticeStats.map(stat => (
                        <div key={stat.key} className="detail-row">
                          <div>
                            <p className="detail-row-main">{language === "es" ? stat.def.es : stat.def.en}</p>
                            <p className="detail-row-sub">{stat.sessions} {language === "es" ? "sesiones" : "sessions"} · {stat.minutes} min</p>
                          </div>
                          <span style={{ color: stat.def.accent, fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900 }}>
                            {stat.sessions > 0 ? Math.round(stat.minutes / stat.sessions) : 0} {language === "es" ? "min/ses" : "min/ses"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 7-DAY BARS */}
                  <div className="home-card">
                    <p className="detail-label">{language === "es" ? "ÚLTIMOS 7 DÍAS" : "LAST 7 DAYS"}</p>
                    <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
                      {recentDays.map(day => {
                        const pct = Math.min(100, meditationGoalMin > 0 ? Math.round((day.minutes / meditationGoalMin) * 100) : 0);
                        const isToday = day.key === getDateKey();
                        const barColor = pct >= 100 ? "#3FB98A" : pct > 0 ? accent : (isLightMode ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)");
                        return (
                          <div key={day.key} className="detail-row" style={{ borderColor: isToday ? `${accent}33` : undefined }}>
                            <div style={{ minWidth: 72 }}>
                              <p className="detail-row-main" style={{ fontSize: 12, color: isToday ? accent : undefined }}>
                                {isToday ? (language === "es" ? "HOY" : "TODAY") : day.key}
                              </p>
                            </div>
                            <div style={{ flex: 1, height: 4, borderRadius: 4, overflow: "hidden", background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)" }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: barColor, borderRadius: 4, transition: "width 0.4s ease" }} />
                            </div>
                            <p style={{ fontSize: 12, fontWeight: 900, color: barColor, fontFamily: "'Orbitron', monospace", minWidth: 60, textAlign: "right" }}>{day.minutes} min</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* TODAY'S SESSIONS */}
                  {todaySessions.length > 0 && (
                    <div className="home-card">
                      <p className="detail-label">{language === "es" ? "SESIONES DE HOY" : "TODAY'S SESSIONS"}</p>
                      <div style={{ display: "grid", gap: 6, marginTop: 10 }}>
                        {todaySessions.map(entry => {
                          const p = MEDITATION_PRACTICES[entry.mode];
                          const name = p ? (language === "es" ? p.es : p.en) : (entry.mode || "—");
                          const c = p?.accent || accent;
                          const time = entry.completedAt ? new Date(entry.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
                          return (
                            <div key={entry.id} className="detail-row">
                              <div>
                                <p className="detail-row-main">{name}</p>
                                <p className="detail-row-sub">
                                  {time}{entry.note ? ` · ${entry.note}` : ""}
                                </p>
                              </div>
                              <span style={{ color: c, fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900 }}>{entry.durationMin} min</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
              <div style={{ display: "flex", gap: 6, background: isLightMode ? "rgba(0,0,0,0.07)" : "#111115", borderRadius: 14, padding: "8px 8px" }}>
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
                      style={isActive ? { background: t.badge, border: `1.5px solid ${isLightMode ? t.accent : t.accent + "50"}` } : {}}
                      onClick={() => {
                        setActiveDay(d);
                        setActiveSession(0);
                        setExpandedExerciseIndex(null);
                      }}
                    >
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1, color: isActive ? t.accent : (isLightMode ? "#7A8090" : "#6E7480"), fontFamily: "'Orbitron', monospace" }}>
                        {displayDayShort(d, workoutData[d].label)}
                      </div>
                      <div style={{ fontSize: 8, color: isActive ? t.sub : (isLightMode ? "#9AA0AC" : "#5A5F6A"), marginTop: 3, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
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
                <span style={{ fontSize: 11, letterSpacing: 2, color: isLightMode ? "#9AA0AC" : "#7C828E", fontFamily: "'Orbitron', monospace" }}>
                  {" "}- {day.type}
                </span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                {total > 0 && (
                  <div style={{ fontSize: 13, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
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
                <div style={{ height: 4, background: isLightMode ? "rgba(0,0,0,0.09)" : "#1E1E26", borderRadius: 4, overflow: "hidden" }}>
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
                      <p style={{ fontSize: 13, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontWeight: 700 }}>
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
                          stroke={isLightMode ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.08)"}
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
                        <p style={{ fontSize: 23, color: isLightMode ? "#101015" : "#FFFFFF", fontWeight: 900, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>
                          {formatTimer(restTimer.secondsLeft)}
                        </p>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#5A6270" : "#888", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
                          {restTimer.running ? text.restWord : text.readyWord}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))", gap: 8 }}>
                    {restPresets.map(seconds => (
                      <button
                        key={seconds}
                        className="dark-btn"
                        onClick={() => startRestTimer(seconds)}
                        style={{ padding: "10px 8px", borderColor: seconds === restSecondsSetting ? `${theme.accent}66` : undefined }}
                      >
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
                    style={activeSession === i
                      ? { background: theme.badge, borderColor: isLightMode ? theme.accent : theme.accent + "60", color: theme.accent, fontWeight: 700 }
                      : { opacity: isLightMode ? 0.55 : 1 }}
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
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{fmtExW(quickExercise.weight)}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.weightWord}</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickExercise.sets}x{quickExercise.reps}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.mSets}</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsDone}/{quickTotalSets}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.mDone}</p>
                    </div>
                    <div className="stat-box">
                      <p style={{ fontSize: 22, color: theme.accent, fontFamily: "'Orbitron', monospace" }}>{quickSetsLeft}</p>
                      <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>{text.leftCap}</p>
                    </div>
                  </div>
                  {quickNote && (
                    <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5 }}>
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
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "#1A1A22", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isLightMode ? "#4A5062" : "white"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7 23h2.1l1.8-8 2.1 2v6h2v-7.5l-2.1-2 .6-3C14.8 12 16.8 13 19 13v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1L6 8.3V13h2V9.6l1.8-.7"/>
                    </svg>
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 9, letterSpacing: 3, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>
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
                  <div style={{ marginBottom: 14, display: "flex", justifyContent: "center" }}>
                    <svg width="42" height="42" viewBox="0 0 24 24" fill={isLightMode ? "#6A4ACC" : "#B8A0FF"} xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: 14, letterSpacing: 4, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
                    {text.recoveryMode}
                  </p>
                  <p style={{ fontSize: 15, color: isLightMode ? "#7A8090" : "#9CA1AC", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>
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
                        <button className="edit-btn" onClick={() => setExpandedExerciseIndex(null)} style={{ flexShrink: 0, marginLeft: 10, color: isLightMode ? "#7A8090" : "#888" }}>
                          ↑ {language === "es" ? "Colapsar" : "Collapse"}
                        </button>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 16 }}>
                        <div style={{ padding: "12px 8px", borderRadius: 12, background: isLightMode ? "rgba(0,0,0,0.04)" : `${theme.accent}10`, border: `1px solid ${theme.accent}33`, textAlign: "center" }}>
                          <p style={{ fontSize: 22, fontWeight: 900, color: theme.accent, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{fmtExW(ex.weight)}</p>
                          <p style={{ fontSize: 8, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{text.weightWord}</p>
                        </div>
                        <div style={{ padding: "12px 8px", borderRadius: 12, background: isLightMode ? "rgba(0,0,0,0.04)" : `${theme.accent}10`, border: `1px solid ${theme.accent}33`, textAlign: "center" }}>
                          <p style={{ fontSize: 22, fontWeight: 900, color: theme.accent, fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{ex.sets}×{ex.reps}</p>
                          <p style={{ fontSize: 8, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{text.mSets}×{text.repsWord}</p>
                        </div>
                        <div style={{ padding: "12px 8px", borderRadius: 12, background: setsDone === totalExerciseSets && totalExerciseSets > 0 ? `${theme.accent}22` : (isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"), border: `1px solid ${setsDone === totalExerciseSets && totalExerciseSets > 0 ? theme.accent : "rgba(255,255,255,0.07)"}`, textAlign: "center" }}>
                          <p style={{ fontSize: 22, fontWeight: 900, color: setsDone === totalExerciseSets && totalExerciseSets > 0 ? theme.accent : "#FFFFFF", fontFamily: "'Orbitron', monospace", lineHeight: 1 }}>{setCompPct2}%</p>
                          <p style={{ fontSize: 8, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 5, fontFamily: "'Orbitron', monospace" }}>{language === "es" ? "HECHO" : "DONE"}</p>
                        </div>
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                          <span style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: 700 }}>{text.mSets} {setsDone}/{totalExerciseSets}</span>
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
                          style={{ padding: "14px 10px", fontSize: 16, fontWeight: 900, color: isLightMode ? "#7A8090" : "#8A8F99" }}
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
                      {(() => {
                        const est = estimate1RMFromExercise(ex.weight, ex.reps);
                        const perf = exercisePerformance[ex.name];
                        const cues = getExerciseCues(ex.name, language);
                        return (
                          <>
                            {est > 0 && (
                              <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 11px", borderRadius: 10, background: isLightMode ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)" }}>
                                <span style={{ fontSize: 11, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>{text.estimatedOneRM}</span>
                                <span style={{ fontSize: 12, color: theme.accent, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                                  {fmtW(est)}{perf?.best1RM ? ` · ${text.personalBest} ${fmtW(perf.best1RM)}` : ""}
                                </span>
                              </div>
                            )}
                            {cues.length > 0 && (
                              <button
                                className="edit-btn"
                                style={{ width: "100%", marginTop: 10, padding: 10 }}
                                onClick={() => setCuesExerciseIndex(prev => (prev === i ? null : i))}
                              >
                                {text.formCues}{cuesExerciseIndex === i ? " ↑" : ""}
                              </button>
                            )}
                            {cuesExerciseIndex === i && cues.length > 0 && (
                              <div style={{ marginTop: 8, display: "grid", gap: 7 }}>
                                {cues.map((cue, cueIndex) => (
                                  <div key={cueIndex} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                    <div style={{ width: 5, height: 5, borderRadius: "50%", background: theme.accent, marginTop: 6, flexShrink: 0 }} />
                                    <p style={{ fontSize: 12, color: isLightMode ? "#5A6270" : "#C8D0DC", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{cue}</p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      })()}
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
                      <p style={{ fontSize: 15, fontWeight: 600, color: isDone ? (isLightMode ? "#9CA1AC" : "#555") : (isLightMode ? "#101015" : "#FFFFFF"), fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {ex.name}
                      </p>
                      <p style={{ fontSize: 12, color: isDone ? "#6E7480" : (isLightMode ? "#5A6270" : "#888"), marginTop: 3, fontFamily: "'DM Sans', sans-serif" }}>
                        {ex.sets} {text.setsWord} x {ex.reps} {text.repsWord}
                      </p>
                      <p style={{ fontSize: 11, color: isDone ? "#6E7480" : (isLightMode ? "#8A8F99" : "#AAAAAA"), marginTop: 4, fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
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
                        {fmtExW(ex.weight)}
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
                      <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#8A8F99", marginTop: 4, fontFamily: "'Orbitron', monospace" }}>
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
                <p style={{ fontSize: 12, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
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
                    : <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 24, color: isLightMode ? "#7A8090" : "#888" }}>{userName.slice(0, 1).toUpperCase()}</span>}
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

              <label style={{ display: "block" }}>
                <span className="field-label">{text.unitSystem.toUpperCase()}</span>
                <select
                  className="input"
                  value={appSettings.unitSystem || "imperial"}
                  onChange={event => setAppSettings(prev => ({ ...prev, unitSystem: event.target.value }))}
                >
                  <option value="imperial">{text.imperial}</option>
                  <option value="metric">{text.metric}</option>
                </select>
              </label>
              <p className="setting-sub">{text.unitSystemSub}</p>

              <label style={{ display: "block" }}>
                <span className="field-label">{text.restTimer}</span>
                <select
                  className="input"
                  value={restSecondsSetting}
                  onChange={event => setAppSettings(prev => ({ ...prev, restSeconds: Number(event.target.value) }))}
                >
                  {[30, 45, 60, 75, 90, 105, 120, 150, 180].map(seconds => (
                    <option key={seconds} value={seconds}>{seconds}s ({formatTimer(seconds)})</option>
                  ))}
                </select>
              </label>
              <p className="setting-sub">{text.restTimerSub}</p>

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
                  <option key={option} value={option}>{option} {language === "es" ? "tono" : "tone"}</option>
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

              {(() => {
                const bg = appSettings.background || { type: "default" };
                const setBg = patch => setAppSettings(prev => ({ ...prev, background: { ...(prev.background || {}), ...patch } }));
                const types = [
                  { id: "default", esLabel: "Predeterminado", enLabel: "Default" },
                  { id: "color", esLabel: "Color sólido", enLabel: "Solid color" },
                  { id: "gradient", esLabel: "Degradado", enLabel: "Gradient" },
                  { id: "photo", esLabel: "Foto", enLabel: "Photo" },
                ];
                const angleOptions = [
                  { value: 0, label: "↑" },
                  { value: 45, label: "↗" },
                  { value: 90, label: "→" },
                  { value: 135, label: "↘" },
                  { value: 180, label: "↓" },
                  { value: 225, label: "↙" },
                  { value: 270, label: "←" },
                  { value: 315, label: "↖" },
                ];
                return (
                  <div style={{ borderTop: `1px solid ${isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)"}`, paddingTop: 14, marginTop: 4 }}>
                    <p className="field-label">{language === "es" ? "FONDO DE LA APP" : "APP BACKGROUND"}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
                      {types.map(t => {
                        const sel = (bg.type || "default") === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setBg({ type: t.id })}
                            style={{ padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${sel ? "#90C8FF66" : (isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)")}`, background: sel ? (isLightMode ? "rgba(144,200,255,0.12)" : "rgba(144,200,255,0.1)") : "transparent", color: sel ? "#90C8FF" : "#888", fontFamily: "'Orbitron', monospace", fontSize: 11, fontWeight: 900, cursor: "pointer" }}
                          >
                            {language === "es" ? t.esLabel : t.enLabel}
                          </button>
                        );
                      })}
                    </div>

                    {bg.type === "color" && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
                        <input
                          type="color"
                          value={bg.color || "#0C0C10"}
                          onChange={event => setBg({ color: event.target.value })}
                          aria-label={language === "es" ? "Color de fondo" : "Background color"}
                          style={{ width: 56, height: 36, borderRadius: 8, border: `1px solid ${isLightMode ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)"}`, background: "transparent", cursor: "pointer", padding: 2 }}
                        />
                        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: isLightMode ? "#5A6270" : "#8A8F99" }}>{(bg.color || "#0C0C10").toUpperCase()}</span>
                      </div>
                    )}

                    {bg.type === "gradient" && (
                      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: isLightMode ? "#5A6270" : "#8A8F99", minWidth: 56 }}>{language === "es" ? "Desde" : "From"}</span>
                          <input type="color" value={bg.gradientFrom || "#0C0C10"} onChange={event => setBg({ gradientFrom: event.target.value })} style={{ width: 48, height: 32, borderRadius: 8, border: `1px solid ${isLightMode ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)"}`, background: "transparent", cursor: "pointer", padding: 2 }} />
                          <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: isLightMode ? "#5A6270" : "#8A8F99" }}>{(bg.gradientFrom || "#0C0C10").toUpperCase()}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: isLightMode ? "#5A6270" : "#8A8F99", minWidth: 56 }}>{language === "es" ? "Hasta" : "To"}</span>
                          <input type="color" value={bg.gradientTo || "#1A1A3E"} onChange={event => setBg({ gradientTo: event.target.value })} style={{ width: 48, height: 32, borderRadius: 8, border: `1px solid ${isLightMode ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.18)"}`, background: "transparent", cursor: "pointer", padding: 2 }} />
                          <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, color: isLightMode ? "#5A6270" : "#8A8F99" }}>{(bg.gradientTo || "#1A1A3E").toUpperCase()}</span>
                        </div>
                        <div>
                          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: isLightMode ? "#5A6270" : "#8A8F99", marginBottom: 6 }}>{language === "es" ? "Dirección" : "Direction"}</p>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {angleOptions.map(opt => {
                              const sel = Number(bg.gradientAngle) === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  onClick={() => setBg({ gradientAngle: opt.value })}
                                  aria-label={`${opt.value}°`}
                                  style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${sel ? "#90C8FF66" : (isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.1)")}`, background: sel ? (isLightMode ? "rgba(144,200,255,0.12)" : "rgba(144,200,255,0.1)") : "transparent", color: sel ? "#90C8FF" : "#888", fontFamily: "'Orbitron', monospace", fontSize: 16, fontWeight: 900, cursor: "pointer" }}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ height: 40, borderRadius: 10, background: `linear-gradient(${bg.gradientAngle || 180}deg, ${bg.gradientFrom || "#0C0C10"}, ${bg.gradientTo || "#1A1A3E"})`, border: `1px solid ${isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}` }} />
                      </div>
                    )}

                    {bg.type === "photo" && (
                      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
                        {bg.photo && (
                          <div style={{ height: 120, borderRadius: 10, backgroundImage: `url(${bg.photo})`, backgroundSize: "cover", backgroundPosition: "center", border: `1px solid ${isLightMode ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)"}` }} />
                        )}
                        <label className="dark-btn" style={{ textAlign: "center" }}>
                          {bg.photo ? (language === "es" ? "Cambiar foto de fondo" : "Change background photo") : (language === "es" ? "Subir foto de fondo" : "Upload background photo")}
                          <input type="file" accept="image/*" onChange={handleBackgroundPhoto} style={{ display: "none" }} />
                        </label>
                        {bg.photo && (
                          <button className="edit-btn" onClick={() => setBg({ photo: "" })} style={{ color: "#E5604D" }}>
                            {language === "es" ? "Quitar foto" : "Remove photo"}
                          </button>
                        )}
                        <p style={{ fontSize: 11, color: isLightMode ? "#7A8090" : "#8A8F99", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
                          {language === "es"
                            ? "Tip: para que el texto se lea bien, usa imágenes oscuras o con poco contraste."
                            : "Tip: for readable text, pick darker or low-contrast images."}
                        </p>
                      </div>
                    )}

                    {bg.type !== "default" && (
                      <button className="edit-btn" onClick={() => setBg({ type: "default" })} style={{ marginTop: 10, color: "#90C8FF" }}>
                        {language === "es" ? "Restaurar predeterminado" : "Reset to default"}
                      </button>
                    )}
                  </div>
                );
              })()}

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
              {text.customReminders}
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
                      {reminder.enabled ? text.reminderOn : text.reminderOff}
                    </button>
                    <button className="edit-btn" onClick={() => removeCustomReminder(reminder.id)}>
                      {text.removeBtn}
                    </button>
                  </div>
                </div>
              ))}

              <input
                className="input"
                value={reminderDraft.label}
                onChange={event => setReminderDraft(prev => ({ ...prev, label: event.target.value }))}
                placeholder={text.reminderTitlePlaceholder}
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
                placeholder={text.reminderMessagePlaceholder}
              />
              <select
                className="input"
                value={reminderDraft.sound}
                onChange={event => setReminderDraft(prev => ({ ...prev, sound: event.target.value }))}
              >
                {SOUND_OPTIONS.map(option => (
                  <option key={option} value={option}>{option} {language === "es" ? "tono" : "tone"}</option>
                ))}
              </select>
              <button className="primary-btn" onClick={addCustomReminder}>
                {text.addReminderBtn}
              </button>
              <button className="dark-btn" onClick={() => setShowReminders(false)}>
                {text.close}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAlbumModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              {text.newAlbumTitle}
            </p>
            <div className="settings-grid">
              <input
                className="input"
                value={albumDraft}
                onChange={event => setAlbumDraft(event.target.value)}
                onKeyDown={event => { if (event.key === "Enter") addPhotoAlbum(); }}
                placeholder={text.newAlbumPlaceholder}
                autoFocus
              />
              <button className="primary-btn" onClick={addPhotoAlbum}>{text.createBtn}</button>
              <button className="dark-btn" onClick={() => { setShowAlbumModal(false); setAlbumDraft(""); }}>
                {text.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {showPhotoModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              {text.addPhotoLabel}
            </p>
            <div className="settings-grid">
              <label style={{ display: "block" }}>
                <span className="field-label">{text.dateField}</span>
                <input className="input" type="date" value={photoDraft.date} onChange={event => setPhotoDraft(prev => ({ ...prev, date: event.target.value }))} />
              </label>
              <label style={{ display: "block" }}>
                <span className="field-label">{text.weightWord} ({weightUnit(unitSystem)})</span>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  value={photoDraft.weight}
                  onChange={event => setPhotoDraft(prev => ({ ...prev, weight: event.target.value }))}
                  placeholder={unitSystem === "metric"
                    ? String(Math.round(lbToKg(Number(profile.currentWeight) || 0) * 10) / 10)
                    : String(Math.round(Number(profile.currentWeight) || 0))}
                />
              </label>
              <label style={{ display: "block" }}>
                <span className="field-label">{text.noteField}</span>
                <input className="input" value={photoDraft.note} onChange={event => setPhotoDraft(prev => ({ ...prev, note: event.target.value }))} placeholder={language === "es" ? "¿Qué muestra esta foto?" : "What does this photo show?"} />
              </label>
              <label style={{ display: "block" }}>
                <span className="field-label">{text.albumField}</span>
                <select className="input" value={photoDraft.album} onChange={event => setPhotoDraft(prev => ({ ...prev, album: event.target.value }))}>
                  <option value="">{text.noAlbum}</option>
                  {photoAlbums.map(album => <option key={album} value={album}>{album}</option>)}
                </select>
              </label>
              <label className="dark-btn" style={{ textAlign: "center" }}>
                {photoDraft.dataUrl ? (language === "es" ? "Cambiar foto" : "Change photo") : text.choosePhoto}
                <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
              </label>
              {photoDraft.dataUrl && <img src={photoDraft.dataUrl} alt="Progress preview" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12, border: "1px solid #24242E", display: "block" }} />}
              <button
                className="primary-btn"
                onClick={saveProgressPhoto}
                disabled={!photoDraft.dataUrl}
                style={{ opacity: photoDraft.dataUrl ? 1 : 0.45 }}
              >
                {text.savePhoto}
              </button>
              <button
                className="dark-btn"
                onClick={() => {
                  setShowPhotoModal(false);
                  setPhotoDraft({ date: getDateKey(), note: "", dataUrl: "", album: "", weight: "" });
                }}
              >
                {text.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingExercise && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: theme.accent, fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              {text.editWeight}
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
                <option key={weight} value={weight}>{fmtExW(weight)}</option>
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
              {language === "es" ? "NOTAS DEL EJERCICIO" : "EXERCISE NOTES"}
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
                  <option key={option || "empty"} value={option}>{option || (language === "es" ? "Dolor / malestar" : "Pain / discomfort")}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingNote.difficulty}
                onChange={event => setEditingNote(prev => ({ ...prev, difficulty: event.target.value }))}
              >
                {RPE_OPTIONS.map(option => (
                  <option key={option || "empty"} value={option}>{option ? `RPE ${option}` : (language === "es" ? "Dificultad 1-10" : "Difficulty 1-10")}</option>
                ))}
              </select>

              <input
                className="input"
                value={editingNote.technique}
                onChange={event => setEditingNote(prev => ({ ...prev, technique: event.target.value }))}
                placeholder={language === "es" ? "Notas de técnica" : "Technique notes"}
              />

              <label style={{ display: "flex", alignItems: "center", gap: 10, color: "#FFFFFF", fontFamily: "'DM Sans', sans-serif", fontWeight: 800 }}>
                <input
                  type="checkbox"
                  checked={editingNote.pr}
                  onChange={event => setEditingNote(prev => ({ ...prev, pr: event.target.checked }))}
                />
                {language === "es" ? "Marcar como Récord" : "Mark as PR"}
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
              {language === "es" ? "RESPALDO / RESTAURAR" : "BACKUP / RESTORE"}
            </p>

            <p style={{ color: "#777", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
              {language === "es"
                ? "Exporta tus pesos, metas, checks, notas e historial de progreso a un archivo JSON. Importar restaura datos de un respaldo anterior."
                : "Export your weights, goals, checks, notes, and progress history to a JSON file. Import restores data from a previous backup."}
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              <button className="primary-btn" onClick={exportData}>
                {language === "es" ? "Exportar Progreso" : "Export Progress"}
              </button>

              <label className="dark-btn" style={{ textAlign: "center" }}>
                {language === "es" ? "Importar Respaldo" : "Import Backup"}
                <input
                  type="file"
                  accept="application/json"
                  onChange={importDataFile}
                  style={{ display: "none" }}
                />
              </label>

              <p style={{ color: "#FFD060", fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.5 }}>
                {language === "es"
                  ? "El sync en la nube envía tus datos al endpoint que ingreses, sin autenticación integrada. Usa solo un endpoint que controles. Descargar reemplaza tus datos actuales."
                  : "Cloud sync sends your data to the endpoint you enter, with no built-in authentication. Only use an endpoint you control and trust. Download replaces your current data."}
              </p>

              <input
                className="input"
                value={cloudSettings.endpoint}
                onChange={event => setCloudSettings(prev => ({ ...prev, endpoint: event.target.value }))}
                placeholder={language === "es" ? "URL del endpoint de sync" : "Cloud sync endpoint URL"}
              />

              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
                <button className="dark-btn" onClick={uploadCloudSync}>
                  {language === "es" ? "Subir a la nube" : "Cloud Upload"}
                </button>
                <button className="dark-btn" onClick={downloadCloudSync}>
                  {language === "es" ? "Bajar de la nube" : "Cloud Download"}
                </button>
              </div>

              <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
                {language === "es" ? "Estado:" : "Cloud status:"} {cloudSettings.status}
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
                  {text.manageWorkouts.toUpperCase()}
                </p>
                <p style={{ fontSize: 12, color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>
                  {text.manageWorkoutsSub}
                </p>
              </div>
              <button className="edit-btn" onClick={() => setEditingRoutine(null)} style={{ padding: "8px 12px" }}>
                {text.doneBtn}
              </button>
            </div>

            <p className="menu-section-label">{text.daySection}</p>
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

            <p className="menu-section-label">{text.sessionSection}</p>
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
                  <span className="field-label">{text.sessionNameField}</span>
                  <input
                    className="input"
                    value={routineSession?.name || ""}
                    onChange={event => updateRoutineSessionMeta({ name: event.target.value })}
                    placeholder={text.sessionNamePlaceholder}
                  />
                </label>
                <label style={{ display: "block" }}>
                  <span className="field-label">{text.timeField}</span>
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
                <button className="dark-btn" onClick={addRoutineSession}>{text.addSessionBtn}</button>
                <button className="dark-btn" onClick={duplicateRoutineSession}>{text.duplicateBtn}</button>
                <button
                  className="dark-btn"
                  onClick={removeRoutineSession}
                  disabled={routineDay.sessions.length <= 1}
                  style={routineDay.sessions.length <= 1 ? { opacity: 0.4 } : { color: "#E5604D" }}
                >
                  {text.deleteBtn}
                </button>
              </div>
            </div>

            <p className="menu-section-label">{text.mExercises}</p>
            <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
              {(routineSession?.exercises || []).length === 0 && (
                <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, padding: "10px 2px" }}>
                  {text.noExercisesYet}
                </p>
              )}
              {(routineSession?.exercises || []).map((exercise, exerciseIndex) => (
                <div key={`${exercise.name}-${exerciseIndex}`} style={{ border: "1px solid #24242E", borderRadius: 14, overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(144,200,255,0.05)", borderBottom: "1px solid #24242E" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: "#90C8FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 900, color: "#0A0A10", fontFamily: "'Orbitron', monospace", flexShrink: 0 }}>
                        {exerciseIndex + 1}
                      </div>
                      <span style={{ fontSize: 9, letterSpacing: 3, color: "#90C8FF", fontFamily: "'Orbitron', monospace", fontWeight: 700 }}>
                        {text.exerciseLabel}
                      </span>
                    </div>
                    <button className="edit-btn" onClick={() => removeRoutineExercise(exerciseIndex)} style={{ color: "#E5604D", fontSize: 11 }}>
                      {text.removeBtn}
                    </button>
                  </div>
                  <div style={{ padding: "10px 14px 14px" }}>
                    <input className="input" value={exercise.name} onChange={event => updateRoutineExercise(exerciseIndex, { name: event.target.value })} placeholder={text.exerciseNamePlaceholder} style={{ marginBottom: 10, fontWeight: 600 }} />
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8 }}>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.mSets}</p>
                        <select className="input" value={exercise.sets} onChange={event => updateRoutineExercise(exerciseIndex, { sets: event.target.value })}>
                          {SET_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.repsLabel}</p>
                        <select className="input" value={exercise.reps} onChange={event => updateRoutineExercise(exerciseIndex, { reps: event.target.value })}>
                          {Array.from(new Set([String(exercise.reps), ...REP_OPTIONS])).map(option => <option key={option} value={option}>{option}</option>)}
                        </select>
                      </div>
                      <div>
                        <p style={{ fontSize: 9, letterSpacing: 2, color: isLightMode ? "#7A8090" : "#555", fontFamily: "'Orbitron', monospace", marginBottom: 4 }}>{text.weightWord}</p>
                        <select className="input" value={exercise.weight} onChange={event => updateRoutineExercise(exerciseIndex, { weight: event.target.value })}>
                          {Array.from(new Set([exercise.weight, ...WEIGHT_OPTIONS])).map(option => <option key={option} value={option}>{fmtExW(option)}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="menu-section-label" style={{ marginTop: 16 }}>{text.addExerciseSection}</p>
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
                  {SET_OPTIONS.map(option => <option key={option} value={option}>{option} {text.setsWord}</option>)}
                </select>
                <select className="input" value={editingRoutine.draft.reps} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, reps: event.target.value } }))}>
                  {REP_OPTIONS.map(option => <option key={option} value={option}>{option} {text.repsWord}</option>)}
                </select>
                <select className="input" value={editingRoutine.draft.weight} onChange={event => setEditingRoutine(prev => ({ ...prev, draft: { ...prev.draft, weight: event.target.value } }))}>
                  {WEIGHT_OPTIONS.map(option => <option key={option} value={option}>{fmtExW(option)}</option>)}
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
              {text.editBodyStatus}
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

              <label style={{ display: "block" }}>
                <span className="field-label">{text.activityLevel.toUpperCase()}</span>
                <select
                  className="input"
                  value={ACTIVITY_LEVELS.includes(editingProfile.activityLevel) ? editingProfile.activityLevel : "auto"}
                  onChange={event => setEditingProfile(prev => ({ ...prev, activityLevel: event.target.value }))}
                >
                  <option value="auto">{language === "es" ? "Automático (según tu rutina)" : "Automatic (from your routine)"}</option>
                  {ACTIVITY_LEVELS.map(level => (
                    <option key={level} value={level}>
                      {text[`activity${level.charAt(0).toUpperCase()}${level.slice(1)}`]}
                    </option>
                  ))}
                </select>
              </label>

              <select
                className="input"
                value={editingProfile.currentWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, currentWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.currentWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{fmtW(option)} {language === "es" ? "actual" : "current"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.startWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, startWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.startWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{fmtW(option)} {language === "es" ? "inicio" : "start"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.targetWeight}
                onChange={event => setEditingProfile(prev => ({ ...prev, targetWeight: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.targetWeight, ...BODY_WEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{fmtW(option)} {language === "es" ? "meta" : "target"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingProfile.height}
                onChange={event => setEditingProfile(prev => ({ ...prev, height: event.target.value }))}
              >
                {Array.from(new Set([editingProfile.height, ...HEIGHT_OPTIONS])).map(option => (
                  <option key={option} value={option}>{fmtH(option)}</option>
                ))}
              </select>

              <input
                className="input"
                type="date"
                value={editingProfile.startDate}
                onChange={event => setEditingProfile(prev => ({ ...prev, startDate: event.target.value }))}
                placeholder={language === "es" ? "Fecha de inicio" : "Start date"}
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
                      { label: text.leanMassLabel, val: fmtW(editLean) },
                      { label: text.ibwLabel, val: fmtW(editIbw) },
                    ].map(item => (
                      <div key={item.label} style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 16, fontWeight: 900, color: "#FFFFFF", fontFamily: "'Orbitron', monospace" }}>{item.val}</p>
                        <p style={{ fontSize: 9, letterSpacing: 1, color: isLightMode ? "#7A8090" : "#666", fontFamily: "'Orbitron', monospace", marginTop: 3 }}>{item.label}</p>
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
              {text.setMyGoals}
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
                  <option key={option} value={option}>{option}% {language === "es" ? "meta semanal" : "weekly goal"}</option>
                ))}
              </select>

              <select
                className="input"
                value={editingGoals.weeklySessionsGoal}
                onChange={event => setEditingGoals(prev => ({ ...prev, weeklySessionsGoal: event.target.value }))}
              >
                {Array.from(new Set([editingGoals.weeklySessionsGoal, ...SESSION_GOAL_OPTIONS])).map(option => (
                  <option key={option} value={option}>{option} {text.sessionsWord}</option>
                ))}
              </select>

              <input
                className="input"
                type="date"
                value={editingGoals.targetDate}
                onChange={event => setEditingGoals(prev => ({ ...prev, targetDate: event.target.value }))}
                placeholder={language === "es" ? "Fecha meta" : "Target date"}
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

      {addFoodTarget && (() => {
        const query = foodSearch.trim().toLowerCase();
        const displayName = food => food.name || (language === "es" ? food.es : food.en);
        const mealLabels = { breakfast: text.breakfast, lunch: text.lunch, dinner: text.dinner, snack: text.snack };
        const allFoods = [...customFoods, ...FOOD_DB];
        const filtered = allFoods.filter(food => {
          if (!query) return true;
          return `${food.name || ""} ${food.en || ""} ${food.es || ""}`.toLowerCase().includes(query);
        }).slice(0, 40);
        return (
          <div className="modal-backdrop">
            <div className="modal">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 12, letterSpacing: 2, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                  {text.addFood.toUpperCase()} · {mealLabels[addFoodTarget].toUpperCase()}
                </p>
                <button className="edit-btn" onClick={() => setAddFoodTarget(null)} style={{ padding: "8px 12px" }}>{text.doneBtn}</button>
              </div>

              <input className="input" value={foodSearch} onChange={event => setFoodSearch(event.target.value)} placeholder={text.searchFood} style={{ marginBottom: 10 }} />

              {recentFoods.length > 0 && !query && (
                <div style={{ marginBottom: 12 }}>
                  <p className="menu-section-label">{text.recentFoods.toUpperCase()}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                    {recentFoods.slice(0, 8).map(food => (
                      <button key={food.id} className="album-chip" onClick={() => addFoodEntry(addFoodTarget, { ...food, qty: 1 })}>
                        + {food.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gap: 6, maxHeight: "34vh", overflow: "auto", marginBottom: 14 }}>
                {filtered.map((food, index) => {
                  const name = displayName(food);
                  return (
                    <button
                      key={food.id || `${name}-${index}`}
                      className="dark-btn"
                      onClick={() => addFoodEntry(addFoodTarget, { id: food.id, name, kcal: food.kcal, protein: food.protein, carbs: food.carbs, fat: food.fat, qty: 1 })}
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "center", textAlign: "left", gap: 10 }}
                    >
                      <span style={{ minWidth: 0 }}>
                        <span style={{ display: "block", fontWeight: 800, fontSize: 13 }}>{name}</span>
                        <span style={{ display: "block", fontSize: 11, color: "#8A8F99", marginTop: 2 }}>{food.serving || "1 serving"} · P{food.protein} C{food.carbs} F{food.fat}</span>
                      </span>
                      <span style={{ color: "#3FB98A", fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>{food.kcal}</span>
                    </button>
                  );
                })}
              </div>

              <p className="menu-section-label">{text.customFood.toUpperCase()}</p>
              <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
                <input className="input" value={customFoodDraft.name} onChange={event => setCustomFoodDraft(prev => ({ ...prev, name: event.target.value }))} placeholder={text.foodName} />
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {[["kcal", "kcal"], ["protein", "P"], ["carbs", "C"], ["fat", "F"]].map(([field, label]) => (
                    <input
                      key={field}
                      className="input"
                      type="number"
                      inputMode="numeric"
                      value={customFoodDraft[field]}
                      onChange={event => setCustomFoodDraft(prev => ({ ...prev, [field]: event.target.value }))}
                      placeholder={label}
                    />
                  ))}
                </div>
                <button className="primary-btn" onClick={addCustomFood}>{text.saveFood}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {editingMeasurements && (
        <div className="modal-backdrop">
          <div className="modal">
            <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
              {text.addMeasurement.toUpperCase()}
            </p>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ display: "block" }}>
                <span className="field-label">{text.dateField}</span>
                <input className="input" type="date" value={editingMeasurements.date} onChange={event => setEditingMeasurements(prev => ({ ...prev, date: event.target.value }))} />
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {MEASUREMENT_FIELDS.map(field => (
                  <label key={field} style={{ display: "block" }}>
                    <span className="field-label">{text[field].toUpperCase()} ({measureUnit(unitSystem)})</span>
                    <input
                      className="input"
                      type="number"
                      inputMode="decimal"
                      value={editingMeasurements[field] || ""}
                      onChange={event => setEditingMeasurements(prev => ({ ...prev, [field]: event.target.value }))}
                      placeholder="0"
                    />
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setEditingMeasurements(null)}>{text.cancel}</button>
              <button className="primary-btn" style={{ flex: 1 }} onClick={() => saveMeasurements(editingMeasurements)}>{text.save}</button>
            </div>
          </div>
        </div>
      )}

      {viewingPhoto && (() => {
        const viewIndex = progressPhotos.findIndex(photo => photo.id === viewingPhoto.id);
        const olderPhoto = viewIndex >= 0 && viewIndex < progressPhotos.length - 1 ? progressPhotos[viewIndex + 1] : null;
        const newerPhoto = viewIndex > 0 ? progressPhotos[viewIndex - 1] : null;
        return (
        <div className="modal-backdrop" onClick={() => setViewingPhoto(null)}>
          <div className="modal" onClick={event => event.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <p style={{ fontSize: 13, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
                {language === "es" ? "VER FOTO" : "VIEW PHOTO"}
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

            {(olderPhoto || newerPhoto) && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
                <button className="dark-btn" disabled={!olderPhoto} onClick={() => olderPhoto && setViewingPhoto(olderPhoto)} style={olderPhoto ? undefined : { opacity: 0.4 }}>
                  {text.photoPrev}
                </button>
                <button className="dark-btn" disabled={!newerPhoto} onClick={() => newerPhoto && setViewingPhoto(newerPhoto)} style={newerPhoto ? undefined : { opacity: 0.4 }}>
                  {text.photoNext}
                </button>
              </div>
            )}

            <div className="detail-grid" style={{ marginTop: 12 }}>
              <div className="detail-card"><p className="detail-label">{text.dateField}</p><p className="detail-value">{viewingPhoto.date}</p></div>
              <div className="detail-card"><p className="detail-label">{text.weightWord}</p><p className="detail-value">{fmtW(viewingPhoto.weight)}</p></div>
            </div>

            <div className="detail-card" style={{ marginTop: 10 }}>
              <p className="detail-label">{text.noteField}</p>
              <p className="detail-value" style={{ fontSize: 14 }}>{viewingPhoto.note || text.noNote}</p>
            </div>

            <label style={{ display: "block", marginTop: 10 }}>
              <span className="field-label">{text.albumField}</span>
              <select
                className="input"
                value={viewingPhoto.album || ""}
                onChange={event => updatePhotoAlbum(viewingPhoto.id, event.target.value)}
              >
                <option value="">{text.noAlbum}</option>
                {photoAlbums.map(album => <option key={album} value={album}>{album}</option>)}
              </select>
            </label>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button className="dark-btn" style={{ flex: 1 }} onClick={() => setViewingPhoto(null)}>
                {text.close}
              </button>
              <button className="dark-btn" style={{ flex: 1, color: "#E5604D" }} onClick={() => deleteProgressPhoto(viewingPhoto.id)}>
                {language === "es" ? "Eliminar Foto" : "Delete Photo"}
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}
