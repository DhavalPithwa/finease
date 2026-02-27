export type UserRole = "user" | "admin";

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: string;
}

export type AccountType = "bank" | "cash" | "loan" | "investment";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  institutionName?: string;
  lastSyncedAt: string;
}

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  startDate: string;
  category: string;
  icon?: string;
}

export type TransactionStatus = "pending" | "approved" | "rejected";
export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  toAccountId?: string; // For transfers
  amount: number;
  date: string;
  description: string;
  category: string;
  type: TransactionType;
  status: TransactionStatus;
  metadata?: {
    originalInstitutionDescription?: string;
    isCashWithdrawal?: boolean;
    isStaged?: boolean;
  };
}

export interface DashboardStats {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorthHistory: { month: string; value: number }[];
  assetLiabilitySplit: { 
    name: string; 
    value: number; 
    type: 'asset' | 'liability'; 
    color: string; 
  }[];
  goalProgress: {
    goalId: string;
    percentageSaved: number;
    expectedPercentage: number;
  }[];
  expenseCategories: {
    category: string;
    amount: number;
    isBounce: boolean;
  }[];
}
