import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ActiveProjectProvider } from "./store/ActiveProjectContext";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ActiveProjectProvider>
        <App />
      </ActiveProjectProvider>
    </BrowserRouter>
  </StrictMode>
);
