import { weightUnit, lbToKg } from "../../lib/units.js";

export default function PhotoModal({
  text,
  t,
  unitSystem,
  profile,
  photoDraft,
  setPhotoDraft,
  photoAlbums,
  handleProgressPhoto,
  saveProgressPhoto,
  setShowPhotoModal,
  getDateKey,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.addPhotoLabel}
        </p>
        <div className="settings-grid">
          <label style={{ display: "block" }}>
            <span className="field-label">{text.dateField}</span>
            <input className="input" type="date" value={photoDraft.date} onChange={event => setPhotoDraft(prev => ({ ...prev, date: event.target.value }))} />
          </label>
          <label style={{ display: "block" }}>
            <span className="field-label">{text.weightWord} ({weightUnit(unitSystem)})</span>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              value={photoDraft.weight}
              onChange={event => setPhotoDraft(prev => ({ ...prev, weight: event.target.value }))}
              placeholder={unitSystem === "metric"
                ? String(Math.round(lbToKg(Number(profile.currentWeight) || 0) * 10) / 10)
                : String(Math.round(Number(profile.currentWeight) || 0))}
            />
          </label>
          <label style={{ display: "block" }}>
            <span className="field-label">{text.noteField}</span>
            <input className="input" value={photoDraft.note} onChange={event => setPhotoDraft(prev => ({ ...prev, note: event.target.value }))} placeholder={t("¿Qué muestra esta foto?", "What does this photo show?")} />
          </label>
          <label style={{ display: "block" }}>
            <span className="field-label">{text.albumField}</span>
            <select className="input" value={photoDraft.album} onChange={event => setPhotoDraft(prev => ({ ...prev, album: event.target.value }))}>
              <option value="">{text.noAlbum}</option>
              {photoAlbums.map(album => <option key={album} value={album}>{album}</option>)}
            </select>
          </label>
          <label className="dark-btn" style={{ textAlign: "center" }}>
            {photoDraft.dataUrl ? t("Cambiar foto", "Change photo") : text.choosePhoto}
            <input type="file" accept="image/*" onChange={handleProgressPhoto} style={{ display: "none" }} />
          </label>
          {photoDraft.dataUrl && <img src={photoDraft.dataUrl} alt="Progress preview" style={{ width: "100%", maxHeight: 260, objectFit: "cover", borderRadius: 12, border: "1px solid #24242E", display: "block" }} />}
          <button
            className="primary-btn"
            onClick={saveProgressPhoto}
            disabled={!photoDraft.dataUrl}
            style={{ opacity: photoDraft.dataUrl ? 1 : 0.45 }}
          >
            {text.savePhoto}
          </button>
          <button
            className="dark-btn"
            onClick={() => {
              setShowPhotoModal(false);
              setPhotoDraft({ date: getDateKey(), note: "", dataUrl: "", album: "", weight: "" });
            }}
          >
            {text.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
