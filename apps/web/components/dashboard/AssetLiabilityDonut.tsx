"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { motion } from "framer-motion";

interface AssetLiabilityData {
  name: string;
  value: number;
  type: 'asset' | 'liability';
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b'];

export function AssetLiabilityDonut({ data }: { data: AssetLiabilityData[] }) {
  const assets = data.filter(d => d.type === 'asset');
  const liabilities = data.filter(d => d.type === 'liability');
  
  const totalAssets = assets.reduce((acc, curr) => acc + curr.value, 0);
  const totalLiabilities = liabilities.reduce((acc, curr) => acc + curr.value, 0);

  const displayData = [
    { name: 'Total Assets', value: totalAssets, color: '#10b981' },
    { name: 'Total Liabilities', value: totalLiabilities, color: '#ef4444' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 glass-card h-[400px]"
    >
      <h3 className="text-xl font-bold text-white mb-6">Asset vs. Liability</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={displayData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={8}
              dataKey="value"
            >
              {displayData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "#1e293b", 
                border: "1px solid #334155",
                borderRadius: "8px",
                color: "#fff"
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-between mt-4 text-sm">
        <div className="text-gray-400">
          Ratio: <span className="text-white font-medium">{(totalAssets / totalLiabilities).toFixed(1)}x</span>
        </div>
        <div className="text-gray-400">
          Debt Leverage: <span className="text-white font-medium">{((totalLiabilities / totalAssets) * 100).toFixed(0)}%</span>
        </div>
      </div>
    </motion.div>
  );
}
