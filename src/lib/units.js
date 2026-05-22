// Unit-system helpers. Imperial (pounds, inches, miles) is the canonical
// stored unit across the app; the functions here convert for display and
// parse user input back to the canonical unit. Switching the unit system
// never rewrites stored data.

const LB_PER_KG = 2.2046226218;
const CM_PER_IN = 2.54;
const KM_PER_MI = 1.609344;

export function lbToKg(lb) { return Number(lb) / LB_PER_KG; }
export function kgToLb(kg) { return Number(kg) * LB_PER_KG; }
export function inToCm(value) { return Number(value) * CM_PER_IN; }
export function cmToIn(value) { return Number(value) / CM_PER_IN; }
export function miToKm(value) { return Number(value) * KM_PER_MI; }
export function kmToMi(value) { return Number(value) / KM_PER_MI; }

export function isMetric(system) { return system === "metric"; }

// Renders a number with at most one decimal and no trailing ".0".
function fmtNum(value) {
  const rounded = Math.round(Number(value) * 10) / 10;
  return Number.isFinite(rounded) ? String(rounded) : "0";
}

function roundHalf(value) { return Math.round(Number(value) * 2) / 2; }

export function weightUnit(system) { return system === "metric" ? "KG" : "LB"; }
export function distanceUnit(system) { return system === "metric" ? "KM" : "MI"; }
export function measureUnit(system) { return system === "metric" ? "CM" : "IN"; }

// Body weight: pounds in -> "197 LB" / "89.5 KG".
export function formatWeight(lb, system) {
  const n = Number(lb) || 0;
  if (system === "metric") return `${fmtNum(roundHalf(lbToKg(n)))} KG`;
  return `${Math.round(n)} LB`;
}

// Signed weight delta (pounds in) -> "+5 LB" / "-2.5 KG".
export function formatWeightDelta(lb, system) {
  const converted = system === "metric"
    ? roundHalf(lbToKg(Number(lb) || 0))
    : Math.round(Number(lb) || 0);
  const sign = converted > 0 ? "+" : "";
  return `${sign}${fmtNum(converted)} ${weightUnit(system)}`;
}

// Parses a stored height ("5'9\"" or "175 cm") into inches.
export function parseHeightInches(heightStr) {
  if (!heightStr) return 0;
  const text = String(heightStr);
  const cm = text.match(/(\d+(?:\.\d+)?)\s*cm/i);
  if (cm) return cmToIn(Number(cm[1]));
  const ft = text.match(/(\d+)'(\d+)?/);
  if (ft) return Number(ft[1]) * 12 + Number(ft[2] || 0);
  const plain = text.match(/^\s*(\d+(?:\.\d+)?)\s*$/);
  if (plain) return Number(plain[1]);
  return 0;
}

// Height: stored feet'inches" string -> "5'9\"" / "175 CM".
export function formatHeight(heightStr, system) {
  if (system !== "metric") return heightStr || "";
  const inches = parseHeightInches(heightStr);
  if (!inches) return heightStr || "";
  return `${Math.round(inToCm(inches))} CM`;
}

// Exercise weight strings ("25 lb", "30-50 lb", "15 lb each") -> kg display.
export function formatExerciseWeight(weightStr, system) {
  if (system !== "metric" || !weightStr) return weightStr || "";
  return String(weightStr)
    .replace(/(\d+(?:\.\d+)?)/g, match => fmtNum(roundHalf(lbToKg(match))))
    .replace(/lb/gi, "kg");
}

// Distance: miles in -> "3.1 MI" / "5 KM".
export function formatDistance(mi, system) {
  const n = Number(mi) || 0;
  if (system === "metric") return `${fmtNum(miToKm(n))} KM`;
  return `${fmtNum(n)} MI`;
}

// Body measurements: inches in -> "15 IN" / "38 CM".
export function formatMeasure(inches, system) {
  const n = Number(inches) || 0;
  if (!n) return "--";
  if (system === "metric") return `${fmtNum(inToCm(n))} CM`;
  return `${fmtNum(n)} IN`;
}

// Converts a measurement value typed in the active unit back to inches.
export function measureInputToInches(value, system) {
  const n = Number(value) || 0;
  return system === "metric" ? cmToIn(n) : n;
}
// Converts a distance typed in the active unit back to miles.
export function distanceInputToMiles(value, system) {
  const n = Number(value) || 0;
  return system === "metric" ? kmToMi(n) : n;
}

// Picker options keep their canonical value; only the label is localized.
export function getBodyWeightOptions(system, baseOptions) {
  return baseOptions.map(value => ({ value, label: formatWeight(value, system) }));
}
export function getHeightOptions(system, baseOptions) {
  return baseOptions.map(value => ({ value, label: formatHeight(value, system) }));
}
export function getExerciseWeightOptions(system, baseOptions) {
  return baseOptions.map(value => ({ value, label: formatExerciseWeight(value, system) }));
}
