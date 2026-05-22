import React from "react";

// Catches render-time crashes anywhere in the app so a single bad value shows
// a recovery screen instead of a blank page. Stored data is left untouched.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Atlas Luthor crashed:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    const isEs =
      typeof navigator !== "undefined" &&
      String(navigator.language || "").toLowerCase().startsWith("es");

    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 32,
          background: "#0C0C10",
          color: "#FFFFFF",
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          textAlign: "center",
        }}
      >
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#E5604D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>
          {isEs ? "Algo salió mal" : "Something went wrong"}
        </h1>
        <p style={{ fontSize: 14, lineHeight: 1.6, color: "#B8C0CC", maxWidth: 360, margin: 0 }}>
          {isEs
            ? "La app encontró un error inesperado. Tus datos guardados siguen a salvo en este dispositivo. Recarga para continuar."
            : "The app hit an unexpected error. Your saved data is still safe on this device. Reload to continue."}
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            marginTop: 4,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 800,
            color: "#0C0C10",
            background: "#FFFFFF",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          {isEs ? "Recargar" : "Reload"}
        </button>
      </div>
    );
  }
}
