import { FolderOpen, Pencil, Trash2, Star, GripVertical } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export const ProjectCard = ({ project, onClick, onRename, onOpenExplorer, onRemoveClicked, onToggleFavorite, dragControls, isDragging }) => {
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
        <motion.div
            onClick={onClick}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`p-4 bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500 dark:hover:border-zinc-500 transition-colors group cursor-pointer shadow-sm hover:shadow-lg relative overflow-hidden ${isDragging ? "opacity-40" : ""}`}
        >
            
            {/* Favorite Badge / Indicator */}
            {project.is_favorite && (
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
            )}

            <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                    {/* Drag Handle */}
                    <div className="mt-1 text-zinc-300 dark:text-zinc-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
                        <GripVertical size={16} />
                    </div>

                    <div className="flex-1 min-w-0">
                        {isEditing ? (
                            <div className="flex gap-2 pr-2" onClick={e => e.stopPropagation()}>
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
                            <h3 className="font-semibold text-zinc-800 dark:text-white truncate flex items-center gap-2 group/title">
                                {project.custom_name || project.name}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                    }}
                                    className="opacity-0 group-hover/title:opacity-100 p-1 text-zinc-400 hover:text-blue-500 transition-all"
                                    title="İsmi Düzenle"
                                >
                                    <Pencil size={12} />
                                </button>
                            </h3>
                        )}
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-500 truncate mt-0.5">
                            {project.path}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(project);
                        }}
                        className={`p-1.5 rounded-lg transition-all ${
                            project.is_favorite 
                            ? "text-amber-500 bg-amber-50 dark:bg-amber-500/10" 
                            : "text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/5"
                        }`}
                        title={project.is_favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                    >
                        <Star size={16} fill={project.is_favorite ? "currentColor" : "none"} />
                    </button>
                    
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onOpenExplorer(project.path);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/5 rounded-lg transition-all"
                        title="Dosya Gezgini'nde Aç"
                    >
                        <FolderOpen size={16} />
                    </button>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveClicked(project);
                        }}
                        className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/5 rounded-lg transition-all"
                        title="Projeyi Uygulamadan Kaldır"
                    >
                        <Trash2 size={16} />
                    </button>
                    
                    {project.is_git && (
                        <div className="ml-1 px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/50 dark:border-emerald-500/20 rounded text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-tight">
                            GIT
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
