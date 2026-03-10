import {
  Controller,
  Get,
  Put,
  Post,
  Body,
  Param,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsersService } from '../common/services/users.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { AuthService } from '../auth/auth.service';
import { User, AdminStats } from '@repo/types';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly analyticsService: AnalyticsService,
    private readonly authService: AuthService,
  ) {}

  @Get('users')
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user as User & { password?: string };
      return rest as Omit<User, 'password'>;
    });
  }

  @Put('users/:uid')
  async updateUser(
    @Param('uid') uid: string,
    @Body() data: Partial<User>,
  ): Promise<User> {
    return this.usersService.update(uid, data);
  }

  @Get('stats')
  async getAdminStats(): Promise<AdminStats> {
    return this.analyticsService.getAdminStats();
  }

  @Put('users/:uid/reset-onboarding')
  async resetUserOnboarding(@Param('uid') uid: string) {
    return this.usersService.update(uid, { hasOnboarded: false });
  }

  @Get('users/:uid/deleted-items')
  async getDeletedItems(
    @Param('uid') uid: string,
  ): Promise<Record<string, any>[]> {
    const db = this.usersService.getFirestore();
    const collections = [
      'accounts',
      'transactions',
      'goals',
      'categories',
      'asset_classes',
      'reminders',
    ];
    const results: Record<string, any>[] = [];

    for (const collectionName of collections) {
      const snapshot = await db
        .collection(collectionName)
        .where('userId', '==', uid)
        .get();

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.deletedAt) {
          results.push({
            id: doc.id,
            collection: collectionName,
            ...data,
          });
        }
      });
    }

    return results;
  }

  @Delete('purge/:collection/:id')
  async purgeItem(
    @Param('collection') collection: string,
    @Param('id') id: string,
  ) {
    const db = this.usersService.getFirestore();
    await db.collection(collection).doc(id).delete();
    return { message: `Item ${id} purged from ${collection}` };
  }

  @Put('bulk-soft-delete-migration')
  async migrateToSoftDelete() {
    const db = this.usersService.getFirestore();
    const collections = [
      'users',
      'accounts',
      'transactions',
      'goals',
      'categories',
      'asset_classes',
      'reminders',
    ];
    let totalUpdated = 0;

    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      let count = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data() as { deletedAt?: string | null };
        if (data.deletedAt === undefined) {
          batch.update(doc.ref, { deletedAt: null });
          count++;
        }
      });

      if (count > 0) {
        await batch.commit();
        totalUpdated += count;
      }
    }

    return {
      message: `Soft delete field initialized for ${totalUpdated} records across ${collections.length} collections.`,
      totalUpdated,
    };
  }

  @Post('impersonate/:uid')
  async impersonate(@Param('uid') uid: string) {
    const token = await this.authService.generateTokenForUser(uid);
    return { token };
  }
}
