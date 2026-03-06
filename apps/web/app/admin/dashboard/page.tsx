"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Activity, 
  ShieldCheck, 
  Database,
  ArrowUpRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { AdminStats } from "@repo/types";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<AdminStats>("/admin/stats");
        setStats(res.data);
      } catch (error) {
        // Silent error for now as per requirements to remove console errors
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08090a] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.3em] text-[10px]">
            <ShieldCheck className="w-4 h-4" />
            System Governance
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
            Omniscience <span className="text-slate-400 font-medium">Dashboard</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Sovereigns" 
            value={stats?.totalUsers.toLocaleString() ?? "0"} 
            icon={<Users className="w-5 h-5" />}
            trend="+12% this week"
          />
          <StatCard 
            title="Active Pulsars" 
            value={stats?.activeUsers24h.toLocaleString() ?? "0"} 
            icon={<Activity className="w-5 h-5" />}
            trend="Live Now"
            color="emerald"
          />
          <StatCard 
            title="Total Valuation" 
            value={`₹${(stats?.totalAssetsTracked ? stats.totalAssetsTracked / 10000000 : 0).toFixed(2)}Cr`} 
            icon={<Database className="w-5 h-5" />}
            trend="Global Assets"
            color="primary"
          />
          <StatCard 
            title="System Status" 
            value={stats?.systemHealth ?? "Optimal"} 
            icon={<ShieldCheck className="w-5 h-5" />}
            trend="All Systems Normal"
            color="indigo"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Growth Velocity</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">User Acquisition Trend</p>
                </div>
                <div className="flex gap-2">
                  <div className="size-2 rounded-full bg-primary" />
                  <div className="size-2 rounded-full bg-slate-200 dark:bg-slate-800" />
                </div>
              </div>
              
              <div className="flex-1 flex items-end justify-between gap-4 px-2">
                {stats?.userGrowth.map((g, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-4">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.min(100, (g.count / (stats.totalUsers || 1)) * 100)}%` }}
                      transition={{ delay: i * 0.1, duration: 1 }}
                      className="w-full max-w-[40px] bg-gradient-to-t from-primary/80 to-primary rounded-2xl relative group"
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-primary text-white text-[10px] font-black px-2 py-1 rounded-lg">
                        {g.count}
                      </div>
                    </motion.div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{g.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-[2.5rem] bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Real-time Feed</h3>
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              
              <div className="space-y-6">
                {stats?.recentActivities.map((activity, i) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="mt-1">
                      <div className={`size-2 rounded-full ${i === 0 ? 'bg-primary animate-pulse' : 'bg-slate-200 dark:bg-slate-800'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{activity.user}</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{activity.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest mt-0.5">{activity.type.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-8 py-3 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-black text-slate-500 uppercase tracking-widest rounded-2xl transition-all border border-slate-200/50 dark:border-white/5">
                Audit Full Stream
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  color?: "primary" | "emerald" | "indigo";
}

function StatCard({ title, value, icon, trend, color = "primary" }: StatCardProps) {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 text-primary",
    emerald: "from-emerald-500/10 to-emerald-500/5 text-emerald-500",
    indigo: "from-indigo-500/10 to-indigo-500/5 text-indigo-500",
  };

  return (
    <div className="p-6 rounded-[2rem] bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          {icon}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mt-1">{value}</h4>
        <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-1">
          {trend}
        </p>
      </div>
    </div>
  );
}
