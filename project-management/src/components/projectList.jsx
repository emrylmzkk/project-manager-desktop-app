// src/components/ProjectList.jsx
import { ProjectCard } from "./projectCard";

export const ProjectList = ({ projects, loading, onProjectClick, onRename, onOpenExplorer, onRemoveClicked }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <p className="text-zinc-500 dark:text-zinc-400 animate-pulse">
                    Klasörler taranıyor, bu biraz sürebilir...
                </p>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-zinc-500 dark:text-zinc-400">
                    Henüz taranmış bir proje yok.
                </p>
            </div>
        );
    }

    return (
        <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project, index) => (
                <ProjectCard
                    key={index}
                    project={project}
                    onClick={() => onProjectClick(project)}
                    onRename={onRename}
                    onOpenExplorer={onOpenExplorer}
                    onRemoveClicked={onRemoveClicked}
                />
            ))}
        </main>
    );
};
