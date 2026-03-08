import { AlertTriangle } from "lucide-react";

export const RemoveProjectModal = ({ isOpen, onClose, onConfirm, project }) => {
    if (!isOpen || !project) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col relative p-6 items-center text-center">

                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                    <AlertTriangle size={32} className="text-red-600 dark:text-red-500" />
                </div>

                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">
                    Projeyi Sil
                </h2>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 font-medium">
                    <span className="text-zinc-900 dark:text-zinc-200 font-bold">{project.custom_name || project.name}</span> isimli projeyi listeden kaldırmak istediğinize emin misiniz? <br /><br />
                    <span className="text-xs opacity-80">(Not: Bu işlem dosyalarınızı bilgisayarınızdan silmez, sadece bu uygulamadan kaldırır.)</span>
                </p>

                <div className="flex w-full gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 py-2.5 px-4 bg-red-600 dark:bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-colors"
                    >
                        Evet, Kaldır
                    </button>
                </div>

            </div>
        </div>
    );
};
