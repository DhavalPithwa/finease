import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Get,
  Delete,
  Put,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { GoalService } from './goal.service';
import { ReconciliationService } from './reconciliation.service';
import { AccountsService } from './accounts.service';
import { TransactionsService } from './transactions.service';
import type { FinancialGoal, Transaction, Account, User } from '@repo/types';
import { UsersService } from '../common/services/users.service';
import type { RequestWithUser } from '../common/interfaces/request.interface';

@ApiTags('Finance')
@ApiBearerAuth('bearer')
@Controller('finance')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(
    private readonly goalService: GoalService,
    private readonly reconciliationService: ReconciliationService,
    private readonly accountsService: AccountsService,
    private readonly transactionsService: TransactionsService,
    private readonly usersService: UsersService,
  ) {}

  // --- Profile ---

  @ApiOperation({ summary: 'Get current user profile metadata' })
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return this.usersService.findOne(req.user.uid);
  }

  @ApiOperation({ summary: 'Update user profile details' })
  @Put('profile')
  updateProfile(@Req() req: RequestWithUser, @Body() data: Partial<User>) {
    return this.usersService.update(req.user.uid, data);
  }

  // --- Accounts ---

  @ApiOperation({ summary: 'List all financial accounts for user' })
  @Get('accounts')
  findAllAccounts(@Req() req: RequestWithUser) {
    return this.accountsService.findAll(req.user.uid);
  }

  @ApiOperation({ summary: 'Create a new financial account' })
  @Post('accounts')
  createAccount(
    @Req() req: RequestWithUser,
    @Body() account: Partial<Account>,
  ) {
    return this.accountsService.create({ ...account, userId: req.user.uid });
  }

  @ApiOperation({ summary: 'Update an existing account' })
  @Put('accounts/:id')
  updateAccount(@Param('id') id: string, @Body() account: Partial<Account>) {
    return this.accountsService.update(id, account);
  }

  @ApiOperation({ summary: 'Delete a financial account' })
  @Delete('accounts/:id')
  removeAccount(@Param('id') id: string) {
    return this.accountsService.remove(id);
  }

  // --- Transactions ---

  @ApiOperation({ summary: 'List all transactions for user' })
  @Get('transactions')
  findAllTransactions(@Req() req: RequestWithUser) {
    return this.transactionsService.findAll(req.user.uid);
  }

  @ApiOperation({ summary: 'Create a new transaction' })
  @Post('transactions')
  createTransaction(
    @Req() req: RequestWithUser,
    @Body() transaction: Partial<Transaction>,
  ) {
    return this.transactionsService.create({
      ...transaction,
      userId: req.user.uid,
    });
  }

  @ApiOperation({ summary: 'Delete a transaction' })
  @Delete('transactions/:id')
  removeTransaction(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }

  // --- Goals & Reconciliation ---

  @ApiOperation({ summary: 'Calculate monthly savings requirement for a goal' })
  @Post('goal/requirement')
  getMonthlyRequirement(@Body() goal: FinancialGoal) {
    return {
      monthlyRequirement: this.goalService.calculateMonthlyRequirement(goal),
      health: this.goalService.getGoalHealth(goal),
    };
  }

  @ApiOperation({ summary: 'Reconcile a specific transaction' })
  @Post('reconcile/:id')
  reconcileTransaction(
    @Param('id') id: string,
    @Body('transactions') transactions: Transaction[],
  ) {
    return this.reconciliationService.reconcile(id, transactions);
  }

  @ApiOperation({ summary: 'Get list of pending reconciliations' })
  @Post('reconcile/pending')
  getPendingReconciliations(@Body('transactions') transactions: Transaction[]) {
    return this.reconciliationService.findUnreconciledWithdrawals(transactions);
  }
}
