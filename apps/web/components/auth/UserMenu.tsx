"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { LogIn, LogOut, User as UserIcon, Settings } from "lucide-react";
import Link from "next/link";

export function UserMenu() {
  const { user, logout, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return <div className="size-8 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse" />;
  }

  if (!user) {
    return (
      <Link href="/login" className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white text-xs font-bold rounded-lg transition-all">
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Sign In</span>
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-4" ref={menuRef}>
      <div className="hidden sm:block text-right">
        <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user.displayName}</p>
        <p className="text-[10px] text-slate-500 font-medium">{user.email}</p>
      </div>
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="size-8 rounded-full bg-gradient-to-tr from-primary to-emerald-400 p-[1px] overflow-hidden flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="w-full h-full rounded-full bg-white dark:bg-background-dark flex items-center justify-center text-primary">
            {user.gender === "Male" ? (
              <UserIcon className="w-5 h-5" />
            ) : user.gender === "Female" ? (
              <UserIcon className="w-5 h-5" />
            ) : (
              <UserIcon className="w-5 h-5" />
            )}
          </div>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark rounded-2xl shadow-2xl py-3 z-[100] animate-in fade-in zoom-in duration-200">
            <div className="px-4 py-2 border-b border-slate-100 dark:border-border-dark mb-2 sm:hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{user.displayName}</p>
              <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider truncate">{user.email}</p>
            </div>
            
            {user.role !== "admin" && (
              <Link 
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </Link>
            )}
            
            <button 
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors mt-1"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
