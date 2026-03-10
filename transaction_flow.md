# FinEase Transaction Engine: Technical Flow Documentation

This document defines the core architecture, logic, and permutations of the FinEase transaction engine. It serves as the single source of truth for how data moves within the system.

---

## 🏗️ Core Architecture: The "Ledger-First" Strategy

FinEase uses a **Recalculated Ledger** approach rather than simple incremental updates.

- **Why?** To prevent "Balance Drift." If a transaction from 3 months ago is edited or deleted, the system re-runs the entire history of the affected account(s) to ensure the current balance is 100% accurate.
- **Trigger:** Any Create, Update, or Delete operation on a transaction triggers a [recalculateBalances(accountId)](file:///Users/dpithwa/Documents/SHIV-DEV/finease/apps/api/src/finance/transactions.service.ts#256-365) event.

---

## 🔄 Transaction Types & Flows

### 1. Standard Income & Expense

_Most common flow: Simple addition or subtraction from a single account._

| Feature     | Income Flow                  | Expense Flow                 |
| :---------- | :--------------------------- | :--------------------------- |
| **Logic**   | `Balance = Balance + Amount` | `Balance = Balance - Amount` |
| **Status**  | `completed`                  | `completed`                  |
| **Example** | Salary Deposit: +$5,000      | Grocery Purchase: -$150      |

---

### 2. Internal Transfers

_Moving money between two accounts owned by the user._

- **Logic:**
  - **Source Account:** `BalanceRaw = BalanceRaw - Amount`
  - **Destination Account:** `BalanceRaw = BalanceRaw + Amount`
- **Example:** Transfer from "Savings Account" to "Wallet".
  - _Action:_ Move $500.
  - _Result:_ Savings -$500, Wallet +$500.

---

### 3. Debt Repayment (Loan/Credit Card)

_A specialized transfer where the destination account type is "Debt"._

- **Logic:**
  - Source (Bank) is deducted by the full `amount`.
  - Destination (Debt) parses the `amount` into **Repaid Capital** and **Burned Interest**.
  - `Debt Balance = Debt Balance + Repaid Capital` (reduces negative debt).
  - `Total Burned Interest` is tracked separately.
- **Example:** $1,200 Mortgage Payment ($1,000 Repaid Capital + $200 Burned Interest).
  - _Source (Bank):_ Balance - $1,200.
  - _Destination (Debt):_ Balance improves by +$1,000. Interest tracked: $200.

---

### 4. Goal Contributions

_Directing funds towards a specific Financial Goal (treated as a virtual sub-account)._

- **Logic:**
  - Deducts from the source account.
  - Increases `currentAmount` of the [Goal](file:///Users/dpithwa/Documents/SHIV-DEV/finease/apps/api/src/finance/finance.controller.ts#166-169) entity.
- **Example:** "Emergency Fund" Goal.
  - _Action:_ Transfer $200 from Checkings.
  - _Result:_ Checkings -$200, Goal Progress +$200.

---

### 5. Automated & Recurring (Smart Logic)

_Transactions flagged with `isAutomated: true`._

- **Initial State:** Created with status `pending_confirmation`.
- **Confirmation Flow:**
  1. User confirms the transaction.
  2. Status changes to `completed`.
  3. [recalculateBalances](file:///Users/dpithwa/Documents/SHIV-DEV/finease/apps/api/src/finance/transactions.service.ts#256-365) triggers.
  4. **Chain Creation:** If `recurringCount > 1`, a new `pending_confirmation` transaction is automatically generated for the next period (Daily/Weekly/Monthly/Yearly) using [calculateNextDate](file:///Users/dpithwa/Documents/SHIV-DEV/finease/apps/api/src/finance/transactions.service.ts#21-41).
- **Example:** Monthly Rent of $2,000 (Recurring for 12 months).
  - _Month 1:_ User confirms. Months remaining drops to 11.
  - _Month 2:_ New $2,000 "Pending" item appears on the dashboard automatically.

---

### 6. Investment Flows (Valuation vs. Cash)

_Special handling for investment accounts to separate performance from contributions._

- **Standard Contribution:** Increases both [Balance](file:///Users/dpithwa/Documents/SHIV-DEV/finease/apps/api/src/finance/transactions.service.ts#256-365) and `InvestedAmount`.
  - _Example:_ Buy $1,000 of Stock. Invested: $1,000, Value: $1,000.
- **Valuation Adjustment:** Increases [Balance](file:///Users/dpithwa/Documents/SHIV-DEV/finease/apps/api/src/finance/transactions.service.ts#256-365) but **NOT** `InvestedAmount`. Used to track market gains.
  - _Example:_ Stock grows by $200.
  - _Transaction Type:_ Income. _Category:_ `Valuation Adjustment`.
  - _Result:_ Balance becomes $1,200. Invested stays $1,000. (Performance = +20%).

---

## 🧩 Lifecycle Status Table

| Status                   | Meaning                                | Balance Impact |
| :----------------------- | :------------------------------------- | :------------- |
| **Completed**            | Finalized transaction.                 | **YES**        |
| **Approved**             | Admin/System verified.                 | **YES**        |
| **Pending Confirmation** | Automated suggestion waiting for user. | **NO**         |
| **Canceled**             | User-rejected automated item.          | **NO**         |
| **Draft**                | Incomplete entry.                      | **NO**         |

---

| Scenario | Source Balance | Dest Balance | Goal Progress | Metric Updated | Automated Chain |
| :--- | :---: | :---: | :---: | :--- | :---: |
| **Salary / Yield** | `+` | N/A | N/A | `balance` | N/A |
| **General Expense** | `-` | N/A | N/A | `balance` | If Recurring |
| **Bank Transfer** | `-` | `+` | N/A | `balance` (Both) | N/A |
| **Goal Funding** | `-` | N/A | `+` | `currentAmount` | N/A |
| **Investment Buy** | `-` | `+` | N/A | `balance` + `invested` | N/A |
| **Valuation Gain** | `+` | N/A | N/A | `balance` (Only) | N/A |
| **Debt Repayment** | `-` | `+` | N/A | `repaidCapital` + `burnedInterest` | N/A |
| **Card Payment** | `-` | `+` | N/A | `balance` (Limit) | N/A |
| **Subscription** | `-` | N/A | N/A | `balance` | Triggers Next |
| **Asset Purchase** | `-` | `+` | N/A | `balance` | N/A |

---

## 🛡️ Data Integrity Guards

1. **Soft Delete:** Transactions are never truly deleted from the DB; they are marked with `deletedAt`. The engine filters these out before recalculation.
2. **Batch Processing:** All balance updates happen in atomic Firestore batches to prevent partial updates.
3. **Ghost Prevention:** Deleting an account also triggers a recursive soft-delete of all associated transactions.
