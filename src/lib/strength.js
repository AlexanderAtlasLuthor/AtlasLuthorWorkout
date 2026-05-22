// Strength-analysis helpers: 1RM estimation, PR detection and volume math.

// Pulls the heaviest numeric token from a weight string ("30-50 lb" -> 50).
export function parseWeightNumber(weightStr) {
  if (typeof weightStr === "number") return weightStr;
  if (!weightStr) return 0;
  const nums = String(weightStr).match(/\d+(?:\.\d+)?/g);
  if (!nums) return 0;
  return Math.max(...nums.map(Number));
}

// Pulls a usable rep count ("3x3" -> 3, "AMRAP" -> 0, 8 -> 8).
export function parseRepsNumber(reps) {
  if (typeof reps === "number") return reps;
  if (!reps) return 0;
  const match = String(reps).match(/\d+/);
  return match ? Number(match[0]) : 0;
}

export function epley1RM(weight, reps) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (w <= 0 || r <= 0) return 0;
  return r === 1 ? w : w * (1 + r / 30);
}

export function brzycki1RM(weight, reps) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (w <= 0 || r <= 0 || r >= 37) return 0;
  return r === 1 ? w : (w * 36) / (37 - r);
}

// Averages Epley and Brzycki for a steadier estimate, rounded to a pound.
export function estimate1RM(weight, reps) {
  const e = epley1RM(weight, reps);
  const b = brzycki1RM(weight, reps);
  if (!e && !b) return 0;
  if (!b) return Math.round(e);
  if (!e) return Math.round(b);
  return Math.round((e + b) / 2);
}

// Estimated 1RM straight from an exercise's programmed weight/reps strings.
export function estimate1RMFromExercise(weightStr, reps) {
  return estimate1RM(parseWeightNumber(weightStr), parseRepsNumber(reps));
}

// Training volume for one exercise = sets * reps * weight.
export function exerciseVolume(sets, reps, weightStr) {
  return (Number(sets) || 0) * parseRepsNumber(reps) * parseWeightNumber(weightStr);
}

// True when a candidate lift beats the stored best 1RM for an exercise.
export function isNewPR(candidate1RM, performanceRecord) {
  if (!candidate1RM || candidate1RM <= 0) return false;
  if (!performanceRecord || !performanceRecord.best1RM) return true;
  return candidate1RM > performanceRecord.best1RM + 0.5;
}
