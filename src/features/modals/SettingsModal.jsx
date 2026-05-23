export default function SettingsModal({
  text,
  t,
  isLightMode,
  userName,
  appSettings,
  setAppSettings,
  handleAvatarPhoto,
  languageOptions,
  themeModeOptions,
  soundOptions,
  restSecondsSetting,
  formatTimer,
  notificationSettings,
  setNotificationSettings,
  requestNotifications,
  playReminderSound,
  setShowSettings,
  setShowReminders,
  setShowDataTools,
  handleLogout,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.settings.toUpperCase()}
        </p>

        <div className="settings-grid">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ width: 66, height: 66, borderRadius: 999, overflow: "hidden", border: "1.5px solid #2A2A34", background: "#101015", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {appSettings.avatar
                ? <img src={appSettings.avatar} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 24, color: isLightMode ? "#7A8090" : "#888" }}>{userName.slice(0, 1).toUpperCase()}</span>}
            </div>
            <div style={{ display: "grid", gap: 8, flex: 1, minWidth: 0 }}>
              <label className="dark-btn" style={{ textAlign: "center" }}>
                {appSettings.avatar
                  ? t("Cambiar foto de perfil", "Change Profile Photo")
                  : t("Agregar foto de perfil", "Add Profile Photo")}
                <input type="file" accept="image/*" onChange={handleAvatarPhoto} style={{ display: "none" }} />
              </label>
              {appSettings.avatar && (
                <button className="edit-btn" onClick={() => setAppSettings(prev => ({ ...prev, avatar: "" }))}>
                  {t("Quitar foto", "Remove Photo")}
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <label style={{ display: "block" }}>
              <span className="field-label">{t("NOMBRE", "FIRST NAME")}</span>
              <input
                className="input"
                value={appSettings.firstName}
                onChange={event => setAppSettings(prev => ({ ...prev, firstName: event.target.value }))}
                placeholder={t("Nombre", "First name")}
              />
            </label>
            <label style={{ display: "block" }}>
              <span className="field-label">{t("APELLIDO", "LAST NAME")}</span>
              <input
                className="input"
                value={appSettings.lastName}
                onChange={event => setAppSettings(prev => ({ ...prev, lastName: event.target.value }))}
                placeholder={t("Apellido", "Last name")}
              />
            </label>
          </div>
          <select
            className="input"
            value={appSettings.language}
            onChange={event => setAppSettings(prev => ({ ...prev, language: event.target.value }))}
          >
            {languageOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <select
            className="input"
            value={appSettings.themeMode}
            onChange={event => setAppSettings(prev => ({ ...prev, themeMode: event.target.value }))}
          >
            {themeModeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <p className="setting-sub">{text.lightStarts}</p>

          <label style={{ display: "block" }}>
            <span className="field-label">{text.unitSystem.toUpperCase()}</span>
            <select
              className="input"
              value={appSettings.unitSystem || "imperial"}
              onChange={event => setAppSettings(prev => ({ ...prev, unitSystem: event.target.value }))}
            >
              <option value="imperial">{text.imperial}</option>
              <option value="metric">{text.metric}</option>
            </select>
          </label>
          <p className="setting-sub">{text.unitSystemSub}</p>

          <label style={{ display: "block" }}>
            <span className="field-label">{text.restTimer}</span>
            <select
              className="input"
              value={restSecondsSetting}
              onChange={event => setAppSettings(prev => ({ ...prev, restSeconds: Number(event.target.value) }))}
            >
              {[30, 45, 60, 75, 90, 105, 120, 150, 180].map(seconds => (
                <option key={seconds} value={seconds}>{seconds}s ({formatTimer(seconds)})</option>
              ))}
            </select>
          </label>
          <p className="setting-sub">{text.restTimerSub}</p>

          <div className="setting-row">
            <div>
              <p className="setting-title">{t("Notificaciones", "Notifications")}</p>
              <p className="setting-sub">
                {notificationSettings.enabled
                  ? t("Activadas", "Enabled")
                  : t("Permiso no activado", "Permission not enabled")}
              </p>
            </div>
            <button className="dark-btn" onClick={requestNotifications}>
              {t("Activar", "Enable")}
            </button>
          </div>
          <p className="setting-sub">
            {t("Los recordatorios solo se disparan mientras la app está abierta. Una notificación en segundo plano necesitaría un servidor de push.", "Reminders only fire while the app is open. Background notifications would need a push server.")}
          </p>

          <input
            className="input"
            type="time"
            value={notificationSettings.workoutTime}
            onChange={event => setNotificationSettings(prev => ({ ...prev, workoutTime: event.target.value, lastWorkoutNotice: "" }))}
          />
          <input
            className="input"
            value={notificationSettings.workoutMessage}
            onChange={event => setNotificationSettings(prev => ({ ...prev, workoutMessage: event.target.value }))}
            placeholder={t("Mensaje de notificación de entreno", "Workout notification message")}
          />
          <input
            className="input"
            type="time"
            value={notificationSettings.restTime}
            onChange={event => setNotificationSettings(prev => ({ ...prev, restTime: event.target.value, lastRestNotice: "" }))}
          />
          <input
            className="input"
            value={notificationSettings.restMessage}
            onChange={event => setNotificationSettings(prev => ({ ...prev, restMessage: event.target.value }))}
            placeholder={t("Mensaje de notificación de descanso", "Recovery notification message")}
          />
          <select
            className="input"
            value={notificationSettings.sound}
            onChange={event => setNotificationSettings(prev => ({ ...prev, sound: event.target.value }))}
          >
            {soundOptions.map(option => (
              <option key={option} value={option}>{option} {t("tono", "tone")}</option>
            ))}
          </select>

          <button className="dark-btn" onClick={() => playReminderSound(notificationSettings.sound)}>
            {t("Probar tono", "Test Tone")}
          </button>

          <div className="setting-row">
            <div>
              <p className="setting-title">{t("Respuesta al tocar", "Tap feedback")}</p>
              <p className="setting-sub">
                {t("Sonido y vibración al tocar un control.", "Click sound and vibration when you tap a control.")}
              </p>
            </div>
            <button
              className="dark-btn"
              onClick={() => setAppSettings(prev => ({ ...prev, tapFeedback: prev.tapFeedback === false }))}
            >
              {appSettings.tapFeedback === false ? t("No", "Off") : t("Sí", "On")}
            </button>
          </div>

          <button className="dark-btn" onClick={() => {
            setShowSettings(false);
            setShowReminders(true);
          }}>
            {t("Recordatorios personalizados", "Custom Reminders")}
          </button>
          <button className="dark-btn" onClick={() => {
            setShowSettings(false);
            setShowDataTools(true);
          }}>
            {t("Respaldo / Sincronización", "Backup / Cloud Sync")}
          </button>
          <button className="dark-btn" onClick={handleLogout}>
            {text.logout}
          </button>
          <button className="dark-btn" onClick={() => setShowSettings(false)}>
            {text.close}
          </button>
        </div>
      </div>
    </div>
  );
}
