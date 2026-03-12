# Transaction Engine: Recalculation Rules

> Quick reference for `recalculateBalances()` logic.
> Full documentation: `/transaction_flow.md`

## Baseline

```
if initialAmount exists → balance = initialAmount
if initialAmount missing + has txs → balance = 0
if initialAmount missing + no txs → balance = current balance (legacy)
if debt account + balance > 0 → balance = -balance
```

## Source Account (tx.accountId == this account)

### IN (income):
```
if investment + metadata.isBalanceSync:
    balance = amount            ← absolute set (valuation sync)
else:
    balance += amount
    // invested is NOT changed (income = yield, not capital)
```

### OUT (expense):
```
balance -= amount
if investment: invested -= amount
```

### MOVE (transfer) OUT:
```
balance -= amount
if investment: invested -= amount
```

## Destination Account (tx.toAccountId == this account)

### Debt account (any tx type):
```
interest = tx.interestAmount || 0
principal = amount - interest
balance += principal
repaidCapital += principal
burnedInterest += interest
```

### Non-debt/Non-card account:
```
balance += amount
if investment AND tx.type == 'transfer':
    invested += amount          ← only MOVE transfers increase cost basis
```

### Card account (liability):
```
// Both source and destination logic
if Source:
    balance -= amount           ← Spending/Outflow increases debt
if Destination:
    balance += amount           ← Payments/Inflow reduces debt
```

## Final Account Update

```
account.balance = balance
if investment: account.investedAmount = invested
if debt: account.repaidCapital, account.burnedInterest
```
