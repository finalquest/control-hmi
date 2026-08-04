import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { startWs } from "./api/ws.js";
import "./styles/theme.css";
import "./styles/app.css";

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

startWs();
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
