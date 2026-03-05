"use client";

import { useState, useEffect } from "react";
import { X, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GoalFormData {
  name: string;
  targetAmount: number;
  targetDate: string;
}

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (goalId: string | null, data: GoalFormData) => void;
  editingGoal?: {
    id: string;
    name: string;
    targetAmount: number;
    targetDate: string;
  } | null;
}

export function EditGoalModal({ isOpen, onClose, onSave, editingGoal }: EditGoalModalProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    name: "",
    targetAmount: 0,
    targetDate: "",
  });

  useEffect(() => {
    if (editingGoal) {
      setFormData({
        name: editingGoal.name,
        targetAmount: editingGoal.targetAmount,
        targetDate: editingGoal.targetDate,
      });
    } else {
      setFormData({ name: "", targetAmount: 0, targetDate: "" });
    }
  }, [editingGoal, isOpen]);

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
                {editingGoal ? "Goal Refinement" : "New Milestone"}
              </h3>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Objective</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. World Tour"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Magnitude (₹)</label>
                <input 
                  type="number" 
                  value={formData.targetAmount || ""}
                  onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                  placeholder="0.00"
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-black text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Horizon Date</label>
                <input 
                  type="date" 
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all"
                />
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
                onClick={() => onSave(editingGoal?.id || null, formData)}
                className="flex-[2] h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-primary/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <Flag className="w-4 h-4" />
                Commit Goal
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
