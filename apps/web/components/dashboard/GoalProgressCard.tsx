"use client";

import { Target, CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

interface GoalProgressProps {
  name: string;
  targetAmount: number;
  currentAmount: number;
  percentageSaved: number;
  expectedPercentage: number;
  targetDate: string;
}

export function GoalProgressCard({ 
  name, 
  targetAmount, 
  currentAmount, 
  percentageSaved, 
  expectedPercentage,
  targetDate 
}: GoalProgressProps) {
  const diff = percentageSaved - expectedPercentage;
  const status = diff >= 0 ? (diff > 5 ? "ahead" : "ontrack") : "behind";
  
  const statusConfig = {
    ahead: { 
      label: "Ahead of schedule", 
      badge: "ahead",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      color: "text-emerald-600"
    },
    ontrack: { 
      label: "On Track", 
      badge: "ontrack",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      color: "text-blue-600"
    },
    behind: { 
      label: `Behind by ${Math.abs(Math.round(diff))}%`, 
      badge: "behind",
      icon: <AlertCircle className="w-3.5 h-3.5" />,
      color: "text-red-500"
    }
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig];

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 border border-indigo-100 dark:border-indigo-500/20">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <p className="text-slate-900 dark:text-white text-sm font-bold">{name}</p>
            <p className="text-xs text-slate-500 font-medium">Target: {formatCurrency(targetAmount)} by {new Date(targetDate).getFullYear()}</p>
          </div>
        </div>
        <span className="text-slate-900 dark:text-white text-sm font-bold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-100 dark:border-slate-700">
          {Math.round(percentageSaved)}%
        </span>
      </div>

      <div className="space-y-3">
        <ProgressBar 
          progress={percentageSaved} 
          expectedPace={expectedPercentage}
          barClassName={status === 'behind' ? 'bg-red-500' : 'bg-indigo-500'}
        />
        
        <div className="flex justify-between text-xs font-medium">
          <span className="text-slate-500">Saved: {formatCurrency(currentAmount)}</span>
          <Badge variant={currentStatus.badge as "ahead" | "behind" | "ontrack" | "default"} icon={currentStatus.icon}>
            {currentStatus.label}
          </Badge>
        </div>
      </div>
    </Card>
  );
}

