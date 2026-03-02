import { Injectable, NotFoundException } from '@nestjs/common';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';
import { Transaction, Account } from '@repo/types';

@Injectable()
export class TransactionsService {
  private readonly collectionName = 'transactions';
  private readonly accountsCollection = 'accounts';

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  private get db() {
    return this.firebaseAdmin.getFirestore();
  }

  private get collection() {
    return this.db.collection(this.collectionName);
  }

  async findAll(userId: string): Promise<Transaction[]> {
    const snapshot = await this.collection
      .where('userId', '==', userId)
      .orderBy('date', 'desc')
      .get();
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as Transaction,
    );
  }

  async create(transaction: Partial<Transaction>): Promise<Transaction> {
    const batch = this.db.batch();
    const txRef = this.collection.doc();
    if (!transaction.accountId) {
      throw new Error('Account ID is required for transaction');
    }
    const accRef = this.db
      .collection(this.accountsCollection)
      .doc(transaction.accountId);

    // 1. Create transaction document
    batch.set(txRef, {
      ...transaction,
      id: txRef.id,
      date: transaction.date || new Date().toISOString(),
    });

    // 2. Adjust account balance
    const accDoc = await accRef.get();
    if (accDoc.exists) {
      const accData = accDoc.data() as Account;
      let balanceChange = Number(transaction.amount);

      if (transaction.type === 'expense') {
        balanceChange = -balanceChange;
      }

      const newBalance = (Number(accData.balance) || 0) + balanceChange;
      batch.update(accRef, {
        balance: newBalance,
        lastSyncedAt: new Date().toISOString(),
      });
    }

    // 3. Handle transfers (To account)
    if (transaction.type === 'transfer' && transaction.toAccountId) {
      const toAccRef = this.db
        .collection(this.accountsCollection)
        .doc(transaction.toAccountId);
      const toAccDoc = await toAccRef.get();
      if (toAccDoc.exists) {
        const toAccData = toAccDoc.data() as Account;
        const newToBalance =
          (Number(toAccData.balance) || 0) + Number(transaction.amount);
        batch.update(toAccRef, {
          balance: newToBalance,
          lastSyncedAt: new Date().toISOString(),
        });
      }
    }

    await batch.commit();
    const createdTx = await txRef.get();
    return createdTx.data() as Transaction;
  }

  async findOne(id: string): Promise<Transaction> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return { id: doc.id, ...doc.data() } as Transaction;
  }

  async remove(id: string): Promise<void> {
    const batch = this.db.batch();
    const txRef = this.collection.doc(id);
    const txDoc = await txRef.get();

    if (!txDoc.exists) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const txData = txDoc.data() as Transaction;
    
    // 1. Revert main account balance
    const accRef = this.db.collection(this.accountsCollection).doc(txData.accountId);
    const accDoc = await accRef.get();
    
    if (accDoc.exists) {
      const accData = accDoc.data() as Account;
      let balanceReversion = Number(txData.amount);
      
      // If original was expense (subtracted), we ADD it back.
      // If original was income (added), we SUBTRACT it.
      if (txData.type !== 'expense') {
        balanceReversion = -balanceReversion;
      }
      
      batch.update(accRef, {
        balance: (Number(accData.balance) || 0) + balanceReversion,
        lastSyncedAt: new Date().toISOString(),
      });
    }

    // 2. Revert transfer toAccount balance
    if (txData.type === 'transfer' && txData.toAccountId) {
       const toAccRef = this.db.collection(this.accountsCollection).doc(txData.toAccountId);
       const toAccDoc = await toAccRef.get();
       
       if (toAccDoc.exists) {
         const toAccData = toAccDoc.data() as Account;
         // Transfer was ADDED to toAccount, so we SUBTRACT.
         batch.update(toAccRef, {
           balance: (Number(toAccData.balance) || 0) - Number(txData.amount),
           lastSyncedAt: new Date().toISOString(),
         });
       }
    }

    // 3. Delete transaction
    batch.delete(txRef);
    await batch.commit();
  }
}
