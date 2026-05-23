export default function ChallengesPage({
  text,
  isLightMode,
  challenges,
  challengeDraft,
  setChallengeDraft,
  addChallenge,
  removeChallenge,
  computeChallengeProgress,
}) {
  const metricLabels = {
    workouts: text.challengeWorkouts,
    water: text.challengeWater,
    cardio: text.challengeCardio,
  };

  return (
    <div className="detail-list">
      <div className="home-card">
        <p className="detail-label">{text.newChallenge.toUpperCase()}</p>
        <div style={{ display: "grid", gap: 8, marginTop: 10 }}>
          <input className="input" value={challengeDraft.title} onChange={event => setChallengeDraft(prev => ({ ...prev, title: event.target.value }))} placeholder={text.challengeTitle} />
          <select className="input" value={challengeDraft.metric} onChange={event => setChallengeDraft(prev => ({ ...prev, metric: event.target.value }))}>
            <option value="workouts">{text.challengeWorkouts}</option>
            <option value="water">{text.challengeWater}</option>
            <option value="cardio">{text.challengeCardio}</option>
          </select>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <label style={{ display: "block" }}>
              <span className="field-label">{text.challengeTarget.toUpperCase()}</span>
              <input className="input" type="number" inputMode="numeric" value={challengeDraft.target} onChange={event => setChallengeDraft(prev => ({ ...prev, target: event.target.value }))} />
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">{text.challengeDays.toUpperCase()}</span>
              <input className="input" type="number" inputMode="numeric" value={challengeDraft.days} onChange={event => setChallengeDraft(prev => ({ ...prev, days: event.target.value }))} />
            </label>
          </div>
          <button className="primary-btn" onClick={addChallenge}>{text.createChallenge}</button>
        </div>
      </div>

      {challenges.length === 0 && (
        <p style={{ color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>{text.noChallenges}</p>
      )}
      {challenges.map(challenge => {
        const progress = computeChallengeProgress(challenge);
        const pct = challenge.target > 0 ? Math.min(100, Math.round((progress / challenge.target) * 100)) : 0;
        const done = progress >= challenge.target;
        return (
          <div key={challenge.id} className="home-card" style={{ borderColor: done ? "#3FB98A66" : undefined }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
              <div style={{ minWidth: 0 }}>
                <p className="detail-row-main">{challenge.title}</p>
                <p className="detail-row-sub">{metricLabels[challenge.metric]} · {challenge.startDate} - {challenge.endDate}</p>
              </div>
              <button className="edit-btn" onClick={() => removeChallenge(challenge.id)} style={{ color: "#E5604D", flexShrink: 0 }}>{text.removeBtn}</button>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: done ? "#3FB98A" : "#B8A0FF", borderRadius: 5, transition: "width 0.4s ease" }} />
            </div>
            <p style={{ marginTop: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", fontWeight: 800, color: done ? "#3FB98A" : "#8A8F99" }}>
              {progress} / {challenge.target} · {pct}%{done ? ` · ${text.challengeDone}` : ""}
            </p>
          </div>
        );
      })}
    </div>
  );
}
