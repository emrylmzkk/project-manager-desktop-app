import { GitCommit } from "lucide-react";
import { GitService } from "../services/gitService";
import { GitActivityCalendar } from "./GitActivityCalendar";

export const GitDashboard = ({ project, gitDetails, fetchGitData, onCommitOpen }) => {
    const handleGitAdd = async () => {
        try {
            await GitService.gitAdd(project.path);
            alert("Tüm değişiklikler eklendi! (git add .)");
        } catch (error) {
            alert("Git add başarısız: " + error);
        }
    };

    const handleGitCommit = () => {
        onCommitOpen();
    };

    const handleGitPush = async () => {
        try {
            await GitService.gitPush(project.path);
            alert("Değişiklikler başarıyla uzak sunucuya (remote) itildi!");
        } catch (error) {
            alert("Git push başarısız: " + error);
        }
    };

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
            <div className="flex-1 min-w-0 flex">
                <GitActivityCalendar activityData={gitDetails.commit_activity} />
            </div>

            {/* Quick Actions Panel */}
            <div className="w-full xl:w-[280px] shrink-0 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-[#0d1117] flex flex-col shadow-sm overflow-hidden h-full">

                {/* Header */}
                <div className="flex items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                        <GitCommit size={18} className="text-blue-500" /> Hızlı İşlemler
                    </h3>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col gap-4 flex-1 justify-center bg-white dark:bg-[#0d1117]">
                    <button
                        onClick={handleGitAdd}
                        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                        Git Add
                    </button>
                    <button
                        onClick={handleGitCommit}
                        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                        Git Commit
                    </button>
                    <button
                        onClick={handleGitPush}
                        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl text-sm font-medium transition-colors cursor-pointer"
                    >
                        Git Push
                    </button>
                </div>

            </div>
        </div>
    );
};
