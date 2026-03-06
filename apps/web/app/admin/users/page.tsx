"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { User as UserIcon, Shield, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth/AuthProvider";

interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  status?: 'active' | 'inactive';
  createdAt: string;
}

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get<User[]>("/admin/users");
      // Filter out current user from the list
      const filteredUsers = res.data.filter(u => u.id !== currentUser?.uid);
      setUsers(filteredUsers);
    } catch {
      toast.error("Failed to fetch user list");
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  const toggleUserStatus = async (uid: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'inactive' ? 'active' : 'inactive';
      await api.put(`/admin/users/${uid}`, { status: newStatus });
      setUsers(users.map(u => u.id === uid ? { ...u, status: newStatus as User['status'] } : u));
      toast.success(`User set to ${newStatus}`);
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const changeUserRole = async (uid: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      await api.put(`/admin/users/${uid}`, { role: newRole });
      setUsers(users.map(u => u.id === uid ? { ...u, role: newRole as User['role'] } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch {
      toast.error("Failed to update user role");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton className="h-10 w-48" />
        <Card className="p-0 overflow-hidden">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          ))}
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 min-h-screen pb-24 lg:pb-8">
      <PageHeader 
        title="User Governance" 
        subtitle={`Commanding ${users.length} registered identities`}
      />

      <div className="hidden lg:block overflow-hidden rounded-[2rem] border border-slate-100 dark:border-white/5 bg-white dark:bg-surface-dark shadow-2xl shadow-slate-200/50 dark:shadow-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorization</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-6" title={user.id}>
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                      <UserIcon className="size-5 text-slate-500" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{user.displayName}</span>
                      <span className="text-xs text-slate-500 font-medium">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <button 
                    onClick={() => changeUserRole(user.id, user.role)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      user.role === 'admin' 
                        ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' 
                        : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                    }`}
                  >
                    {user.role === 'admin' ? <ShieldAlert className="size-3" /> : <Shield className="size-3" />}
                    {user.role}
                  </button>
                </td>
                <td className="px-6 py-6">
                  <div className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${
                    user.status === 'inactive' ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {user.status === 'inactive' ? <XCircle className="size-3" /> : <CheckCircle2 className="size-3" />}
                    {user.status || 'active'}
                  </div>
                </td>
                <td className="px-6 py-6 text-right">
                   <button 
                     onClick={() => toggleUserStatus(user.id, user.status || 'active')}
                     className={`h-8 px-4 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${
                       user.status === 'inactive' 
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                        : 'bg-white dark:bg-slate-900 text-rose-500 border-rose-100 dark:border-rose-500/20'
                     }`}
                   >
                     {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile-friendly card list */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="p-6 space-y-4 border-slate-100 dark:border-white/5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                  <UserIcon className="size-5 text-slate-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{user.displayName}</span>
                  <span className="text-xs text-slate-500 font-medium truncate max-w-[150px]">{user.email}</span>
                </div>
              </div>
              <div className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${
                user.status === 'inactive' ? 'text-rose-500' : 'text-emerald-500'
              }`}>
                {user.status === 'inactive' ? <XCircle className="size-3" /> : <CheckCircle2 className="size-3" />}
                {user.status || 'active'}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button 
                onClick={() => changeUserRole(user.id, user.role)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                  user.role === 'admin' 
                    ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' 
                    : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                }`}
              >
                {user.role === 'admin' ? <ShieldAlert className="size-3" /> : <Shield className="size-3" />}
                {user.role}
              </button>
              
              <button 
                onClick={() => toggleUserStatus(user.id, user.status || 'active')}
                className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                  user.status === 'inactive' 
                   ? 'bg-emerald-500 text-white border-emerald-600' 
                   : 'bg-white dark:bg-slate-900/50 text-rose-500 border-rose-100 dark:border-rose-500/20'
                }`}
              >
                {user.status === 'inactive' ? 'Activate' : 'Deactivate'}
              </button>
            </div>
          </Card>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="p-20 text-center font-bold text-slate-400 uppercase tracking-widest text-xs">
          No other identities detected in this sector
        </div>
      )}
    </div>
  );
}

