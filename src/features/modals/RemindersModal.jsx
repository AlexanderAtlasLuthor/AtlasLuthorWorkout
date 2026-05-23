export default function RemindersModal({
  text,
  t,
  notificationSettings,
  reminderDraft,
  setReminderDraft,
  updateCustomReminder,
  removeCustomReminder,
  addCustomReminder,
  setShowReminders,
  soundOptions,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.customReminders}
        </p>

        <div className="settings-grid">
          {(notificationSettings.customReminders || []).map(reminder => (
            <div key={reminder.id} className="setting-row">
              <div>
                <p className="setting-title">{reminder.label}</p>
                <p className="setting-sub">{reminder.time} - {reminder.message} - {reminder.sound}</p>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                <button className="edit-btn" onClick={() => updateCustomReminder(reminder.id, { enabled: !reminder.enabled })}>
                  {reminder.enabled ? text.reminderOn : text.reminderOff}
                </button>
                <button className="edit-btn" onClick={() => removeCustomReminder(reminder.id)}>
                  {text.removeBtn}
                </button>
              </div>
            </div>
          ))}

          <input
            className="input"
            value={reminderDraft.label}
            onChange={event => setReminderDraft(prev => ({ ...prev, label: event.target.value }))}
            placeholder={text.reminderTitlePlaceholder}
          />
          <input
            className="input"
            type="time"
            value={reminderDraft.time}
            onChange={event => setReminderDraft(prev => ({ ...prev, time: event.target.value }))}
          />
          <input
            className="input"
            value={reminderDraft.message}
            onChange={event => setReminderDraft(prev => ({ ...prev, message: event.target.value }))}
            placeholder={text.reminderMessagePlaceholder}
          />
          <select
            className="input"
            value={reminderDraft.sound}
            onChange={event => setReminderDraft(prev => ({ ...prev, sound: event.target.value }))}
          >
            {soundOptions.map(option => (
              <option key={option} value={option}>{option} {t("tono", "tone")}</option>
            ))}
          </select>
          <button className="primary-btn" onClick={addCustomReminder}>
            {text.addReminderBtn}
          </button>
          <button className="dark-btn" onClick={() => setShowReminders(false)}>
            {text.close}
          </button>
        </div>
      </div>
    </div>
  );
}
