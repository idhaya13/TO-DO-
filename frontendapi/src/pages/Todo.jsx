import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [binTodos, setBinTodos] = useState([]); // Bin data
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showBin, setShowBin] = useState(false); // Toggle between todos & bin
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

  const fetchBinTodos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/todos/bin/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBinTodos(res.data);
    } catch (err) {
      console.error(err);
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

  const handleDeleteToBin = async (todo) => {
    if (!window.confirm("Move this task to the bin?")) return;
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

  const handleRestore = async (id) => {
    if (!window.confirm("Restore this task?")) return;
    try {
      await axios.post(`http://127.0.0.1:8000/api/todos/${id}/restore/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBinTodos();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm("Permanently delete this task?")) return;
    try {
      await axios.delete(`http://127.0.0.1:8000/api/todos/${id}/permanent-delete/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchBinTodos();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }
    fetchTodos();
    fetchBinTodos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
        <p className="text-lg animate-pulse">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar inside the page */}
      <nav className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">📋 My Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBin(false)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              !showBin ? "bg-indigo-600" : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            📄 Todos
          </button>
          <button
            onClick={() => setShowBin(true)}
            className={`px-4 py-2 rounded-lg font-semibold ${
              showBin ? "bg-yellow-500" : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            🗑 Bin
          </button>
          <button
            onClick={() => navigate("/create-todo")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold"
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

      {/* Main content */}
      <div className="p-6">
        <h2 className="text-3xl font-semibold mb-6">
          {showBin ? "🗑 Deleted Tasks" : "✅ Your Tasks"}
        </h2>

        {/* Todos List */}
        {!showBin && (
          todos.length > 0 ? (
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
          )
        )}

        {/* Bin List */}
        {showBin && (
          binTodos.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {binTodos.map((todo) => (
                <div key={todo.id} className="bg-gray-700 p-4 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-2">{todo.title}</h3>
                  <p className="text-sm mb-4">{todo.description || "No description"}</p>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleRestore(todo.id)}
                      className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg font-semibold"
                    >
                      ♻ Restore
                    </button>
                    <button
                      onClick={() => handlePermanentDelete(todo.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg font-semibold"
                    >
                      ❌ Delete Forever
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Bin is empty.</p>
          )
        )}
      </div>

      {/* Modal for selected todo */}
      {selectedTodo && !showBin && (
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
                onClick={() => handleDeleteToBin(selectedTodo)}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
              >
                🗑 Move to Bin
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
