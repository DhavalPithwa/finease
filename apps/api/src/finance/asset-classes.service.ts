import { Injectable, BadRequestException } from '@nestjs/common';
import { AssetClass } from '@repo/types';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';

@Injectable()
export class AssetClassesService {
  private readonly collectionName = 'asset_classes';
  private readonly accountsCollection = 'accounts';

  constructor(private readonly firebase: FirebaseAdminService) {}

  private get db() {
    return this.firebase.getFirestore();
  }

  private get collection() {
    return this.db.collection(this.collectionName);
  }

  async findAll(userId: string): Promise<AssetClass[]> {
    const snapshot = await this.collection.where('userId', '==', userId).get();
    return snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<AssetClass, 'id'>),
      }))
      .filter((assetClass) => !assetClass.deletedAt);
  }

  async create(assetClass: Partial<AssetClass>): Promise<AssetClass> {
    const docRef = await this.collection.add({
      ...assetClass,
      deletedAt: null,
    });
    const doc = await docRef.get();
    return { id: doc.id, ...(doc.data() as Omit<AssetClass, 'id'>) };
  }

  async update(
    id: string,
    assetClass: Partial<AssetClass>,
  ): Promise<AssetClass> {
    await this.collection.doc(id).update(assetClass);
    const doc = await this.collection.doc(id).get();
    return { id: doc.id, ...(doc.data() as Omit<AssetClass, 'id'>) };
  }

  async remove(id: string): Promise<void> {
    // Check if any active account is using this asset class
    const accountsSnapshot = await this.db
      .collection(this.accountsCollection)
      .where('assetType', '==', id)
      .get();

    const activeAccounts = accountsSnapshot.docs.filter(
      (doc) => !(doc.data() as { deletedAt?: string | null }).deletedAt,
    );

    if (activeAccounts.length > 0) {
      throw new BadRequestException(
        'Cannot archive Asset Class: it is still associated with one or more active accounts. Please update those accounts first.',
      );
    }

    await this.collection.doc(id).update({
      deletedAt: new Date().toISOString(),
    });
  }
}
