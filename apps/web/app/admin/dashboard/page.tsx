"use client";

import { motion } from "framer-motion";
import { Users, BarChart3, ShieldCheck, Activity } from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total System Users", value: "1,284", icon: Users, color: "text-blue-500" },
    { label: "Total Wealth Managed", value: "$42.8M", icon: BarChart3, color: "text-emerald-500" },
    { label: "System Health", value: "99.9%", icon: Activity, color: "text-purple-500" },
    { label: "Security Events", value: "0", icon: ShieldCheck, color: "text-green-500" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-bold">System Health Dashboard</h1>
            <p className="text-gray-400 mt-2">Aggregated metrics and system-wide visibility (Admin Only)</p>
          </div>
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <span className="text-sm font-medium text-emerald-500">Node Status: Active</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, idx) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="p-6 glass-card"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-white/5 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-sm text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="p-8 glass-card">
          <h3 className="text-xl font-bold mb-6">Aggregate Growth Trend</h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-white/10 rounded-xl bg-white/5">
            <p className="text-gray-500">Global wealth metrics visualization (Anonymized)</p>
          </div>
        </div>
      </div>
    </main>
  );
}
