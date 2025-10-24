/**
 * React application entry point
 * Renders the App component in the DOM
 * 
 * @module main
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

/**
 * Creates the React root and renders the application in the element with id "root"
 * Uses React.StrictMode to detect potential problems in the application
 * 
 * @description
 * React.StrictMode activates additional checks and warnings:
 * - Detects components with unsafe side effects
 * - Warns about deprecated APIs
 * - Detects unexpected renders
 * 
 * Only affects development mode, has no impact on production
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);