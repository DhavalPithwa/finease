import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { UsersService } from '../common/services/users.service';
import { AnalyticsService } from '../analytics/analytics.service';
import { User, AdminStats } from '@repo/types';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly usersService: UsersService,
    private readonly analyticsService: AnalyticsService,
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
}
