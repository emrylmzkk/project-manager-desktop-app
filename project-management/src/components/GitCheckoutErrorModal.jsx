import { AlertCircle, Archive, ExternalLink } from "lucide-react";

export const GitCheckoutErrorModal = ({ isOpen, onClose, onStash, onOpenIde, targetBranch }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col relative p-6 items-center text-center">

                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-amber-600 dark:text-amber-500" />
                </div>

                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Kaydedilmemiş Değişiklikler
                </h2>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium px-2">
                    <span className="text-zinc-900 dark:text-zinc-200 font-bold">{targetBranch}</span> dalına geçiş yapabilmek için öncelikle mevcut değişikliklerinizi kaydetmeli veya rafa kaldırmalısınız (stash). Aksi takdirde dosyalarınızın üzerine yazılacaktır.
                </p>

                <div className="flex flex-col w-full gap-3">
                    <button
                        onClick={onStash}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 transition-colors"
                    >
                        <Archive size={18} />
                        Stash
                    </button>

                    <button
                        onClick={onOpenIde}
                        className="flex items-center justify-center gap-2 py-3 px-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-xl border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                        <ExternalLink size={18} />
                        IDE ile Değişiklikleri Gör
                    </button>

                    <button
                        onClick={onClose}
                        className="py-3 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors mt-1"
                    >
                        İptal ve Kapat
                    </button>
                </div>

            </div>
        </div>
    );
};
