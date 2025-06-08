import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
import { ActiveProjectProvider } from "./store/ActiveProjectContext";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { AuthProvider } from "./store/AuthContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ActiveProjectProvider>
          <App />
        </ActiveProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
