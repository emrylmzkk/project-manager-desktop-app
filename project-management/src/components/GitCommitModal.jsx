import { useState } from "react";
import { GitCommit, X } from "lucide-react";

export const GitCommitModal = ({ isOpen, onClose, onCommit }) => {
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (message.trim()) {
            onCommit(message.trim());
            setMessage(""); // formu sıfırla
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <h2 className="text-base font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <GitCommit size={18} className="text-blue-500" />
                        Commit Mesajı
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="commitMessage" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Değişikliklerinizi açıklayın
                        </label>
                        <textarea
                            id="commitMessage"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Örn: Buton rengi mavi yapıldı"
                            className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-24 text-sm text-zinc-900 dark:text-zinc-100"
                            autoFocus
                        />
                    </div>

                    {/* Footer / Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        >
                            İptal
                        </button>
                        <button
                            type="submit"
                            disabled={!message.trim()}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Commit Oluştur
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
