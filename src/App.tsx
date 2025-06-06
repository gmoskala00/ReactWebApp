import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import HistoryjkaTasksPage from "./pages/TasksPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/historyjka/:id" element={<HistoryjkaTasksPage />} />
    </Routes>
  );
}

export default App;
