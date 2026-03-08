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
        return 'text-zinc-600 dark:text-zinc-400';
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white dark:bg-zinc-900 w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-xl flex items-center justify-center">
                                <Terminal size={20} className="text-blue-500" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-zinc-900 dark:text-white">Git Status</h2>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400">Çalışma dizini durumu</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden flex flex-col p-6">
                        <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 h-full flex flex-col">
                            <div className="p-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-400/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-400/50"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-400/50"></div>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest ml-2">Console Output</span>
                            </div>

                            <ScrollArea className="flex-1 p-4">
                                <div className="font-mono text-sm leading-relaxed whitespace-pre">
                                    {lines.map((line, i) => (
                                        <div key={i} className={getLineStyle(line)}>
                                            {line || ' '}
                                        </div>
                                    ))}
                                    {lines.length === 0 && (
                                        <div className="text-zinc-500 italic">Hiçbir çıktı alınamadı.</div>
                                    )}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-zinc-50 dark:bg-zinc-800/10 border-t border-zinc-200 dark:border-zinc-800 flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                        >
                            Tamam
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};