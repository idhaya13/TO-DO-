import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 text-white p-6">
      <header className="text-center">
        <h1 className="text-4xl font-bold mb-2">📝 To-Do Tracker</h1>
        <p className="text-lg opacity-90">
          Organize your day, one task at a time.
        </p>
      </header>

      <div className="mt-8 flex gap-4">
        <Link
          to="/register"
          className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold shadow-md hover:scale-105 transform transition"
        >
          Get Started
        </Link>
        <Link
          to="/login"
          className="px-6 py-3 bg-white/20 border border-white rounded-full font-semibold shadow-md hover:scale-105 transform transition"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;

