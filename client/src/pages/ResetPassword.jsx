import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import AuthLayout from "../components/AuthLayout";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const accessToken = params.get("access_token");

    const checkSession = async () => {
      setIsProcessing(true);
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData.session) {
          setIsVerified(true);
          return;
        }
        if (accessToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
          });
          if (!error) setIsVerified(true);
          else {
            toast.error("Password reset link is invalid or expired");
            setTimeout(() => navigate("/sign-in"), 3000);
          }
        } else {
          toast.error("No active session for password reset");
          setTimeout(() => navigate("/sign-in"), 3000);
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      } finally {
        setIsProcessing(false);
      }
    };
    checkSession();
  }, [location, navigate]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

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

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validatePassword()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to reset password");
      } else {
        toast.success("Password updated successfully!");
        setTimeout(() => navigate("/sign-in"), 2000);
      }
    } catch (err) {
      console.error("Reset error:", err);
      toast.error("An error occurred during password reset");
    } finally {
      setLoading(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-brand-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted font-medium">Verifying reset link...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Set a new secure password for your account."
      alternativeText="Remembered your password?"
      alternativeLink="/sign-in"
      alternativeAction="Back to Sign In"
    >
      <div className="space-y-6">
        {!isVerified ? (
          <div className="bg-[#880d1e]/10 p-6 rounded-2xl border border-[#880d1e]/20 text-center">
            <p className="text-[#DD2D4A] font-semibold mb-1">Verification Failed</p>
            <p className="text-muted text-sm">The reset link may have expired or is invalid.</p>
            <Link to="/sign-in" className="mt-4 inline-block text-brand-primary font-bold underline hover:text-brand-secondary transition-colors">Go to Sign In</Link>
          </div>
        ) : (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[#F49CBB] ml-1 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full premium-input rounded-2xl p-4 pr-12 text-main focus:outline-none transition-all placeholder:text-muted"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-main transition-all focus:outline-none"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-xs ml-1 mt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full premium-button h-14 rounded-2xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white/30 border-t-white rounded-full"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <span>Update Password</span>
              )}
            </button>
          </form>
        )}
      </div>
    </AuthLayout>
  );
}

