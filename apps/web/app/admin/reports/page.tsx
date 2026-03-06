"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie
} from "recharts";
import { Activity, ShieldCheck, Zap, Cpu } from "lucide-react";
import api from "@/lib/api";
import { AdminStats } from "@repo/types";

export default function AdminReportsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get<AdminStats>("/admin/stats");
        setStats(res.data);
      } catch {
        // Silent error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const COLORS = ['#135bec', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 min-h-screen pb-24 lg:pb-8">
      <PageHeader 
        title="Institutional Intelligence" 
        subtitle="Aggregated behavioral analytics and system velocity"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Acquisition Velocity */}
        <Card className="lg:col-span-2 p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Growth Velocity</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Network expansion per solar day</p>
            </div>
            <Zap className="size-5 text-primary" />
          </div>
          
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.userGrowth}>
                <defs>
                   <linearGradient id="growthGradient" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#135bec" stopOpacity={0.1}/>
                     <stop offset="95%" stopColor="#135bec" stopOpacity={0}/>
                   </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.3} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#94A3B8' }} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '1rem', 
                    border: 'none', 
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    backgroundColor: '#fff',
                    fontSize: '10px'
                  }} 
                />
                <Area type="monotone" dataKey="count" stroke="#135bec" strokeWidth={3} fillOpacity={1} fill="url(#growthGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* System Health */}
        <Card className="p-8 space-y-6">
           <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest text-center">Protocol Integrity</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Real-time Node Status</p>
           </div>
           
           <div className="flex flex-col items-center justify-center space-y-6 py-4">
              <div className="relative size-32">
                 <div className="absolute inset-0 rounded-full border-[10px] border-slate-100 dark:border-white/5" />
                 <div className="absolute inset-0 rounded-full border-[10px] border-emerald-500 border-t-transparent animate-spin" />
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-slate-900 dark:text-white">99%</span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase">Uptime</span>
                 </div>
              </div>
              
              <div className="w-full space-y-4">
                 {[
                   { label: 'Latency', value: '12ms', color: 'bg-emerald-500' },
                   { label: 'Security', value: 'Hardened', color: 'bg-indigo-500' },
                   { label: 'Database', value: 'Sync', color: 'bg-primary' }
                 ].map((metric) => (
                   <div key={metric.label} className="flex items-center justify-between">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{metric.label}</span>
                     <div className="flex items-center gap-2">
                        <div className={`size-1.5 rounded-full ${metric.color}`} />
                        <span className="text-xs font-bold text-slate-900 dark:text-white">{metric.value}</span>
                     </div>
                   </div>
                 ))}
              </div>
           </div>
        </Card>

        {/* Assets vs Users */}
        <Card className="p-8 space-y-6">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Identity Load</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active vs Total Population</p>
              </div>
              <Cpu className="size-5 text-indigo-500" />
           </div>
           
           <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Active', value: stats?.activeUsers24h },
                      { name: 'Passive', value: (stats?.totalUsers || 0) - (stats?.activeUsers24h || 0) }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Total Users</p>
                 <p className="text-lg font-black text-slate-900 dark:text-white mt-1">{stats?.totalUsers}</p>
              </div>
              <div className="bg-slate-50 dark:bg-white/5 p-4 rounded-3xl text-center">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Assets/User</p>
                 <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                   ₹{((stats?.totalAssetsTracked || 0) / (stats?.totalUsers || 1) / 100000).toFixed(1)}L
                 </p>
              </div>
           </div>
        </Card>

        {/* Protocol Logs */}
        <Card className="lg:col-span-2 p-8 space-y-6">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">System Audit Stream</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 10 security & lifecycle events</p>
              </div>
              <Activity className="size-5 text-slate-300" />
           </div>
           
           <div className="space-y-4">
              {stats?.recentActivities.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-white/[0.02] rounded-2xl border border-slate-100 dark:border-white/5">
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-xl ${log.type === 'signup' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                         <ShieldCheck className="size-4" />
                      </div>
                      <div>
                         <p className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{log.user}</p>
                         <p className="text-[9px] font-bold text-slate-400 uppercase">{log.type.replace('_', ' ')}</p>
                      </div>
                   </div>
                   <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{log.time}</span>
                </div>
              ))}
           </div>
        </Card>
      </div>
    </div>
  );
}

