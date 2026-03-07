import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';
import { Reminder } from '@repo/types';

@Injectable()
export class RemindersService {
  private readonly collectionName = 'reminders';

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  private get collection(): admin.firestore.CollectionReference<Reminder> {
    return this.firebaseAdmin
      .getFirestore()
      .collection(
        this.collectionName,
      ) as admin.firestore.CollectionReference<Reminder>;
  }

  async getReminders(userId: string): Promise<Reminder[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs
      .map((doc: admin.firestore.QueryDocumentSnapshot<Reminder>) => {
        const raw = doc.data() as unknown as Record<string, unknown>;
        const reminder: Reminder = {
          id: doc.id,
          userId: (raw.userId as string) || '',
          name: (raw.name as string) || '',
          type: (raw.type as 'policy' | 'document' | 'other') || 'other',
          expiryDate: (raw.expiryDate as string) || new Date().toISOString(),
          renewalAmount: Number(raw.renewalAmount || 0),
          metadata: (raw.metadata as Record<string, unknown>) || {},
          createdAt: (raw.createdAt as string) || new Date().toISOString(),
          deletedAt: (raw.deletedAt as string | null) || null,
        };
        return reminder;
      })
      .filter((reminder) => !reminder.deletedAt);
  }

  async createReminder(
    userId: string,
    data: Partial<Reminder>,
  ): Promise<Reminder> {
    const reminderRef = this.collection.doc();
    const now = new Date().toISOString();
    const newReminder: Reminder = {
      id: reminderRef.id,
      userId,
      name: data.name ?? '',
      type: data.type ?? 'policy',
      expiryDate: data.expiryDate ?? now,
      renewalAmount: data.renewalAmount ?? 0,
      metadata: (data.metadata as Record<string, unknown>) ?? {},
      createdAt: now,
      deletedAt: null,
    };
    await reminderRef.set(newReminder);
    return newReminder;
  }

  async updateReminder(
    userId: string,
    reminderId: string,
    data: Partial<Reminder>,
  ): Promise<Reminder> {
    const reminderRef = this.collection.doc(reminderId);
    const doc = await reminderRef.get();

    if (!doc.exists || doc.data()?.userId !== userId || doc.data()?.deletedAt) {
      throw new Error('Reminder not found or unauthorized');
    }

    await reminderRef.update(data);
    const updated = await reminderRef.get();
    const updatedRaw = updated.data() as unknown as Record<string, unknown>;

    const reminder: Reminder = {
      id: updated.id,
      userId: (updatedRaw?.userId as string) || '',
      name: (updatedRaw?.name as string) || '',
      type: (updatedRaw?.type as 'policy' | 'document' | 'other') || 'other',
      expiryDate:
        (updatedRaw?.expiryDate as string) || new Date().toISOString(),
      renewalAmount: Number(updatedRaw?.renewalAmount || 0),
      metadata: (updatedRaw?.metadata as Record<string, unknown>) || {},
      createdAt: (updatedRaw?.createdAt as string) || new Date().toISOString(),
      deletedAt: (updatedRaw?.deletedAt as string | null) || null,
    };
    return reminder;
  }

  async deleteReminder(userId: string, reminderId: string): Promise<void> {
    const reminderRef = this.collection.doc(reminderId);
    const doc = await reminderRef.get();

    if (doc.exists && doc.data()?.userId === userId) {
      await reminderRef.update({
        deletedAt: new Date().toISOString(),
      });
    }
  }
}
