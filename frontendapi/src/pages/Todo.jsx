import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/todos/", {
        headers: { Authorization: `Bearer ${token}` },
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

  const handleCompleteToggle = async (todo) => {
    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/todos/${todo.id}/`,
        { completed: !todo.completed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setSelectedTodo(null);
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  const handleDelete = async (todo) => {
    if (!window.confirm("Are you sure you want to delete this task permanently?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/todos/${todo.id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTodo(null);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    fetchTodos();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-6">✅ Your Tasks</h2>
        {todos.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {todos.map((todo) => (
              <div
                key={todo.id}
                onClick={() => setSelectedTodo(todo)}
                className={`p-4 rounded-xl shadow-lg hover:scale-105 cursor-pointer ${
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
          <p className="text-gray-400">No todos found.</p>
        )}
      </div>
      {selectedTodo && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">{selectedTodo.title}</h3>
            <p className="mb-4 text-gray-300">
              {selectedTodo.description || "No description provided."}
            </p>
            <p className="mb-4">
              Status:{" "}
              {selectedTodo.completed ? "✅ Completed" : "❌ Pending"}
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleCompleteToggle(selectedTodo)}
                className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg font-semibold"
              >
                {selectedTodo.completed
                  ? "Mark as Pending"
                  : "Mark as Completed"}
              </button>
              <button
                onClick={() => handleDelete(selectedTodo)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
              >
                ❌ Delete
              </button>
              <button
                onClick={() => setSelectedTodo(null)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
