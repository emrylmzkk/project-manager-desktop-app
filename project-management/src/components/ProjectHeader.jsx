import { ChevronLeft, FolderOpen, ExternalLink, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/themeContext";
import { open } from "@tauri-apps/plugin-shell";

export const ProjectHeader = ({ 
    project, 
    selectedAvatar, 
    onBack, 
    onOpenExplorer, 
    onOpenWith, 
    gitDetails 
}) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className={`
            h-16 flex items-center px-6 border-b transition-all duration-700 ease-in-out backdrop-blur-md sticky top-0 z-10 shrink-0
            ${selectedAvatar
                ? (theme === "light" 
                    ? `${selectedAvatar.headerTheme.light} text-zinc-900` 
                    : `${selectedAvatar.headerTheme.dark} text-white opacity-100`)
                : "bg-white/50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-sm"}
        `}>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-current transition-colors cursor-pointer"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold flex items-center gap-2">
                            {project.custom_name || project.name}
                            {project.is_git && (
                                <span className="text-[10px] bg-emerald-100/80 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-500/20 uppercase font-bold tracking-tight">
                                    Git Repo
                                </span>
                            )}
                        </h1>
                        <p className="text-[11px] opacity-70 truncate max-w-lg font-medium">{project.path}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {project.is_git && gitDetails?.remote_url && (
                        <button
                            onClick={() => open(gitDetails.remote_url)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border border-transparent rounded-lg text-sm font-bold transition-all cursor-pointer hover:opacity-80 active:scale-95 shadow-lg shadow-black/10"
                            title="Github'da Gör"
                        >
                            <ExternalLink size={16} strokeWidth={2.5} /> Git
                        </button>
                    )}
                    
                    <button
                        onClick={onOpenExplorer}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/20 dark:bg-white/10 text-current hover:bg-white/40 dark:hover:bg-white/20 border border-black/5 dark:border-white/5 rounded-lg text-sm font-semibold transition-all cursor-pointer active:scale-95"
                        title="Dosya Gezgini'nde Aç"
                    >
                        <FolderOpen size={16} /> Göster
                    </button>
                    
                    <button
                        onClick={onOpenWith}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-500 dark:hover:bg-blue-400 border border-transparent rounded-lg text-sm font-semibold transition-all active:scale-95 shadow-md shadow-blue-500/20"
                    >
                        <ExternalLink size={16} /> Birlikte Aç
                    </button>
                    
                    <button
                        onClick={toggleTheme}
                        className="p-2 ml-2 rounded-lg bg-black/5 dark:bg-white/10 text-current hover:bg-black/10 dark:hover:bg-white/20 transition-all flex items-center justify-center cursor-pointer active:rotate-12"
                        title="Temayı Değiştir"
                    >
                        {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                    </button>
                </div>
            </div>
        </header>
    );
};
