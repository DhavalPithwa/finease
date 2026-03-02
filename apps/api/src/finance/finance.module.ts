import { Module } from '@nestjs/common';
import { GoalService } from './goal.service';
import { ReconciliationService } from './reconciliation.service';
import { AccountsService } from './accounts.service';
import { TransactionsService } from './transactions.service';
import { FinanceController } from './finance.controller';
import { FirebaseAdminService } from '../common/services/firebase-admin.service';
import { UsersService } from '../common/services/users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [FinanceController],
  providers: [
    GoalService,
    ReconciliationService,
    FirebaseAdminService,
    AccountsService,
    TransactionsService,
    UsersService,
  ],
  exports: [
    GoalService,
    ReconciliationService,
    FirebaseAdminService,
    AccountsService,
    TransactionsService,
    UsersService,
  ],
})
export class FinanceModule {}
