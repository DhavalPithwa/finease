"use client";

import { useState } from "react";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { AssetAllocationDonut } from "@/components/dashboard/AssetLiabilityDonut";
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard";
import { AccountList } from "@/components/accounts/AccountList";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addAccount } from "@/store/slices/accountsSlice";
import { AddAccountModal } from "@/components/accounts/AddAccountModal";
import { FinancialGoal } from "@repo/types";
import { addCategory, updateCategory } from "@/store/slices/categoriesSlice";
import { AddCategoryModal } from "@/components/categories/AddCategoryModal";

import { useAuth } from "@/components/auth/AuthProvider";

export default function Home() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string; color: string } | null>(null);
  const accounts = useSelector((state: RootState) => state.accounts.items);
  const transactions = useSelector((state: RootState) => state.transactions.items);
  const categories = useSelector((state: RootState) => state.categories.items);
  const goals = useSelector((state: RootState) => state.goals.items);
  const stats = useSelector((state: RootState) => state.stats.data);

  const accountsWithBalance = accounts.map((acc: any) => {
    let currentBalance = acc.balance;
    transactions.forEach((tx: any) => {
      if (tx.isAutomated) return;
      if (tx.accountId === acc.id) {
        if (tx.type === 'expense') currentBalance -= tx.amount;
        if (tx.type === 'income') currentBalance += tx.amount;
      }
      if (tx.toAccountId === acc.id) {
        currentBalance += tx.amount;
      }
    });
    return { ...acc, computedBalance: currentBalance };
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 w-full">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Financial Command Center</h1>
          <p className="text-slate-500 font-medium mt-1">Welcome back, {user?.displayName || "User"}. Here represents your unified wealth landscape.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl transition-all shadow-sm active:scale-95"
          >
            + Category
          </button>
          <button 
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-primary/25 active:scale-95"
          >
            + Account
          </button>
        </div>
      </div>



      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Accounts</h3>
        <AccountList accounts={accountsWithBalance as any} />
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Spending Categories</h3>
          <button 
             onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
             className="text-sm font-bold text-primary hover:underline"
          >
             Add New
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map(c => (
            <div 
              key={c.id} 
              onClick={() => { setEditingCategory(c); setIsCategoryModalOpen(true); }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark flex items-center justify-between cursor-pointer hover:border-primary transition-colors group"
            >
               <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{c.name}</span>
               <div className={`w-3 h-3 rounded-full ${c.color}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NetWorthChart 
            data={stats.netWorthHistory} 
            currentNetWorth={stats.netWorth} 
            percentageChange={0} 
          />
        </div>
        <div className="lg:col-span-1">
          <AssetAllocationDonut data={stats.assetAllocation} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Goal Navigator</h3>
          <button className="text-sm font-bold text-primary hover:underline">View All</button>
        </div>
        
        {goals.length === 0 ? (
          <p className="text-sm text-slate-500">No goals set up yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {goals.map((goal: FinancialGoal) => {
              const pace = stats.goalPacing.find((p: any) => p.goalId === goal.id);
              return (
                <GoalProgressCard 
                  key={goal.id}
                  name={goal.name}
                  targetAmount={goal.targetAmount}
                  currentAmount={goal.currentAmount}
                  percentageSaved={pace?.actualPercentage || 0}
                  expectedPercentage={pace?.expectedPercentage || 0}
                  targetDate={goal.targetDate}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Transfer UI */}
      <AddAccountModal 
        isOpen={isAccountModalOpen} 
        onClose={() => setIsAccountModalOpen(false)} 
        onSave={(data) => {
          dispatch(addAccount({
            id: `acc-${Date.now()}`,
            userId: "user-1",
            name: data.name,
            type: data.type as any,
            balance: parseFloat(data.balance) || 0,
            currency: "INR",
            lastSyncedAt: new Date().toISOString()
          }));
          setIsAccountModalOpen(false);
        }} 
      />
      <AddCategoryModal 
        isOpen={isCategoryModalOpen}
        category={editingCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={(data) => {
          if (data.id) {
            dispatch(updateCategory({
              id: data.id,
              name: data.name,
              color: data.color
            }));
          } else {
            dispatch(addCategory({
              id: `cat-${Date.now()}`,
              name: data.name,
              color: data.color
            }));
          }
          setIsCategoryModalOpen(false);
        }}
      />
    </div>
  );
}

