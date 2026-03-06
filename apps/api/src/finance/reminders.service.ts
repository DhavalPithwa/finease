import { Injectable } from '@nestjs/common';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';
import { Reminder } from '@repo/types';

@Injectable()
export class RemindersService {
  private readonly collectionName = 'reminders';

  constructor(private readonly firebaseAdmin: FirebaseAdminService) {}

  private get collection() {
    return this.firebaseAdmin.getFirestore().collection(this.collectionName);
  }

  async getReminders(userId: string): Promise<Reminder[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        name: data.name,
        type: data.type,
        expiryDate: data.expiryDate,
        renewalAmount: data.renewalAmount,
        metadata: data.metadata,
        createdAt: data.createdAt,
      } as Reminder;
    });
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
    await reminderRef.update(data);
    const updated = await reminderRef.get();
    const updatedData = updated.data();
    return {
      id: updated.id,
      userId: updatedData?.userId,
      name: updatedData?.name,
      type: updatedData?.type,
      expiryDate: updatedData?.expiryDate,
      renewalAmount: updatedData?.renewalAmount,
      metadata: updatedData?.metadata,
      createdAt: updatedData?.createdAt,
    } as Reminder;
  }

  async deleteReminder(userId: string, reminderId: string): Promise<void> {
    await this.collection.doc(reminderId).delete();
  }
}
