// Builds a shareable progress card image on a canvas. Pure rendering only —
// the component decides whether to share it via the Web Share API or
// download it.

// Draws the card and resolves with a PNG Blob (or null if canvas is missing).
export function renderShareCard(stats) {
  return new Promise(resolve => {
    if (typeof document === "undefined") {
      resolve(null);
      return;
    }

    const size = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      resolve(null);
      return;
    }

    const background = ctx.createLinearGradient(0, 0, size, size);
    background.addColorStop(0, "#101018");
    background.addColorStop(1, "#05060A");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(144,200,255,0.35)";
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, size - 80, size - 80);

    ctx.textAlign = "center";

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 64px 'Orbitron', sans-serif";
    ctx.fillText("ATLAS", size / 2 - 90, 170);
    ctx.fillStyle = "#90C8FF";
    ctx.fillText("LUTHOR", size / 2 + 110, 170);

    ctx.fillStyle = "#8A8F99";
    ctx.font = "600 30px 'DM Sans', sans-serif";
    ctx.fillText((stats.subtitle || "WEEKLY PROGRESS").toUpperCase(), size / 2, 230);

    // Atlas Score ring.
    const centerX = size / 2;
    const centerY = 470;
    const radius = 150;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 26;
    ctx.stroke();

    const pct = Math.max(0, Math.min(1, (Number(stats.score) || 0) / 100));
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, -Math.PI / 2, -Math.PI / 2 + pct * Math.PI * 2);
    ctx.strokeStyle = "#90C8FF";
    ctx.lineWidth = 26;
    ctx.lineCap = "round";
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "900 130px 'Orbitron', sans-serif";
    ctx.fillText(String(stats.score ?? 0), centerX, centerY + 46);
    ctx.fillStyle = "#8A8F99";
    ctx.font = "600 28px 'DM Sans', sans-serif";
    ctx.fillText("ATLAS SCORE", centerX, centerY + 100);

    // Three stat columns.
    const stat = stats.stats || [];
    const columnWidth = (size - 160) / 3;
    stat.slice(0, 3).forEach((item, index) => {
      const x = 80 + columnWidth * index + columnWidth / 2;
      ctx.fillStyle = "#90C8FF";
      ctx.font = "900 70px 'Orbitron', sans-serif";
      ctx.fillText(String(item.value), x, 760);
      ctx.fillStyle = "#8A8F99";
      ctx.font = "600 26px 'DM Sans', sans-serif";
      ctx.fillText(String(item.label).toUpperCase(), x, 810);
    });

    if (stats.message) {
      ctx.fillStyle = "#C8D0DC";
      ctx.font = "600 32px 'DM Sans', sans-serif";
      wrapText(ctx, stats.message, size / 2, 920, size - 220, 44);
    }

    canvas.toBlob(blob => resolve(blob), "image/png");
  });
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = String(text).split(/\s+/);
  let line = "";
  let cursorY = y;
  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = word;
      cursorY += lineHeight;
    } else {
      line = candidate;
    }
  });
  if (line) ctx.fillText(line, x, cursorY);
}
