import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landingpage";
import RegisterPage from "./pages/Register";
import Login from "./pages/Login";
import Todos from "./pages/Todo";
import CreateTodo from "./pages/Createtodo";
import { useState } from "react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("access") || null);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/create-todo" element={<CreateTodo />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

