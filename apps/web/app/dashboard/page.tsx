"use client";

import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { AssetLiabilityDonut } from "@/components/dashboard/AssetLiabilityDonut";
import { GoalProgressCard } from "@/components/dashboard/GoalProgressCard";
import { ExpenseChart } from "@/components/dashboard/ExpenseChart";
import { MOCK_STATS, MOCK_GOALS } from "@/lib/mock-data";

export default function DashboardPage() {
  const [bounceEnabled, setBounceEnabled] = useState(true);

  // Filter logic for "Bounce" money
  const stats = {
    ...MOCK_STATS,
    netWorth: bounceEnabled 
      ? MOCK_STATS.netWorth 
      : (MOCK_STATS.netWorthHistory[MOCK_STATS.netWorthHistory.length - 1]?.value || 0) * 0.9, // Simplified for mock
  };

  return (
    <main className="min-h-screen bg-brand-background text-white p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader 
          netWorth={stats.netWorth}
          bounceEnabled={bounceEnabled}
          onToggleBounce={() => setBounceEnabled(!bounceEnabled)}
          reconciliationStatus="matched"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <NetWorthChart 
              data={stats.netWorthHistory} 
              currentNetWorth={stats.netWorth}
              percentageChange={12.5}
            />
          </div>
          <div>
            <AssetLiabilityDonut data={stats.assetLiabilitySplit} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-bold px-2">North Star Goals</h3>
            {MOCK_GOALS.map((goal: typeof MOCK_GOALS[0], idx: number) => (
              <GoalProgressCard 
                key={goal.id}
                name={goal.name}
                targetAmount={goal.targetAmount}
                currentAmount={goal.targetAmount * ((stats.goalProgress[idx]?.percentageSaved || 0) / 100)}
                percentageSaved={stats.goalProgress[idx]?.percentageSaved || 0}
                expectedPercentage={stats.goalProgress[idx]?.expectedPercentage || 0}
                targetDate={goal.targetDate}
              />
            ))}
          </div>
          <div className="lg:col-span-3">
            <ExpenseChart data={stats.expenseCategories} showBounce={bounceEnabled} />
          </div>
        </div>
      </div>
    </main>
  );
}
