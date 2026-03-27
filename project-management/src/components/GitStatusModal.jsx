import { motion, AnimatePresence } from "framer-motion";
import { X, Terminal, FileCode, CheckCircle2, AlertCircle } from "lucide-react";
import { ScrollArea } from "./ScrollArea";

export const GitStatusModal = ({ isOpen, onClose, statusOutput }) => {
    if (!isOpen) return null;

    // Basit bir parse işlemi: değişen dosyaları renkli göstermek için
    const lines = statusOutput ? statusOutput.split('\n') : [];

    const getLineStyle = (line) => {
        if (line.includes('modified:')) return 'text-amber-500';
        if (line.includes('new file:')) return 'text-emerald-500';
        if (line.includes('deleted:')) return 'text-red-500';
        if (line.trim().startsWith('Untracked files:')) return 'font-bold text-zinc-800 dark:text-zinc-200';
        if (line.trim().startsWith('Changes not staged for commit:')) return 'font-bold text-zinc-800 dark:text-zinc-200';
        if (line.trim().startsWith('Changes to be committed:')) return 'font-bold text-emerald-600 dark:text-emerald-400';
        if (line.startsWith('+')) return 'text-emerald-500 bg-emerald-500/5 px-1 rounded-sm';
        if (line.startsWith('-')) return 'text-red-500 bg-red-500/5 px-1 rounded-sm';
        return 'text-zinc-600 dark:text-zinc-400';
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden relative z-10"
            >
                {/* Header */}
                <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-inner">
                            <Terminal size={20} className="text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Git Status Output</h2>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">Klasörün mevcut git durumu ve değişiklikleri</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-all active:scale-95 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 bg-zinc-50/30 dark:bg-black/20">
                    <div className="bg-zinc-900 dark:bg-black rounded-2xl border border-zinc-200 dark:border-zinc-800 h-full flex flex-col shadow-inner overflow-hidden">
                        <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400/30"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400/30"></div>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest ml-2">Console View</span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-600 truncate max-w-[200px]">{lines.length} satır</span>
                        </div>

                        <ScrollArea className="flex-1 p-4 font-mono text-xs md:text-sm leading-relaxed text-zinc-300">
                            <div className="min-w-fit inline-block w-full">
                                {lines.map((line, i) => (
                                    <div key={i} className={`${getLineStyle(line)} whitespace-pre border-l border-zinc-800/50 pl-2 -ml-2`}>
                                        {line || ' '}
                                    </div>
                                ))}
                                {lines.length === 0 && (
                                    <div className="text-zinc-600 italic py-10 flex flex-col items-center justify-center gap-3">
                                        <CheckCircle2 size={32} className="text-zinc-700" />
                                        <span>Herhangi bir değişiklik veya çıktı bulunmuyor.</span>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3 shadow-sm">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-500/20"
                    >
                        Pencereyi Kapat
                    </button>
                </div>
            </motion.div>
        </div>
    );
};