import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import TasksPage from "./pages/TasksPage";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./store/AuthContext";

function App() {
  const { user, login, logout } = useAuth();

  if (!user) {
    return <LoginForm onLogin={login} />;
  }

  return (
    <div>
      <div className="d-flex justify-content-end p-3">
        <span>
          Zalogowany jako:{" "}
          <strong>
            {user.firstName} {user.lastName} ({user.role})
          </strong>
        </span>
        <button className="btn btn-outline-danger ms-3" onClick={logout}>
          Wyloguj
        </button>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/historyjka/:id" element={<TasksPage />} />
      </Routes>
    </div>
  );
}

export default App;
