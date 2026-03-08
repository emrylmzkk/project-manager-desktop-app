import { FolderOpen, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

export const ProjectCard = ({ project, onClick, onRename, onOpenExplorer, onRemoveClicked }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(project.custom_name || project.name);

    const handleSave = (e) => {
        e.stopPropagation();
        if (editName.trim()) {
            onRename(project, editName.trim());
        }
        setIsEditing(false);
    };

    const handleCancel = (e) => {
        e.stopPropagation();
        setEditName(project.custom_name || project.name);
        setIsEditing(false);
    };
    return (
        <div
            onClick={onClick}
            className="p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 dark:hover:border-zinc-600 transition-colors group cursor-pointer shadow-sm hover:shadow-md">
            <div className="flex justify-between items-start">
                {isEditing ? (
                    <div className="flex-1 flex gap-2 pr-2" onClick={e => e.stopPropagation()}>
                        <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleSave(e);
                                if (e.key === 'Escape') handleCancel(e);
                            }}
                            autoFocus
                            className="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 px-2 py-0.5 rounded text-sm outline-none border border-blue-500"
                        />
                        <button onClick={handleSave} className="text-xs px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">Kaydet</button>
                    </div>
                ) : (
                    <h3 className="font-medium text-zinc-800 dark:text-white truncate pr-2 flex items-center gap-2 group/title">
                        {project.custom_name || project.name}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                            className="opacity-0 group-hover/title:opacity-100 p-1 text-zinc-400 hover:text-blue-500 transition-all"
                            title="İsmi Düzenle"
                        >
                            <Pencil size={14} />
                        </button>
                    </h3>
                )}

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveClicked(project);
                        }}
                        className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                        title="Projeyi Uygulamadan Kaldır"
                    >
                        <Trash2 size={16} />
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenExplorer(project.path);
                        }}
                        className="p-1 text-zinc-400 hover:text-blue-500 transition-colors"
                        title="Dosya Gezgini'nde Aç"
                    >
                        <FolderOpen size={16} />
                    </button>
                    {project.is_git && (
                        <span className="text-[10px] bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-medium">
                            GIT
                        </span>
                    )}
                </div>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 truncate">
                {project.path}
            </p>
        </div>
    );
};
