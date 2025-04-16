import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { X, Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for access token in URL if it exists
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");

    const checkSession = async () => {
      setIsProcessing(true);

      try {
        // First check if there's already a valid session
        const { data: sessionData } = await supabase.auth.getSession();

        if (sessionData.session) {
          setIsVerified(true);
          setIsProcessing(false);
          return;
        }

        // If no session but we have an access token, try to set it
        if (accessToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
          });

          if (!error) {
            setIsVerified(true);
          } else {
            console.error("Failed to set session:", error);
            toast.error("Password reset link is invalid or expired");
            setTimeout(() => navigate("/login"), 3000);
          }
        } else {
          // No session and no token
          toast.error("No active session for password reset");
          setTimeout(() => navigate("/login"), 3000);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      } finally {
        setIsProcessing(false);
      }
    };

    checkSession();
  }, [location, navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = () => {
    if (!newPassword) {
      setPasswordError("Password cannot be empty.");
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long.");
      return false;
    }
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(newPassword)) {
      setPasswordError("Password must contain at least one special character.");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleResetConfirmation = () => {
    if (validatePassword()) {
      setIsModalOpen(true);
    } else {
      toast.error(passwordError);
    }
  };

  const handleReset = async () => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        console.error("Password update error:", error);
        toast.error("Failed to reset password");
      } else {
        toast.success("Password updated successfully!");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("An error occurred during password reset");
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleCancelReset = () => {
    setIsModalOpen(false);
  };

  if (isProcessing) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white dark:bg-gray-800 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300">
          Verifying reset link...
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow bg-white dark:bg-gray-800 relative">
        <h1 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          Reset Password
        </h1>

        {!isVerified ? (
          <div className="text-center py-4">
            <p className="text-red-500 dark:text-red-400">
              Verification failed
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              The reset link may have expired. Redirecting to login...
            </p>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New password"
                className="w-full border p-2 pr-10 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-500 dark:text-gray-400"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mb-2">{passwordError}</p>
            )}
            <button
              onClick={handleResetConfirmation}
              className={`bg-blue-600 font-bold text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors ${
                !newPassword ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={!newPassword}
            >
              Update Password
            </button>
          </>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 shadow-lg text-center relative">
            <button
              onClick={handleCancelReset}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
            <p className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Are you sure you want to update?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelReset}
                className="flex items-center font-bold space-x-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex items-center font-bold space-x-1 bg-emerald-500 text-white px-4 py-2 rounded-xl hover:bg-emerald-600 transition-colors duration-200"
              >
                Yes, Update
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
