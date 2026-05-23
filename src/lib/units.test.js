import { describe, it, expect } from "vitest";
import {
  lbToKg,
  kgToLb,
  inToCm,
  cmToIn,
  miToKm,
  kmToMi,
  weightUnit,
  distanceUnit,
  measureUnit,
  parseHeightInches,
  measureInputToInches,
  distanceInputToMiles,
  formatWeight,
  formatHeight,
  formatDistance,
  formatMeasure,
} from "./units.js";

describe("unit conversions", () => {
  it("round-trips lb <-> kg", () => {
    expect(Math.round(lbToKg(220) * 10) / 10).toBe(99.8);
    expect(Math.round(kgToLb(100) * 10) / 10).toBe(220.5);
  });

  it("round-trips in <-> cm", () => {
    expect(Math.round(inToCm(10))).toBe(25);
    expect(Math.round(cmToIn(100))).toBe(39);
  });

  it("round-trips mi <-> km", () => {
    expect(Math.round(miToKm(5) * 10) / 10).toBe(8);
    expect(Math.round(kmToMi(10) * 10) / 10).toBe(6.2);
  });

  it("returns the correct unit labels per system", () => {
    expect(weightUnit("metric")).toBe("KG");
    expect(weightUnit("imperial")).toBe("LB");
    expect(distanceUnit("metric")).toBe("KM");
    expect(distanceUnit("imperial")).toBe("MI");
    expect(measureUnit("metric")).toBe("CM");
    expect(measureUnit("imperial")).toBe("IN");
  });
});

describe("height parsing and formatting", () => {
  it("parses imperial height strings to inches", () => {
    expect(parseHeightInches("5'9\"")).toBe(69);
    expect(parseHeightInches("6'0\"")).toBe(72);
  });

  it("returns 0 for empty height", () => {
    expect(parseHeightInches("")).toBe(0);
    expect(parseHeightInches(null)).toBe(0);
  });

  it("formats heights for the selected system", () => {
    expect(formatHeight("5'9\"", "imperial")).toBe("5'9\"");
    expect(formatHeight("5'9\"", "metric")).toMatch(/CM$/i);
  });
});

describe("input conversion helpers", () => {
  it("converts measure input to inches", () => {
    expect(measureInputToInches("30", "imperial")).toBe(30);
    expect(Math.round(measureInputToInches("76.2", "metric"))).toBe(30);
  });

  it("converts distance input to miles", () => {
    expect(distanceInputToMiles("5", "imperial")).toBe(5);
    expect(Math.round(distanceInputToMiles("8.05", "metric") * 10) / 10).toBe(5);
  });
});

describe("formatters", () => {
  it("formatWeight respects the selected system", () => {
    expect(formatWeight(220, "imperial")).toMatch(/220.*LB/);
    expect(formatWeight(220, "metric")).toMatch(/KG/);
  });

  it("formatDistance respects the selected system", () => {
    expect(formatDistance(5, "imperial")).toMatch(/MI/);
    expect(formatDistance(5, "metric")).toMatch(/KM/);
  });

  it("formatMeasure respects the selected system", () => {
    expect(formatMeasure(30, "imperial")).toMatch(/IN/);
    expect(formatMeasure(30, "metric")).toMatch(/CM/);
  });
});
