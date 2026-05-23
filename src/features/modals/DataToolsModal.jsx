export default function DataToolsModal({
  text,
  t,
  isLightMode,
  cloudSettings,
  setCloudSettings,
  exportData,
  importDataFile,
  uploadCloudSync,
  downloadCloudSync,
  setShowDataTools,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {t("RESPALDO / RESTAURAR", "BACKUP / RESTORE")}
        </p>

        <p style={{ color: "#777", fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.5, marginBottom: 14 }}>
          {t("Exporta tus pesos, metas, checks, notas e historial de progreso a un archivo JSON. Importar restaura datos de un respaldo anterior.", "Export your weights, goals, checks, notes, and progress history to a JSON file. Import restores data from a previous backup.")}
        </p>

        <div style={{ display: "grid", gap: 10 }}>
          <button className="primary-btn" onClick={exportData}>
            {t("Exportar Progreso", "Export Progress")}
          </button>

          <label className="dark-btn" style={{ textAlign: "center" }}>
            {t("Importar Respaldo", "Import Backup")}
            <input
              type="file"
              accept="application/json"
              onChange={importDataFile}
              style={{ display: "none" }}
            />
          </label>

          <p style={{ color: "#FFD060", fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.5 }}>
            {t("El sync en la nube envía tus datos al endpoint que ingreses, sin autenticación integrada. Usa solo un endpoint que controles. Descargar reemplaza tus datos actuales.", "Cloud sync sends your data to the endpoint you enter, with no built-in authentication. Only use an endpoint you control and trust. Download replaces your current data.")}
          </p>

          <input
            className="input"
            value={cloudSettings.endpoint}
            onChange={event => setCloudSettings(prev => ({ ...prev, endpoint: event.target.value }))}
            placeholder={t("URL del endpoint de sync", "Cloud sync endpoint URL")}
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
            <button className="dark-btn" onClick={uploadCloudSync}>
              {t("Subir a la nube", "Cloud Upload")}
            </button>
            <button className="dark-btn" onClick={downloadCloudSync}>
              {t("Bajar de la nube", "Cloud Download")}
            </button>
          </div>

          <p style={{ color: isLightMode ? "#7A8090" : "#666", fontFamily: "'DM Sans', sans-serif", fontSize: 12 }}>
            {t("Estado:", "Cloud status:")} {cloudSettings.status}
          </p>

          <button className="dark-btn" onClick={() => setShowDataTools(false)}>
            {text.close}
          </button>
        </div>
      </div>
    </div>
  );
}
