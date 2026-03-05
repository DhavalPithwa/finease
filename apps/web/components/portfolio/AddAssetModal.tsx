"use client";

import { useState, useEffect } from "react";
import { X, Gem } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Account } from "@repo/types";

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset?: Partial<Account>;
  onSave: (data: { name: string; balance: string }) => void;
}

export function AddAssetModal({ isOpen, onClose, asset, onSave }: AddAssetModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    balance: "",
  });

  useEffect(() => {
    if (asset) {
      setFormData({
        name: asset.name ?? "",
        balance: (asset.balance ?? 0).toString(),
      });
    } else {
      setFormData({
        name: "",
        balance: "",
      });
    }
  }, [asset, isOpen]);

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
                 {asset ? "Asset Refinement" : "Physical Asset Node"}
              </h3>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              <div className="p-5 space-y-4 overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Asset Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                    placeholder="e.g. Gold, Real Estate"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                    Current Valuation (₹)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                    className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-black text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto border-t border-slate-100 dark:border-white/5 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-white/5 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-[2] h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Gem className="w-4 h-4" />
                  {asset ? "Update Asset" : "Commit Asset"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
