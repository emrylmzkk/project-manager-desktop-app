import { useState, useRef, useEffect } from "react";
import { GitCommit, Plus, Save, ArrowUp, Info, Download, RefreshCw, GitMerge, ChevronDown } from "lucide-react";
import { GitService } from "../services/gitService";
import { GitActivityCalendar } from "./GitActivityCalendar";

export const GitDashboard = ({ project, gitDetails, fetchGitData, onCommitOpen, onStatusOpen, onMerge, showAlert }) => {
    const [showMergeDropdown, setShowMergeDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowMergeDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleGitAdd = async () => {
        try {
            await GitService.gitAdd(project.path);
            showAlert("Tüm değişiklikler eklendi", "Başarılı", "success");
        } catch (error) {
            showAlert("Git add işlemi başarısız: " + error, "Hata", "error");
        }
    };

    const handleGitPush = async () => {
        try {
            await GitService.gitPush(project.path);
            showAlert("Değişiklikler başarıyla pushlandı", "Başarılı", "success");
            fetchGitData();
        } catch (error) {
            showAlert("Git push işlemi başarısız: " + error, "Hata", "error");
        }
    };

    const handleGitPull = async () => {
        try {
            await GitService.gitPull(project.path);
            showAlert("Uzak sunucudaki değişiklikler çekildi", "Başarılı", "success");
            fetchGitData();
        } catch (error) {
            showAlert("Git pull işlemi başarısız: " + error, "Hata", "error");
        }
    };

    const handleGitFetch = async () => {
        try {
            await GitService.gitFetch(project.path);
            showAlert("Uzak sunucu kontrol edildi. Yeni değişiklikler olabilir", "Fetch Tamamlandı", "info");
            fetchGitData();
        } catch (error) {
            showAlert("Git fetch işlemi başarısız: " + error, "Hata", "error");
        }
    };

    const otherBranches = gitDetails?.branches?.filter(b => b !== gitDetails.current_branch) || [];

    return (
        <div className="flex flex-col xl:flex-row gap-6 items-stretch w-full">
            <div className="flex-1 min-w-0 flex shadow-sm rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <GitActivityCalendar activityData={gitDetails.commit_activity} />
            </div>

            {/* Quick Actions Panel */}
            <div className="w-full xl:w-[300px] shrink-0 border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-[#0d1117] flex flex-col shadow-sm overflow-hidden h-full">

                {/* Header */}
                <div className="flex items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                        <RefreshCw size={16} className="text-blue-500 animate-[spin_4s_linear_infinite]" /> Git İşlemleri
                    </h3>
                </div>

                {/* Content */}
                <div className="p-4 grid grid-cols-2 gap-3 bg-white dark:bg-[#0d1117]">
                    <button
                        onClick={handleGitAdd}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-300 dark:hover:border-emerald-700 rounded-xl transition-all cursor-pointer group"
                        title="Değişiklikleri Hazırla"
                    >
                        <Plus size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-tighter">Add</span>
                    </button>

                    <button
                        onClick={onCommitOpen}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-xl transition-all cursor-pointer group"
                        title="Değişiklikleri Kaydet"
                    >
                        <Save size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-tighter">Commit</span>
                    </button>

                    <button
                        onClick={handleGitPush}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-zinc-200 dark:border-zinc-700 hover:border-purple-300 dark:hover:border-purple-700 rounded-xl transition-all cursor-pointer group"
                        title="Sunucuya Gönder"
                    >
                        <ArrowUp size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-tighter">Push</span>
                    </button>

                    <button
                        onClick={onStatusOpen}
                        className="flex flex-col items-center justify-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-zinc-200 dark:border-zinc-700 hover:border-orange-300 dark:hover:border-orange-700 rounded-xl transition-all cursor-pointer group"
                        title="Durum Kontrolü"
                    >
                        <Info size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold uppercase tracking-tighter">Status</span>
                    </button>

                    {/* Merge Dropdown Button */}
                    <div className="col-span-2 relative" ref={dropdownRef}>
                        <button
                            onClick={() => setShowMergeDropdown(!showMergeDropdown)}
                            disabled={otherBranches.length === 0}
                            className={`w-full flex items-center justify-center gap-2 px-4 py-3 
  bg-zinc-50 dark:bg-zinc-800/50 
  hover:bg-emerald-50 dark:hover:bg-emerald-900/20
  text-emerald-600 dark:text-emerald-400 
  border border-zinc-200 dark:border-zinc-700 
  hover:border-emerald-300 dark:hover:border-emerald-700 
  text-xs font-bold uppercase transition-all active:scale-95 cursor-pointer relative rounded-xl`}
                        >
                            <div className="absolute left-4">
                                <GitMerge size={16} />
                            </div>
                            <span>Git Merge</span>
                            <ChevronDown
                                size={14}
                                className={`absolute right-4 transition-transform duration-300 ${showMergeDropdown ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {showMergeDropdown && (
                            <div className="absolute left-0 bottom-full mb-2 w-full bg-white dark:bg-[#161b22] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
                                <div className="p-3 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                                    <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Hedef Branş Seçin</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto font-mono">
                                    {otherBranches.map((branch, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                onMerge(branch);
                                                setShowMergeDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-between group"
                                        >
                                            <span className="truncate">{branch}</span>
                                            <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleGitPull}
                        className="col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer"
                    >
                        <Download size={14} /> Pull
                    </button>

                    <button
                        onClick={handleGitFetch}
                        className="col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-xl text-[11px] font-bold uppercase transition-all cursor-pointer"
                    >
                        <RefreshCw size={14} /> Fetch
                    </button>
                </div>

            </div>
        </div>
    );
};
