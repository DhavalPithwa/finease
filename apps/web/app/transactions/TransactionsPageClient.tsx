"use client";

import { useState } from "react";
import Link from "next/link";
import { TransactionModal } from "@/components/transactions/TransactionModal";
import { AddAccountModal } from "@/components/accounts/AddAccountModal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addTransaction, updateTransaction, deleteTransaction } from "@/store/slices/transactionsSlice";
import { addAccount, updateAccountBalance } from "@/store/slices/accountsSlice";
import { Transaction } from "@repo/types";
import { Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

export default function TransactionsPageClient() {
  const dispatch = useDispatch();
  const transactions = useSelector((state: RootState) => state.transactions.items);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"actual" | "automated">("actual");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Transaction | null>(null);

  const filtered = transactions.filter((t: Transaction) => {
    const isSearchMatch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const isTabMatch = activeTab === "automated" ? !!t.isAutomated : !t.isAutomated;
    return isSearchMatch && isTabMatch;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transactions</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your financial activities</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Link href="/transactions/import" className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none dark:border-border-dark dark:bg-surface-dark dark:text-slate-200 dark:hover:bg-border-dark">
            <span className="material-symbols-outlined mr-2 text-lg">upload_file</span>
            Import
          </Link>
          <button onClick={() => { setEditingData(null); setIsModalOpen(true); }} className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background-dark">
            <span className="material-symbols-outlined mr-2 text-lg">add</span>
            Transaction
          </button>
        </div>
      </div>

      <div className="mb-6 border-b border-slate-200 dark:border-border-dark overflow-x-auto">
        <nav aria-label="Tabs" className="-mb-px flex space-x-4 sm:space-x-8 min-w-max">
          <button 
            onClick={() => setActiveTab("actual")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold inline-flex items-center gap-2 transition-colors ${activeTab === 'actual' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            Actual Transactions
            <span className={`hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block ${activeTab === 'actual' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
              {transactions.filter((t: Transaction) => !t.isAutomated).length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab("automated")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-semibold inline-flex items-center gap-2 transition-colors ${activeTab === 'automated' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:hover:text-slate-300'}`}
          >
            <span className="material-symbols-outlined text-[20px]">autorenew</span>
            Automated Movements
            <span className={`hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block ${activeTab === 'automated' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
              {transactions.filter((t: Transaction) => !!t.isAutomated).length}
            </span>
          </button>
        </nav>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark mb-6">
        <div className="relative w-full md:w-96">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="material-symbols-outlined text-slate-400">search</span>
          </div>
          <input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 dark:bg-[#0b0d12] dark:text-white dark:ring-border-dark dark:focus:ring-primary" 
            placeholder="Search transactions..." 
            type="text"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
            <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-[#0b0d12] dark:text-slate-300">
              <tr>
                <th className="px-6 py-4" scope="col">Date</th>
                <th className="px-6 py-4" scope="col">Description</th>
                <th className="px-6 py-4" scope="col">Category</th>
                <th className="px-6 py-4 text-right" scope="col">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
              {filtered.map((tx: Transaction) => (
                <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {new Date(tx.date).toLocaleDateString()}
                      {tx.isAutomated && (
                         <div className="text-xs text-purple-500 mt-0.5">
                           Every {tx.frequency} ({tx.recurringCount}x)
                         </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">{tx.description}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${tx.type === 'expense' ? 'text-red-500' : 'text-emerald-500'}`}>
                      {tx.type === 'expense' ? '-' : '+'} ₹{tx.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 w-20 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setEditingData(tx); setIsModalOpen(true); }}
                        className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (!tx.isAutomated) {
                            dispatch(updateAccountBalance({ id: tx.accountId, amountChange: tx.type === 'expense' ? tx.amount : -tx.amount }));
                            if (tx.toAccountId) {
                              dispatch(updateAccountBalance({ id: tx.toAccountId, amountChange: -tx.amount }));
                            }
                          }
                          dispatch(deleteTransaction(tx.id));
                          toast.success("Transaction deleted");
                        }}
                        className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <TransactionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        transaction={editingData}
        onSave={(data) => {
          const amountVar = parseFloat(data.amount);
          
          if (editingData) {
            if (!editingData.isAutomated) {
              dispatch(updateAccountBalance({ id: editingData.accountId, amountChange: editingData.type === 'expense' ? editingData.amount : -editingData.amount }));
              if (editingData.toAccountId) {
                dispatch(updateAccountBalance({ id: editingData.toAccountId, amountChange: -editingData.amount }));
              }
            }
            if (!data.isAutomated) {
              dispatch(updateAccountBalance({ id: data.accountId, amountChange: data.type === 'expense' ? -amountVar : amountVar }));
              if (data.toAccountId) {
                dispatch(updateAccountBalance({ id: data.toAccountId, amountChange: amountVar }));
              }
            }
            dispatch(updateTransaction({ ...editingData, ...data, amount: amountVar }));
          } else {
            const newTx: Transaction = {
              id: `tx-${Date.now()}`,
              userId: "user-1",
              accountId: data.accountId,
              toAccountId: data.toAccountId || undefined,
              amount: amountVar,
              date: data.date,
              description: data.description,
              category: data.category,
              type: data.type,
              status: "pending",
              metadata: {},
              isAutomated: data.isAutomated,
              frequency: data.frequency,
              recurringCount: data.recurringCount
            };
            
            if (!newTx.isAutomated) {
              dispatch(updateAccountBalance({ id: newTx.accountId, amountChange: newTx.type === 'expense' ? -newTx.amount : newTx.amount }));
              if (newTx.toAccountId) {
                dispatch(updateAccountBalance({ id: newTx.toAccountId, amountChange: newTx.amount }));
              }
            }
            dispatch(addTransaction(newTx));
          }
          setIsModalOpen(false);
        }} 
      />
      <AddAccountModal 
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onSave={(data) => {
          dispatch(addAccount({
            id: `acc-${Date.now()}`,
            userId: "user-1",
            name: data.name,
            type: data.type as any,
            assetType: "",
            balance: parseFloat(data.balance) || 0,
            currency: "INR",
            lastSyncedAt: new Date().toISOString()
          }));
          setIsAccountModalOpen(false);
        }}
      />
    </div>
  );
}
