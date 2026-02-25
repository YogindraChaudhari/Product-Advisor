import { useState } from "react";
import { supabase } from "../supabase";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import AuthLayout from "./AuthLayout";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;

    if (!isLongEnough || !hasUpperCase || !hasNumber || !hasSpecialChar) {
      setLoading(false);
      let errorMsg = "Password must meet the following criteria:\n";
      if (!isLongEnough) errorMsg += "• At least 8 characters long\n";
      if (!hasUpperCase) errorMsg += "• At least one uppercase letter\n";
      if (!hasNumber) errorMsg += "• At least one number\n";
      if (!hasSpecialChar) errorMsg += "• At least one special character (!@#$%^&*)\n";
      
      toast.error(errorMsg, { duration: 5000 });
      setError("Weak Password: Please follow the security requirements.");
      return;
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name: fullName },
      },
    });

    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      if (supabaseError.message.includes("invalid email")) {
        toast.error("Please enter a valid email address.");
      } else if (supabaseError.message.includes("user already exists")) {
        toast.error("This email address is already registered.");
      } else {
        toast.error(supabaseError.message || "Registration failed.");
      }
    } else {
      toast.success("Registration successful! Please check your email for verification.");
      navigate("/sign-in");
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join us for a tailored AI experience."
      alternativeText="Already have an account?"
      alternativeLink="/sign-in"
      alternativeAction="Sign In"
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

        <form onSubmit={handleRegister} className="space-y-4 md:space-y-5">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F49CBB] ml-1 uppercase tracking-wider">First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. John"
                required
                className="w-full premium-input rounded-xl p-3 md:p-4 text-main placeholder:text-muted focus:outline-none text-sm md:text-base"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#F49CBB] ml-1 uppercase tracking-wider">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Doe"
                required
                className="w-full premium-input rounded-xl p-3 md:p-4 text-main placeholder:text-muted focus:outline-none text-sm md:text-base"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F49CBB] ml-1 uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              required
              className="w-full premium-input rounded-xl p-3 md:p-4 text-main placeholder:text-muted focus:outline-none text-sm md:text-base"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#F49CBB] ml-1 uppercase tracking-wider">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 chars, 1 Cap, 1 Num, 1 Symbol"
                required
                className="w-full premium-input rounded-xl p-3 md:p-4 pr-12 text-main placeholder:text-muted focus:outline-none text-sm md:text-base"
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
                <span>Creating account...</span>
              </>
            ) : (
              <span>Sign Up</span>
            )}
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}

