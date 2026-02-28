"use client";

import { useState } from "react";
import { ArrowLeftRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (amount: number, from: string, to: string) => void;
}

export function TransferModal({ isOpen, onClose, onTransfer }: TransferModalProps) {
  const accounts = useSelector((state: RootState) => state.accounts.items);
  const [amount, setAmount] = useState("");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");

  return (
    <AnimatePresence>
      {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-md bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-border-dark shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Cash Withdrawal</h3>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 p-4 bg-slate-50 dark:bg-[#0b0d12] rounded-xl border border-slate-100 dark:border-border-dark">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">From</p>
                <select 
                  className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-0"
                  value={fromAccount}
                  onChange={(e) => setFromAccount(e.target.value)}
                >
                  <option value="">Select Account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
              <ArrowLeftRight className="w-5 h-5 text-primary flex-shrink-0" />
              <div className="flex-1 p-4 bg-slate-50 dark:bg-[#0b0d12] rounded-xl border border-slate-100 dark:border-border-dark">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">To</p>
                <select 
                  className="w-full bg-transparent text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-0"
                  value={toAccount}
                  onChange={(e) => setToAccount(e.target.value)}
                >
                  <option value="">Select Account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
              <input 
                type="number" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full text-3xl font-black p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
              />
            </div>

            <button 
              onClick={() => onTransfer(Number(amount), fromAccount, toAccount)}
              disabled={!amount || !fromAccount || !toAccount || fromAccount === toAccount}
              className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm Withdrawal
            </button>
          </div>
        </motion.div>
      </div>)}
    </AnimatePresence>
  );
}
