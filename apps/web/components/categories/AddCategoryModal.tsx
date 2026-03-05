import { useState, useEffect } from "react";
import { X, LayoutGrid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; name: string; color: string; parentType?: string }) => void;
  onDelete?: (id: string) => void;
  category?: { id: string; name: string; color: string; parentType?: string } | null;
}

export function AddCategoryModal({ isOpen, onClose, onSave, onDelete, category }: AddCategoryModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("bg-indigo-500");
  const [parentType, setParentType] = useState("needs");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (category) {
        setName(category.name);
        setColor(category.color);
        setParentType(category.parentType || "needs");
      } else {
        setName("");
        setColor("bg-indigo-500");
        setParentType("needs");
      }
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
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
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-t-[2rem] sm:rounded-2xl border-t sm:border border-slate-200 dark:border-white/5 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
          >
            <div className="px-5 py-3.5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">
                {category ? "Taxonomy Refinement" : "New Category Node"}
              </h3>
              <button 
                onClick={onClose} 
                className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Label</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Grocery, SaaS..."
                  className="w-full h-10 bg-slate-50 dark:bg-slate-950 border-none rounded-xl px-3 text-xs font-bold text-slate-900 dark:text-white ring-1 ring-slate-100 dark:ring-white/5 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Spending Bucket</label>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl ring-1 ring-slate-100 dark:ring-white/5">
                  {["needs", "wants", "unavoidable"].map((type) => (
                    <button
                      key={type}
                      onClick={() => setParentType(type)}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        parentType === type 
                        ? "bg-white dark:bg-slate-800 text-primary shadow-sm ring-1 ring-black/5 dark:ring-white/10" 
                        : "text-slate-500"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Theme Color</label>
                <div className="flex flex-wrap gap-2.5 px-1 py-1">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full ${c} transition-all active:scale-90 flex items-center justify-center ${
                        color === c ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-slate-900 shadow-lg" : ""
                      }`}
                    >
                      {color === c && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950/50 mt-auto border-t border-slate-100 dark:border-white/5 flex gap-3">
                {category && onDelete && (
                  <button
                    onClick={() => onDelete(category.id)}
                    className="flex-1 h-10 bg-rose-50 dark:bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-100 transition-all active:scale-95 border border-rose-100 dark:border-rose-500/20"
                  >
                    Scrap
                  </button>
                )}
                <button
                  onClick={() => {
                    if(name.trim()) {
                      onSave({ id: category?.id, name, color, parentType });
                      setName("");
                    }
                  }}
                  className="flex-[2] h-10 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <LayoutGrid className="w-4 h-4" />
                  {category ? "Commit" : "Create"}
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
