"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface NetWorthChartProps {
  data: { month: string; value: number }[];
  currentNetWorth: number;
  percentageChange: number;
}

export function NetWorthChart({ data, currentNetWorth, percentageChange }: NetWorthChartProps) {
  return (
    <Card 
      className="h-[450px]"
      title="Net Worth Trend"
      subtitle="Your wealth growth over time"
      headerAction={
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
          <TrendingUp className="w-3.5 h-3.5" />
          +{percentageChange}%
        </div>
      }
    >
      <div className="mb-6">
        <div className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          {formatCurrency(currentNetWorth)}
        </div>
      </div>
      
      <div className="h-[280px] w-full -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#135bec" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#135bec" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="#ffffff10" vertical={false} verticalFill={["#ffffff00", "#ffffff05"]} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              hide
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#0f1115", 
                border: "1px solid #2a2f3a",
                borderRadius: "12px",
                color: "#fff",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
              }}
              formatter={(value: number) => [formatCurrency(value), "Net Worth"]}
              itemStyle={{ color: "#135bec", fontWeight: 700 }}
              labelStyle={{ color: "#94a3b8", marginBottom: "4px" }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#135bec"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#primaryGradient)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

