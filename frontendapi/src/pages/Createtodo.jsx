import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateTodo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // ✅ Added description state
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a title for the todo.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/todos/",
        { title, description, completed }, // ✅ Send description too
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Todo created successfully!");
      navigate("/todos");
    } catch (err) {
      console.error("Error creating todo:", err);
      if (err.response?.status === 403) {
        alert("You are not authorized. Please log in again.");
        navigate("/login");
      } else {
        alert("Failed to create todo. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <form
        onSubmit={handleCreate}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          ➕ Create New Todo
        </h2>

        <input
          type="text"
          placeholder="Enter todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <textarea
          placeholder="Enter description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-700 text-white mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          rows={4}
        />

        <label className="flex items-center gap-2 text-gray-300 mb-6">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="w-5 h-5"
          />
          Mark as Completed
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition duration-300"
        >
          {loading ? "Creating..." : "Create Todo"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/todos")}
          className="w-full mt-3 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-lg transition duration-300"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
