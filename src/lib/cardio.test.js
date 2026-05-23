import { describe, it, expect } from "vitest";
import {
  CARDIO_TYPES,
  cardioTypeInfo,
  cardioTypeLabel,
  estimateCardioCalories,
  formatPace,
} from "./cardio.js";

describe("cardioTypeInfo", () => {
  it("returns the matching type", () => {
    expect(cardioTypeInfo("run").met).toBe(9.8);
  });

  it("falls back to the first type for unknown ids", () => {
    expect(cardioTypeInfo("not-real")).toEqual(CARDIO_TYPES[0]);
  });
});

describe("cardioTypeLabel", () => {
  it("returns the Spanish label when language is es", () => {
    expect(cardioTypeLabel("run", "es")).toBe("Correr");
  });

  it("returns the English label otherwise", () => {
    expect(cardioTypeLabel("run", "en")).toBe("Run");
  });
});

describe("estimateCardioCalories", () => {
  it("scales linearly with duration", () => {
    const twenty = estimateCardioCalories("run", 20, 180);
    const forty = estimateCardioCalories("run", 40, 180);
    expect(forty).toBeGreaterThanOrEqual(twenty * 2 - 1);
    expect(forty).toBeLessThanOrEqual(twenty * 2 + 1);
  });

  it("returns 0 (or near zero) for zero duration", () => {
    expect(estimateCardioCalories("run", 0, 180)).toBe(0);
  });

  it("higher MET activities burn more calories", () => {
    expect(estimateCardioCalories("run", 30, 180)).toBeGreaterThan(
      estimateCardioCalories("walk", 30, 180)
    );
  });
});

describe("formatPace", () => {
  it("returns a placeholder when distance or duration is zero", () => {
    expect(formatPace(0, 30, "imperial")).toBe("--");
    expect(formatPace(3, 0, "imperial")).toBe("--");
  });

  it("includes the per-distance unit", () => {
    expect(formatPace(3, 24, "imperial")).toMatch(/mi/);
    expect(formatPace(3, 24, "metric")).toMatch(/km/);
  });
});
