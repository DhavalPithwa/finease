"use client";

import { useState, useEffect } from "react";
import { X, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Account } from "@repo/types";

interface AddLiabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  liability?: Partial<Account>;
  onSave: (data: { name: string; type: string; initialAmount: string; paidAmount: string; interestPaid: string }) => void;
}

export function AddLiabilityModal({ isOpen, onClose, liability, onSave }: AddLiabilityModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "debt",
    initialAmount: "",
    paidAmount: "",
    interestPaid: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (liability) {
        const absBalance = Math.abs(liability.balance ?? 0);
        setFormData({
          name: liability.name ?? "",
          type: liability.type ?? "debt",
          initialAmount: liability.initialAmount?.toString() || (absBalance + (liability.paidAmount ?? 0)).toString(),
          paidAmount: liability.paidAmount?.toString() ?? "0",
          interestPaid: liability.interestPaid?.toString() ?? "0",
        });
      } else {
        setFormData({
          name: "",
          type: "debt",
          initialAmount: "",
          paidAmount: "0",
          interestPaid: "0",
        });
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [liability, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-2xl border-t sm:border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                 {liability ? "Debt Refinement" : "Liability Node"}
              </h3>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Instrument Label</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Home Loan"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Total Obligation (₹)</label>
                <input 
                  type="number" 
                  value={formData.initialAmount}
                  onChange={(e) => setFormData({ ...formData, initialAmount: e.target.value })}
                  placeholder="0.00"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-black text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-1">Principal (₹)</label>
                  <input 
                    type="number" 
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: e.target.value })}
                    className="w-full h-10 bg-emerald-50 dark:bg-emerald-500/10 border-none rounded-xl px-3 text-xs font-black text-emerald-500 ring-1 ring-emerald-500/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-orange-500 uppercase tracking-widest pl-1">Cost (₹)</label>
                  <input 
                    type="number" 
                    value={formData.interestPaid}
                    onChange={(e) => setFormData({ ...formData, interestPaid: e.target.value })}
                    className="w-full h-10 bg-orange-50 dark:bg-orange-500/10 border-none rounded-xl px-3 text-xs font-black text-orange-500 ring-1 ring-orange-500/20 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto border-t border-slate-100 dark:border-white/5 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 h-10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-white/5 active:scale-95"
              >
                Cancel
              </button>
                <button 
                onClick={handleSubmit}
                className="flex-[2] h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Commit Debt
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
