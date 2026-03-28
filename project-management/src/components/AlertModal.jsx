import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export const AlertModal = ({ isOpen, onClose, title, message, type = "info" }) => {
    if (!isOpen) return null;

    const icons = {
        success: <CheckCircle2 size={24} className="text-emerald-500" />,
        error: <AlertCircle size={24} className="text-red-500" />,
        warning: <AlertTriangle size={24} className="text-amber-500" />,
        info: <Info size={24} className="text-blue-500" />
    };

    const bgColors = {
        success: "bg-emerald-50 dark:bg-emerald-900/10",
        error: "bg-red-50 dark:bg-red-900/10",
        warning: "bg-amber-50 dark:bg-amber-900/10",
        info: "bg-blue-50 dark:bg-blue-900/10"
    };

    const buttonColors = {
        success: "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20",
        error: "bg-red-600 hover:bg-red-500 shadow-red-500/20",
        warning: "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20",
        info: "bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden relative"
                >
                    <div className="p-8 flex flex-col items-center text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${bgColors[type]}`}>
                            {icons[type]}
                        </div>
                        
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                            {title || (type === "error" ? "Hata" : type === "success" ? "Başarılı" : "Bilgi")}
                        </h3>
                        
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed px-4">
                            {message}
                        </p>

                        <div className="mt-8 w-full">
                            <button
                                onClick={onClose}
                                className={`w-full py-3 text-white rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg ${buttonColors[type]} cursor-pointer`}
                            >
                                Tamam
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
