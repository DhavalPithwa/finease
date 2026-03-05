import { useState } from "react";
import { X, Rocket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FinancialGoal } from "@repo/types";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: FinancialGoal | null;
  onSave: (amount: number) => void;
}

export function TopUpModal({ isOpen, onClose, goal, onSave }: TopUpModalProps) {
  const [amount, setAmount] = useState("");

  if (!goal) return null;

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
                Capital Injection
              </h3>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto">
              <div className="p-4 rounded-xl bg-primary/5 ring-1 ring-primary/10">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Current Position</span>
                  <span className="text-[10px] font-black text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded-lg">{Math.round((goal.currentAmount / goal.targetAmount) * 100)}% Complete</span>
                </div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">₹{goal.currentAmount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">target ₹{goal.targetAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  Injection Magnitude
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full h-12 bg-slate-50 dark:bg-slate-950 border-none rounded-xl pl-8 pr-4 text-lg font-black text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto border-t border-slate-100 dark:border-white/5 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 h-10 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-200 dark:border-white/5 active:scale-95"
              >
                Retreat
              </button>
                <button 
                onClick={() => {
                  const val = parseFloat(amount);
                  if (val > 0) {
                    onSave(val);
                    setAmount("");
                  }
                }}
                className="flex-[2] h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:active:scale-100"
                disabled={!amount || parseFloat(amount) <= 0}
              >
                <Rocket className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                Deploy Capital
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
