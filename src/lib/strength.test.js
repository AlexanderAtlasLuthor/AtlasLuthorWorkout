import { describe, it, expect } from "vitest";
import {
  parseWeightNumber,
  parseRepsNumber,
  epley1RM,
  brzycki1RM,
  estimate1RM,
  estimate1RMFromExercise,
  exerciseVolume,
  isNewPR,
} from "./strength.js";

describe("parseWeightNumber", () => {
  it("extracts the heaviest number from a weight string", () => {
    expect(parseWeightNumber("30-50 lb")).toBe(50);
    expect(parseWeightNumber("100 lb")).toBe(100);
  });

  it("accepts numeric input", () => {
    expect(parseWeightNumber(85)).toBe(85);
  });

  it("returns 0 for empty or invalid input", () => {
    expect(parseWeightNumber("")).toBe(0);
    expect(parseWeightNumber(null)).toBe(0);
    expect(parseWeightNumber("BW")).toBe(0);
  });
});

describe("parseRepsNumber", () => {
  it("extracts the first numeric token", () => {
    expect(parseRepsNumber("3x3")).toBe(3);
    expect(parseRepsNumber("8")).toBe(8);
  });

  it("accepts numeric input", () => {
    expect(parseRepsNumber(10)).toBe(10);
  });

  it("returns 0 for non-numeric inputs", () => {
    expect(parseRepsNumber("AMRAP")).toBe(0);
    expect(parseRepsNumber("")).toBe(0);
  });
});

describe("1RM formulas", () => {
  it("epley1RM and brzycki1RM return weight when reps == 1", () => {
    expect(epley1RM(225, 1)).toBe(225);
    expect(brzycki1RM(225, 1)).toBe(225);
  });

  it("estimate1RM returns 0 for invalid input", () => {
    expect(estimate1RM(0, 5)).toBe(0);
    expect(estimate1RM(200, 0)).toBe(0);
  });

  it("estimate1RM produces a higher value than the working weight for reps > 1", () => {
    const oneRM = estimate1RM(200, 5);
    expect(oneRM).toBeGreaterThan(200);
  });

  it("estimate1RMFromExercise parses string inputs", () => {
    expect(estimate1RMFromExercise("200 lb", "5")).toBeGreaterThan(200);
  });
});

describe("exerciseVolume", () => {
  it("multiplies sets * reps * weight", () => {
    expect(exerciseVolume(3, "10", "100 lb")).toBe(3 * 10 * 100);
  });

  it("returns 0 if any input is missing", () => {
    expect(exerciseVolume(0, 10, 100)).toBe(0);
    expect(exerciseVolume(3, "", 100)).toBe(0);
  });
});

describe("isNewPR", () => {
  it("returns false on the first lift (no baseline)", () => {
    expect(isNewPR(200, null)).toBe(false);
    expect(isNewPR(200, {})).toBe(false);
  });

  it("returns false when the candidate is not above the best", () => {
    expect(isNewPR(200, { best1RM: 200 })).toBe(false);
    expect(isNewPR(199, { best1RM: 200 })).toBe(false);
  });

  it("returns true when the candidate beats the best by more than 0.5", () => {
    expect(isNewPR(205, { best1RM: 200 })).toBe(true);
  });

  it("returns false for zero or negative candidates", () => {
    expect(isNewPR(0, { best1RM: 200 })).toBe(false);
    expect(isNewPR(-5, { best1RM: 200 })).toBe(false);
  });
});
