import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/todos/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(res.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert("Session expired. Please log in again.");
        navigate("/login");
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading todos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 My Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => alert("Open create todo modal")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold"
          >
            + Add Todo
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-6">Your Tasks</h2>
        {todos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`p-4 rounded-xl shadow-lg transition transform hover:scale-105 ${
                  todo.completed ? "bg-green-600" : "bg-gray-700"
                }`}
              >
                <h3 className="text-xl font-bold mb-2">{todo.title}</h3>
                <p className="text-sm opacity-80">
                  Status: {todo.completed ? "✅ Completed" : "❌ Pending"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No todos found. Create one above!</p>
        )}
      </div>
    </div>
  );
}


