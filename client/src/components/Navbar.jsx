import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "./Modal";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext"; 
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
  Moon,
  Sun,
  Sparkles,
  Info,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme(); 
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const [showTooltip, setShowTooltip] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await supabase.auth.signOut();
    toast.success("Logged out successfully!");
    navigate("/sign-in");
  };

  const navItems = user
    ? [
        { to: "/", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { to: "/history", icon: <History size={20} />, label: "History" },
        { to: "/profile", icon: <UserCircle size={20} />, label: "Profile" },
        { to: "/about", icon: <Info size={20} />, label: "About" },
      ]
    : [
        currentPath !== "/sign-in" && {
          to: "/sign-in",
          icon: <LogIn size={20} />,
          label: "Sign In",
        },
        currentPath !== "/sign-up" && {
          to: "/sign-up",
          icon: <UserPlus size={20} />,
          label: "Sign Up",
        },
        { to: "/about", icon: <Info size={20} />, label: "About" },
      ].filter(Boolean);

  return (
    <>
      {/* Top Header - Desktop & Compact Mobile */}
      <nav className="fixed top-4 md:top-6 left-0 right-0 z-50 px-4 sm:px-6 flex justify-center pointer-events-none">
        <div className="glass-card rounded-[1.5rem] md:rounded-3xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border border-white/5 w-full max-w-5xl pointer-events-auto">
          <Link
            to="/"
            className="flex items-center space-x-2 md:space-x-3 group"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-tr from-[#DD2D4A] to-[#F26A8D] rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-[#DD2D4A]/20 group-hover:scale-110 transition-transform">
               <Sparkles size={18} className="md:w-[22px] md:h-[22px]" fill="currentColor" />
            </div>
            <span className="text-lg md:text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#DD2D4A] to-[#F26A8D]">
              Product Advisor
            </span>
          </Link>

          <div className="flex items-center space-x-2 md:space-x-6">
            {/* Desktop Mentu */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.to}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    currentPath === item.to 
                      ? "text-brand-primary bg-brand-primary/10 border border-brand-primary/20" 
                      : "text-muted hover:text-main hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-2 md:space-x-4 md:pl-4 md:border-l md:border-white/10">
              <button
                onClick={toggleDarkMode}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:text-main hover:bg-white/5 transition-all"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user && (
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <LogOut size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      {user && (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm">
          <div className="glass-card rounded-[2rem] p-2 flex items-center justify-around border border-white/10 shadow-2xl">
            {navItems.map((item, index) => {
              const isActive = currentPath === item.to;
              return (
                <Link
                  key={index}
                  to={item.to}
                  className={`relative flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all ${
                    isActive ? "text-brand-primary" : "text-muted"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className="absolute inset-0 bg-brand-primary/10 border border-brand-primary/10 rounded-2xl -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {item.icon}
                  <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Global Modals */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Signing Out?"
        confirmText="Logout"
        onConfirm={handleLogout}
        confirmColor="red"
      >
        <p>Are you sure you want to end your session? You'll need to log back in to access your recommendations.</p>
      </Modal>
    </>
  );
}
