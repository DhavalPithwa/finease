"use client";

import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import toast from "react-hot-toast";

import { Transaction, TransactionFrequency, FinancialGoal, Category } from "@repo/types";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Transaction>) => void;
  transaction?: Transaction | null; // The initial transaction to edit
}

export function TransactionModal({ isOpen, onClose, onSave, transaction }: TransactionModalProps) {
  const accounts = useSelector((state: RootState) => state.accounts.items);
  const categories = useSelector((state: RootState) => state.categories.items);
  const goals = useSelector((state: RootState) => state.goals.items);
  const [formData, setFormData] = useState<{
    description: string;
    amount: string;
    interestAmount: string;
    category: string;
    date: string;
    accountId: string;
    toAccountId: string;
    type: "expense" | "income" | "transfer";
    isAutomated: boolean;
    frequency: TransactionFrequency;
    recurringCount: string;
  }>({
    description: "",
    amount: "",
    interestAmount: "",
    category: "uncategorized",
    date: new Date().toISOString().split("T")[0] ?? "",
    accountId: "acc-1",
    toAccountId: "",
    type: "expense",
    isAutomated: false,
    frequency: "monthly",
    recurringCount: "12",
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: String(transaction.amount),
          interestAmount: transaction.interestAmount ? String(transaction.interestAmount) : "",
          category: transaction.category || "uncategorized",
          date: new Date(transaction.date).toISOString().split("T")[0] ?? "",
          accountId: transaction.accountId || "acc-1",
          toAccountId: transaction.toAccountId || "",
          type: transaction.type || "expense",
          isAutomated: transaction.isAutomated || false,
          frequency: transaction.frequency || "monthly",
          recurringCount: String(transaction.recurringCount || 12),
        });
      } else {
        setFormData({
          description: "",
          amount: "",
          interestAmount: "",
          category: "uncategorized",
          date: new Date().toISOString().split("T")[0] ?? "",
          accountId: accounts[0]?.id || "acc-1",
          toAccountId: "",
          type: "expense",
          isAutomated: false,
          frequency: "monthly",
          recurringCount: "12",
        });
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [transaction, isOpen, accounts]);

  const handleSave = () => {
    if (!formData.description || !formData.amount) {
      toast.error("Please fill required fields (description & amount)");
      return;
    }
    if (!formData.accountId) {
      toast.error("Please select a primary account");
      return;
    }
    const payload: Partial<Transaction> = {
      ...formData,
      amount: parseFloat(formData.amount),
      interestAmount: formData.interestAmount ? parseFloat(formData.interestAmount) : undefined,
      recurringCount: formData.recurringCount,
    };
    onSave(payload);
    toast.success(transaction ? "Transaction updated" : "Transaction added");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-white dark:bg-surface-dark rounded-t-[2rem] sm:rounded-2xl border border-slate-200 dark:border-border-dark shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="p-4 border-b border-slate-100 dark:border-border-dark flex items-center justify-between shrink-0">
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {transaction ? "Edit Record" : "New Record"}
              </h3>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="p-4 space-y-3.5 overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Merchant / Narration</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="e.g. Grocery, Salary..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs text-slate-900 dark:text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Flow Type</label>
                  <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                    <button
                      onClick={() => setFormData({ ...formData, type: "expense" })}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.type === "expense" ? "bg-white dark:bg-slate-800 text-rose-500 shadow-sm" : "text-slate-500"}`}
                    >
                      Out
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, type: "income" })}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.type === "income" ? "bg-white dark:bg-slate-800 text-emerald-500 shadow-sm" : "text-slate-500"}`}
                    >
                      In
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Execution</label>
                  <div className="flex gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                    <button
                      onClick={() => setFormData({ ...formData, isAutomated: false })}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${!formData.isAutomated ? "bg-white dark:bg-slate-800 text-primary shadow-sm" : "text-slate-500"}`}
                    >
                      One
                    </button>
                    <button
                      onClick={() => setFormData({ ...formData, isAutomated: true })}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${formData.isAutomated ? "bg-white dark:bg-slate-800 text-purple-500 shadow-sm" : "text-slate-500"}`}
                    >
                      Recur
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Amount (₹)</label>
                <input 
                  type="number" 
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  className="w-full p-2.5 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              
              <div className="space-y-4">
                {formData.type === "expense" ? (
                  <div className="flex flex-col gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Deduct From</label>
                      <div className="relative">
                        <select 
                          value={formData.accountId}
                          onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                          className="w-full p-2.5 pr-10 appearance-none bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs text-slate-900 dark:text-white font-medium"
                        >
                          <option value="" disabled>Select Source</option>
                          {accounts.filter(a => ["bank", "cash", "card"].includes(a.type)).map(acc => (
                            <option key={acc.id} value={acc.id}>
                              {acc.name} (₹{acc.balance.toLocaleString()})
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Credit / Invest To (Optional)</label>
                      <div className="relative">
                        <select 
                          value={formData.toAccountId}
                          onChange={(e) => setFormData({ ...formData, toAccountId: e.target.value })}
                          className="w-full p-2.5 pr-10 appearance-none bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs text-slate-900 dark:text-white font-medium"
                        >
                          <option value="">(None)</option>
                          <optgroup label="Assets & Accounts">
                            {accounts.filter(acc => acc.id !== formData.accountId && acc.type !== 'asset').map(acc => (
                              <option key={acc.id} value={acc.id}>{acc.name} (₹{acc.balance.toLocaleString()})</option>
                            ))}
                          </optgroup>
                          {goals && goals.length > 0 && (
                            <optgroup label="Goals">
                              {goals.map((g: FinancialGoal) => (
                                <option key={g.id} value={g.id}>{g.name} (₹{g.currentAmount.toLocaleString()})</option>
                              ))}
                            </optgroup>
                          )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                      {accounts.find(a => a.id === formData.toAccountId)?.type === "debt" && (
                        <div className="pt-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Interest Portion (₹)</label>
                          <input 
                            type="number" 
                            value={formData.interestAmount}
                            onChange={(e) => setFormData({ ...formData, interestAmount: e.target.value })}
                            placeholder="0.00"
                            className="w-full p-2.5 mt-1 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs font-medium text-slate-900 dark:text-white"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Deposit To</label>
                    <div className="relative">
                      <select 
                        value={formData.accountId}
                        onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                        className="w-full p-2.5 pr-10 appearance-none bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs text-slate-900 dark:text-white font-medium"
                      >
                        <option value="" disabled>Select Destination</option>
                        {accounts.filter(a => ["bank", "cash", "card"].includes(a.type)).map(acc => (
                          <option key={acc.id} value={acc.id}>{acc.name} (₹{acc.balance.toLocaleString()})</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs font-medium text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                  <div className="relative">
                    <select 
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-2.5 pr-8 appearance-none bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-xs text-slate-900 dark:text-white font-medium"
                    >
                      {categories.map((cat: Category) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {formData.isAutomated && (
                <div className="p-3 bg-purple-500/5 dark:bg-purple-500/10 rounded-2xl border border-purple-500/10 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-purple-500 uppercase tracking-widest ml-1">Frequency</label>
                      <div className="relative">
                        <select 
                          value={formData.frequency}
                          onChange={(e) => setFormData({ ...formData, frequency: e.target.value as TransactionFrequency })}
                          className="w-full p-2 bg-white dark:bg-[#0b0d12] border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-[10px] font-bold text-purple-600 dark:text-purple-400"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-purple-500 uppercase tracking-widest ml-1">Occurrences</label>
                      <input 
                        type="number" 
                        value={formData.recurringCount}
                        onChange={(e) => setFormData({ ...formData, recurringCount: e.target.value })}
                        className="w-full p-2 bg-white dark:bg-[#0b0d12] border border-purple-500/20 rounded-xl focus:ring-2 focus:ring-purple-500 transition-all outline-none text-[10px] font-bold text-purple-600 dark:text-purple-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                onClick={handleSave}
                className="w-full mt-2 py-3.5 bg-primary hover:bg-primary-dark text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
              >
                {transaction ? "Update Entry" : "Commit Record"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
