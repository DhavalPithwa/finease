import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddAssetTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; color: string }) => void;
  onDelete?: (id: string) => void;
  assetType?: { id: string; name: string; color: string } | null;
}

export function AddAssetTypeModal({ isOpen, onClose, onSave, onDelete, assetType }: AddAssetTypeModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-indigo-500");

  useEffect(() => {
    if (assetType) {
      setName(assetType.name);
      setColor(assetType.color);
    } else {
      setName("");
      setColor("bg-indigo-500");
    }
  }, [assetType, isOpen]);

  const colors = [
    "bg-indigo-500",
    "bg-orange-500",
    "bg-blue-500",
    "bg-pink-500",
    "bg-emerald-500",
    "bg-purple-500",
    "bg-rose-500",
    "bg-amber-500"
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-border-dark shadow-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100 dark:border-border-dark flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {assetType ? "Edit Asset Class" : "New Asset Class"}
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Asset Class Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Mutual Funds"
                className="w-full p-3 bg-slate-50 dark:bg-[#0b0d12] border border-slate-200 dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Color Theme</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {colors.map(c => (
                  <button 
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full ${c} ${color === c ? 'ring-2 ring-offset-2 ring-primary dark:ring-offset-surface-dark' : 'hover:scale-110 transition-transform'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => {
                  if(name.trim()) {
                    onSave({ id: assetType?.id, name, color });
                    setName("");
                    setColor("bg-indigo-500");
                  }
                }}
                className="flex-1 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
              >
                {assetType ? "Update Asset Class" : "Create Asset Class"}
              </button>
              
              {assetType && onDelete && (
                <button 
                  onClick={() => onDelete(assetType.id)}
                  className="px-6 py-4 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 font-bold rounded-xl transition-all active:scale-[0.98]"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
