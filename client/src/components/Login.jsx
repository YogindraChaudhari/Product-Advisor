import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for reset_failed parameter
    const params = new URLSearchParams(location.search);
    if (params.get("reset_failed") === "true") {
      toast.error("Password reset link is invalid or expired");
    }
  }, [location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error("Login failed!");
      } else {
        // Check if this is a login after requesting a password reset
        const params = new URLSearchParams(location.search);
        const resetRequested = params.get("reset") === "true";

        if (resetRequested) {
          // Redirect to reset password after login if reset was requested
          navigate("/reset-password");
          toast.success("Please set your new password");
        } else {
          toast.success("Logged in Successfully");
          navigate("/");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred");
      toast.error("Login failed!");
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
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-emerald-600 dark:text-emerald-400">
          Login to Your Account
        </h2>
        {error && (
          <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Email"
              required
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
                required
                className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 cursor-pointer"
              >
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </button>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-sm text-teal-500 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl transition-colors"
          >
            Login
          </button>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-500 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </motion.div>
  );
}
