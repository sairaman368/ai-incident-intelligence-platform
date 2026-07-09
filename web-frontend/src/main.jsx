import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import { SnackbarProvider } from "./context/SnackbarContext";
import { ThemeModeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeModeProvider>
      <SnackbarProvider>
        <App />
      </SnackbarProvider>
    </ThemeModeProvider>
  </React.StrictMode>
);