import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ReactiveDotProvider } from "@reactive-dot/react";
import { config } from "./config.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReactiveDotProvider config={config}>
      <App />
    </ReactiveDotProvider>
  </StrictMode>,
);
