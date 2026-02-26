import { DashboardStats } from "@repo/types";

export const MOCK_STATS: DashboardStats = {
  netWorth: 125430,
  totalAssets: 154200,
  totalLiabilities: 28770,
  netWorthHistory: [
    { month: "Jan", value: 98000 },
    { month: "Feb", value: 102000 },
    { month: "Mar", value: 105000 },
    { month: "Apr", value: 112000 },
    { month: "May", value: 118000 },
    { month: "Jun", value: 125430 },
  ],
  assetLiabilitySplit: [
    { name: "Bank Accounts", value: 85000, type: "asset" },
    { name: "Cash", value: 5200, type: "asset" },
    { name: "Investments", value: 64000, type: "asset" },
    { name: "Home Loan", value: 25000, type: "liability" },
    { name: "Credit Cards", value: 3770, type: "liability" },
  ],
  goalProgress: [
    {
      goalId: "1",
      percentageSaved: 60,
      expectedPercentage: 65,
    },
    {
      goalId: "2",
      percentageSaved: 45,
      expectedPercentage: 40,
    },
  ],
  expenseCategories: [
    { category: "Housing", amount: 2500, isBounce: false },
    { category: "Food", amount: 800, isBounce: false },
    { category: "Entertainment", amount: 300, isBounce: true }, // Unexpected party
    { category: "Utilities", amount: 200, isBounce: false },
    { category: "Travel", amount: 1500, isBounce: true }, // Unexpected trip
  ],
};

export const MOCK_GOALS = [
  { id: "1", name: "2028 Home Deposit", targetAmount: 200000, deadline: "2028-12-31" },
  { id: "2", name: "European Summer", targetAmount: 15000, deadline: "2026-06-01" },
];
