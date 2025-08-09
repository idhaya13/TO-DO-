import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodos = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        alert("Please log in first.");
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
        } else {
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  if (loading) return <p>Loading todos...</p>;

  return (
    <div>
      <h1>My Todos</h1>
      <ul>
        {todos.length > 0 ? (
          todos.map((todo) => (
            <li key={todo.id}>
              {todo.title} - {todo.completed ? "✅" : "❌"}
            </li>
          ))
        ) : (
          <p>No todos found.</p>
        )}
      </ul>
    </div>
  );
}

