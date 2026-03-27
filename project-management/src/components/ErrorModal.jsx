// src/components/ErrorModal.jsx
import { motion } from "framer-motion";
import { X, AlertCircle } from "lucide-react";

export const ErrorModal = ({ isOpen, onClose, title = "Bir Hata Oluştu", message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-100 dark:bg-red-500/10 rounded-2xl">
                            <AlertCircle className="text-red-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Mesaj */}
                <div className="px-8 pb-6">
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 break-words">
                        {message}
                    </p>
                </div>

                {/* Kapat Butonu */}
                <div className="px-8 pb-8">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-2xl transition-colors"
                    >
                        Tamam
                    </button>
                </div>
            </motion.div>
        </div>
    );
};