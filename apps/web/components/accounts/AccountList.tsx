"use client";

import { Account } from "@repo/types";
import { Card } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { Building2, Wallet, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface AccountListProps {
  accounts: Account[];
}

export function AccountList({ accounts }: AccountListProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "bank": return <Landmark className="w-5 h-5" />;
      case "cash": return <Wallet className="w-5 h-5" />;
      case "loan": return <Building2 className="w-5 h-5" />;
      default: return <Landmark className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "bank": return "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400";
      case "cash": return "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400";
      case "loan": return "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <Card key={account.id} className="hover:border-primary/50 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className={`p-2 rounded-lg ${getTypeColor(account.type)}`}>
              {getIcon(account.type)}
            </div>
            <Badge variant="default" className="capitalize">{account.type}</Badge>
          </div>
          <div className="space-y-1">
            <h4 className="text-slate-900 dark:text-white font-bold">{account.name}</h4>
            {account.institutionName && (
              <p className="text-xs text-slate-500 font-medium">{account.institutionName}</p>
            )}
          </div>
          <div className="mt-6">
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(account.balance)}
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
              Last synced {new Date(account.lastSyncedAt).toLocaleDateString()}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
