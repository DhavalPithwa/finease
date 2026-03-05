import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-[2rem] border border-slate-200/50 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
          >
          <div className="p-6 pb-4 flex flex-col items-center text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDestructive ? 'bg-rose-500/10 text-rose-500' : 'bg-primary/10 text-primary'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight mb-1">
              {title}
            </h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
              {message}
            </p>
          </div>

          <div className="p-4 pt-0 flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 py-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg transition-all active:scale-[0.98] ${
                isDestructive 
                ? "bg-rose-500 shadow-rose-500/20" 
                : "bg-primary shadow-primary/20"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
     )}
    </AnimatePresence>
  );
}
