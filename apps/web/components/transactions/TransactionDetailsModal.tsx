"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, Account, FinancialGoal, Category } from "@repo/types";
import { formatDate } from "@/lib/utils";

interface TransactionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  accounts: Account[];
  goals: FinancialGoal[];
  categories: Category[];
}

export function TransactionDetailsModal({ isOpen, onClose, transaction, accounts, goals, categories }: TransactionDetailsModalProps) {
  if (!isOpen || !transaction) return null;

  const getAccountName = (id?: string) => {
    if (!id) return "Unknown";
    const acc = accounts.find(a => a.id === id);
    if (acc) return acc.name;
    const goal = goals.find(g => g.id === id);
    if (goal) return goal.name;
    return "Unknown";
  };

  const categoryObj = categories.find(c => c.id === transaction.category);

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
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Details</h3>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</span>
                <span className="text-sm font-black text-slate-900 dark:text-white leading-tight">{transaction.description}</span>
              </div>
              
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</span>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{formatDate(transaction.date)}</span>
              </div>

              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Value Impact</span>
                <div className="flex items-baseline gap-2">
                  <span className={`text-2xl font-black tracking-tighter ${transaction.type === 'expense' ? 'text-rose-500' : transaction.type === 'transfer' ? 'text-slate-500' : 'text-emerald-500'}`}>
                    ₹{transaction.amount.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase">{transaction.type}</span>
                </div>
                {transaction.interestAmount && (
                  <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest bg-orange-500/10 px-2 py-0.5 rounded w-fit mt-1">
                    Incl. ₹{(Number(transaction.interestAmount)).toLocaleString()} Cost
                  </span>
                )}
              </div>

              <div className="h-px bg-slate-50 dark:bg-white/5 my-2"></div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category</span>
                  <span className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-widest w-fit ${categoryObj ? (categoryObj.color + ' bg-opacity-10') : 'bg-slate-100 dark:bg-slate-800'}`}>
                    {categoryObj?.name || transaction.category}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Flow</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{getAccountName(transaction.accountId)}</span>
                </div>
              </div>

              {(transaction.type === 'transfer' || transaction.toAccountId) && (
                <div className="flex flex-col gap-0.5 p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-200 dark:border-white/10">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Destination</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate">{getAccountName(transaction.toAccountId)}</span>
                </div>
              )}

              {transaction.isAutomated && (
                <div className="flex flex-col gap-1.5 bg-indigo-50 dark:bg-indigo-500/10 p-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em]">Automated Trace</span>
                  <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                    Cycles: {transaction.frequency} • {transaction.recurringCount} Total
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto border-t border-slate-100 dark:border-white/5">
              <button 
                onClick={onClose}
                className="w-full h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-black uppercase tracking-widest rounded-xl transition-all active:scale-95 shadow-lg"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
