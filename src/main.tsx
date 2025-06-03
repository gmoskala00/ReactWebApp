import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { ActiveProjectProvider } from "./store/ActiveProjectContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ActiveProjectProvider>
      <App />
    </ActiveProjectProvider>
  </StrictMode>
);
