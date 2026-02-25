import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Pencil, Trash2, History as HistoryIcon } from "lucide-react";
import Modal from "../components/Modal";
import { motion, AnimatePresence } from "framer-motion";
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
    const url = `${ENDPOINTS.HISTORY}/${user.id}`;
    try {
      console.log("Fetching history from:", url);
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("History fetch failed:", res.status, errorData);
        throw new Error(`Failed to fetch history: ${res.status}`);
      }

      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error("History fetch error:", error);
      toast.error("Failed to fetch history");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      const res = await fetch(`${ENDPOINTS.ADVICE}/${deleteModal.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id }),
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Deleted!");
      setDeleteModal({ open: false, id: null });
      fetchHistory();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  const confirmRename = async () => {
    if (!renameModal.title) return toast.error("Title cannot be empty");

    try {
      const res = await fetch(`${ENDPOINTS.ADVICE}/${renameModal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          title: renameModal.title,
        }),
      });

      if (!res.ok) throw new Error("Rename failed");

      toast.success("Title updated!");
      setRenameModal({ open: false, id: null, title: "" });
      fetchHistory();
    } catch (error) {
      console.error("Rename error:", error);
      toast.error("Rename failed");
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

    const normalizedText = text.replace(/([^\n])(\s[\*\-]\s)/g, "$1\n$2");

    const lines = normalizedText.split("\n");
    let html = [];
    let inList = false;

    lines.forEach((line) => {
      let trimmed = line.trim();
      
      if (!trimmed) {
        if (inList) { html.push("</ul>"); inList = false; }
        return;
      }

      if (trimmed.startsWith("#### ")) {
        if (inList) { html.push("</ul>"); inList = false; }
        const content = trimmed.substring(5).replace(/\*\*/g, "");
        html.push(`<h4 class="text-base md:text-lg font-bold text-white mt-7 mb-3 border-l-4 border-[#DD2D4A] pl-4">${content}</h4>`);
        return;
      }
      
      if (trimmed.startsWith("### ")) {
        if (inList) { html.push("</ul>"); inList = false; }
        const content = trimmed.substring(4).replace(/\*\*/g, "");
        html.push(`<h3 class="text-lg md:text-xl font-bold text-bright mt-10 mb-4 border-b border-brand-primary/10 pb-2">${content}</h3>`);
        return;
      }

      const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ") || trimmed.startsWith("• ");
      let processed = isBullet ? trimmed.replace(/^[\*\-\•]\s+/, "") : trimmed;

      processed = processed
        .replace(/\*\*\*(.*?)\*\*\*/g, '<strong class="text-bright font-bold italic">$1</strong>')
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-bright font-bold">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-brand-secondary italic">$1</em>');

      if (isBullet) {
        if (!inList) {
          html.push('<ul class="list-none pl-1 space-y-3 mb-6">');
          inList = true;
        }
        html.push(`
          <li class="flex items-start gap-3 text-muted leading-relaxed">
            <span class="mt-2 w-1.5 h-1.5 rounded-full bg-brand-primary shrink-0 shadow-[0_0_8px_rgba(221,45,74,0.4)]"></span>
            <span class="text-main">${processed}</span>
          </li>
        `);
      } else {
        if (inList) {
          html.push("</ul>");
          inList = false;
        }
        html.push(`<p class="mb-5 leading-relaxed text-main">${processed}</p>`);
      }
    });

    if (inList) html.push("</ul>");
    return html.join("");
  };

  useEffect(() => {
    if (user) fetchHistory();
  }, [user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Advice History</h1>
          <p className="text-muted text-sm md:text-base">Review your past consultations and AI recommendations.</p>
        </div>
        <div className="flex items-center space-x-2 glass-pill px-4 py-2 rounded-2xl w-fit">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-semibold text-muted uppercase tracking-wider">{history.length} Records</span>
        </div>
      </motion.div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="ai-orbital">
            <div className="ai-ring"></div>
            <div className="ai-core"></div>
          </div>
          <p className="text-muted animate-pulse">Retrieving your history...</p>
        </div>
      )}

      {!loading && history.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-[2.5rem] p-16 text-center"
        >
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <HistoryIcon size={40} className="text-gray-500" />
          </div>
          <p className="text-xl font-medium text-main mb-2">No history yet</p>
          <p className="text-muted mb-8">Your AI recommendations will appear here once you start exploring.</p>
          <Link to="/" className="premium-button px-8 py-3 rounded-xl font-bold inline-block">
            Get Started
          </Link>
        </motion.div>
      )}

      {!loading && history.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {history.map((item, index) => {
              const isExpanded = expandedItems[item.id];
              const previewText = item.result?.slice(0, 150) + "...";

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.98, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card rounded-3xl p-6 md:p-8 hover:border-white/20 transition-all group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold group-hover:text-[#F26A8D] transition-colors">
                        {item.title || "Consultation"}
                      </h2>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                         <span>{new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                         <span>•</span>
                         <span className="text-[#DD2D4A] font-mono uppercase text-[10px] tracking-widest">{item.provider || "AI"}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                       <button
                         onClick={() => setRenameModal({ open: true, id: item.id, title: item.title })}
                         className="p-2 glass-pill rounded-lg text-muted hover:text-bright transition-colors"
                       >
                         <Pencil size={16} />
                       </button>
                       <button
                         onClick={() => setDeleteModal({ open: true, id: item.id })}
                         className="p-2 glass-pill rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                       >
                         <Trash2 size={16} />
                       </button>
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-2xl p-6 relative">
                    <div
                      className="prose dark:prose-invert prose-sm max-w-none text-muted leading-relaxed 
                        prose-strong:text-main prose-p:mb-0"
                      dangerouslySetInnerHTML={{
                        __html: formatText(isExpanded ? item.result : previewText),
                      }}
                    />
                    
                    {item.result?.length > 150 && (
                      <button
                        className="text-[#DD2D4A] text-xs font-bold mt-4 uppercase tracking-tighter hover:underline"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {isExpanded ? "Close Report" : "Read Full Report"}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Modal
        isOpen={renameModal.open}
        onClose={() => setRenameModal({ open: false, id: null, title: "" })}
        title="Rename Advice"
        confirmText="Rename"
        confirmColor="red"
        onConfirm={confirmRename}
      >
        <div className="space-y-3">
          <label className="text-sm font-semibold text-[#F49CBB]/80 ml-1 uppercase tracking-wider">
            Consulation Title
          </label>
          <input
            type="text"
            className="w-full premium-input rounded-2xl p-4 focus:outline-none"
            placeholder="Enter a descriptive title"
            value={renameModal.title}
            onChange={(e) =>
              setRenameModal((prev) => ({ ...prev, title: e.target.value }))
            }
          />
        </div>
      </Modal>

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        title="Confirm Delete"
        confirmText="Delete Advice"
        confirmColor="red"
        onConfirm={confirmDelete}
      >
        <p className="text-muted leading-relaxed">
          Are you sure you want to delete this advice report? This action <span className="text-red-400 font-bold">cannot be undone</span> and the data will be permanently removed.
        </p>
      </Modal>
    </div>
  );
}
