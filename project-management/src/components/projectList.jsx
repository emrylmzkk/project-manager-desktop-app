// src/components/ProjectList.jsx
import { ProjectCard } from "./projectCard";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    rectSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence } from "framer-motion";
import { Star, FolderCode } from "lucide-react";

// Sortable Item Wrapper
const SortableProject = ({ project, onProjectClick, onRename, onOpenExplorer, onRemoveClicked, onToggleFavorite }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: project.path });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 0,
        position: "relative",
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="touch-none"
        >
            <ProjectCard
                project={project}
                onClick={() => onProjectClick(project)}
                onRename={onRename}
                onOpenExplorer={onOpenExplorer}
                onRemoveClicked={onRemoveClicked}
                onToggleFavorite={onToggleFavorite}
                isDragging={isDragging}
            />
        </div>
    );
};

export const ProjectList = ({
    projects,
    loading,
    onProjectClick,
    onRename,
    onOpenExplorer,
    onRemoveClicked,
    onToggleFavorite,
    onReorder,
    isSearching
}) => {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-zinc-500 dark:text-zinc-400 animate-pulse font-medium">
                    Klasörler taranıyor, bu biraz sürebilir...
                </p>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                    <FolderCode size={24} className="text-zinc-400" />
                </div>
                <p className="text-zinc-500 dark:text-zinc-400 font-medium">
                    Filtrenize uygun proje bulunamadı
                </p>
            </div>
        );
    }

    const favorites = projects.filter(p => p.is_favorite);
    const others = projects.filter(p => !p.is_favorite);

    const handleDragEnd = (event, items, onReorderItems) => {
        if (isSearching) return;
        const { active, over } = event;

        if (active && over && active.id !== over.id) {
            const oldIndex = items.findIndex(item => item.path === active.id);
            const newIndex = items.findIndex(item => item.path === over.id);
            const newOrder = arrayMove(items, oldIndex, newIndex);
            onReorderItems(newOrder);
        }
    };

    const renderList = (items, onReorderItems, title, icon) => (
        <div className="mb-12 last:mb-0">
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className={`${title === "Favoriler" ? "text-amber-500" : "text-zinc-400"}`}>
                    {icon}
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                    {title} <span className="ml-2 text-[10px] opacity-60">({items.length})</span>
                </h2>
                <div className="flex-1 h-[1px] bg-zinc-200 dark:bg-zinc-800 ml-2 opacity-30"></div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, items, onReorderItems)}
            >
                <SortableContext
                    items={items.map(p => p.path)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <AnimatePresence initial={false}>
                            {items.map((project) => (
                                <SortableProject
                                    key={project.path}
                                    project={project}
                                    onProjectClick={onProjectClick}
                                    onRename={onRename}
                                    onOpenExplorer={onOpenExplorer}
                                    onRemoveClicked={onRemoveClicked}
                                    onToggleFavorite={onToggleFavorite}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );

    return (
        <main className="pb-10">
            {favorites.length > 0 && renderList(
                favorites,
                (newOrder) => onReorder(newOrder, true),
                "Favoriler",
                <Star size={16} fill="currentColor" />
            )}

            {(others.length > 0 || favorites.length === 0) && renderList(
                others,
                (newOrder) => onReorder(newOrder, false),
                "Projeler",
                <FolderCode size={16} />
            )}
        </main>
    );
};
