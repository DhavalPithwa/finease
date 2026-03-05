"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect } from "react";
import { User as UserIcon, Phone, Mail, Calendar, UserCog, Target, ChevronDown, Save, CheckCircle2, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    needsTarget: 50,
    wantsTarget: 30,
    savingsTarget: 20,
    name: "",
    email: "",
    phone: "+91 ",
    gender: "Not Specified",
    dob: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.displayName || "",
        email: user.email || "",
        phone: user.phone || "+91 9876543210",
        gender: user.gender || "Not Specified",
        dob: user.dob || "1990-01-01",
        needsTarget: user.budgetTargets?.needs ?? 50,
        wantsTarget: user.budgetTargets?.wants ?? 30,
        savingsTarget: user.budgetTargets?.savings ?? 20,
      });
    }
  }, [user]);

  const handleSave = () => {
    const total = formData.needsTarget + formData.wantsTarget + formData.savingsTarget;
    if (total !== 100) {
      toast.error(`Targets must sum to 100%. Currently: ${total}%`);
      return;
    }

    updateProfile({
      gender: formData.gender,
      dob: formData.dob,
      budgetTargets: {
        needs: formData.needsTarget,
        wants: formData.wantsTarget,
        savings: formData.savingsTarget,
      }
    });
    toast.success("Profile Updated Successfully!");
    
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 w-full space-y-4 sm:space-y-6 pb-12 lg:pb-12 pt-0">
      {/* Sticky Header */}
      <PageHeader
        title="Architect Settings"
        subtitle="Configure your financial engine"
        className="space-y-1 mb-4"
      />

      <div className="rounded-3xl border border-slate-200 bg-white p-5 md:p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none dark:border-white/5 dark:bg-slate-900 space-y-6 md:space-y-8">
        
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-white/5 pb-6 md:pb-8">
          <div className="size-14 md:size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 relative overflow-hidden group">
            {formData.gender === "Male" ? (
              <UserIcon className="w-6 h-6 md:w-8 md:h-8" />
            ) : formData.gender === "Female" ? (
              <UserIcon className="w-6 h-6 md:w-8 md:h-8" />
            ) : (
              <UserIcon className="w-6 h-6 md:w-8 md:h-8" />
            )}
            <div className="absolute inset-0 bg-primary/20 scale-0 group-hover:scale-150 transition-transform duration-500" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight">{formData.name}</h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest mt-0.5">Primary Node</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-4">
            <UserCog className="w-5 h-5 text-primary" />
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Profile Core</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Legal Identity</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.name}
                  disabled
                  className="w-full h-10 pl-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed text-xs font-bold ring-1 ring-slate-100 dark:ring-white/5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Communication Node</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full h-10 pl-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed text-xs font-bold ring-1 ring-slate-100 dark:ring-white/5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Mobile Uplink</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="tel" 
                  value={formData.phone}
                  disabled
                  className="w-full h-10 pl-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed text-xs font-bold ring-1 ring-slate-100 dark:ring-white/5"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Gender Identity</label>
              <div className="relative">
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="w-full h-10 px-3 pr-10 appearance-none bg-slate-50 dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white text-xs font-bold ring-1 ring-slate-100 dark:ring-white/5 transition-all"
                >
                  <option>Not Specified</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Biological Horizon</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full h-10 pl-10 pr-3 bg-slate-50 dark:bg-slate-950 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none text-slate-900 dark:text-white text-xs font-bold ring-1 ring-slate-100 dark:ring-white/5 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-white/5 mt-8">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-emerald-500" />
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Budget Protocol Targets</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest pl-1">Essential Needs</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.needsTarget}
                    onChange={(e) => setFormData({ ...formData, needsTarget: parseFloat(e.target.value) || 0 })}
                    className="w-full h-10 px-3 pr-10 bg-indigo-50/30 dark:bg-indigo-500/5 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white text-sm font-black ring-1 ring-indigo-500/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-indigo-400/50 font-black text-xs">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-pink-500 uppercase tracking-widest pl-1">Discretionary wants</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.wantsTarget}
                    onChange={(e) => setFormData({ ...formData, wantsTarget: parseFloat(e.target.value) || 0 })}
                    className="w-full h-10 px-3 pr-10 bg-pink-50/30 dark: pink-500/5 border-none rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-slate-900 dark:text-white text-sm font-black ring-1 ring-pink-500/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-pink-400/50 font-black text-xs">%</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest pl-1">Capital Savings</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={formData.savingsTarget}
                    onChange={(e) => setFormData({ ...formData, savingsTarget: parseFloat(e.target.value) || 0 })}
                    className="w-full h-10 px-3 pr-10 bg-emerald-50/30 dark:bg-emerald-500/5 border-none rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white text-sm font-black ring-1 ring-emerald-500/20 transition-all"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400/50 font-black text-xs">%</span>
                </div>
              </div>
            </div>

            <div className={`mt-4 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 ${formData.needsTarget + formData.wantsTarget + formData.savingsTarget === 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
              {formData.needsTarget + formData.wantsTarget + formData.savingsTarget === 100 ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5" />
              )}
              Configuration Equilibrium: {formData.needsTarget + formData.wantsTarget + formData.savingsTarget}% 
              {formData.needsTarget + formData.wantsTarget + formData.savingsTarget !== 100 && ' (Must equal 100%)'}
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleSave}
              className="w-full md:w-auto h-11 px-8 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Save className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Sync Architecture
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
