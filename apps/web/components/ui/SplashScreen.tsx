"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Hide after initial load - this is just a backup if not controlled by parent
    const timer = setTimeout(() => {
      setIsVisible(true); // Keep it visible until parent unmounts or we decide otherwise
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white dark:bg-[#0f1115]"
        >
          <div className="relative flex flex-col items-center">
            {/* Branded Logo Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                duration: 0.8, 
                ease: [0, 0.71, 0.2, 1.01],
                scale: {
                  type: "spring",
                  damping: 12,
                  stiffness: 100,
                  restDelta: 0.001
                }
              }}
              className="relative size-32"
            >
              {/* Pulsing Backlight */}
              <div className="absolute inset-0 rounded-[2.5rem] bg-primary/20 blur-3xl animate-pulse" />
              
              {/* Geometric Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-24 rounded-[2rem] bg-gradient-to-tr from-primary to-emerald-500 shadow-2xl shadow-primary/40 flex items-center justify-center transform rotate-12 hover:rotate-0 transition-transform duration-700">
                  <div className="size-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center -rotate-12">
                     <div className="size-6 bg-white rounded-md transform rotate-45 shadow-sm" />
                  </div>
                </div>
              </div>

              {/* Orbiting Ring */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-6 border-2 border-primary/5 rounded-full border-dashed"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-10 border border-emerald-500/5 rounded-full border-dotted"
              />
            </motion.div>

            {/* Branded Text */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-16 text-center space-y-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                  Fin<span className="text-primary">Ease</span>
                </span>
              </div>
              
              <div className="flex flex-col items-center gap-2">
                <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">
                  Sovereign Wealth Architect
                </div>
                <div className="flex gap-1.5 h-1 items-center">
                  <motion.div 
                    animate={{ scaleY: [1, 2, 1] }} 
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-1 h-3 bg-primary/30 rounded-full" 
                  />
                  <motion.div 
                    animate={{ scaleY: [1, 2, 1] }} 
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1 h-5 bg-primary rounded-full" 
                  />
                  <motion.div 
                    animate={{ scaleY: [1, 2, 1] }} 
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1 h-3 bg-primary/30 rounded-full" 
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Security Badge */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-12 flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5"
          >
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Secured Decentralized Instance
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
