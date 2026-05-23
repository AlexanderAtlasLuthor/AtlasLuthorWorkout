export default function AlbumModal({
  text,
  albumDraft,
  setAlbumDraft,
  addPhotoAlbum,
  setShowAlbumModal,
}) {
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p style={{ fontSize: 10, letterSpacing: 3, color: "#FFFFFF", fontFamily: "'Orbitron', monospace", marginBottom: 10 }}>
          {text.newAlbumTitle}
        </p>
        <div className="settings-grid">
          <input
            className="input"
            value={albumDraft}
            onChange={event => setAlbumDraft(event.target.value)}
            onKeyDown={event => { if (event.key === "Enter") addPhotoAlbum(); }}
            placeholder={text.newAlbumPlaceholder}
            autoFocus
          />
          <button className="primary-btn" onClick={addPhotoAlbum}>{text.createBtn}</button>
          <button className="dark-btn" onClick={() => { setShowAlbumModal(false); setAlbumDraft(""); }}>
            {text.cancel}
          </button>
        </div>
      </div>
    </div>
  );
}
