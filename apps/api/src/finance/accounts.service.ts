import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';
import { Account } from '@repo/types';
import { TransactionsService } from './transactions.service';

@Injectable()
export class AccountsService {
  private readonly collectionName = 'accounts';

  constructor(
    private readonly firebaseAdmin: FirebaseAdminService,
    private readonly transactionsService: TransactionsService,
  ) {}

  private get collection() {
    return this.firebaseAdmin.getFirestore().collection(this.collectionName);
  }

  async findAll(userId: string): Promise<Account[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Account)
      .filter((account) => !account.deletedAt);
  }

  async findOne(id: string): Promise<Account> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists || doc.data()?.deletedAt) {
      throw new NotFoundException(`Account with ID ${id} not found`);
    }
    return { id: doc.id, ...doc.data() } as Account;
  }

  async create(account: Partial<Account>): Promise<Account> {
    const initialAmount = Number(account.balance) || 0;
    const docRef = await this.collection.add({
      ...account,
      initialAmount,
      deletedAt: null,
      lastSyncedAt: new Date().toISOString(),
    });
    const doc = await docRef.get();
    return { id: doc.id, ...doc.data() } as Account;
  }

  async update(id: string, account: Partial<Account>): Promise<Account> {
    const currentAccount = await this.findOne(id);
    const newBalance =
      account.balance !== undefined ? Number(account.balance) : undefined;

    // If balance is being manually updated, create an adjustment transaction
    // to preserve this change in the historical record.
    if (
      newBalance !== undefined &&
      Math.abs(newBalance - (currentAccount.balance || 0)) > 0.01
    ) {
      const delta = newBalance - (currentAccount.balance || 0);
      const isInvestment = currentAccount.type === 'investment';

      // For investments, Valuation Adjustment is an ABSOLUTE set point.
      // For others, it's a RELATIVE movement (delta).
      const finalAmount = isInvestment ? newBalance : Math.abs(delta);
      const finalType = isInvestment
        ? 'income'
        : delta > 0
          ? 'income'
          : 'expense';

      await this.transactionsService.create({
        userId: currentAccount.userId,
        accountId: id,
        amount: finalAmount,
        type: finalType,
        category: 'Valuation Adjustment',
        description: `Manual adjustment to match ${newBalance.toLocaleString()} valuation`,
        date: new Date().toISOString(),
        status: 'completed',
        metadata: {
          isSystemAdjustment: true,
          isBalanceSync: true, // Explicit flag for Absolute Sync point logic
          previousBalance: currentAccount.balance,
          newBalance: newBalance,
        },
      });

      // Remove balance from the direct update to avoid overwriting the recalculated value
      const updateData = { ...account };
      delete updateData.balance;
      await this.collection.doc(id).update({
        ...updateData,
        lastSyncedAt: new Date().toISOString(),
      });
    } else {
      await this.collection.doc(id).update({
        ...account,
        lastSyncedAt: new Date().toISOString(),
      });
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    // Cascade soft-delete transactions related to this account
    await this.transactionsService.removeByAccountId(id);
    // Soft-delete the account itself
    await this.collection.doc(id).update({
      deletedAt: new Date().toISOString(),
    });
  }
}
