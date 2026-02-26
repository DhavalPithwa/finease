export interface User {
  id: string;
  email: string;
  displayName: string;
  role: "user" | "admin";
}

export interface Asset {
  id: string;
  name: string;
  value: number;
  type: "bank" | "cash" | "investment" | "other";
  lastUpdated: string;
}

export interface Liability {
  id: string;
  name: string;
  value: number;
  type: "loan" | "credit_card" | "mortgage" | "other";
  lastUpdated: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  startDate: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
  source: "bank" | "cash";
  isBounce?: boolean; // For the "Bounce" toggle (unexpected money)
}

export interface DashboardStats {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorthHistory: { month: string; value: number }[];
  assetLiabilitySplit: {
    name: string;
    value: number;
    type: "asset" | "liability";
  }[];
  goalProgress: {
    goalId: string;
    percentageSaved: number;
    expectedPercentage: number; // The "Pace" line
  }[];
  expenseCategories: { category: string; amount: number; isBounce: boolean }[];
}
