import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import { useState, useCallback } from "react";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import { motion } from "framer-motion";
import { ENDPOINTS } from "../config/api"; // Import the API endpoints

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
    // Use the correct account endpoint
    const res = await fetch(`${ENDPOINTS.ACCOUNT}/delete-account`, {
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
      window.location.href = "/login";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto p-4 md:p-6"
    >
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Profile Settings
      </h1>

      {/* User Info Tile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          User Information
        </h2>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 via-sky-200 to-purple-500 rounded-full h-16 w-16 flex items-center justify-center text-lg font-bold text-gray-700 dark:text-gray-900">
            {user.user_metadata?.name?.charAt(0) ||
              user.email.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow">
            <p className="font-medium text-gray-900 dark:text-white">
              {user.user_metadata?.name || "No name set"}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Tile */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
          Settings
        </h2>

        <div className="space-y-6">
          {/* Update Name */}
          <div className="p-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
            <h3 className="font-medium mb-1 text-gray-800 dark:text-white">
              Display Name
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Change how your name appears
            </p>
            <button
              onClick={() => setShowUpdateNameModal(true)}
              className="text-green-500 hover:text-green-700 dark:hover:text-green-400 text-sm font-medium"
            >
              Update Name
            </button>
          </div>

          {/* Reset Password */}
          <div className="p-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
            <h3 className="font-medium mb-1 text-gray-800 dark:text-white">
              Password
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Reset your account password
            </p>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-400 text-sm font-medium"
            >
              Reset Password
            </button>
          </div>

          {/* Clear History */}
          <div className="p-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
            <h3 className="font-medium mb-1 text-gray-800 dark:text-white">
              Advice History
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Clear all your advice history
            </p>
            <button
              onClick={() => setShowClearHistoryModal(true)}
              className="text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 text-sm font-medium"
            >
              Clear All History
            </button>
          </div>

          {/* Delete Account */}
          <div className="p-3 border dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
            <h3 className="font-medium mb-1 text-gray-800 dark:text-white">
              Account
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Permanently remove your account and data
            </p>
            <button
              onClick={() => setShowDeleteAccountModal(true)}
              className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showUpdateNameModal}
        onClose={() => setShowUpdateNameModal(false)}
        title="Update Display Name"
        confirmText={loading ? "Updating..." : "Update"}
        onConfirm={updateName}
        confirmColor="green"
      >
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            New Display Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full border rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 border-gray-300 dark:border-gray-600"
            placeholder="Enter new name"
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
        <p className="text-gray-800 dark:text-gray-200">
          Are you sure you want to reset your password? A password reset link
          will be sent to your email address.
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
        <p className="text-gray-800 dark:text-gray-200">
          This will delete all your advice history. This action cannot be
          undone. Are you sure you want to continue?
        </p>
      </Modal>

      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Delete Account"
        confirmText="Yes, Delete My Account"
        onConfirm={deleteAccount}
        confirmColor="red"
      >
        <p className="text-red-600 dark:text-red-400 font-medium mb-2">
          Warning: This action is permanent!
        </p>
        <p className="text-gray-800 dark:text-gray-200">
          This will permanently delete your account and all associated data.
          This action cannot be undone.
        </p>
      </Modal>
    </motion.div>
  );
}
