import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [filter, setFilter] = useState('all'); // all, completed, pending
  const [searchTerm, setSearchTerm] = useState('');
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

  // Filter todos based on status and search
  const filteredTodos = todos.filter(todo => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && todo.completed) ||
      (filter === 'pending' && !todo.completed);
    
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (todo.description && todo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.filter(todo => !todo.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900"></div>
        <div className="absolute inset-0 dot-pattern"></div>
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-slate-300">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-900"></div>
      <div className="absolute inset-0 dot-pattern"></div>
      <div className="absolute top-20 left-1/4 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      
      {/* Main content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Header section */}
        <div className="px-6 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Your Tasks
                </h1>
                <p className="text-slate-400">
                  Stay organized and productive with your personal task manager
                </p>
              </div>
              
              {/* Quick stats */}
              <div className="flex gap-4 mt-4 md:mt-0">
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-indigo-400">{todos.length}</div>
                  <div className="text-xs text-slate-400">Total</div>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-400">{completedCount}</div>
                  <div className="text-xs text-slate-400">Done</div>
                </div>
                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-yellow-400">{pendingCount}</div>
                  <div className="text-xs text-slate-400">Pending</div>
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="🔍 Search your tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                />
              </div>
              <div className="flex gap-2">
                {['all', 'pending', 'completed'].map((filterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 capitalize ${
                      filter === filterType
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-slate-800/40 text-slate-300 border border-slate-700/50 hover:bg-slate-700/40'
                    }`}
                  >
                    {filterType === 'all' ? '📋 All' : filterType === 'pending' ? '⏳ Pending' : '✅ Done'}
                  </button>
                ))}
              </div>
            </div>

            {/* Tasks Grid */}
            {filteredTodos.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredTodos.map((todo) => (
                  <div
                    key={todo.id}
                    onClick={() => setSelectedTodo(todo)}
                    className={`group relative p-6 rounded-2xl backdrop-blur-sm border cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                      todo.completed 
                        ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" 
                        : "bg-slate-800/40 border-slate-700/50 hover:bg-slate-700/40"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-3 h-3 rounded-full ${todo.completed ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        todo.completed 
                          ? 'bg-green-400/20 text-green-300' 
                          : 'bg-yellow-400/20 text-yellow-300'
                      }`}>
                        {todo.completed ? '✅ Done' : '⏳ Pending'}
                      </div>
                    </div>
                    
                    <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${
                      todo.completed ? 'text-green-100 line-through opacity-75' : 'text-white'
                    }`}>
                      {todo.title}
                    </h3>
                    
                    {todo.description && (
                      <p className="text-slate-400 text-sm line-clamp-3 mb-3">
                        {todo.description}
                      </p>
                    )}
                    
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="text-indigo-400">→</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-800/40 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl opacity-50">📝</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-300">
                  {searchTerm || filter !== 'all' ? 'No matching tasks found' : 'No tasks yet'}
                </h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm || filter !== 'all' 
                    ? 'Try adjusting your search or filter criteria' 
                    : 'Create your first task to get started with organizing your life'}
                </p>
                {(!searchTerm && filter === 'all') && (
                  <button 
                    onClick={() => navigate('/create-todo')}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-semibold text-white hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
                  >
                    ✨ Create Your First Task
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {selectedTodo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedTodo.completed 
                  ? 'bg-green-400/20 text-green-300' 
                  : 'bg-yellow-400/20 text-yellow-300'
              }`}>
                {selectedTodo.completed ? '✅ Completed' : '⏳ Pending'}
              </div>
              <button
                onClick={() => setSelectedTodo(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <h3 className="text-2xl font-bold mb-4 text-white">
              {selectedTodo.title}
            </h3>
            
            {selectedTodo.description && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Description</h4>
                <p className="text-slate-400 leading-relaxed">
                  {selectedTodo.description}
                </p>
              </div>
            )}
            
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleCompleteToggle(selectedTodo)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  selectedTodo.completed
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {selectedTodo.completed ? '↩️ Mark Pending' : '✅ Mark Complete'}
              </button>
              
              <button
                onClick={() => handleDelete(selectedTodo)}
                className="px-6 py-3 bg-red-600/80 hover:bg-red-600 rounded-xl font-semibold text-white transition-all duration-200"
              >
                🗑️ Delete
              </button>
              
              <button
                onClick={() => setSelectedTodo(null)}
                className="px-6 py-3 bg-slate-700/80 hover:bg-slate-600 rounded-xl font-semibold text-white transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Styles */}
      <style jsx>{`
        .dot-pattern {
          background-image: radial-gradient(circle at center, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        
        .animate-pulse {
          animation: pulse 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
