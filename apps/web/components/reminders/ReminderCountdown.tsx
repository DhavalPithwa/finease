"use client";

import { useEffect, useState, useMemo } from "react";
import { Clock, ShieldAlert, FileText, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reminder } from "@/store/slices/remindersSlice";

interface ReminderCountdownProps {
  reminders: Reminder[];
  onEdit?: (reminder: Reminder) => void;
}

export function ReminderCountdown({ reminders, onEdit }: ReminderCountdownProps) {
  const sortedReminders = useMemo(() => {
    return [...reminders].sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());
  }, [reminders]);

  if (reminders.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Signal Horizon</h3>
        <span className="text-[8px] font-black text-primary uppercase bg-primary/10 px-1.5 py-0.5 rounded tracking-[0.1em]">Active Monitoring</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <AnimatePresence mode="popLayout">
          {sortedReminders.map((reminder) => (
            <CountdownCard key={reminder.id} reminder={reminder} onClick={() => onEdit?.(reminder)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CountdownCard({ reminder, onClick }: { reminder: Reminder; onClick: () => void }) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number }>({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(reminder.expiryDate).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
      });
    };

    calculate();
    const timer = setInterval(calculate, 60000);
    return () => clearInterval(timer);
  }, [reminder.expiryDate]);

  const isCritical = timeLeft.days < 7;
  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0;

  const Icon = reminder.type === 'policy' ? ShieldAlert : reminder.type === 'document' ? FileText : Activity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className={`group cursor-pointer p-4 rounded-2xl border transition-all active:scale-[0.98] ${
        isCritical 
          ? "bg-rose-50/50 dark:bg-rose-500/5 border-rose-100 dark:border-rose-500/20 shadow-lg shadow-rose-500/5" 
          : "bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-primary/20"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`p-2 rounded-xl ${isCritical ? "bg-rose-500/10 text-rose-500" : "bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/5"} transition-colors`}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <h4 className={`text-xs font-black truncate tracking-tight ${isCritical ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
              {reminder.name}
            </h4>
            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 ml-2 whitespace-nowrap uppercase">
              ₹{reminder.renewalAmount.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-end justify-between mt-2">
            <div className="flex gap-2">
              <div className="flex flex-col">
                <span className={`text-lg font-black leading-none tracking-tighter ${isCritical ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                  {timeLeft.days}
                </span>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Days</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-black leading-none tracking-tighter ${isCritical ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"}`}>
                  {timeLeft.hours}
                </span>
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest mt-1">Hrs</span>
              </div>
            </div>

            {isExpired ? (
              <span className="text-[8px] font-black text-rose-500 uppercase bg-rose-500/10 px-1.5 py-0.5 rounded animate-pulse">Critical / Expired</span>
            ) : isCritical ? (
              <span className="text-[8px] font-black text-orange-500 uppercase bg-orange-500/10 px-1.5 py-0.5 rounded">High Velocity</span>
            ) : (
              <Clock className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
