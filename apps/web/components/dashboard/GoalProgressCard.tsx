"use client";

import { motion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";

interface GoalProgressProps {
  name: string;
  targetAmount: number;
  currentAmount: number;
  percentageSaved: number;
  expectedPercentage: number;
  deadline: string;
}

export function GoalProgressCard({ 
  name, 
  targetAmount, 
  currentAmount, 
  percentageSaved, 
  expectedPercentage,
  deadline 
}: GoalProgressProps) {
  const isOnTrack = percentageSaved >= expectedPercentage;

  return (
    <div className="p-6 glass-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-accent/20 rounded-lg">
            <Target className="w-5 h-5 text-brand-accent" />
          </div>
          <div>
            <h4 className="font-bold text-white">{name}</h4>
            <p className="text-xs text-gray-400">Target: ${targetAmount.toLocaleString()}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-bold ${isOnTrack ? 'text-emerald-500' : 'text-amber-500'}`}>
            {isOnTrack ? 'On Track' : 'Behind Pace'}
          </div>
          <p className="text-xs text-gray-400">Until {new Date(deadline).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Saved Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Saved: ${currentAmount.toLocaleString()}</span>
            <span className="text-white font-medium">{percentageSaved}%</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentageSaved}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-emerald-500 rounded-full"
            />
          </div>
        </div>

        {/* Pace Line Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Required Pace</span>
            <span className="text-gray-300 font-medium">{expectedPercentage}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${expectedPercentage}%` }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="h-full bg-blue-500/50 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-xs">
        <TrendingUp className="w-3 h-3 text-emerald-500" />
        <span className="text-gray-400">
          You need to save <span className="text-white font-medium">$1,200/mo</span> to hit this goal.
        </span>
      </div>
    </div>
  );
}
