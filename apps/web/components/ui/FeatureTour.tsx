"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  ShieldCheck,
  Target,
  TrendingUp,
  Compass,
  Zap,
  UserCircle2,
  Lock,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";

interface TourStep {
  title: string;
  description: string;
  icon: React.ReactNode;
  selector?: string; // For highlighting elements later if needed
}

export function FeatureTour() {
  const { user, updateProfile } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Show tour if user is logged in and hasn't onboarded yet
    if (user && user.hasOnboarded === false) {
      setIsVisible(true);
    }
  }, [user]);

  const steps: TourStep[] = [
    {
      title: "Welcome to FinEase",
      description:
        "Your financial engine is now online. Let's take a quick look at the controls of your new wealth command center.",
      icon: <Sparkles className="w-10 h-10 text-primary" />,
    },
    {
      title: "Unified Liquidity",
      description:
        "Monitor your cash flow and bank balances in real-time. Link your units of capital to see your immediate buying power.",
      icon: <Zap className="w-10 h-10 text-emerald-500" />,
    },
    {
      title: "Growth Portfolio",
      description:
        "Track your investments across stocks, mutual funds, and assets. Watch your net worth evolve through our automated tracking.",
      icon: <TrendingUp className="w-10 h-10 text-indigo-500" />,
    },
    {
      title: "Wealth Mapping",
      description:
        "Define your 'Financial North Star' by setting goals. We'll calculate the exact velocity needed to reach your targets.",
      icon: <Target className="w-10 h-10 text-rose-500" />,
    },
    {
      title: "Privacy Protocol",
      description:
        "Your data is encrypted and private. Use biometric locks or PINs to secure your financial architecture on any device.",
      icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    },
    {
      title: "Identity Gateway",
      description:
        "Switch profiles instantly. Manage your family's or business's ledgers under one master identity without logging out.",
      icon: <UserCircle2 className="w-10 h-10 text-primary" />,
    },
    {
      title: "Protocol Governance",
      description:
        "Administer your financial architecture. Sanitize ledgers and govern sub-nodes via the encrypted Purge terminal.",
      icon: <Lock className="w-10 h-10 text-orange-500" />,
    },
    {
      title: "Ready for Launch",
      description:
        "You're now ready to pilot your financial future. Sync your data and let FinEase guide you to absolute clarity.",
      icon: <Compass className="w-10 h-10 text-emerald-500" />,
    },
  ];

  const handleComplete = () => {
    setIsVisible(false);
    updateProfile({ hasOnboarded: true });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-[#0f1115] w-full max-w-lg rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden"
        >
          {/* Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-white/5">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <button
            onClick={handleComplete}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="size-20 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-8 shadow-inner"
            >
              {steps[currentStep]?.icon}
            </motion.div>

            <motion.div
              key={`text-${currentStep}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                {steps[currentStep]?.title}
              </h2>
              <p className="text-sm md:text-base font-medium text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mb-12">
                {steps[currentStep]?.description}
              </p>
            </motion.div>

            <div className="flex items-center justify-between w-full pt-4">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-0 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-1.5">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`size-1.5 rounded-full transition-all duration-300 ${i === currentStep ? "bg-primary w-4" : "bg-slate-200 dark:bg-white/10"}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:scale-105 transition-all"
              >
                {currentStep === steps.length - 1
                  ? "Begin Mission"
                  : "Secure Next"}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Decorative background elements */}
          <div className="absolute -bottom-12 -right-12 size-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 -left-12 size-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
