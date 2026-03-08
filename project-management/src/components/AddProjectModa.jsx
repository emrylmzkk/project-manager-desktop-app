// src/components/AddProjectModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FolderPlus, Layers, X } from "lucide-react";

export const AddProjectModal = ({ isOpen, onClose, onSelectSingle, onSelectMulti }) => {
    if (!isOpen) return null;

    const options = [
        {
            title: "Tek Proje Ekle",
            description: "Belirli bir proje klasörünü doğrudan listeye ekle.",
            icon: <FolderPlus className="text-blue-500" size={32} />,
            onClick: onSelectSingle,
            color: "hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
        },
        {
            title: "Klasörü Tara (Toplu)",
            description: "Seçtiğiniz klasörün içindeki tüm alt klasörleri proje olarak tara.",
            icon: <Layers className="text-emerald-500" size={32} />,
            onClick: onSelectMulti,
            color: "hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
                <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">Proje Ekle</h3>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                <div className="p-6 grid gap-4">
                    {options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => { opt.onClick(); onClose(); }}
                            className={`flex items-start gap-5 p-5 border-2 border-zinc-100 dark:border-zinc-800 rounded-2xl text-left transition-all group ${opt.color}`}
                        >
                            <div className="mt-1">{opt.icon}</div>
                            <div>
                                <h4 className="font-bold text-zinc-900 dark:text-white text-lg group-hover:text-current transition-colors">
                                    {opt.title}
                                </h4>
                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                                    {opt.description}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};