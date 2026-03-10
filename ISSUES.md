# FinEase — Transaction Logic Audit Report

> Compared against: `TRANSACTION_LOGIC.md`
> Files reviewed: `transactions.service.ts`, `accounts.service.ts`, `TransactionModal.tsx`

---

## ✅ What Works Correctly

| Flow | Behaviour | Status |
|------|-----------|--------|
| **OUT (expense)** — Bank/Cash source | `balance -= amount` | ✅ Correct |
| **OUT (expense)** — Investment source | `balance -= amount`, `invested -= amount` | ✅ Correct |
| **IN (income)** — Bank/Cash | `balance += amount` | ✅ Correct |
| **IN (income)** — Investment | `balance += amount`, `invested += amount` | ✅ Correct |
| **IN (income)** — Investment + `isBalanceSync` | `balance = amount` (absolute), invested unchanged | ✅ Correct |
| **MOVE (transfer)** — Bank → Bank | `src -= amount`, `dst += amount` | ✅ Correct |
| **MOVE (transfer)** — Bank → Investment | `src -= amount`, `dst += amount AND invested += amount` | ✅ Correct |
| **MOVE (transfer)** — Investment → Bank | `src -= amount AND invested -= amount`, `dst += amount` | ✅ Correct |
| **MOVE (transfer)** — Bank → Debt repayment | principal/interest split tracked | ✅ Correct |
| **De-duplication in replay** | Map used to avoid double-counting transfers | ✅ Correct |
| **Initial amount as baseline** | `initialAmount` used as floor, falls back to `balance` | ✅ Correct |
| **Debt balance sign** | Always stored negative | ✅ Correct |

---

## ❌ Issues Found

### Issue 1 — OUT with "Credit To" (Debt Repayment) is treated as transfer, not expense

**Where:** `TransactionModal.tsx` line 108 + `transactions.service.ts` create()

**What happens:**
When the user selects an OUT transaction and picks a "Credit To" debt account,
the front-end sends `type = "expense"` AND `toAccountId = <debt-id>`.

In `create()`, the service then does:
```ts
const effectiveType = transaction.toAccountId ? 'transfer' : transaction.type;
```

This **overrides** the type to `"transfer"`, so the source account loses money (correct),
but the debt account's recalculation now enters the `toAccountId` block and adds
the amount as if it were a capital contribution — **NOT as a debt repayment with principal/interest split**.

**Expected:** When `type == "expense"` AND `toAccountId == debt`, the debt account
should still receive the principal/interest split, tracked as `repaidCapital` + `burnedInterest`.

**Fix needed:** In `recalculateBalances()`, the debt destination check should also trigger
for `expense` type transactions that have a `toAccountId`, not just `transfer` ones.
OR: the `create()` should preserve the `expense` type when a debt `toAccountId` is present,
and `recalculateBalances` should handle the `toAccountId` block for expenses as well.

---

### Issue 2 — MOVE (Transfer): Debt account as source is allowed but not handled

**Where:** `transactions.service.ts` `recalculateBalances()`, source block

**What happens:**
A debt account can theoretically be set as the `accountId` source on a transfer.
If someone records a "loan received" by doing MOVE with debt as source → bank as dest,
the engine would try to:
- Source (debt): `balance -= amount` (makes debt MORE negative — wrong, loan arrived)
- Destination (bank): `balance += amount` (correct)

**Expected:** A loan received should INCREASE (reduce the negative of) the debt balance,
not decrease it further.

**Fix:** This use case should either be blocked in the UI
OR a new special handling should be added: if source is `debt` on a transfer,
it means money came FROM the loan, so `balance += amount` (reverse sign).

Currently the UI does not expose debt accounts as MOVE sources — **this is safe for now**,
but worth documenting.

---

### Issue 3 — IN (Income) → Investment: `invested` should NOT always increase

**Where:** `transactions.service.ts` recalculateBalances() income block

**What happens:**
```ts
if (tx.type === 'income') {
  // isBalanceSync check...
  } else {
    balance += amount;
    if (acc.type === 'investment') invested += amount;  // ← always increases
  }
}
```

When a user records a **dividend** or **interest earned** as an `income` on their
investment account, the invested amount also increases. But dividends are **not**
additional capital — they are yield. 

**Expected:** Only contributions (MOVE transfers in) should increase `investedAmount`.
Direct income deposits to investments should only increase `balance`.

**Fix:** Add a metadata flag `isCapitalContribution` OR rely on type:
- `transfer` (MOVE into investment) → `invested += amount` ✅
- `income` (dividend/yield) → only `balance += amount`, invested unchanged

---

### Issue 4 — `initialAmount` not set on older accounts causes balance drift

**Where:** `transactions.service.ts` recalculateBalances()

**What happens:**
```ts
let balance = acc.initialAmount !== undefined && acc.initialAmount !== null
  ? Number(acc.initialAmount)
  : Number(acc.balance) || 0;
```

If `initialAmount` is missing (legacy accounts), the engine uses the current `balance`
as the starting point, then replays ALL transactions on top of it.
This **double-counts** every transaction because the current `balance` already
includes those transactions.

**Expected:** If `initialAmount` is missing and there ARE transactions, the balance
should be rebuilt from `0`, not from the current stale `balance`.

**Fix:**
```ts
let balance = acc.initialAmount !== undefined && acc.initialAmount !== null
  ? Number(acc.initialAmount)
  : (txs.length > 0 ? 0 : Number(acc.balance) || 0);
```

---

### Issue 5 — `Deposit To` for IN flow only shows Bank/Cash (no Investment option)

**Where:** `TransactionModal.tsx` lines 434–443

**What happens:**
The "Deposit To" dropdown for `income` only shows Bank and Cash accounts.
Users cannot record an Income transaction directly to an Investment account
(e.g., dividend credited to a brokerage account).

**Expected per doc:** All account types except Debt should be valid income destinations.

**Fix:** Add an `Investments` optgroup to the "Deposit To" dropdown for income flow.

---

## 🔧 Priority Summary

| # | Issue | Severity | Affected Flow |
|---|-------|----------|---------------|
| 1 | OUT + "Credit To" debt treated as transfer | 🔴 High | OUT → Debt |
| 4 | Legacy accounts sans `initialAmount` double-count | 🔴 High | All accounts |
| 3 | Dividend income inflates `investedAmount` | 🟡 Medium | IN → Investment |
| 5 | Investment missing from "Deposit To" for IN | 🟡 Medium | IN → Investment |
| 2 | Debt as MOVE source not handled | 🟢 Low (UI blocks it) | MOVE source |
