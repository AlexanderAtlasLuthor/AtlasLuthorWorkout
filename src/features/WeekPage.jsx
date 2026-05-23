export default function WeekPage({
  text,
  days,
  workoutData,
  themeFor,
  displayDay,
  displayDayShort,
  openWorkout,
}) {
  return (
    <div className="detail-list">
      {days.map(dayName => {
        const currentDay = workoutData[dayName];
        const currentTheme = themeFor(currentDay.type);
        const dayExercises = currentDay.sessions.reduce((sum, currentSession) => sum + currentSession.exercises.length, 0);
        const daySets = currentDay.sessions.reduce(
          (sum, currentSession) => sum + currentSession.exercises.reduce((setSum, exercise) => setSum + Number(exercise.sets || 0), 0),
          0
        );

        return (
          <div key={`${dayName}-feature`} className="detail-row">
            <div>
              <p className="detail-row-main">{displayDayShort(dayName, currentDay.label)} - {displayDay(dayName)}</p>
              <p className="detail-row-sub">{currentDay.sessions.map(item => item.name).join(" / ")} - {dayExercises} {text.exercisesWord} - {daySets} {text.setsWord}</p>
            </div>
            <button className="edit-btn" onClick={() => openWorkout(dayName)} style={{ color: currentTheme.accent }}>
              {currentDay.type}
            </button>
          </div>
        );
      })}
    </div>
  );
}
