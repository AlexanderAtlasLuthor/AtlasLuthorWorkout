import { describe, it, expect } from "vitest";
import {
  calcBMR,
  calcTDEE,
  goalCalorieTarget,
  macroSplit,
  sumDayMacros,
  FOOD_DB,
} from "./nutrition.js";

describe("calcBMR", () => {
  it("returns 0 with missing weight or height", () => {
    expect(calcBMR({})).toBe(0);
    expect(calcBMR({ weightLb: 0, heightInches: 70, age: 30, sex: "male" })).toBe(0);
    expect(calcBMR({ weightLb: 180, heightInches: 0, age: 30, sex: "male" })).toBe(0);
  });

  it("falls in a plausible range for a typical adult male", () => {
    const bmr = calcBMR({ weightLb: 180, heightInches: 70, age: 30, sex: "male" });
    expect(bmr).toBeGreaterThan(1500);
    expect(bmr).toBeLessThan(2200);
  });

  it("produces a lower BMR for females than males with identical inputs", () => {
    const male = calcBMR({ weightLb: 180, heightInches: 70, age: 30, sex: "male" });
    const female = calcBMR({ weightLb: 180, heightInches: 70, age: 30, sex: "female" });
    expect(female).toBeLessThan(male);
  });
});

describe("calcTDEE", () => {
  it("returns higher TDEE for higher activity levels", () => {
    expect(calcTDEE(2000, "athlete")).toBeGreaterThan(calcTDEE(2000, "sedentary"));
  });

  it("falls back to moderate for unknown activity levels", () => {
    const unknown = calcTDEE(2000, "made-up");
    const moderate = calcTDEE(2000, "moderate");
    expect(unknown).toBe(moderate);
  });
});

describe("goalCalorieTarget", () => {
  it("returns 0 when TDEE is 0", () => {
    expect(goalCalorieTarget(0, "lean")).toBe(0);
  });

  it("subtracts calories for lean, adds for muscular", () => {
    const tdee = 2500;
    expect(goalCalorieTarget(tdee, "lean")).toBe(tdee - 400);
    expect(goalCalorieTarget(tdee, "muscular")).toBe(tdee + 350);
    expect(goalCalorieTarget(tdee, "athletic")).toBe(tdee - 150);
  });
});

describe("macroSplit", () => {
  it("returns positive macros for a positive calorie target", () => {
    const macros = macroSplit(2500, "athletic");
    expect(macros.protein).toBeGreaterThan(0);
    expect(macros.carbs).toBeGreaterThan(0);
    expect(macros.fat).toBeGreaterThan(0);
  });

  it("returns zero macros when calories are zero", () => {
    const macros = macroSplit(0, "athletic");
    expect(macros).toEqual({ protein: 0, carbs: 0, fat: 0 });
  });

  it("gives more protein for lean than muscular at equal calories", () => {
    const lean = macroSplit(2500, "lean");
    const muscular = macroSplit(2500, "muscular");
    expect(lean.protein).toBeGreaterThan(muscular.protein);
  });
});

describe("sumDayMacros", () => {
  it("returns zeros for an empty day", () => {
    expect(sumDayMacros(null)).toEqual({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
    expect(sumDayMacros({})).toEqual({ kcal: 0, protein: 0, carbs: 0, fat: 0 });
  });

  it("sums totals across meals and respects quantity", () => {
    const log = {
      breakfast: [{ kcal: 200, protein: 20, carbs: 10, fat: 5, qty: 2 }],
      lunch: [{ kcal: 500, protein: 30, carbs: 50, fat: 15 }],
    };
    const totals = sumDayMacros(log);
    expect(totals.kcal).toBe(200 * 2 + 500);
    expect(totals.protein).toBe(20 * 2 + 30);
  });
});

describe("FOOD_DB", () => {
  it("contains a reasonable number of unique items", () => {
    expect(FOOD_DB.length).toBeGreaterThan(100);
    const ids = new Set(FOOD_DB.map(item => item.id));
    expect(ids.size).toBe(FOOD_DB.length);
  });

  it("every entry has the expected nutrition fields", () => {
    FOOD_DB.forEach(item => {
      expect(item).toHaveProperty("en");
      expect(item).toHaveProperty("es");
      expect(item).toHaveProperty("serving");
      expect(typeof item.kcal).toBe("number");
      expect(typeof item.protein).toBe("number");
      expect(typeof item.carbs).toBe("number");
      expect(typeof item.fat).toBe("number");
    });
  });
});
