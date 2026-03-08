import { AlertCircle } from "lucide-react";

export const IdeNotFoundModal = ({ isOpen, onClose, ideName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col p-6 items-center text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <AlertCircle size={32} className="text-red-600 dark:text-red-500" />
                </div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Uygulama Bulunamadı
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                    Sisteminizde <span className="text-zinc-900 dark:text-zinc-200 font-bold">{ideName}</span> isimli IDE tespit edilemedi veya açılırken bir hata oluştu. Lütfen uygulamanın yüklü olduğundan emin olun.
                </p>
                <button
                    onClick={onClose}
                    className="w-full py-3 px-4 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-medium rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
                >
                    Tamam, Anladım
                </button>
            </div>
        </div>
    );
};
