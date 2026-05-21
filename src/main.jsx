import React from "react";
import { createRoot } from "react-dom/client";
import AtlasLuthor from "./AtlasLuthor.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AtlasLuthor />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
