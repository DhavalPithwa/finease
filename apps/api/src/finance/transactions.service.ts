import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';
import { Transaction, Account } from '@repo/types';

@Injectable()
export class TransactionsService {
  private readonly collectionName = 'transactions';
  private readonly accountsCollection = 'accounts';
  private readonly goalsCollection = 'goals';

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  private get db() {
    return this.firebaseAdmin.getFirestore();
  }

  private get collection() {
    return this.db.collection(this.collectionName);
  }

  private calculateNextDate(currentDate: string, frequency: string): string {
    const date = new Date(currentDate);
    switch (frequency) {
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      case 'yearly':
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        date.setMonth(date.getMonth() + 1);
    }
    return date.toISOString();
  }

  async findAll(userId: string): Promise<Transaction[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    const transactions = snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }) as Transaction)
      .filter((tx) => !tx.deletedAt);
    // Sort in-memory to bypass index requirement
    return transactions.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const batch = this.db.batch();
    const txRef = this.collection.doc();

    if (!transaction.accountId) {
      throw new Error('Account ID is required for transaction');
    }

    // 1. Calculate and set transaction properties
    const isTransfer = !!transaction.toAccountId;
    const effectiveType = isTransfer
      ? 'transfer'
      : transaction.type || 'expense';
    // status calculation
    const status =
      transaction.status ||
      (transaction.isAutomated ? 'pending_confirmation' : 'completed');

    // 1. Create transaction document
    // We DON'T manually update account balance here anymore.
    // We rely on recalculateBalances to do it based on full history.
    // This prevents the "it set that amount" bug where manual and
    // recalculated balances fought each other.
    batch.set(txRef, {
      ...transaction,
      id: txRef.id,
      status,
      type: effectiveType,
      date: transaction.date || new Date().toISOString(),
      deletedAt: null,
    });

    await batch.commit();

    // 2. Trigger recalculation immediately
    if (status === 'completed' || status === 'approved') {
      await this.recalculateBalances(transaction.accountId);
      if (transaction.toAccountId) {
        await this.recalculateBalances(transaction.toAccountId);
        await this.recalculateGoalProgress(transaction.toAccountId);
      }
    }

    const createdTx = await txRef.get();
    return createdTx.data() as Transaction;
  }

  async findOne(id: string): Promise<Transaction> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists || doc.data()?.deletedAt) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return { id: doc.id, ...doc.data() } as Transaction;
  }

  async update(
    id: string,
    updateData: Partial<Transaction>,
  ): Promise<Transaction> {
    const oldTx = await this.findOne(id);
    const batch = this.db.batch();
    const txRef = this.collection.doc(id);

    // 1. Calculate and set transaction properties
    const isTransfer = !!(updateData.toAccountId || oldTx.toAccountId);
    const effectiveType = isTransfer
      ? 'transfer'
      : updateData.type || oldTx.type;

    // 2. Update the transaction itself
    batch.update(txRef, {
      ...updateData,
      type: effectiveType,
      lastSyncedAt: new Date().toISOString(),
    });

    await batch.commit();

    // 2. Identify affected accounts and goals
    const affectedAccounts = new Set<string>();
    const affectedGoals = new Set<string>();

    if (oldTx.accountId) affectedAccounts.add(oldTx.accountId);
    if (oldTx.toAccountId) {
      affectedAccounts.add(oldTx.toAccountId);
      affectedGoals.add(oldTx.toAccountId);
    }

    if (updateData.accountId) affectedAccounts.add(updateData.accountId);
    if (updateData.toAccountId) {
      affectedAccounts.add(updateData.toAccountId);
      affectedGoals.add(updateData.toAccountId);
    }

    // 3. Recalculate everything affected
    for (const accId of affectedAccounts) {
      await this.recalculateBalances(accId);
    }
    for (const goalId of affectedGoals) {
      await this.recalculateGoalProgress(goalId);
    }

    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const txDoc = await this.collection.doc(id).get();

    if (!txDoc.exists) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const txData = txDoc.data() as Transaction;
    const batch = this.db.batch();

    // 1. Soft-delete the transaction
    batch.update(this.collection.doc(id), {
      deletedAt: new Date().toISOString(),
    });

    await batch.commit();

    // 2. Recalculate balances for all involved accounts/goals
    if (txData.status === 'completed') {
      await this.recalculateBalances(txData.accountId);
      if (txData.toAccountId) {
        await this.recalculateBalances(txData.toAccountId);
        await this.recalculateGoalProgress(txData.toAccountId);
      }
    }
  }

  async removeByAccountId(accountId: string): Promise<void> {
    const snapshot = await this.collection
      .where('accountId', '==', accountId)
      .where('deletedAt', '==', null)
      .get();

    const batch = this.db.batch();
    const now = new Date().toISOString();

    snapshot.docs.forEach((doc) => {
      batch.update(doc.ref, { deletedAt: now });
    });

    await batch.commit();
    // No need to recalculate balances here because the account itself is being deleted
    // But we might need to recalculate destination accounts if they were transfers.
    // However, the user said "do not need to resolved 3. Incomplete Account Purge point",
    // so we skip systemic destination recalculation for now.
  }

  async confirm(id: string): Promise<Transaction> {
    const txRef = this.collection.doc(id);
    const txDoc = await txRef.get();

    if (!txDoc.exists) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const txData = txDoc.data() as Transaction;
    const batch = this.db.batch();

    // 1. Update status to completed
    batch.update(txRef, {
      status: 'completed',
    });

    // 2. Generate next occurrence if automated
    if (txData.isAutomated && txData.frequency) {
      const currentCount = Number(txData.recurringCount);
      if (!isNaN(currentCount) && currentCount > 1) {
        const nextDate = this.calculateNextDate(txData.date, txData.frequency);

        // Check if a transaction for this next occurrence already exists
        const existingNextTx = await this.collection
          .where('userId', '==', txData.userId)
          .where('accountId', '==', txData.accountId)
          .where('description', '==', txData.description)
          .where('date', '==', nextDate)
          .limit(1)
          .get();

        if (existingNextTx.empty) {
          const nextTxRef = this.collection.doc();
          batch.set(nextTxRef, {
            ...txData,
            id: nextTxRef.id,
            date: nextDate,
            status: 'pending_confirmation',
            recurringCount: currentCount - 1,
          });
        }
      }
    }

    await batch.commit();

    // 3. Recalculate balances
    await this.recalculateBalances(txData.accountId);
    if (txData.toAccountId) {
      await this.recalculateBalances(txData.toAccountId);
      await this.recalculateGoalProgress(txData.toAccountId);
    }

    return { ...txData, status: 'completed' } as Transaction;
  }

  /**
   * Recalculates all historical balances for a specific account.
   * This is heavy but ensures 100% accuracy if historical data is modified.
   */
  public async recalculateBalances(accountId: string): Promise<void> {
    const accRef = this.db.collection(this.accountsCollection).doc(accountId);
    const accDoc = await accRef.get();
    if (!accDoc.exists) return;
    const accData = accDoc.data() as Account;

    // 1. Fetch ALL transactions where this account is either source or destination
    const [fromSnapshot, toSnapshot] = await Promise.all([
      this.collection
        .where('accountId', '==', accountId)
        .where('deletedAt', '==', null)
        .where('status', 'in', ['completed', 'approved'])
        .get(),
      this.collection
        .where('toAccountId', '==', accountId)
        .where('deletedAt', '==', null)
        .where('status', 'in', ['completed', 'approved'])
        .get(),
    ]);

    const txs: Transaction[] = [
      ...fromSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Transaction,
      ),
      ...toSnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Transaction,
      ),
    ];

    // 2. Sort by date ASC
    txs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 3. Replay from baseline.
    let rollingBalance =
      accData.initialAmount !== undefined && accData.initialAmount !== null
        ? Number(accData.initialAmount)
        : Number(accData.balance) || 0;

    if (
      txs.length > 0 &&
      (accData.initialAmount === undefined || accData.initialAmount === null)
    ) {
      // Trust current balance as baseline if no initialAmount is found
    }

    if (accData.type === 'debt' && rollingBalance > 0) {
      rollingBalance = -rollingBalance;
    }

    let rollingInvested = rollingBalance;
    let totalRepaidCapital = 0;
    let totalBurnedInterest = 0;

    const batch = this.db.batch();

    for (const tx of txs) {
      const amount = Number(tx.amount);
      const isBalanceSync = !!(tx.metadata as Record<string, any>)
        ?.isBalanceSync;

      if (tx.accountId === accountId) {
        // Source Account
        if (tx.type === 'income') {
          if (accData.type === 'investment' && isBalanceSync) {
            // SET Valuation: Absolute sync point (driven by metadata flag)
            rollingBalance = amount;
          } else {
            // RELATIVE Income: Add gain (does not affect invested capital)
            rollingBalance += amount;
          }
        } else if (tx.type === 'expense') {
          if (accData.type === 'investment' && isBalanceSync) {
            // SET Valuation: Absolute sync point for market loss
            rollingBalance = amount;
          } else {
            // RELATIVE Expense: Subtract cost
            rollingBalance -= amount;
          }
        } else {
          // Transfer OUT (Move Out): Relative withdrawal from cost basis
          rollingBalance -= amount;
          if (accData.type === 'investment') {
            rollingInvested -= amount;
          }
        }

        batch.update(this.collection.doc(tx.id), {
          balanceAfter: rollingBalance,
        });
      } else if (tx.toAccountId === accountId) {
        // Destination Account (Transfer IN / Move IN)
        if (accData.type === 'debt') {
          const interest = Number(tx.interestAmount) || 0;
          const principal = amount - interest;
          rollingBalance += principal;
          totalRepaidCapital += principal;
          totalBurnedInterest += interest;
        } else {
          // Relative Addition for capital contribution
          rollingBalance += amount;
          if (accData.type === 'investment') {
            rollingInvested += amount;
          }
        }
        batch.update(this.collection.doc(tx.id), {
          toBalanceAfter: rollingBalance,
        });
      }
    }

    // 4. Update the account summary
    const accUpdate: Partial<Account> = {
      balance: rollingBalance,
      lastSyncedAt: new Date().toISOString(),
    };
    if (accData.type === 'investment') {
      accUpdate.investedAmount = rollingInvested;
    } else if (accData.type === 'debt') {
      accUpdate.repaidCapital = totalRepaidCapital;
      accUpdate.burnedInterest = totalBurnedInterest;
    }

    batch.update(accRef, accUpdate);
    await batch.commit();
  }

  /**
   * Recalculates a financial goal's current amount from transaction history.
   */
  public async recalculateGoalProgress(goalId: string): Promise<void> {
    const goalRef = this.db.collection(this.goalsCollection).doc(goalId);
    const goalDoc = await goalRef.get();
    if (!goalDoc.exists) return;

    const snapshot = await this.collection
      .where('toAccountId', '==', goalId)
      .where('deletedAt', '==', null)
      .where('status', '==', 'completed')
      .get();

    const amount = snapshot.docs.reduce((sum, doc) => {
      const data = doc.data() as Transaction;
      return sum + Number(data.amount);
    }, 0);

    await goalRef.update({ currentAmount: amount });
  }

  /**
   * Triggers recalculation for ALL accounts and goals belonging to a user.
   * Useful as a "Repair Data" tool.
   */
  public async recalculateAllForUser(userId: string): Promise<void> {
    const db = this.db;
    const accountsSnapshot = await db
      .collection(this.accountsCollection)
      .where('userId', '==', userId)
      .where('deletedAt', '==', null)
      .get();

    const goalsSnapshot = await db
      .collection(this.goalsCollection)
      .where('userId', '==', userId)
      .where('deletedAt', '==', null)
      .get();

    for (const doc of accountsSnapshot.docs) {
      await this.recalculateBalances(doc.id);
    }
    for (const doc of goalsSnapshot.docs) {
      await this.recalculateGoalProgress(doc.id);
    }
  }
}
