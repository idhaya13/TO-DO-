import React from "react";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white p-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">
          📝 To-Do Tracker
        </h1>
        <p className="text-lg opacity-80 mb-8">
          Your personal productivity companion — simple, beautiful, and effective.
        </p>
      </header>

      {/* Buttons */}
      <div className="mt-4 flex gap-6">
        <Link
          to="/register"
          className="px-8 py-4 bg-indigo-500 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-400 hover:scale-105 transform transition duration-300 ease-in-out"
        >
          🚀 Get Started
        </Link>
        <Link
          to="/login"
          className="px-8 py-4 bg-gray-700 text-white rounded-lg font-semibold shadow-lg hover:bg-gray-600 hover:scale-105 transform transition duration-300 ease-in-out"
        >
          🔑 Log In
        </Link>
      </div>

      {/* Features */}
      <div className="mt-16 text-center max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-indigo-300">
          ✨ Why You'll Love It
        </h2>
        <ul className="text-lg opacity-90 space-y-3">
          <li>✅ Lightning-fast task creation</li>
          <li>✅ Prioritize with just a tap</li>
          <li>✅ Cloud sync — your tasks anywhere</li>
          <li>✅ Sleek, distraction-free interface</li>
        </ul>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center opacity-60">
        <p>© {new Date().getFullYear()} To-Do Tracker — Stay organized, stay awesome.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
