import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { ENDPOINTS } from "../config/api";

export default function Profile() {
  const { user } = useAuth();
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showClearHistoryModal, setShowClearHistoryModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showUpdateNameModal, setShowUpdateNameModal] = useState(false);

  const updateName = useCallback(async () => {
    if (!newName) return toast.error("Enter a name");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      data: { name: newName },
    });
    setLoading(false);

    if (error) toast.error("Update failed");
    else {
      toast.success("Name updated!");
      setShowUpdateNameModal(false);
    }
  }, [newName]);

  const resetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(user.email);
    if (error) toast.error("Could not send reset email");
    else {
      toast.success("Reset link sent to your email!");
      setShowPasswordModal(false);
    }
  };

  const clearAllHistory = async () => {
    const { error } = await supabase
      .from("advices")
      .delete()
      .eq("user_id", user.id);

    if (error) toast.error("Failed to clear history");
    else {
      toast.success("History cleared!");
      setShowClearHistoryModal(false);
    }
  };

  const deleteAccount = async () => {
    const res = await fetch(ENDPOINTS.DELETE_ACCOUNT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id }),
    });

    if (!res.ok) {
      toast.error("Account deletion failed");
      return;
    }

    const result = await res.json();
    if (result.error) toast.error("Account deletion failed");
    else {
      toast.success("Account deleted");
      window.location.href = "/sign-in";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto px-4 sm:px-6 pb-12"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Profile Settings</h1>
        <p className="text-muted text-sm md:text-base">Manage your account preferences and data.</p>
      </motion.div>

      {/* User Info Tile */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 relative overflow-hidden text-center md:text-left"
      >

        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-tr from-[#DD2D4A] to-[#F26A8D] rounded-3xl flex items-center justify-center text-3xl font-bold text-white shadow-2xl shadow-[#DD2D4A]/20">
            {user.user_metadata?.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-app-bg rounded-full"></div>
        </div>

        <div className="text-center md:text-left relative z-10">
          <h2 className="text-2xl font-bold mb-1 text-main">{user.user_metadata?.name || "User"}</h2>
          <p className="text-muted mb-4">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            <span className="glass-pill px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-green-400">Verified</span>
          </div>
        </div>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { 
            title: "Display Name", 
            desc: "Change how your name appears in the app.", 
            action: () => setShowUpdateNameModal(true),
            label: "Update Name",
            color: "text-[#DD2D4A]"
          },
          { 
            title: "Account Password", 
            desc: "Update your security credentials.", 
            action: () => setShowPasswordModal(true),
            label: "Reset Password",
            color: "text-blue-400"
          },
          { 
            title: "Advice History", 
            desc: "Clear all your past consultations.", 
            action: () => setShowClearHistoryModal(true),
            label: "Clear All",
            color: "text-orange-400"
          },
          { 
            title: "Danger Zone", 
            desc: "Permanently delete your account.", 
            action: () => setShowDeleteAccountModal(true),
            label: "Delete Account",
            color: "text-red-500"
          }
        ].map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass-card rounded-[2rem] p-6 hover:bg-white/[0.04] transition-colors cursor-pointer group"
            onClick={item.action}
          >
            <h3 className="text-lg font-bold mb-1 group-hover:text-bright transition-colors text-main">{item.title}</h3>
            <p className="text-sm text-muted mb-6">{item.desc}</p>
            <button className={`${item.color} text-xs font-bold uppercase tracking-widest hover:underline`}>
              {item.label}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Modals */}
      <Modal
        isOpen={showUpdateNameModal}
        onClose={() => setShowUpdateNameModal(false)}
        title="Update Display Name"
        confirmText={loading ? "Updating..." : "Update"}
        onConfirm={updateName}
        confirmColor="red"
      >
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#F49CBB]/80 ml-1 uppercase tracking-wider">
            New Display Name
          </label>
          <input
            type="text"
            className="w-full premium-input rounded-2xl p-4 focus:outline-none"
            placeholder="Enter your new name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
      </Modal>

      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Reset Password"
        confirmText="Yes, Send Reset Link"
        onConfirm={resetPassword}
        confirmColor="blue"
      >
        <p className="text-muted leading-relaxed">
          Are you sure you want to reset your password? A secure password reset link
          will be sent to <span className="text-main font-medium">{user.email}</span>.
        </p>
      </Modal>

      <Modal
        isOpen={showClearHistoryModal}
        onClose={() => setShowClearHistoryModal(false)}
        title="Clear All History"
        confirmText="Yes, Clear All"
        onConfirm={clearAllHistory}
        confirmColor="orange"
      >
        <p className="text-muted leading-relaxed">
          This will permanently delete your entire advice history. This action <span className="text-orange-400 font-bold">cannot be undone</span>.
        </p>
      </Modal>

      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account"
        confirmText="Delete My Account"
        onConfirm={deleteAccount}
        confirmColor="red"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-red-400 font-bold text-sm">
              Warning: This action is permanent!
            </p>
          </div>
          <p className="text-muted leading-relaxed">
            This will permanently delete your account and all associated data.
            All your consultations will be lost forever.
          </p>
        </div>
      </Modal>
    </motion.div>
  );
}
