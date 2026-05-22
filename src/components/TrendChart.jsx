import React, { useId } from "react";

// Lightweight SVG line/area chart for historical trends. No dependencies —
// it matches the hand-drawn SVG style used elsewhere in the app. `points` is
// an array of { value } objects in chronological order (oldest first).
export default function TrendChart({
  points,
  color = "#90C8FF",
  emptyLabel = "",
  formatValue = value => String(Math.round(value)),
}) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "");
  const values = (points || []).map(point => Number(point.value) || 0);

  if (values.length < 2) {
    return (
      <div
        style={{
          minHeight: 96,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#8A8F99",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          textAlign: "center",
          padding: "14px 8px",
          lineHeight: 1.5,
        }}
      >
        {emptyLabel}
      </div>
    );
  }

  const W = 300;
  const H = 110;
  const padX = 8;
  const padY = 14;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const stepX = (W - padX * 2) / (values.length - 1);

  const coords = values.map((value, index) => {
    const x = padX + index * stepX;
    const y = padY + (1 - (value - min) / span) * (H - padY * 2);
    return [x, y];
  });

  const linePath = coords
    .map(([x, y], index) => `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  const lastPoint = coords[coords.length - 1];
  const areaPath = `${linePath} L${lastPoint[0].toFixed(1)} ${H} L${coords[0][0].toFixed(1)} ${H} Z`;
  const gradientId = `trend-${rawId}`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#${gradientId})`} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx={lastPoint[0]} cy={lastPoint[1]} r="3.6" fill={color} />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
        <span style={{ fontSize: 10, color: "#8A8F99", fontFamily: "'Orbitron', monospace" }}>
          {formatValue(values[0])}
        </span>
        <span style={{ fontSize: 10, color, fontFamily: "'Orbitron', monospace", fontWeight: 900 }}>
          {formatValue(values[values.length - 1])}
        </span>
      </div>
    </div>
  );
}
