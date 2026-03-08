import { GitCommit } from "lucide-react";

export const GitCommitTimeline = ({ commits }) => {
    if (!commits || commits.length === 0) return null;

    return (
        <div className="bg-white dark:bg-zinc-900/50 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <h3 className="text-sm font-semibold mb-6 flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <GitCommit size={18} className="text-blue-500" /> Son Aktiviteler
            </h3>

            {/* Sol tarafta tek düz uzun bir çizgi */}
            <div className="relative border-l border-zinc-200 dark:border-zinc-700 ml-4 space-y-6 pb-4">
                {commits.map((commit, i) => (
                    <div key={i} className="relative pl-8 group">

                        {/* Nokta (Indicator) */}
                        <div className="absolute w-4 h-4 rounded-full bg-zinc-200 dark:bg-zinc-700 border-2 border-white dark:border-zinc-900 -left-[9px] top-1.5 group-hover:bg-blue-500 group-hover:border-blue-100 dark:group-hover:border-blue-900 transition-colors z-10"></div>

                        {/* İçerik */}
                        <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-800/30 hover:bg-white dark:hover:bg-zinc-800 transition-colors shadow-sm group-hover:shadow-md">

                            {/* Üst Kısım: Hash & Tarih */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-500/20">
                                    {commit.hash.substring(0, 7)}
                                </span>
                                <time className="font-mono text-xs font-medium text-zinc-400 dark:text-zinc-500">
                                    {commit.date}
                                </time>
                            </div>

                            {/* Mesaj */}
                            <p className="text-sm text-zinc-800 dark:text-zinc-200 font-medium leading-relaxed mb-3">
                                {commit.message}
                            </p>

                            {/* Yazar Bilgisi */}
                            <div className="flex items-center gap-2 mt-auto">
                                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center text-[10px] font-bold uppercase shadow-sm">
                                    {commit.author.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                                    {commit.author}
                                </span>
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
