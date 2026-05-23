#!/usr/bin/env python3
"""One-shot swap of the inline workout JSX (lines 5082-5682) with a
WorkoutScreen component invocation."""
import sys

PATH = "src/AtlasLuthor.jsx"

with open(PATH) as f:
    lines = f.readlines()

START_MARKER = "        {activeUserId && screen === \"workout\" && (\n"
END_MARKER = "        )}\n"  # We need the FIRST matching )} after the start.

start_idx = None
for i, line in enumerate(lines):
    if line == START_MARKER:
        start_idx = i
        break

if start_idx is None:
    sys.exit("start marker not found")

# Look for the closing fragment of the workout block. The block ends with:
#   `          </>\n`  followed by `        )}\n`
end_idx = None
for j in range(start_idx + 1, len(lines)):
    if lines[j] == "          </>\n" and j + 1 < len(lines) and lines[j + 1] == END_MARKER:
        end_idx = j + 1  # inclusive index of the `)}` line
        break

if end_idx is None:
    sys.exit("end marker not found")

replacement = """        {activeUserId && screen === "workout" && (
          <WorkoutScreen
            text={text}
            t={t}
            language={language}
            isLightMode={isLightMode}
            days={days}
            themeFor={themeFor}
            displayDay={displayDay}
            displayDayShort={displayDayShort}
            fmtW={fmtW}
            fmtExW={fmtExW}
            formatTimer={formatTimer}
            workoutData={workoutData}
            activeDay={activeDay}
            setActiveDay={setActiveDay}
            activeSession={activeSession}
            setActiveSession={setActiveSession}
            todayOnlyMode={todayOnlyMode}
            setTodayOnlyMode={setTodayOnlyMode}
            setScreen={setScreen}
            expandedExerciseIndex={expandedExerciseIndex}
            setExpandedExerciseIndex={setExpandedExerciseIndex}
            highlightedExerciseIndex={highlightedExerciseIndex}
            setHighlightedExerciseIndex={setHighlightedExerciseIndex}
            checked={checked}
            exerciseNotes={exerciseNotes}
            setProgress={setProgress}
            exercisePerformance={exercisePerformance}
            cuesExerciseIndex={cuesExerciseIndex}
            setCuesExerciseIndex={setCuesExerciseIndex}
            setOneRMExerciseName={setOneRMExerciseName}
            quickMode={quickMode}
            setQuickMode={setQuickMode}
            quickExercise={quickExercise}
            quickExerciseIndex={quickExerciseIndex}
            quickExerciseKey={quickExerciseKey}
            quickNote={quickNote}
            quickSetsDone={quickSetsDone}
            quickTotalSets={quickTotalSets}
            quickSetsLeft={quickSetsLeft}
            restTimer={restTimer}
            restTimerRadius={restTimerRadius}
            restTimerCircumference={restTimerCircumference}
            restTimerOffset={restTimerOffset}
            restPresets={restPresets}
            restSecondsSetting={restSecondsSetting}
            startRestTimer={startRestTimer}
            stopRestTimer={stopRestTimer}
            setEditingRoutine={setEditingRoutine}
            setEditingNote={setEditingNote}
            setEditingCardio={setEditingCardio}
            setEditingExercise={setEditingExercise}
            updateSetCount={updateSetCount}
            toggleExercise={toggleExercise}
          />
        )}
"""

new_lines = lines[:start_idx] + [replacement] + lines[end_idx + 1:]
with open(PATH, "w") as f:
    f.writelines(new_lines)

print(f"Replaced lines {start_idx + 1}-{end_idx + 1} ({end_idx - start_idx + 1} lines) with WorkoutScreen invocation.")
