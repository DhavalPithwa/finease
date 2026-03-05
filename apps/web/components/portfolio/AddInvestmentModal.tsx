"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Account } from "@repo/types";
import toast from "react-hot-toast";

interface AddInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { assetName: string; assetType: string; investedAmount: string; currentAmount: string }) => void;
  investment?: Account | null;
}

export function AddInvestmentModal({ isOpen, onClose, onSave, investment }: AddInvestmentModalProps) {
  const assetTypes = useSelector((state: RootState) => state.assetClasses.items);
  const [formData, setFormData] = useState({
    assetName: "",
    assetType: assetTypes[0]?.id || "",
    investedAmount: "",
    currentAmount: "",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (investment) {
        setFormData({
          assetName: investment.name,
          assetType: investment.assetType || assetTypes[0]?.id || "",
          investedAmount: String(investment.investedAmount || investment.balance),
          currentAmount: String(investment.balance),
        });
      } else {
        setFormData({
          assetName: "",
          assetType: assetTypes.length > 0 ? (assetTypes[0]?.id || "") : "",
          investedAmount: "",
          currentAmount: "",
        });
      }
    } else {
      document.body.style.overflow = 'auto';
      setTimeout(() => setFormData({ assetName: "", assetType: assetTypes[0]?.id || "", investedAmount: "", currentAmount: "" }), 300);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [investment, isOpen, assetTypes]);

  const handleSave = () => {
    if (!formData.assetName) {
      toast.error("Please enter an asset name");
      return;
    }
    if (!formData.assetType) {
      toast.error("Please select an asset class");
      return;
    }
    if (!formData.investedAmount) {
      toast.error("Please enter capital invested");
      return;
    }
    if (!formData.currentAmount) {
      toast.error("Please enter current value");
      return;
    }
    onSave(formData);
    toast.success(investment ? "Investment updated successfully" : "Investment logged successfully");
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
                {investment ? "Asset Strategy" : "Capital Growth"}
              </h3>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Instrument / Ticker</label>
                <input 
                  type="text" 
                  value={formData.assetName}
                  onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                  placeholder="e.g. BTC-INR or NIFTY 50"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Asset Category</label>
                <div className="relative">
                  <select 
                    value={formData.assetType}
                    onChange={(e) => setFormData({ ...formData, assetType: e.target.value })}
                    className="w-full h-10 appearance-none bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                  >
                    <option value="" disabled>Select Sector</option>
                    {assetTypes.map((type) => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Basis (Capital)</label>
                  <input 
                    type="number" 
                    value={formData.investedAmount}
                    onChange={(e) => setFormData({ ...formData, investedAmount: e.target.value })}
                    placeholder="0.00"
                    disabled={!!investment}
                    className={`w-full h-10 border-none rounded-xl px-3 text-xs font-black ring-1 outline-none transition-all ${
                      investment 
                        ? "bg-slate-100 dark:bg-slate-800 text-slate-500 ring-slate-200 dark:ring-white/5 cursor-not-allowed" 
                        : "bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary"
                    }`}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-1">Valuation</label>
                  <input 
                    type="number" 
                    value={formData.currentAmount}
                    onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
                    placeholder="0.00"
                    className="w-full h-10 bg-emerald-50 dark:bg-emerald-500/10 border-none rounded-xl px-3 text-xs font-black text-emerald-500 ring-1 ring-emerald-500/20 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
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
                onClick={handleSave}
                className="flex-[2] h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Commit Force
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
