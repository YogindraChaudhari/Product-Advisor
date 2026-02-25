import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  confirmText,
  onConfirm,
  confirmColor = "purple",
}) => {
  const colorSchemes = {
    purple: "bg-[#DD2D4A] hover:bg-[#880d1e] shadow-[#DD2D4A]/20",
    blue: "bg-[#F26A8D] hover:bg-[#DD2D4A] shadow-[#F26A8D]/20",
    green: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20",
    red: "bg-[#880d1e] hover:bg-[#5a0914] shadow-[#880d1e]/20",
    orange: "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 dark:bg-[#0a0102]/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          onClick={onClose}
        >
          <motion.div
            key="modal-content"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#DD2D4A]/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-bold tracking-tight">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-8 relative z-10 text-muted">
              {children}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end relative z-10">
              <button
                onClick={onClose}
                className="order-2 sm:order-1 px-6 py-3 font-semibold text-muted hover:text-main transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`order-1 sm:order-2 px-6 py-3 font-bold text-white rounded-2xl shadow-lg transition-all active:scale-95 ${
                  colorSchemes[confirmColor] || colorSchemes.purple
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
