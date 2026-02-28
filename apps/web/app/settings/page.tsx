"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect } from "react";
import { User as UserIcon, Phone, Mail, Calendar, UserCog } from "lucide-react";

export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
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
      });
    }
  }, [user]);

  const handleSave = () => {
    updateProfile({
      gender: formData.gender,
      dob: formData.dob,
    });
    alert("Profile Updated Successfully!");
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-3xl w-full px-4 sm:px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your personal profile and preferences</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm dark:border-border-dark dark:bg-surface-dark space-y-8">
        
        <div className="flex items-center gap-4 border-b border-slate-100 dark:border-border-dark pb-8">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            {formData.gender === "Male" ? (
              <span className="material-symbols-outlined !text-[32px]">face</span>
            ) : formData.gender === "Female" ? (
              <span className="material-symbols-outlined !text-[32px]">face_3</span>
            ) : (
              <UserIcon className="w-8 h-8" />
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{formData.name}</h2>
            <p className="text-sm font-medium text-slate-500 mt-0.5">Basic Member</p>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCog className="w-5 h-5 text-primary" /> Profile Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.name}
                  disabled
                  className="w-full p-3 pl-10 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark rounded-xl text-slate-500 dark:text-slate-400 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full p-3 pl-10 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark rounded-xl text-slate-500 dark:text-slate-400 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="tel" 
                  value={formData.phone}
                  disabled
                  className="w-full p-3 pl-10 bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-border-dark rounded-xl text-slate-500 dark:text-slate-400 opacity-70 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 text-primary">Gender (Editable)</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-primary/50 dark:border-primary/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
              >
                <option>Not Specified</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 text-primary">Date of Birth (Editable)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full p-3 pl-10 bg-slate-50 dark:bg-[#0b0d12] border border-primary/50 dark:border-primary/50 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={handleSave}
              className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
            >
              Save Changes
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
