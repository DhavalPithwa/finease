"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addAccount } from "@/store/slices/accountsSlice";
import { NetWorthChart } from "@/components/dashboard/NetWorthChart";
import { AddInvestmentModal } from "@/components/portfolio/AddInvestmentModal";
import { AddAssetTypeModal } from "@/components/portfolio/AddAssetTypeModal";
import { addAssetType, updateAssetType, removeAssetType } from "@/store/slices/assetTypesSlice";
import toast from "react-hot-toast";

export default function PortfolioPageClient() {
  const dispatch = useDispatch();
  const [isAddInvestmentOpen, setIsAddInvestmentOpen] = useState(false);
  const [isAssetTypeModalOpen, setIsAssetTypeModalOpen] = useState(false);
  const [editingAssetType, setEditingAssetType] = useState<{ id: string; name: string; color: string } | null>(null);
  
  const accounts = useSelector((state: RootState) => state.accounts.items);
  const assetTypes = useSelector((state: RootState) => state.assetTypes.items);

  const investments = accounts.filter(a => a.type === 'investment');
  const loans = accounts.filter(a => a.type === 'loan');
  
  const assets = accounts.filter(a => a.type !== 'loan').reduce((sum, item) => sum + item.balance, 0);
  const liabilities = Math.abs(loans.reduce((sum, item) => sum + item.balance, 0));
  const netWorth = assets - liabilities;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Investment Portfolio</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your wealth growth across all asset classes.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => { setEditingAssetType(null); setIsAssetTypeModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-lg transition-colors shadow-sm"
          >
            + Asset Class
          </button>
          <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-border-dark dark:bg-surface-dark dark:text-slate-200 dark:hover:bg-surface-hover transition">
            <span className="material-symbols-outlined text-lg">download</span>
            Export
          </button>
          <button 
            onClick={() => setIsAddInvestmentOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary rounded-lg text-sm font-medium text-white hover:bg-primary-dark transition shadow-lg shadow-primary/25"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Investment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">account_balance</span>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Net Worth</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹ {(netWorth).toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-2">Assets - Liabilities</div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
              <span className="material-symbols-outlined">payments</span>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Total Invested (Assets)</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹ {assets.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-2">Current Value</div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
              <span className="material-symbols-outlined">credit_card</span>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Liabilities</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">₹ {liabilities.toLocaleString()}</div>
          <div className="text-xs text-slate-500 mt-2">Active Loans</div>
        </div>

        <div className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-border-dark p-5 rounded-xl shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
              <span className="material-symbols-outlined">percent</span>
            </div>
          </div>
          <div className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-wider">Portfolio XIRR</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">18.4%</div>
          <div className="text-xs text-slate-500 mt-2">Annualized Return</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 mt-8">
        <NetWorthChart data={[]} currentNetWorth={netWorth} percentageChange={0} />
      </div>

      <div className="space-y-6 mb-8 mt-8">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Asset Classes</h3>
          <button 
             onClick={() => { setEditingAssetType(null); setIsAssetTypeModalOpen(true); }}
             className="text-sm font-bold text-primary hover:underline"
          >
             Add New
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {assetTypes.map(c => (
            <div 
              key={c.id} 
              onClick={() => { setEditingAssetType(c); setIsAssetTypeModalOpen(true); }}
              className="p-4 rounded-xl bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark flex items-center justify-between cursor-pointer hover:border-primary transition-colors group"
            >
               <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{c.name}</span>
               <div className={`w-3 h-3 rounded-full ${c.color}`} />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Investments</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-border-dark dark:bg-surface-dark">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 dark:bg-[#0b0d12] dark:text-slate-300">
                <tr>
                  <th className="px-6 py-4" scope="col">Name</th>
                  <th className="px-6 py-4" scope="col">Type</th>
                  <th className="px-6 py-4 text-right" scope="col">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-border-dark">
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-6 text-center text-slate-500">No investments added yet.</td>
                  </tr>
                ) : (
                  investments.map(inv => (
                    <tr key={inv.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 dark:text-white">{inv.name}</div>
                      </td>
                      <td className="px-6 py-4 uppercase text-xs font-bold text-slate-500">
                        {inv.assetType || inv.type}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-slate-900 dark:text-white">
                          ₹{inv.balance.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddInvestmentModal 
        isOpen={isAddInvestmentOpen}
        onClose={() => setIsAddInvestmentOpen(false)}
        onSave={(data) => {
          dispatch(addAccount({
            id: `inv-${Date.now()}`,
            userId: "user-1",
            name: data.assetName,
            type: "investment",
            assetType: data.assetType ??"",
            balance: parseFloat(data.amount) || 0,
            currency: "INR",
            lastSyncedAt: new Date().toISOString()
          }));
          setIsAddInvestmentOpen(false);
        }}
      />
      
      <AddAssetTypeModal 
        isOpen={isAssetTypeModalOpen}
        assetType={editingAssetType}
        onClose={() => setIsAssetTypeModalOpen(false)}
        onSave={(data) => {
          if (data.id) {
            dispatch(updateAssetType({
              id: data.id,
              name: data.name,
              color: data.color
            }));
          } else {
            dispatch(addAssetType({
              id: `ast-${Date.now()}`,
              name: data.name,
              color: data.color
            }));
          }
          setIsAssetTypeModalOpen(false);
        }}
        onDelete={(id) => {
          dispatch(removeAssetType(id));
          setIsAssetTypeModalOpen(false);
          toast.success("Asset Class deleted");
        }}
      />
    </div>
  );
}
