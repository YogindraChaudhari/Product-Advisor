import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "../components/Modal";
import { AnimatePresence } from "framer-motion";
import { ENDPOINTS } from "../config/api";

export default function History() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState({});
  const [renameModal, setRenameModal] = useState({
    open: false,
    id: null,
    title: "",
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      console.log("Fetching history from:", `${ENDPOINTS.ADVICE}/${user.id}`);

      const res = await fetch(`${ENDPOINTS.ADVICE}/${user.id}`, {
        method: "GET",
        credentials: "include", // Include credentials for cross-site requests
        headers: {
          "Content-Type": "application/json",
          // You may need to add authorization headers if your API requires it
        },
      });

      if (!res.ok) {
        console.error("Error response:", res.status, res.statusText);
        throw new Error(
          `Failed to fetch history: ${res.status} ${res.statusText}`
        );
      }

      const data = await res.json();
      console.log("History data received:", data);
      setHistory(data);
    } catch (error) {
      console.error("History fetch error:", error);
      toast.error(`Failed to fetch history: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${ENDPOINTS.ADVICE}/${deleteModal.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Delete failed");
      }

      toast.success("Deleted!");
      setDeleteModal({ open: false, id: null });
      fetchHistory();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error(`Delete failed: ${error.message}`);
    }
  };

  const confirmRename = async () => {
    if (!renameModal.title) return toast.error("Title cannot be empty");

    try {
      const res = await fetch(`${ENDPOINTS.ADVICE}/${renameModal.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title: renameModal.title,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Rename failed");
      }

      toast.success("Title updated!");
      setRenameModal({ open: false, id: null, title: "" });
      fetchHistory();
    } catch (error) {
      console.error("Rename error:", error);
      toast.error(`Rename failed: ${error.message}`);
    }
  };

  const toggleExpand = (id) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  useEffect(() => {
    if (user && user.id) {
      console.log("User authenticated, fetching history");
      fetchHistory();
    } else {
      console.log("No user or user ID available");
      setLoading(false);
    }
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 transition-colors duration-300">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-6 text-gray-900 dark:text-white"
      >
        Your Advice History
      </motion.h1>

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            Loading history...
          </p>
        </div>
      )}

      {!loading && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center"
        >
          <p className="text-gray-600 dark:text-gray-300">
            No advice history found yet.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
            Get started by asking a question on the Dashboard.
          </p>
        </motion.div>
      )}

      {!loading && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 gap-6"
        >
          <AnimatePresence>
            {history.map((item, index) => {
              const isExpanded = expandedItems[item.id];
              const previewText = item.result?.slice(0, 100) + "...";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                        {item.title || "Untitled"}
                      </h2>
                      <div className="flex space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Pencil
                            size={18}
                            className="text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-800 dark:hover:text-blue-300"
                            onClick={() =>
                              setRenameModal({
                                open: true,
                                id: item.id,
                                title: item.title,
                              })
                            }
                          />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Trash2
                            size={18}
                            className="text-red-600 dark:text-red-400 cursor-pointer hover:text-red-800 dark:hover:text-red-300"
                            onClick={() =>
                              setDeleteModal({ open: true, id: item.id })
                            }
                          />
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="mr-3">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                      <span className="bg-gradient-to-br from-blue-500 via-sky-300 to-purple-500 font-mono text-gray-100 px-2 py-1 rounded-xl text-xs">
                        {item.provider || "AI"}
                      </span>
                    </div>

                    <div className="border-t dark:border-gray-700 pt-4">
                      <div
                        className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-800 dark:prose-p:text-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: formatText(
                            isExpanded ? item.result : previewText
                          ),
                        }}
                      />
                      {item.result?.length > 200 && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-blue-500 dark:text-blue-400 mt-2 text-sm hover:underline"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {isExpanded ? "See less" : "See more"}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Rename Modal */}
      <Modal
        isOpen={renameModal.open}
        onClose={() => setRenameModal({ open: false, id: null, title: "" })}
        title="Rename Advice"
        confirmText="Rename"
        confirmColor="blue"
        onConfirm={confirmRename}
      >
        <div>
          <label
            htmlFor="rename"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            New Title
          </label>
          <input
            id="rename"
            type="text"
            className="w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            value={renameModal.title}
            onChange={(e) =>
              setRenameModal((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Confirm Delete"
        confirmText="Delete"
        confirmColor="red"
        onConfirm={confirmDelete}
      >
        <p>
          Are you sure you want to delete this advice? This cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
