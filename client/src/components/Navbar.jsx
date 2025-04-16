import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; // Import useTheme hook
import { supabase } from "../supabase";
import {
  LayoutDashboard,
  History,
  UserCircle,
  LogOut,
  LogIn,
  UserPlus,
  Home,
  X,
  Check,
  Moon, // Import Moon icon
  Sun, // Import Sun icon
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme(); // Get darkMode state and toggle function
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [showTooltip, setShowTooltip] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const navItems = user
    ? [
        { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { to: "/history", icon: <History size={20} />, label: "History" },
        { to: "/profile", icon: <UserCircle size={20} />, label: "Profile" },
      ]
    : [
        currentPath !== "/login" && {
          to: "/login",
          icon: <LogIn size={20} />,
          label: "Login",
        },
        currentPath !== "/register" && {
          to: "/register",
          icon: <UserPlus size={20} />,
          label: "Register",
        },
      ].filter(Boolean);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold text-xl"
          >
            <Home size={24} />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-500 dark:from-blue-400 dark:to-purple-300">
              Product Advisor
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {/* Theme toggle button */}
            <div
              className="relative group"
              onMouseEnter={() => setShowTooltip("theme")}
              onMouseLeave={() => setShowTooltip(null)}
            >
              <button
                onClick={toggleDarkMode}
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition p-1 rounded-full"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {showTooltip === "theme" && (
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-md">
                  {darkMode ? "Light mode" : "Dark mode"}
                </div>
              )}
            </div>

            {navItems.map((item, index) => (
              <div
                key={index}
                className="relative group"
                onMouseEnter={() => setShowTooltip(index)}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <Link
                  to={item.to}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  {item.icon}
                </Link>
                {showTooltip === index && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-md">
                    {item.label}
                  </div>
                )}
              </div>
            ))}

            {user && (
              <div
                className="relative group"
                onMouseEnter={() => setShowTooltip("logout")}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-500 transition"
                >
                  <LogOut size={20} />
                </button>
                {showTooltip === "logout" && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-md">
                    Logout
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Logout Modal - Updated with dark mode */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg text-center relative">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">
              Are you sure?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Do you really want to logout?
            </p>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex items-center font-bold space-x-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors duration-200"
              >
                <Check size={16} />
                <span>Yes</span>
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex items-center font-bold space-x-1 bg-gray-900 text-gray-200 px-4 py-2 rounded-xl hover:bg-black transition-colors duration-200"
              >
                <X size={16} />
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
