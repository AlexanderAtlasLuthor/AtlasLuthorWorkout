export default function PhotosPage({
  text,
  t,
  isLightMode,
  fmtW,
  fmtWDelta,
  toNumber,
  getDateKey,
  progressPhotos,
  photoAlbums,
  totalPhotoCount,
  compareAId,
  compareBId,
  comparePos,
  setCompareAId,
  setCompareBId,
  setComparePos,
  albumFilter,
  setAlbumFilter,
  removePhotoAlbum,
  setAlbumDraft,
  setShowAlbumModal,
  setPhotoDraft,
  setShowPhotoModal,
  setViewingPhoto,
}) {
  const photosByDate = [...progressPhotos].sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  const cmpA = progressPhotos.find(p => p.id === compareAId) || photosByDate[0];
  const cmpB = progressPhotos.find(p => p.id === compareBId) || photosByDate[photosByDate.length - 1];
  const cmpDelta = cmpA && cmpB ? Math.round((toNumber(cmpB.weight) - toNumber(cmpA.weight)) * 10) / 10 : 0;
  const updateComparePos = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width) return;
    const pos = ((event.clientX - rect.left) / rect.width) * 100;
    setComparePos(Math.max(0, Math.min(100, pos)));
  };

  const shownPhotos = albumFilter ? progressPhotos.filter(photo => photo.album === albumFilter) : progressPhotos;

  return (
    <div className="detail-list">
      <div className="detail-grid">
        <div className="detail-card"><p className="detail-label">{text.photosLabel}</p><p className="detail-value" style={{ color: "#90C8FF" }}>{totalPhotoCount}</p></div>
        <div className="detail-card"><p className="detail-label">{text.albumsLabel}</p><p className="detail-value" style={{ color: "#B8A0FF" }}>{photoAlbums.length}</p></div>
      </div>

      {progressPhotos.length >= 2 && cmpA && cmpB && (
        <div className="home-card">
          <p className="detail-label">{text.beforeAfter.toUpperCase()}</p>
          <div
            onPointerDown={event => {
              try { event.currentTarget.setPointerCapture(event.pointerId); } catch { /* unsupported */ }
              updateComparePos(event);
            }}
            onPointerMove={event => { if (event.buttons === 1) updateComparePos(event); }}
            style={{ position: "relative", width: "100%", aspectRatio: "1", borderRadius: 14, overflow: "hidden", marginTop: 10, cursor: "ew-resize", touchAction: "none", userSelect: "none", border: "1px solid #24242E", background: "#050507" }}
          >
            <img src={cmpB.dataUrl} draggable={false} alt="After" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, clipPath: `inset(0 ${100 - comparePos}% 0 0)` }}>
              <img src={cmpA.dataUrl} draggable={false} alt="Before" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ position: "absolute", top: 0, bottom: 0, left: `${comparePos}%`, width: 3, background: "#FFFFFF", transform: "translateX(-50%)", boxShadow: "0 0 14px rgba(0,0,0,0.7)" }}>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 36, height: 36, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", gap: 3, boxShadow: "0 2px 12px rgba(0,0,0,0.55)" }}>
                <div style={{ width: 2.5, height: 13, borderRadius: 2, background: "#101015" }} />
                <div style={{ width: 2.5, height: 13, borderRadius: 2, background: "#101015" }} />
              </div>
            </div>
            <span style={{ position: "absolute", top: 10, left: 10, background: "rgba(8,8,12,0.74)", color: "#90C8FF", borderRadius: 999, padding: "5px 11px", fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 900, letterSpacing: 2, backdropFilter: "blur(6px)" }}>{text.photoBefore.toUpperCase()}</span>
            <span style={{ position: "absolute", top: 10, right: 10, background: "rgba(8,8,12,0.74)", color: "#3FB98A", borderRadius: 999, padding: "5px 11px", fontFamily: "'Orbitron', monospace", fontSize: 9, fontWeight: 900, letterSpacing: 2, backdropFilter: "blur(6px)" }}>{text.photoAfter.toUpperCase()}</span>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "#8A8F99", fontFamily: "'DM Sans', sans-serif", marginTop: 8 }}>{text.dragToCompare}</p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8 }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 9, letterSpacing: 2, color: "#90C8FF", fontFamily: "'Orbitron', monospace" }}>{text.photoBefore.toUpperCase()}</p>
              <p style={{ fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{cmpA.date} · {fmtW(cmpA.weight)}</p>
            </div>
            <div style={{ minWidth: 0, textAlign: "right" }}>
              <p style={{ fontSize: 9, letterSpacing: 2, color: "#3FB98A", fontFamily: "'Orbitron', monospace" }}>{text.photoAfter.toUpperCase()}</p>
              <p style={{ fontSize: 12, fontWeight: 800, fontFamily: "'DM Sans', sans-serif" }}>{cmpB.date} · {fmtW(cmpB.weight)}</p>
            </div>
          </div>
          {cmpDelta !== 0 && (
            <p style={{ textAlign: "center", marginTop: 8, fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 14, color: cmpDelta < 0 ? "#3FB98A" : "#FF9860" }}>
              {fmtWDelta(cmpDelta)}
            </p>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
            <select className="input" value={cmpA.id} onChange={event => setCompareAId(event.target.value)}>
              {photosByDate.map(photo => <option key={photo.id} value={photo.id}>{photo.date}</option>)}
            </select>
            <select className="input" value={cmpB.id} onChange={event => setCompareBId(event.target.value)}>
              {photosByDate.map(photo => <option key={photo.id} value={photo.id}>{photo.date}</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="home-card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <p className="detail-label" style={{ margin: 0 }}>{text.albumsLabel}</p>
          <button
            className="album-chip"
            onClick={() => { setAlbumDraft(""); setShowAlbumModal(true); }}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <span style={{ fontSize: 15, lineHeight: 1, fontWeight: 900 }}>+</span> {text.newAlbumBtn}
          </button>
        </div>
        {photoAlbums.length === 0 ? (
          <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.5, marginTop: 10 }}>
            {text.noAlbumsHint}
          </p>
        ) : (
          <>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <button
                className={`album-chip${albumFilter === "" ? " active" : ""}`}
                onClick={() => setAlbumFilter("")}
              >
                {t("Todos", "All")} ({progressPhotos.length})
              </button>
              {photoAlbums.map(album => (
                <button
                  key={album}
                  className={`album-chip${albumFilter === album ? " active" : ""}`}
                  onClick={() => setAlbumFilter(album)}
                >
                  {album} ({progressPhotos.filter(photo => photo.album === album).length})
                </button>
              ))}
            </div>
            {albumFilter && (
              <button className="edit-btn" onClick={() => removePhotoAlbum(albumFilter)} style={{ marginTop: 10, color: "#E5604D" }}>
                {text.deleteAlbumBtn} "{albumFilter}"
              </button>
            )}
          </>
        )}
      </div>

      <button
        className="primary-btn"
        onClick={() => {
          setPhotoDraft({ date: getDateKey(), note: "", dataUrl: "", album: albumFilter || "", weight: "" });
          setShowPhotoModal(true);
        }}
      >
        + {text.addPhotoBtn}
      </button>

      {shownPhotos.length === 0 ? (
        <div className="home-card">
          <p style={{ color: isLightMode ? "#7A8090" : "#888", fontFamily: "'DM Sans', sans-serif", fontSize: 13, textAlign: "center" }}>
            {albumFilter ? text.noPhotosInAlbum : text.noPhotos}
          </p>
        </div>
      ) : (
        <div className="photo-grid">
          {shownPhotos.map(photo => (
            <div key={`${photo.id}-feature`} className="photo-tile" onClick={() => setViewingPhoto(photo)}>
              <img src={photo.dataUrl} alt={photo.note || "Progress"} />
              <div className="photo-body">
                <p className="photo-note">{photo.note || text.noNote}</p>
                <p className="photo-sub">{photo.date} · {fmtW(photo.weight)}{photo.album ? ` · ${photo.album}` : ""}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
