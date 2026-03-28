import { motion, AnimatePresence } from "framer-motion";
import { X, GitMerge, AlertTriangle, CheckCircle2, ExternalLink, FileWarning } from "lucide-react";
import { ScrollArea } from "./ScrollArea";

export const GitMergeModal = ({ isOpen, onClose, result, onOpenWith }) => {
    if (!isOpen || !result) return null;

    const isConflict = result.type === "Conflict";
    const data = result.data;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isConflict ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                                {isConflict ? (
                                    <AlertTriangle size={20} className="text-orange-600 dark:text-orange-400" />
                                ) : (
                                    <GitMerge size={20} className="text-emerald-600 dark:text-emerald-400" />
                                )}
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
                                    {isConflict ? "Merge Çakışması!" : "Merge Başarılı"}
                                </h2>
                                <p className="text-xs text-zinc-500">
                                    {isConflict ? "Bazı dosyalarda çakışmalar tespit edildi." : "Dallar başarıyla birleştirildi."}
                                </p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <ScrollArea className="flex-1 p-6">
                        {isConflict ? (
                            <div className="space-y-4 pb-2">
                                <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 p-4 rounded-2xl flex gap-3">
                                    <AlertTriangle size={20} className="text-orange-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-orange-800 dark:text-orange-300 font-medium">
                                        Lütfen aşağıdaki dosyaları bir kod editörü ile açın ve çakışmaları çözün. Çözdükten sonra commit atmayı unutmayın.
                                    </p>
                                </div>

                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1 mb-2">Çakışan Dosyalar</p>
                                    {data.map((file, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl">
                                            <FileWarning size={16} className="text-orange-500" />
                                            <span className="text-sm font-mono text-zinc-700 dark:text-zinc-300 truncate flex-1">{file}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle2 size={32} className="text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <p className="text-sm text-zinc-500">Her şey yolunda, değişiklikler birleştirildi.</p>
                            </div>
                        )}
                    </ScrollArea>

                    {/* Footer / Fixed Action Area */}
                    <div className="p-6 pt-0">
                        {isConflict ? (
                            <button
                                onClick={() => {
                                    onOpenWith();
                                    onClose();
                                }}
                                className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl text-sm font-bold shadow-lg shadow-black/10 hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                <ExternalLink size={18} /> Editör ile Çöz
                            </button>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                            >
                                Harika
                            </button>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
