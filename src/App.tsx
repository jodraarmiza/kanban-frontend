import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import KanbanBoard from "./components/KanbanBoard";
import "./App.css"; // ✅ Import CSS

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(auth);
  }, []);

  return (
    <>
      {/* 🔹 Background animasi */}
      <div className="animated-bg"></div>

      {/* 🔹 Wrapper utama agar tidak tertutup background */}
      <div className="app-container">
        <Router>
          <Routes>
            <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/kanban" element={<KanbanBoard isAuthenticated={isAuthenticated} />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
