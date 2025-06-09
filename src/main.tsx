import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./App.css";
import { ActiveProjectProvider } from "./store/ActiveProjectContext";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { AuthProvider } from "./store/AuthContext";
import { ThemeProvider } from "./store/ThemeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ActiveProjectProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </ActiveProjectProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
