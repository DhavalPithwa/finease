"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  expectedPace?: number;
  className?: string;
  barClassName?: string;
  paceClassName?: string;
}

export function ProgressBar({
  progress,
  expectedPace,
  className,
  barClassName,
  paceClassName,
}: ProgressBarProps) {
  return (
    <div
      className={cn(
        "relative h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner",
        className,
      )}
    >
      {/* Actual Progress */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, progress)}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={cn("absolute inset-y-0 left-0 bg-primary", barClassName)}
      />

      {/* Expected Pace Marker (Vertical Tick) */}
      {expectedPace !== undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className={cn(
            "absolute inset-y-0 w-1 bg-red-400 z-10 ring-2 ring-white dark:ring-slate-900 shadow-sm",
            paceClassName,
          )}
          style={{ left: `${Math.min(100, expectedPace)}%` }}
          title="Expected Pace"
        />
      )}
    </div>
  );
}
