// src/components/AddProjectModal.jsx
import { motion } from "framer-motion";
import { FolderPlus, Layers, MousePointerSquareDashed, X, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentWebview } from "@tauri-apps/api/webview";

export const AddProjectModal = ({ isOpen, onClose, onSelectSingle, onSelectMulti, onDropped }) => {
    const [isDragging, setIsDragging] = useState(false);

    // Tauri Native Sürükle-Bırak dinleyicisi
    useEffect(() => {
        let unlistenFn = null;

        const setupListener = async () => {
            unlistenFn = await getCurrentWebview().onDragDropEvent((event) => {
                if (isOpen && onDropped && event.payload.type === "drop") {
                    const paths = event.payload.paths;
                    if (Array.isArray(paths) && paths.length > 0) {
                        onDropped(paths);
                    }
                }
                if (event.payload.type === "drop" || event.payload.type === "cancel") {
                    setIsDragging(false);
                }
            });
        };

        if (isOpen) {
            setupListener();
        }

        return () => {
            if (unlistenFn) {
                unlistenFn();
            }
        };
    }, [isOpen, onDropped]);

    if (!isOpen) return null;

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        // Standart HTML drop genelde tarayıcı güvenliğine takılıp tam 'path'i dönmez.
        // O yüzden asıl işi Tauri (tauri://drop event'i) üstleniyor.
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="p-8 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Proje Ekle</h3>
                        <p className="text-zinc-500 text-sm">Çalışma alanına yeni projeler dahil et.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 pt-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Sol Taraf: Butonlar */}
                    <div className="space-y-3">
                        <button onClick={onSelectSingle} className="w-full flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-blue-500 transition-all group">
                            <FolderPlus className="text-blue-500" />
                            <div className="text-left">
                                <div className="font-semibold dark:text-white">Tek Klasör</div>
                                <div className="text-xs text-zinc-500">Bir proje seç</div>
                            </div>
                        </button>

                        <button onClick={onSelectMulti} className="w-full flex items-center gap-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-2xl hover:border-emerald-500 transition-all">
                            <Layers className="text-emerald-500" />
                            <div className="text-left">
                                <div className="font-semibold dark:text-white">Çoklu Seçim</div>
                                <div className="text-xs text-zinc-500">Birden fazla klasör</div>
                            </div>
                        </button>
                    </div>

                    {/* Sağ Taraf: Sürükle Bırak Alanı */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all ${isDragging ? "border-purple-500 bg-purple-500/10" : "border-zinc-200 dark:border-zinc-800"
                            }`}
                    >
                        <div className={`p-4 rounded-full mb-3 ${isDragging ? "bg-purple-500 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"}`}>
                            {isDragging ? <Upload className="animate-bounce" /> : <MousePointerSquareDashed size={32} />}
                        </div>
                        <p className="text-sm font-medium dark:text-zinc-300 text-center">
                            {isDragging ? "Bırak gitsin!" : "Klasörü uygulamanın neresine istersen sürükleyebilirsin"}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};