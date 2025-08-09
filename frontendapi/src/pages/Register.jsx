import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        password,
        email
      });
      alert("Registration successful! You can now log in.");
      navigate("/login"); // redirect to login page
    } catch (err) {
      alert("Registration failed. Try another username.");
    }
  };

  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-4 max-w-sm mx-auto mt-10">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border rounded px-3 py-2"
      />
      <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        Register
      </button>
    </form>
  );
}
