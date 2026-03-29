import { TodoSection } from "./TodoSection";
import { NotesSection } from "./NotesSection";
import { CheckCircle, LayoutGrid, Activity, StickyNote, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ProjectSidebar = ({ projectPath, isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/10 dark:bg-black/30 backdrop-blur-[2px] z-40"
          />

          {/* Side Panel (Drawer) */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 w-96 h-screen border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between bg-zinc-50/30 dark:bg-zinc-900/10 shrink-0">
              <div className="flex items-center gap-3">

                <div>
                  <h2 className="text-sm font-bold text-zinc-800 dark:text-zinc-100 tracking-tight">HATIRLATICI</h2>

                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Area - Equal Split */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">

              {/* Top Half: Todo Section */}
              <div className="flex-1 flex flex-col min-h-0 p-5 overflow-hidden">
                <div className="mb-3 flex items-center gap-2 shrink-0">
                  <CheckCircle size={15} className="text-emerald-500" />
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Yapılacaklar</h3>
                </div>
                <div className="flex-1 min-h-0">
                  <TodoSection projectPath={projectPath} />
                </div>
              </div>

              {/* Bottom Half: Notes Section */}
              <div className="flex-1 flex flex-col min-h-0 p-5 overflow-hidden">
                <div className="mb-3 flex items-center gap-2 shrink-0">
                  <StickyNote size={15} className="text-blue-500" />
                  <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Notlar</h3>
                </div>
                <div className="flex-1 min-h-0">
                  <NotesSection projectPath={projectPath} />
                </div>
              </div>

            </div>





          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
