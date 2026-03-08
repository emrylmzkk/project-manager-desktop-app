// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import { Header } from "../components/header";
import { ProjectList } from "../components/projectList";
import { RemoveProjectModal } from "../components/RemoveProjectModal";

export const Home = () => {
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem("my_projects");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [projectToRemove, setProjectToRemove] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("my_projects", JSON.stringify(projects));
    }, [projects]);

    const handleSelectFolder = async () => {
        const path = await ProjectService.selectDirectory();
        if (path) {
            if (projects.some(p => p.path === path)) {
                alert("Bu klasör zaten projelere ekli!");
                return;
            }

            setLoading(true);
            const projectData = await ProjectService.addProject(path);
            if (projectData) {
                setProjects(prev => [...prev, projectData]);
            } else {
                alert("Klasör okunamadı.");
            }
            setLoading(false);
        }
    };

    const handleProjectClick = (project) => {
        // Git olup olmadığına bakılmaksızın yönlendir
        navigate("/project", { state: { project } });
    };

    const handleRename = (projectToRename, newName) => {
        setProjects(prev => prev.map(p =>
            p.path === projectToRename.path ? { ...p, custom_name: newName } : p
        ));
    };

    const handleOpenExplorer = async (path) => {
        await ProjectService.openInExplorer(path);
    };

    const handleRemoveProject = () => {
        if (projectToRemove) {
            setProjects(prev => prev.filter(p => p.path !== projectToRemove.path));
            setProjectToRemove(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] transition-colors duration-200 p-8 font-sans">
            <Header onSelectFolder={handleSelectFolder} />
            <ProjectList
                projects={projects}
                loading={loading}
                onProjectClick={handleProjectClick}
                onRename={handleRename}
                onOpenExplorer={handleOpenExplorer}
                onRemoveClicked={setProjectToRemove}
            />

            <RemoveProjectModal
                isOpen={!!projectToRemove}
                project={projectToRemove}
                onClose={() => setProjectToRemove(null)}
                onConfirm={handleRemoveProject}
            />
        </div>
    );
};
