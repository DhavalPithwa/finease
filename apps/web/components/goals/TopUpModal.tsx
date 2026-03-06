"use client";

import { useState } from "react";
import { Rocket } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { FinancialGoal } from "@repo/types";
import { Button } from "@/components/ui/Button";

interface TopUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: FinancialGoal | null;
  onSave: (amount: number) => Promise<void> | void;
}

export function TopUpModal({ isOpen, onClose, goal, onSave }: TopUpModalProps) {
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!goal) return null;

  const handleSave = async () => {
    const val = parseFloat(amount);
    if (val <= 0 || isNaN(val)) return;

    setIsSaving(true);
    try {
      await onSave(val);
      setAmount("");
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Capital Injection"
      maxWidth="max-w-sm"
      footer={
        <div className="flex gap-3 w-full">
          <Button 
            variant="secondary"
            onClick={onClose}
            className="flex-1"
            disabled={isSaving}
          >
            Retreat
          </Button>
          <Button 
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!amount || parseFloat(amount) <= 0}
            className="flex-[2]"
            leftIcon={<Rocket className="w-4 h-4 hover:rotate-12 transition-transform" />}
          >
            Deploy Capital
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
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
              disabled={isSaving}
              className="w-full h-12 bg-slate-50 dark:bg-slate-950 border-none rounded-xl pl-8 pr-4 text-lg font-black text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
