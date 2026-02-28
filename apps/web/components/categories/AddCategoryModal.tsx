import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; color: string }) => void;
  category?: { id: string; name: string; color: string } | null;
}

export function AddCategoryModal({ isOpen, onClose, onSave, category }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-indigo-500");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setColor(category.color);
    } else {
      setName("");
      setColor("bg-indigo-500");
    }
  }, [category, isOpen]);

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
              {category ? "Edit Category" : "New Category"}
            </h3>
            <button onClick={onClose} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Category Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Subscriptions"
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

            <button 
              onClick={() => {
                if(name.trim()) {
                  onSave({ id: category?.id, name, color });
                  setName("");
                  setColor("bg-indigo-500");
                }
              }}
              className="w-full mt-4 py-4 bg-primary hover:bg-primary-dark text-white font-black rounded-xl shadow-lg shadow-primary/25 transition-all active:scale-[0.98]"
            >
              {category ? "Update Category" : "Create Category"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
