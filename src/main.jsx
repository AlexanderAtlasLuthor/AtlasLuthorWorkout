import React from "react";
import { createRoot } from "react-dom/client";
import AtlasLuthor from "./AtlasLuthor.jsx";
import ErrorBoundary from "./ErrorBoundary.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AtlasLuthor />
    </ErrorBoundary>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  // Reload once when a new service worker takes control so users always run
  // the latest build instead of being trapped on a stale cached version.
  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  });

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then(registration => registration.update())
      .catch(() => {});
  });
}
