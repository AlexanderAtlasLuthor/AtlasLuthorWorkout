export default function ViewPhotoModal({
  text,
  t,
  fmtW,
  viewingPhoto,
  setViewingPhoto,
  progressPhotos,
  photoAlbums,
  updatePhotoAlbum,
  deleteProgressPhoto,
}) {
  const viewIndex = progressPhotos.findIndex(photo => photo.id === viewingPhoto.id);
  const olderPhoto = viewIndex >= 0 && viewIndex < progressPhotos.length - 1 ? progressPhotos[viewIndex + 1] : null;
  const newerPhoto = viewIndex > 0 ? progressPhotos[viewIndex - 1] : null;

  return (
    <div className="modal-backdrop" onClick={() => setViewingPhoto(null)}>
      <div className="modal" onClick={event => event.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 13, letterSpacing: 3, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
            {t("VER FOTO", "VIEW PHOTO")}
          </p>
          <button className="edit-btn" onClick={() => setViewingPhoto(null)} style={{ padding: "8px 12px" }}>
            {text.close}
          </button>
        </div>

        <img
          src={viewingPhoto.dataUrl}
          alt={viewingPhoto.note || "Progress photo"}
          style={{ width: "100%", maxHeight: "52vh", objectFit: "contain", borderRadius: 12, border: "1px solid #24242E", background: "#050507", display: "block" }}
        />

        {(olderPhoto || newerPhoto) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
            <button className="dark-btn" disabled={!olderPhoto} onClick={() => olderPhoto && setViewingPhoto(olderPhoto)} style={olderPhoto ? undefined : { opacity: 0.4 }}>
              {text.photoPrev}
            </button>
            <button className="dark-btn" disabled={!newerPhoto} onClick={() => newerPhoto && setViewingPhoto(newerPhoto)} style={newerPhoto ? undefined : { opacity: 0.4 }}>
              {text.photoNext}
            </button>
          </div>
        )}

        <div className="detail-grid" style={{ marginTop: 12 }}>
          <div className="detail-card"><p className="detail-label">{text.dateField}</p><p className="detail-value">{viewingPhoto.date}</p></div>
          <div className="detail-card"><p className="detail-label">{text.weightWord}</p><p className="detail-value">{fmtW(viewingPhoto.weight)}</p></div>
        </div>

        <div className="detail-card" style={{ marginTop: 10 }}>
          <p className="detail-label">{text.noteField}</p>
          <p className="detail-value" style={{ fontSize: 14 }}>{viewingPhoto.note || text.noNote}</p>
        </div>

        <label style={{ display: "block", marginTop: 10 }}>
          <span className="field-label">{text.albumField}</span>
          <select
            className="input"
            value={viewingPhoto.album || ""}
            onChange={event => updatePhotoAlbum(viewingPhoto.id, event.target.value)}
          >
            <option value="">{text.noAlbum}</option>
            {photoAlbums.map(album => <option key={album} value={album}>{album}</option>)}
          </select>
        </label>

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button className="dark-btn" style={{ flex: 1 }} onClick={() => setViewingPhoto(null)}>
            {text.close}
          </button>
          <button className="dark-btn" style={{ flex: 1, color: "#E5604D" }} onClick={() => deleteProgressPhoto(viewingPhoto.id)}>
            {t("Eliminar Foto", "Delete Photo")}
          </button>
        </div>
      </div>
    </div>
  );
}
