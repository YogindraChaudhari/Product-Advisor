import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { motion } from "framer-motion";
import AuthLayout from "./AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("reset_failed") === "true") {
      toast.error("Password reset link is invalid or expired");
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error(error.message || "Login failed!");
      } else {
        const params = new URLSearchParams(location.search);
        const resetRequested = params.get("reset") === "true";

        if (resetRequested) {
          navigate("/reset-password");
          toast.success("Please set your new password");
        } else {
      toast.success("Logged in successfully");
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      toast.error("Login failed!");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleResetPassword = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        toast.error("Could not send reset email: " + error.message);
      } else {
        toast.success("Password reset link sent to your email!");
      }
    } catch (err) {
      console.error("Password reset error:", err);
      toast.error("Failed to send reset email");
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Enter your details to access your account."
      alternativeText="Don't have an account?"
      alternativeLink="/sign-up"
      alternativeAction="Sign Up"
    >
      <div className="space-y-4 md:space-y-6">
        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="text-red-400 text-xs md:text-sm bg-red-500/10 p-3 md:p-4 rounded-2xl border border-red-500/20 text-center"
          >
            {error}
          </motion.p>
        )}

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F49CBB] ml-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              required
              className="w-full premium-input rounded-xl p-3.5 md:p-4 text-main placeholder:text-muted focus:outline-none text-sm md:text-base"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-semibold text-[#F49CBB] uppercase tracking-wider">Password</label>
              <button
                type="button"
                onClick={handleResetPassword}
                className="text-[11px] font-bold text-[#F26A8D] hover:text-[#F49CBB] transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full premium-input rounded-xl p-3.5 md:p-4 pr-12 text-main placeholder:text-muted focus:outline-none text-sm md:text-base"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-all focus:outline-none"
              >
                {showPassword ? <AiOutlineEyeInvisible size={18} /> : <AiOutlineEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full premium-button h-12 md:h-14 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-2 flex items-center justify-center space-x-2 text-sm md:text-base"
          >
            {loading ? (
              <>
                <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

