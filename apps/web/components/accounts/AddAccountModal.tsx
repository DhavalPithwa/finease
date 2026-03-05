"use client";

import { useState, useEffect } from "react";
import { X, Building2, CreditCard, Wallet, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Account } from "@repo/types";
import toast from "react-hot-toast";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string; type: string; balance: string; minimumBalance?: string; maxLimit?: string }) => void;
  account?: Account | null;
}

export function AddAccountModal({ isOpen, onClose, onSave, account }: AddAccountModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "bank",
    balance: "",
    minimumBalance: "",
    maxLimit: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (account) {
        setFormData({
          name: account.name,
          type: account.type,
          balance: String(account.balance),
          minimumBalance: account.minimumBalance?.toString() || "",
          maxLimit: account.maxLimit?.toString() || "",
        });
      } else {
        setFormData({
          name: "",
          type: "bank",
          balance: "",
          minimumBalance: "",
          maxLimit: "",
        });
      }
    } else {
      document.body.style.overflow = 'auto';
      setTimeout(() => setFormData({ name: "", type: "bank", balance: "", minimumBalance: "", maxLimit: "" }), 300);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [account, isOpen]);

  const handleSave = () => {
    if (!formData.name) {
      toast.error("Please enter an account name");
      return;
    }
    if (!formData.balance) {
      toast.error("Please enter an initial balance");
      return;
    }
    onSave(formData);
    toast.success(account ? "Account updated successfully" : "Account added successfully");
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
                {account ? "Asset Identity" : "New Node"}
              </h3>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Identification</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. HDFC Core"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Node Class</label>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    disabled={!!account}
                    onClick={(e) => { e.preventDefault(); setFormData({ ...formData, type: "bank" }); }}
                    className={`h-9 rounded-xl border-none ring-1 flex flex-col items-center justify-center gap-1 transition-all ${formData.type === "bank" ? "bg-primary text-white ring-primary shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-slate-950 ring-slate-100 dark:ring-white/5 text-slate-400 hover:ring-slate-200 dark:hover:ring-white/10"}`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Bank</span>
                  </button>
                  <button 
                    disabled={!!account}
                    onClick={(e) => { e.preventDefault(); setFormData({ ...formData, type: "card" }); }}
                    className={`h-9 rounded-xl border-none ring-1 flex flex-col items-center justify-center gap-1 transition-all ${formData.type === "card" ? "bg-primary text-white ring-primary shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-slate-950 ring-slate-100 dark:ring-white/5 text-slate-400 hover:ring-slate-200 dark:hover:ring-white/10"}`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Card</span>
                  </button>
                  <button 
                    disabled={!!account}
                    onClick={(e) => { e.preventDefault(); setFormData({ ...formData, type: "cash" }); }}
                    className={`h-9 rounded-xl border-none ring-1 flex flex-col items-center justify-center gap-1 transition-all ${formData.type === "cash" ? "bg-primary text-white ring-primary shadow-lg shadow-primary/20" : "bg-slate-50 dark:bg-slate-950 ring-slate-100 dark:ring-white/5 text-slate-400 hover:ring-slate-200 dark:hover:ring-white/10"}`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Cash</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between px-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Liquid Value (₹)</label>
                    {account && <span className="text-[7px] font-black text-amber-500 uppercase tracking-widest animate-pulse">Read-Only</span>}
                </div>
                <input 
                  type="number" 
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  disabled={!!account}
                  className={`w-full h-10 border-none rounded-xl px-3 text-xs font-black ring-1 outline-none transition-all ${
                    account 
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-500 ring-slate-200 dark:ring-white/5 cursor-not-allowed" 
                      : "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary"
                  }`}
                />
              </div>

              {formData.type === "bank" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Threshold (₹)</label>
                  <input 
                    type="number" 
                    value={formData.minimumBalance}
                    onChange={(e) => setFormData({ ...formData, minimumBalance: e.target.value })}
                    placeholder="Minimum balance..."
                    className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              )}

              {formData.type === "card" && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-primary uppercase tracking-widest pl-1">Node Limit (₹)</label>
                  <input 
                    type="number" 
                    value={formData.maxLimit}
                    onChange={(e) => setFormData({ ...formData, maxLimit: e.target.value })}
                    placeholder="Total credit limit..."
                    className="w-full h-10 bg-primary/5 dark:bg-primary/10 border-none rounded-xl px-3 text-xs font-black text-primary ring-1 ring-primary/20 focus:ring-2 focus:ring-primary outline-none transition-all"
                  />
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto border-t border-slate-100 dark:border-white/5 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 h-10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-white/5 active:scale-95"
              >
                Cancel
              </button>
                <button 
                onClick={handleSave}
                className="flex-[2] h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Commit State
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
