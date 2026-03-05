"use client";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchGoals, addGoalAction, updateGoalAction } from "@/store/slices/goalsSlice";
import { EditGoalModal } from "@/components/goals/EditGoalModal";
import { FinancialGoal } from "@repo/types";
import { formatDate } from "@/lib/utils";
import { TopUpModal } from "@/components/goals/TopUpModal";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { Plus, Flag, Target, TrendingUp, Wallet, Pencil } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function GoalsPageClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const goals = useSelector((state: RootState) => state.goals.items);
  const loading = useSelector((state: RootState) => state.goals.loading);
  
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);
  const [topUpGoal, setTopUpGoal] = useState<FinancialGoal | null>(null);

  useEffect(() => {
    if (user) {
      dispatch(fetchGoals());
    }
  }, [dispatch, user]);

  // Simple Savings Gap Calculator
  const calculateGap = (goal: FinancialGoal) => {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const monthsRemaining = (targetDate.getFullYear() - today.getFullYear()) * 12 + (targetDate.getMonth() - today.getMonth());
    
    if (monthsRemaining <= 0) return 0;
    
    const shortfall = goal.targetAmount - goal.currentAmount;
    return shortfall / monthsRemaining;
  };

  const totalRequiredMonthly = goals.reduce((acc: number, goal: FinancialGoal) => acc + calculateGap(goal), 0);

  if (loading && goals.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] w-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full min-h-screen pb-12 lg:pb-8 pt-0">
      {/* Sticky Header */}
      <PageHeader
        title="Goals"
        subtitle={
          <>
            Need <span className="text-primary font-bold">₹{totalRequiredMonthly.toLocaleString(undefined, {maximumFractionDigits:0})}/mo</span> to meet all targets.
          </>
        }
        className="mb-6 space-y-3"
        actions={
          <button 
            onClick={() => { setEditingGoal(null); setIsGoalModalOpen(true); }}
            className="flex items-center justify-center gap-2 bg-primary text-white h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Goal</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 mt-4">
        {goals.length === 0 ? (
          <div className="lg:col-span-2 text-center py-20 bg-white dark:bg-slate-900/50 rounded-3xl border border-dashed border-slate-200 dark:border-white/5">
            <Flag className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">No Goals Set</h3>
            <p className="text-slate-500">Define your first milestone to start tracking progress.</p>
          </div>
        ) : (
          goals.map((goal: FinancialGoal) => {
            const reqMonthly = calculateGap(goal);
            const percent = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100).toFixed(1);

            return (
              <div key={goal.id} className="bg-white dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-white/5 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                 {/* Background Decorative Element */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                 
                <div className="flex flex-col gap-6 relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4">
                      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-slate-900 dark:text-white font-black text-xl tracking-tight">{goal.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Target:</span>
                          <span className="text-slate-900 dark:text-slate-200 text-xs font-black">{formatDate(goal.targetDate)}</span>
                        </div>
                        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-500/20">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>₹{reqMonthly.toLocaleString(undefined, {maximumFractionDigits:0})}/mo req.</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-primary font-black text-2xl tracking-tighter">{percent}%</div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end px-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-1">Position</span>
                        <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter">
                          ₹{goal.currentAmount.toLocaleString()} 
                          <span className="text-sm text-slate-400 font-normal tracking-tight ml-2">/ ₹{goal.targetAmount.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    <div className="relative h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="absolute h-full bg-primary rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">
                      <span>Started {formatDate(goal.startDate)}</span>
                      <span>{Math.round(goal.targetAmount - goal.currentAmount).toLocaleString()} Left</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 dark:border-white/5">
                    <button 
                      onClick={() => { setTopUpGoal(goal); setIsTopUpModalOpen(true); }}
                      className="flex-1 h-10 px-4 rounded-xl bg-primary text-white hover:bg-primary-dark text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <Wallet className="w-4 h-4" />
                        Top Up
                    </button>
                    <button 
                      onClick={() => { setEditingGoal(goal); setIsGoalModalOpen(true); }}
                      className="flex-1 h-10 px-4 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                        <Pencil className="w-4 h-4" />
                        Edit
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <EditGoalModal 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        editingGoal={editingGoal}
        onSave={(id, data) => {
          if (id) {
            dispatch(updateGoalAction({ id, data }))
              .unwrap()
              .then(() => toast.success("Goal updated"))
              .catch(() => toast.error("Failed to update goal"));
          } else {
            if (!user) return;
            dispatch(addGoalAction({
              userId: user.uid,
              name: data.name,
              targetAmount: data.targetAmount,
              currentAmount: 0,
              targetDate: data.targetDate,
              startDate: new Date().toISOString(),
              category: "General"
            }))
              .unwrap()
              .then(() => toast.success("Goal created"))
              .catch(() => toast.error("Failed to create goal"));
          }
          setIsGoalModalOpen(false);
        }}
      />

      <TopUpModal 
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        goal={topUpGoal}
        onSave={(amount) => {
          if (topUpGoal) {
            dispatch(updateGoalAction({
              id: topUpGoal.id,
              data: {
                currentAmount: topUpGoal.currentAmount + amount
              }
            }))
              .unwrap()
              .then(() => toast.success(`Invested ₹${amount.toLocaleString()} in ${topUpGoal.name}`))
              .catch(() => toast.error("Failed to update goal"));
          }
          setIsTopUpModalOpen(false);
        }}
      />
    </div>
  );
}
