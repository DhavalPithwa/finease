# Transaction Engine: Design & Logic

## Account Types

| Type         | Description                                 |
|--------------|---------------------------------------------|
| `bank`       | Standard bank savings/current account       |
| `cash`       | Physical cash / wallet                      |
| `card`       | Credit card / debit card                    |
| `investment` | Growth Index, mutual funds, stocks, etc.    |
| `debt`       | Loans, EMIs, liabilities (negative balance) |
| `asset`      | Fixed / auxiliary assets (land, gold, etc.) |

---

## Flow Types

### 1. OUT (Expense)
Money leaves the system to an external party (e.g., grocery, rent).

| Account Type   | Source Effect                          | Destination Effect |
|----------------|---------------------------------------|--------------------|
| `bank`         | `balance -= amount`                    | N/A                |
| `cash`         | `balance -= amount`                    | N/A                |
| `card`         | `balance -= amount` (increases owed)   | N/A                |
| `investment`   | `balance -= amount`, `invested -= amount` | N/A             |
| `debt`         | Not valid as source for expense        | N/A                |
| `asset`        | `balance -= amount`                    | N/A                |

**Net Worth Impact:** Decreases.

---

### 2. IN (Income)
Money enters the system from an external source (salary, dividend, gift).

| Account Type   | Destination Effect                          |
|----------------|---------------------------------------------|
| `bank`         | `balance += amount`                         |
| `cash`         | `balance += amount`                         |
| `card`         | `balance += amount` (reduces owed)          |
| `investment`   | `balance += amount`, `invested += amount`   |
| `debt`         | Not valid as income destination             |
| `asset`        | `balance += amount`                         |

**Special Case: Valuation Sync (`isBalanceSync` flag in metadata)**
> Used ONLY for investment accounts to set the precise current market value.
> - `balance = amount` (absolute set, replaces previous balance)
> - `invested` is NOT changed (preserves cost basis for P&L calculation)
> - This is triggered by `metadata.isBalanceSync = true`

**Net Worth Impact:** Increases.

---

### 3. MOVE (Transfer)
Money moves between two internal accounts. Net worth is unchanged.

| Source Account     | Source Effect                              | Destination Account  | Destination Effect                     |
|--------------------|--------------------------------------------|----------------------|----------------------------------------|
| `bank`             | `balance -= amount`                        | `bank / cash / card` | `balance += amount`                    |
| `bank`             | `balance -= amount`                        | `investment`         | `balance += amount`, `invested += amount` |
| `bank`             | `balance -= amount`                        | `debt`               | `balance += principal`, `repaidCapital += principal`, `burnedInterest += interest` |
| `cash`             | `balance -= amount`                        | any                  | Same as bank                           |
| `investment`       | `balance -= amount`, `invested -= amount`  | `bank / cash`        | `balance += amount`                    |
| `investment`       | `balance -= amount`, `invested -= amount`  | `investment`         | `balance += amount`, `invested += amount` |

**Net Worth Impact:** Zero (internal movement).

---

## recalculateBalances Engine Rules

The engine replays every completed transaction in chronological order
starting from `initialAmount` (set when account was created).

### Processing Logic per Transaction

```
for each transaction (sorted by date ASC):
  amount = tx.amount
  isSync = tx.metadata.isBalanceSync

  if tx.accountId == this account:  // This account is SOURCE
    if type == 'income':
      if isSync && account.type == 'investment':
        balance = amount   ← absolute set (valuation sync)
      else:
        balance += amount
        if account.type == 'investment': invested += amount

    if type == 'expense':
      balance -= amount
      if account.type == 'investment': invested -= amount

    if type == 'transfer':
      balance -= amount
      if account.type == 'investment': invested -= amount

  if tx.toAccountId == this account:  // This account is DESTINATION
    if account.type == 'debt':
      principal = amount - interestAmount
      balance += principal
      repaidCapital += principal
      burnedInterest += interestAmount
    else:
      balance += amount
      if account.type == 'investment': invested += amount
```

---

## Key Invariants
1. **Balances are never updated directly** — always via `recalculateBalances`.
2. **`initialAmount`** is the starting floor for every account, set at creation.
3. **Debt accounts** always have a negative balance (representing what is owed).
4. **`isBalanceSync`** is the ONLY way to trigger an absolute valuation set.
   It is set only by the system (manual balance edit or specific Sync flows).
5. **`investedAmount`** tracks actual capital contributed, not market value.
   Market value = `balance`. Profit = `balance - investedAmount`.
