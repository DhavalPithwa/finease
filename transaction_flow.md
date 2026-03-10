# FinEase Transaction Engine — Complete Flow Documentation

> **Single source of truth** for how every transaction type moves money.
> Last updated: 10 Mar 2026

---

## 🏗️ Core Architecture: Ledger-First Recalculation

FinEase never updates a balance directly. Instead, it **replays every completed transaction** for an account from its `initialAmount` baseline. This guarantees accuracy even when past records are edited or deleted.

### Trigger

Any Create / Update / Delete on a transaction triggers [`recalculateBalances(accountId)`](file:///Users/dpithwa/Documents/SHIV-DEV/finease/apps/api/src/finance/transactions.service.ts#L250) for all affected accounts.

### Baseline

| Condition | Starting Balance |
|-----------|-----------------|
| `initialAmount` is set | `Number(initialAmount)` (set at account creation) |
| `initialAmount` missing + transactions exist | `0` (prevents double-counting) |
| `initialAmount` missing + no transactions | Current `balance` (legacy fallback) |

---

## 📊 Account Types

| Type         | Description                               | Balance Sign |
|--------------|-------------------------------------------|--------------|
| `bank`       | Savings / current account                 | Positive     |
| `cash`       | Physical cash / digital wallet            | Positive     |
| `card`       | Credit card / debit card                  | Positive     |
| `investment` | Growth Index, mutual funds, stocks        | Positive     |
| `debt`       | Loans, EMIs, mortgages (money you owe)    | **Negative** |
| `asset`      | Fixed assets (land, gold, vehicle)        | Positive     |

---

## 🔄 The Three Flow Types

### 1. OUT (Expense)

> Money **leaves** the system to an external party (rent, grocery, EMI).

**Source account (`accountId`) is deducted:**

| Source Account Type | Balance Effect | Invested Effect |
|---------------------|----------------|-----------------|
| Bank                | `balance -= amount` | — |
| Cash                | `balance -= amount` | — |
| Card                | `balance -= amount` | — |
| Investment          | `balance -= amount` | `invested -= amount` |

**Optional "Credit To" (`toAccountId`):**

If the user selects a "Credit To" destination (e.g. a Debt account), the transaction has **both** a source deduction AND a destination credit. The backend automatically converts this to a `transfer` type.

| Destination (Credit To) | Balance Effect | Tracked Metrics |
|--------------------------|----------------|-----------------|
| Debt account             | `balance += principal` | `repaidCapital += principal`, `burnedInterest += interest` |
| Bank / Cash / Card       | `balance += amount` | — |
| Investment               | `balance += amount` | `invested += amount` |
| Financial Goal           | — | `currentAmount += amount` |

**Net Worth Impact:** Decreases (unless Credit To is used, making it an internal move).

---

### 2. IN (Income)

> Money **enters** the system from an external source (salary, dividend, gift).

**Destination account (`accountId`) is credited:**

| Destination Account Type | Balance Effect | Invested Effect |
|--------------------------|----------------|-----------------|
| Bank                     | `balance += amount` | — |
| Cash                     | `balance += amount` | — |
| Card                     | `balance += amount` | — |
| Investment               | `balance += amount` | **No change** (income is yield, not capital) |

**Special: Valuation Sync (Investment Only)**

When a transaction has `metadata.isBalanceSync = true`, the engine **sets** the balance to the exact amount instead of adding:

```
balance = amount          ← absolute set (replaces previous value)
invested = unchanged      ← preserves cost basis for P&L calculation
```

This is triggered automatically when you manually edit an investment account's balance in the Portfolio page. It lets you reconcile your portfolio to the real market value without calculating deltas.

**Net Worth Impact:** Increases.

---

### 3. MOVE (Transfer)

> Money moves between two internal accounts. **Net worth is unchanged.**

**Source account (`accountId`) is deducted:**

| Source Type   | Balance Effect | Invested Effect |
|---------------|----------------|-----------------|
| Bank          | `balance -= amount` | — |
| Cash          | `balance -= amount` | — |
| Card          | `balance -= amount` | — |
| Investment    | `balance -= amount` | `invested -= amount` |

**Destination account (`toAccountId`) is credited:**

| Destination Type | Balance Effect | Invested Effect | Other Metrics |
|------------------|----------------|-----------------|---------------|
| Bank             | `balance += amount` | — | — |
| Cash             | `balance += amount` | — | — |
| Card             | `balance += amount` | — | — |
| Investment       | `balance += amount` | `invested += amount` | — |
| Debt             | `balance += principal` | — | `repaidCapital += principal`, `burnedInterest += interest` |
| Financial Goal   | — | — | `currentAmount += amount` |

**Key Rule:** Only MOVE (transfer) into an investment account increases the `investedAmount` (cost basis). This is how the system differentiates between "money you put in" vs "money the market gave you."

**Net Worth Impact:** Zero (internal movement).

---

## 📋 Complete Scenario Matrix

| Scenario | Flow | Source Balance | Dest Balance | investedAmount | repaidCapital | burnedInterest | Net Worth |
|---|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Salary** | IN | — | `+amount` | — | — | — | ↑ |
| **Grocery** | OUT | `-amount` | — | — | — | — | ↓ |
| **Bank → Bank** | MOVE | `-amount` | `+amount` | — | — | — | = |
| **Bank → Investment** | MOVE | `-amount` | `+amount` | `+amount` | — | — | = |
| **Investment → Bank** | MOVE | `-amount` | `+amount` | `-amount` (src) | — | — | = |
| **Dividend (to Investment)** | IN | — | `+amount` | **unchanged** | — | — | ↑ |
| **Valuation Sync** | IN + flag | — | `= amount` | **unchanged** | — | — | ↑/↓ |
| **EMI Payment** | OUT + CreditTo Debt | `-amount` | `+principal` | — | `+principal` | `+interest` | ↓ (by interest) |
| **Loan Repayment** | MOVE to Debt | `-amount` | `+principal` | — | `+principal` | `+interest` | = |
| **Goal Funding** | MOVE/OUT to Goal | `-amount` | — | — | — | — | = |
| **Subscription** | OUT + Recur | `-amount` | — | — | — | — | ↓ |

---

## ⚡ Automated & Recurring Transactions

Transactions flagged with `isAutomated: true` follow a chain pattern:

1. **Created** with status `pending_confirmation`.
2. **User confirms** → status changes to `completed` → balance recalculates.
3. **Chain creation:** If `recurringCount > 1`, a new `pending_confirmation` transaction is automatically generated for the next period.

| Frequency | Next Date Calculation |
|-----------|----------------------|
| `daily`   | `+1 day` |
| `weekly`  | `+7 days` |
| `monthly` | `+1 month` |
| `yearly`  | `+1 year` |

Duplicate prevention: The system checks if a matching transaction already exists for the next date before creating one.

---

## 🧩 Transaction Lifecycle

| Status | Meaning | Balance Impact |
|--------|---------|:--------------:|
| `completed` | Finalized transaction | ✅ YES |
| `approved` | Admin/system verified | ✅ YES |
| `pending_confirmation` | Automated suggestion awaiting user | ❌ NO |
| `rejected` | User-rejected automated item | ❌ NO |

---

## 🛡️ Data Integrity Guards

1. **Soft Delete** — Transactions are never hard-deleted; they're marked with `deletedAt`. The engine filters these out before replay.
2. **Atomic Batches** — All balance updates happen in Firestore batch writes to prevent partial updates.
3. **De-duplication** — The engine uses a `Map` to de-duplicate transactions that appear in both source and destination queries (transfers).
4. **Account Cascade** — Deleting an account soft-deletes all its transactions automatically.
5. **Multi-Account Recalc** — On update/delete, the engine recalculates ALL affected accounts and goals (old + new source/destination).

---

## 🔑 Key Invariants

1. **Balances are NEVER updated directly** — always via `recalculateBalances()`.
2. **`initialAmount`** is the starting floor for every account, set at creation.
3. **Debt accounts** always carry a negative balance (representing what is owed).
4. **`isBalanceSync`** (metadata flag) is the ONLY way to trigger an absolute valuation set. It is set only by the system during manual portfolio edits.
5. **`investedAmount`** tracks actual capital contributed, not market value.
   - Market value = `balance`
   - Profit/Loss = `balance - investedAmount`
6. **Income (IN flow)** to investment accounts is treated as yield/dividend — it does NOT inflate your cost basis.
7. **Only MOVE (transfer)** into an investment account increases your cost basis (`investedAmount`).
