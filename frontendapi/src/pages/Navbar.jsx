import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Check, X, Eye, EyeOff } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [profileData, setProfileData] = useState({
    username: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const dropdownRef = useRef(null);
  const modalRef = useRef(null);

  // Close dropdown/modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowProfileModal(false);
        resetForm();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access");
      if (!token) return;
      const response = await fetch("http://localhost:8000/api/auth/user/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setProfileData((prev) => ({ ...prev, username: userData.username }));
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/login");
  };

  const resetForm = () => {
    setProfileData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
    setError("");
    setSuccess("");
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      setError("New passwords don't match");
      setLoading(false);
      return;
    }
    if (profileData.newPassword && profileData.newPassword.length < 8) {
      setError("New password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }

      const updateData = {
        username: profileData.username,
      };

      // Only include password fields if the user wants to change the password
      if (profileData.newPassword) {
        updateData.current_password = profileData.currentPassword;
        updateData.new_password = profileData.newPassword;
      }

      const response = await fetch("http://localhost:8000/api/auth/profile/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        resetForm();
        setTimeout(() => {
          setShowProfileModal(false);
          setSuccess("");
        }, 2000);
      } else {
        // Handle specific error messages from the backend
        if (data.current_password) {
          setError(data.current_password[0]);
        } else if (data.new_password) {
          setError(data.new_password[0]);
        } else if (data.username) {
          setError(data.username[0]);
        } else if (data.error) {
          setError(data.error);
        } else {
          setError("Failed to update profile. Please try again.");
        }
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <nav className="bg-gray-800 shadow-md p-4 flex justify-between items-center relative">
        <h1 className="text-2xl font-bold text-white">📋 My Dashboard</h1>
        <div className="flex gap-3 items-center">
          <button
            onClick={() => navigate("/create-todo")}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white transition-colors"
          >
            + Add Todo
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="bg-blue-600 hover:bg-blue-700 p-2 rounded-lg transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5 text-white" />
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                <div className="py-1">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    {profileData.username || "User"}
                  </div>
                  <button
                    onClick={() => {
                      setShowProfileModal(true);
                      setShowProfileDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Profile Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Profile Modal with Blur Background */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Profile Settings</h2>
              <button
                onClick={() => {
                  setShowProfileModal(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  required
                />
              </div>

              {/* Password Section */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Change Password (Optional)
                </h3>

                <div className="space-y-3">
                  {/* Current Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <input
                      type={showPassword.currentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={profileData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("currentPassword")}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.currentPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* New Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type={showPassword.newPassword ? "text" : "password"}
                      name="newPassword"
                      value={profileData.newPassword}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-800"
                      minLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("newPassword")}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.newPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Confirm New Password */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type={showPassword.confirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={profileData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-gray-800"
                      minLength="8"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirmPassword")}
                      className="absolute right-3 top-9 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword.confirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {success}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProfileUpdate}
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
