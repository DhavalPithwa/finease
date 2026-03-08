"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import {
  Trash2,
  Users as UsersIcon,
  ChevronDown,
  Database,
  Search,
  Loader2,
  AlertTriangle,
  History,
  Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

interface DeletedItem {
  id: string;
  collection: string;
  deletedAt: string;
  description?: string;
  name?: string;
  amount?: number;
  [key: string]: any;
}

export default function AdminPurgePage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [deletedItems, setDeletedItems] = useState<DeletedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsLoading, setItemsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [purgingId, setPurgingId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    item: DeletedItem | null;
  }>({
    isOpen: false,
    item: null,
  });

  const fetchUsers = useCallback(async () => {
    try {
      const res = await api.get<User[]>("/admin/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch user list");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeletedItems = useCallback(async (uid: string) => {
    if (!uid) {
      setDeletedItems([]);
      return;
    }
    setItemsLoading(true);
    try {
      const res = await api.get<DeletedItem[]>(`/admin/users/${uid}/deleted-items`);
      setDeletedItems(res.data);
    } catch {
      toast.error("Failed to fetch deleted items for user");
    } finally {
      setItemsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchUsers();
    }
  }, [currentUser, fetchUsers]);

  useEffect(() => {
    if (selectedUserId) {
      fetchDeletedItems(selectedUserId);
    }
  }, [selectedUserId, fetchDeletedItems]);

  const handlePurge = async () => {
    if (!confirmModal.item) return;

    const { id, collection } = confirmModal.item;
    setPurgingId(id);
    try {
      await api.delete(`/admin/purge/${collection}/${id}`);
      setDeletedItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Item permanently removed from ledger");
    } catch {
      toast.error("Failed to purge item");
    } finally {
      setPurgingId(null);
      setConfirmModal({ isOpen: false, item: null });
    }
  };

  const filteredItems = deletedItems.filter((item) => {
    const searchStr = (item.description || item.name || item.id || "").toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm z-50">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 pt-4 pb-20 lg:pb-8 space-y-6 lg:space-y-8">
      <PageHeader
        title="Protocol Purge"
        subtitle="Permanent data removal from system ledgers"
        className="mb-8"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Selection Sidebar */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <UsersIcon className="size-4 text-primary" />
            <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
              Target Identity
            </h3>
          </div>
          
          <div className="relative">
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full h-12 px-4 appearance-none bg-white dark:bg-slate-900 border-none rounded-2xl text-xs font-black ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm pr-10"
            >
              <option value="">Select an identity...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.displayName} ({u.email})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
          </div>

          <Card className="p-6 border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="size-16 rounded-[2rem] bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <AlertTriangle className="size-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">
                  Hard Delete Protocol
                </h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
                  Items purged from this interface are <span className="text-rose-500">permanently destroyed</span>. No recovery is possible once the operation is executed.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Deleted Items List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 px-1">
              <Database className="size-4 text-primary" />
              <h3 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest">
                Soft-Deleted Fragments
                {selectedUserId && ` (${filteredItems.length})`}
              </h3>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!selectedUserId}
                className="w-full h-9 bg-white dark:bg-slate-900 border-none rounded-xl pl-9 text-[10px] font-bold ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all shadow-sm disabled:opacity-50"
                placeholder="Filter fragments..."
              />
            </div>
          </div>

          <div className="min-h-[400px] space-y-3 relative">
            {itemsLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="size-6 text-primary animate-spin" />
              </div>
            ) : !selectedUserId ? (
              <div className="h-[400px] rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="size-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                  <Info className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    No Target Selected
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    Identify a user to scan for deleted fragments
                  </p>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="h-[400px] rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-white/5 flex flex-col items-center justify-center text-center p-8 space-y-4">
                <div className="size-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <History className="size-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-emerald-500 uppercase tracking-widest">
                    Clean Sector
                  </h4>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                    No soft-deleted fragments detected for this identity
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                <AnimatePresence mode="popLayout">
                  {filteredItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Card className="p-4 border-slate-100 dark:border-white/5 hover:border-primary/20 transition-all group overflow-hidden relative">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="size-10 rounded-xl bg-slate-50 dark:bg-white/5 flex flex-col items-center justify-center text-[8px] font-black uppercase text-slate-400 border border-slate-100 dark:border-white/10 shrink-0">
                              <span>COL</span>
                              <span className="text-primary truncate max-w-[32px]">{item.collection.charAt(0)}</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">
                                    {item.collection} fragment
                                </span>
                              <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight truncate">
                                {item.description || item.name || item.id}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                                  Deleted: {new Date(item.deletedAt).toLocaleDateString()}
                                </span>
                                {item.amount !== undefined && (
                                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">
                                        ₹{item.amount.toLocaleString()}
                                    </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => setConfirmModal({ isOpen: true, item })}
                            disabled={purgingId === item.id}
                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20 active:scale-90 shrink-0 disabled:opacity-50"
                          >
                            {purgingId === item.id ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                          </button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title="Institutional Purge"
        message={
          <div className="space-y-4">
            <p>
              Are you sure you want to permanently destroy this fragment from the system ledgers?
            </p>
            {confirmModal.item && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[10px] space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-bold">Collection:</span>
                  <span className="text-primary font-black uppercase">{confirmModal.item.collection}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 uppercase font-bold">Identity:</span>
                  <span className="dark:text-white font-black truncate max-w-[150px]">{confirmModal.item.id}</span>
                </div>
              </div>
            )}
          </div>
        }
        onConfirm={handlePurge}
        onCancel={() => setConfirmModal({ isOpen: false, item: null })}
      />
    </div>
  );
}
