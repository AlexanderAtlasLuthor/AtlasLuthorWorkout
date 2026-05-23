import { describe, it, expect } from "vitest";
import {
  ACHIEVEMENT_DEFS,
  computeAchievementStats,
  computeAchievements,
} from "./achievements.js";

describe("computeAchievementStats", () => {
  it("returns zero stats for an empty user", () => {
    const stats = computeAchievementStats({});
    expect(stats.completedDays).toBe(0);
    expect(stats.prCount).toBe(0);
    expect(stats.cardioSessions).toBe(0);
    expect(stats.photoCount).toBe(0);
    expect(stats.foodEntries).toBe(0);
    expect(stats.weeklyStreak).toBe(0);
    expect(stats.goalWeightReached).toBe(false);
  });

  it("counts completed and trained calendar days", () => {
    const calendarLog = {
      "2025-01-01": { status: "completed" },
      "2025-01-02": { status: "trained" },
      "2025-01-03": { status: "missed" },
      "2025-01-04": { status: "rest" },
    };
    expect(computeAchievementStats({ calendarLog }).completedDays).toBe(2);
  });

  it("counts only PR-flagged exercise notes", () => {
    const exerciseNotes = {
      "bench-press": { pr: true },
      "squat": { pr: false },
      "deadlift": {},
    };
    expect(computeAchievementStats({ exerciseNotes }).prCount).toBe(1);
  });

  it("sums cardio sessions across dates", () => {
    const cardioLog = {
      "2025-01-01": [{ durationMin: 30 }, { durationMin: 20 }],
      "2025-01-02": [{ durationMin: 25 }],
    };
    expect(computeAchievementStats({ cardioLog }).cardioSessions).toBe(3);
  });

  it("detects a met cutting goal", () => {
    const profile = { startWeight: 200, currentWeight: 175, targetWeight: 175 };
    expect(computeAchievementStats({ profile }).goalWeightReached).toBe(true);
  });

  it("detects a met bulking goal", () => {
    const profile = { startWeight: 150, currentWeight: 165, targetWeight: 160 };
    expect(computeAchievementStats({ profile }).goalWeightReached).toBe(true);
  });
});

describe("computeAchievements", () => {
  it("returns one entry per definition", () => {
    const result = computeAchievements({
      completedDays: 0,
      prCount: 0,
      cardioSessions: 0,
      photoCount: 0,
      foodEntries: 0,
      weeklyStreak: 0,
      goalWeightReached: false,
    });
    expect(result).toHaveLength(ACHIEVEMENT_DEFS.length);
  });

  it("marks an achievement earned when progress meets the target", () => {
    const result = computeAchievements({
      completedDays: 12,
      prCount: 0,
      cardioSessions: 0,
      photoCount: 0,
      foodEntries: 0,
      weeklyStreak: 0,
      goalWeightReached: false,
    });
    const tenWorkouts = result.find(a => a.id === "workouts-10");
    expect(tenWorkouts.earned).toBe(true);
    const hundredWorkouts = result.find(a => a.id === "workouts-100");
    expect(hundredWorkouts.earned).toBe(false);
  });
});
