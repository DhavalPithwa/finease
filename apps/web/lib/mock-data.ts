import { Account, FinancialGoal, Transaction, DashboardStats } from "@repo/types";

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: "acc-1",
    userId: "user-1",
    name: "HDFC Bank",
    type: "bank",
    balance: 1250000,
    currency: "INR",
    institutionName: "HDFC",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "acc-2",
    userId: "user-1",
    name: "Cash Wallet",
    type: "cash",
    balance: 15000,
    currency: "INR",
    lastSyncedAt: new Date().toISOString(),
  },
  {
    id: "acc-3",
    userId: "user-1",
    name: "Car Loan",
    type: "loan",
    balance: -800000,
    currency: "INR",
    institutionName: "ICICI",
    lastSyncedAt: new Date().toISOString(),
  },
];

export const MOCK_GOALS: FinancialGoal[] = [
  {
    id: "goal-1",
    userId: "user-1",
    name: "Retirement",
    targetAmount: 50000000,
    currentAmount: 32500000,
    targetDate: "2045-12-31",
    startDate: "2020-01-01",
    category: "Retirement",
  },
  {
    id: "goal-2",
    userId: "user-1",
    name: "Child Education",
    targetAmount: 5000000,
    currentAmount: 2100000,
    targetDate: "2030-06-30",
    startDate: "2022-01-01",
    category: "Education",
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    userId: "user-1",
    accountId: "acc-1",
    amount: 12500,
    date: new Date().toISOString(),
    description: "Amazon India Payment",
    category: "Shopping",
    type: "expense",
    status: "pending",
    metadata: {
      originalInstitutionDescription: "AMZN MKTP IN"
    }
  },
  {
    id: "tx-2",
    userId: "user-1",
    accountId: "acc-1",
    amount: 5000,
    date: new Date().toISOString(),
    description: "ATM Cash Withdrawal",
    category: "Transfer",
    type: "transfer",
    status: "pending",
    metadata: {
      isCashWithdrawal: true
    }
  }
];

export const MOCK_STATS: DashboardStats = {
  netWorth: 12450000,
  totalAssets: 13250000,
  totalLiabilities: 800000,
  netWorthHistory: [
    { month: "Jan", value: 11000000 },
    { month: "Mar", value: 11500000 },
    { month: "May", value: 11800000 },
    { month: "Jul", value: 12000000 },
    { month: "Sep", value: 12200000 },
    { month: "Nov", value: 12450000 },
  ],
  assetLiabilitySplit: [
    { name: "Equity", value: 7650000, type: "asset", color: "#135bec" },
    { name: "Debt", value: 2780000, type: "asset", color: "#10b981" },
    { name: "Gold", value: 1390000, type: "asset", color: "#f59e0b" },
    { name: "Liquid", value: 630000, type: "asset", color: "#ef4444" },
  ],
  goalProgress: [
    {
      goalId: "goal-1",
      percentageSaved: 65,
      expectedPercentage: 62,
    },
    {
      goalId: "goal-2",
      percentageSaved: 42,
      expectedPercentage: 48,
    },
  ],
  expenseCategories: [
     { category: 'Rent', amount: 2000, isBounce: false },
     { category: 'Groceries', amount: 600, isBounce: false },
     { category: 'Emergency Car Repair', amount: 1200, isBounce: true },
     { category: 'Bonus Shopping', amount: 500, isBounce: true },
  ]
};
