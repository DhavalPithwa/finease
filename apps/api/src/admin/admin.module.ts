import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { FinanceModule } from '../finance/finance.module';
import { AnalyticsModule } from '../analytics/analytics.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FinanceModule, AnalyticsModule, AuthModule],
  controllers: [AdminController],
})
export class AdminModule {}
