// Cardio-activity helpers: MET-based calorie estimation and pace formatting.

const LB_PER_KG = 2.2046226218;

// Cardio activity types with approximate MET values (moderate effort).
export const CARDIO_TYPES = [
  { id: "run", met: 9.8, en: "Run", es: "Correr", distance: true },
  { id: "walk", met: 3.8, en: "Walk", es: "Caminar", distance: true },
  { id: "bike", met: 7.5, en: "Cycling", es: "Bicicleta", distance: true },
  { id: "row", met: 7.0, en: "Rowing", es: "Remo", distance: true },
  { id: "elliptical", met: 5.0, en: "Elliptical", es: "Elíptica", distance: false },
  { id: "stairs", met: 8.8, en: "Stair Climber", es: "Escaleras", distance: false },
  { id: "swim", met: 8.0, en: "Swimming", es: "Natación", distance: false },
  { id: "jumprope", met: 12.3, en: "Jump Rope", es: "Saltar Cuerda", distance: false },
  { id: "hiit", met: 8.0, en: "HIIT", es: "HIIT", distance: false },
];

export function cardioTypeInfo(id) {
  return CARDIO_TYPES.find(type => type.id === id) || CARDIO_TYPES[0];
}

export function cardioTypeLabel(id, language) {
  const info = cardioTypeInfo(id);
  return language === "es" ? info.es : info.en;
}

// kcal ~= MET * 3.5 * bodyMassKg / 200 * minutes.
export function estimateCardioCalories(typeId, durationMin, weightLb) {
  const met = cardioTypeInfo(typeId).met;
  const kg = (Number(weightLb) || 175) / LB_PER_KG;
  const minutes = Number(durationMin) || 0;
  return Math.round(((met * 3.5 * kg) / 200) * minutes);
}

// Pace per mile or per km from distance (miles) and duration (minutes).
export function formatPace(distanceMi, durationMin, system) {
  const distance = Number(distanceMi) || 0;
  const minutes = Number(durationMin) || 0;
  if (distance <= 0 || minutes <= 0) return "--";
  const perUnit = system === "metric"
    ? minutes / (distance * 1.609344)
    : minutes / distance;
  const wholeMinutes = Math.floor(perUnit);
  const seconds = Math.round((perUnit - wholeMinutes) * 60);
  const normalizedMinutes = seconds === 60 ? wholeMinutes + 1 : wholeMinutes;
  const normalizedSeconds = seconds === 60 ? 0 : seconds;
  const unit = system === "metric" ? "/km" : "/mi";
  return `${normalizedMinutes}:${String(normalizedSeconds).padStart(2, "0")} ${unit}`;
}
