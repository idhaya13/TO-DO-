import React from "react";

function LandingPage() {
  return (
    <div className="h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900"></div>

      {/* Subtle dot pattern */}
      <div className="absolute inset-0 dot-pattern"></div>

      {/* Floating orbs */}
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Navigation */}
        <nav className="flex justify-between items-center p-4 md:p-6">
          <div className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            TodoTracker
          </div>
          <div></div>{/* Empty div to balance the nav layout */}
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main headline */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Organize Your Life
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                One Task at a Time
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-slate-400 mb-6 max-w-2xl mx-auto leading-relaxed">
              A beautifully simple, completely free task manager that helps you stay organized.
              No subscriptions, no ads, just pure productivity.
            </p>

            {/* Feature cards preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 max-w-2xl mx-auto">
              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-lg">✨</span>
                </div>
                <h3 className="font-semibold mb-1 text-sm">Clean & Simple</h3>
                <p className="text-xs text-slate-400">No clutter, just your tasks</p>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-lg">🎯</span>
                </div>
                <h3 className="font-semibold mb-1 text-sm">Easy Priority</h3>
                <p className="text-xs text-slate-400">High, medium, low priority</p>
              </div>

              <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/60 transition-all duration-300">
                <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <span className="text-lg">🔒</span>
                </div>
                <h3 className="font-semibold mb-1 text-sm">Your Privacy</h3>
                <p className="text-xs text-slate-400">Data stays on your device</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-6">
              <a
                href="/register"
                className="group relative px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transform transition-all duration-300 ease-out text-sm"
              >
                <span className="relative z-10 flex items-center gap-2">
                  🚀 Start Using - It's Free!
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>

              <a
                href="/login"
                className="px-6 py-3 bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl font-semibold text-white hover:bg-slate-700/80 hover:border-slate-500/50 transition-all duration-300 flex items-center gap-2 text-sm"
              >
                🔑 Log In
              </a>
            </div>

            {/* Social proof */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-center items-center space-x-6 opacity-60">
                <div className="text-xs text-slate-400">💯 Always Free</div>
                <div className="text-xs text-slate-400">🚫 No Ads</div>
                <div className="text-xs text-slate-400">🔒 Privacy First</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating animation styles */}
      <style jsx>{`
        .dot-pattern {
          background-image: radial-gradient(circle at center, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default LandingPage;
