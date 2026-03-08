// src/components/GitModal.jsx
export const GitModal = ({ isOpen, onClose, gitDetails, projectName }) => {
    if (!isOpen) return null; // Modal kapalıysa hiçbir şey çizme

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[85vh]">

                {/* Modal Header */}
                <div className="flex justify-between items-center p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <div>
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                            {projectName} <span className="text-sm font-normal text-zinc-500">Git Geçmişi</span>
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Modal Body (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {gitDetails ? (
                        <div className="space-y-6">

                            {/* Aktif Branch ve Tüm Branchler */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">Aktif Branch</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                        <p className="font-mono text-sm text-zinc-800 dark:text-zinc-200 font-medium">{gitDetails.current_branch}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Diğer Branch'ler</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {gitDetails.branches.map((b, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono">
                                                {b}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Commit Geçmişi */}
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 border-b border-zinc-200 dark:border-zinc-800 pb-2">
                                    Son Commit'ler (Top 5)
                                </h3>
                                <div className="space-y-3">
                                    {gitDetails.recent_commits.map((commit, idx) => (
                                        <div key={idx} className="flex flex-col p-3 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 line-clamp-1" title={commit.message}>
                                                    {commit.message}
                                                </p>
                                                <span className="text-[10px] font-mono bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400 px-1.5 py-0.5 rounded">
                                                    {commit.hash.substring(0, 7)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-zinc-500 dark:text-zinc-500">
                                                <span>{commit.author}</span>
                                                <span>{commit.date}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    ) : (
                        // Eğer Rust null dönerse veya veri çekilemezse
                        <div className="text-center py-10">
                            <p className="text-red-500 dark:text-red-400">Git detayları çekilirken bir hata oluştu veya bu proje temiz bir Git reposu değil.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
