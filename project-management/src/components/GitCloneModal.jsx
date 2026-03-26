// src/components/GitCloneModal.jsx
import { motion } from "framer-motion";
import { X, GitBranch, FolderOpen, Loader2 } from "lucide-react";
import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";

export const GitCloneModal = ({ isOpen, onClose, onSuccess }) => {
    const [url, setUrl] = useState("");
    const [targetPath, setTargetPath] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handlePickFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            title: "Klonlanacak Konumu Seç",
        });
        if (selected) {
            setTargetPath(selected);
        }
    };

    const handleClone = async () => {
        if (!url.trim()) {
            setError("Lütfen bir URL girin.");
            return;
        }
        if (!targetPath) {
            setError("Lütfen hedef klasörü seçin.");
            return;
        }

        setError("");
        setIsLoading(true);
        try {
            await invoke("git_clone", { targetPath, url: url.trim() });
            onSuccess(targetPath); // üst bileşene bildir
            handleClose();
        } catch (err) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setUrl("");
        setTargetPath("");
        setError("");
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-8 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Git Clone</h3>
                        <p className="text-zinc-500 text-sm">HTTPS veya SSH URL ile klonla.</p>
                    </div>
                    <button onClick={handleClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 pt-0 space-y-4">
                    {/* URL Input */}
                    <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
                            Repository URL
                        </label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-sm dark:text-white placeholder-zinc-400 focus:outline-none focus:border-orange-500 transition-colors"
                        />
                    </div>

                    {/* Hedef Klasör Seçimi */}
                    <div>
                        <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 block">
                            Hedef Klasör
                        </label>
                        <button
                            onClick={handlePickFolder}
                            className="w-full flex items-center gap-3 px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-orange-500 transition-colors text-left"
                        >
                            <FolderOpen size={18} className="text-orange-500 shrink-0" />
                            <span className="text-sm truncate text-zinc-500 dark:text-zinc-400">
                                {targetPath || "Klasör seç..."}
                            </span>
                        </button>
                    </div>

                    {/* Hata Mesajı */}
                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-500/10 px-4 py-2 rounded-xl">
                            {error}
                        </p>
                    )}

                    {/* Clone Butonu */}
                    <button
                        onClick={handleClone}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold rounded-2xl transition-colors"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Klonlanıyor...
                            </>
                        ) : (
                            <>
                                <GitBranch size={18} />
                                Clone
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};