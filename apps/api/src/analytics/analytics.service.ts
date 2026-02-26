import { Injectable } from '@nestjs/common';
import { DashboardStats } from '@repo/types';

@Injectable()
export class AnalyticsService {
  /**
   * Formats raw Firestore transaction and asset data into Recharts-friendly JSON
   */
  async getDashboardStats(userId: string): Promise<DashboardStats> {
    // In a real implementation, this would fetch from Firestore:
    // const assets = await this.firestore.collection('users').doc(userId).collection('assets').get();
    // const liabilities = await this.firestore.collection('users').doc(userId).collection('liabilities').get();
    
    // Logic for "Net Worth" over time
    const netWorthHistory = [
      { month: 'Jan', value: 95000 },
      { month: 'Feb', value: 98000 },
      { month: 'Mar', value: 103000 },
      { month: 'Apr', value: 110000 },
      { month: 'May', value: 115000 },
      { month: 'Jun', value: 125430 },
    ];

    // Logic for "Asset vs Liability Split"
    const assetLiabilitySplit = [
      { name: 'Bank Accounts', value: 85000, type: 'asset' as const },
      { name: 'Real Estate', value: 450000, type: 'asset' as const },
      { name: 'Mortgage', value: 380000, type: 'liability' as const },
      { name: 'Car Loan', value: 15000, type: 'liability' as const },
    ];

    // Logic for "Goal Progress" with Pace Lines
    const goalProgress = [
      {
        goalId: 'goal_1',
        percentageSaved: 65,
        expectedPercentage: 70, // Behind pace
      },
      {
        goalId: 'goal_2',
        percentageSaved: 40,
        expectedPercentage: 35, // Ahead of pace
      }
    ];

    // Logic for "Expense Categories" with Bounce Toggle flag
    const expenseCategories = [
      { category: 'Rent', amount: 2000, isBounce: false },
      { category: 'Groceries', amount: 600, isBounce: false },
      { category: 'Emergency Car Repair', amount: 1200, isBounce: true },
      { category: 'Bonus Shopping', amount: 500, isBounce: true },
    ];

    const totalAssets = assetLiabilitySplit
      .filter(i => i.type === 'asset')
      .reduce((sum, i) => sum + i.value, 0);
      
    const totalLiabilities = assetLiabilitySplit
      .filter(i => i.type === 'liability')
      .reduce((sum, i) => sum + i.value, 0);

    return {
      netWorth: totalAssets - totalLiabilities,
      totalAssets,
      totalLiabilities,
      netWorthHistory,
      assetLiabilitySplit,
      goalProgress,
      expenseCategories,
    };
  }
}
