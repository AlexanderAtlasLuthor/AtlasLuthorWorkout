// Body-composition helpers. The US Navy circumference method gives a
// measurement-based body-fat estimate as an alternative to the BMI estimate.

// Circumference measurements tracked over time. Hips is only required for
// the female Navy formula but is useful to log for everyone.
export const MEASUREMENT_FIELDS = ["neck", "chest", "waist", "hips", "arms", "thighs", "calves"];

// US Navy body-fat %. All circumference inputs are in inches.
export function navyBodyFat({ sex, heightIn, neckIn, waistIn, hipIn }) {
  const height = Number(heightIn) || 0;
  const neck = Number(neckIn) || 0;
  const waist = Number(waistIn) || 0;
  const hip = Number(hipIn) || 0;

  if (!height || !neck || !waist) return 0;

  let bodyFat;
  if (sex === "female") {
    if (!hip) return 0;
    const inner = waist + hip - neck;
    if (inner <= 0) return 0;
    bodyFat = 163.205 * Math.log10(inner) - 97.684 * Math.log10(height) - 78.387;
  } else {
    const inner = waist - neck;
    if (inner <= 0) return 0;
    bodyFat = 86.010 * Math.log10(inner) - 70.041 * Math.log10(height) + 36.76;
  }

  if (!Number.isFinite(bodyFat)) return 0;
  return Math.max(3, Math.min(60, Math.round(bodyFat * 10) / 10));
}
