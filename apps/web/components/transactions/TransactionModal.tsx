"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  transaction?: any; // The initial transaction to edit
}

export function TransactionModal({ isOpen, onClose, onSave, transaction }: TransactionModalProps) {
  const accounts = useSelector((state: RootState) => state.accounts.items);
  const categories = useSelector((state: RootState) => state.categories.items);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "Uncategorized",
    date: new Date().toISOString().split("T")[0],
    accountId: "acc-1",
    toAccountId: "",
    type: "expense" as "expense" | "income",
    isAutomated: false,
    frequency: "monthly",
    recurringCount: "12",
  });

  useEffect(() => {
    if (transaction) {
      setFormData({
        description: transaction.description,
        amount: String(transaction.amount),
        category: transaction.category,
        date: new Date(transaction.date).toISOString().split("T")[0],
        accountId: transaction.accountId || "acc-1",
        toAccountId: transaction.toAccountId || "",
        type: transaction.type || "expense",
        isAutomated: transaction.isAutomated || false,
        frequency: transaction.frequency || "monthly",
        recurringCount: transaction.recurringCount || "12",
      });
    } else {
      setFormData({
        description: "",
        amount: "",
        category: "Uncategorized",
        date: new Date().toISOString().split("T")[0],
        accountId: "acc-1",
        toAccountId: "",
        type: "expense",
        isAutomated: false,
        frequency: "monthly",
        recurringCount: "12",
      });
    }
  }, [transaction, isOpen]);

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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {transaction ? "Edit Transaction" : "New Transaction"}
              </h3>
              <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Merchant / Description</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Transaction Type</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, type: "expense" })}
                    className={`flex-1 p-3 rounded-xl border font-bold text-sm transition-all ${formData.type === "expense" ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-[#0b0d12] dark:border-border-dark dark:text-slate-400 hover:border-slate-300"}`}
                  >
                    Money Out (Expense)
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, type: "income" })}
                    className={`flex-1 p-3 rounded-xl border font-bold text-sm transition-all ${formData.type === "income" ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-[#0b0d12] dark:border-border-dark dark:text-slate-400 hover:border-slate-300"}`}
                  >
                    Money In (Income)
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Execution Type</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => setFormData({ ...formData, isAutomated: false })}
                    className={`flex-1 p-3 rounded-xl border font-bold text-sm transition-all ${!formData.isAutomated ? "bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-[#0b0d12] dark:border-border-dark dark:text-slate-400 hover:border-slate-300"}`}
                  >
                    Actual Transaction
                  </button>
                  <button
                    onClick={() => setFormData({ ...formData, isAutomated: true })}
                    className={`flex-1 p-3 rounded-xl border font-bold text-sm transition-all ${formData.isAutomated ? "bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20" : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-[#0b0d12] dark:border-border-dark dark:text-slate-400 hover:border-slate-300"}`}
                  >
                    Automated Recurring
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Amount (₹)</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                />
              </div>
              
              <div className="space-y-4">
                {formData.type === "expense" ? (
                  <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Deduct From Account</label>
                      <select 
                        value={formData.accountId}
                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                        className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                      >
                        {accounts.map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name} ({acc.type.toUpperCase()})</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Credit To Account / Investment</label>
                      <select 
                        value={formData.toAccountId}
                        onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                        className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                      >
                        <option value="">(None)</option>
                        {accounts.filter(acc => acc.id !== formData.accountId).map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name} ({acc.type.toUpperCase()})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Credit To Account</label>
                    <select 
                      value={formData.accountId}
                      onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                      className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    >
                      {accounts.filter(acc => acc.type !== "investment").map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.name} ({acc.type.toUpperCase()})</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="space-y-1 flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                  >
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                    <option value="Uncategorized">Uncategorized</option>
                  </select>
                </div>
                
                <div className="space-y-1 flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">{formData.isAutomated ? "Start Date" : "Date"}</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {formData.isAutomated && (
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-purple-100 bg-purple-50/50 dark:bg-purple-500/5 dark:border-purple-500/10">
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 text-purple-700 dark:text-purple-400">Frequency</label>
                    <select 
                      value={formData.frequency}
                      onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                      className="w-full p-3 bg-white dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                  <div className="space-y-1 flex-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 text-purple-700 dark:text-purple-400">Occurrences</label>
                    <input 
                      type="number" 
                      value={formData.recurringCount}
                      onChange={(e) => setFormData({ ...formData, recurringCount: e.target.value })}
                      placeholder="e.g. 12"
                      className="w-full p-3 bg-white dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <button 
                onClick={() => onSave(formData)}
                className="w-full mt-4 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
              >
                {transaction ? "Update Entry" : "Save Transaction"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
