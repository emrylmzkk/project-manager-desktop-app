// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import { Header } from "../components/header";
import { ProjectList } from "../components/projectList";
import { RemoveProjectModal } from "../components/RemoveProjectModal";
import { AddProjectModal } from "../components/AddProjectModa";

export const Home = () => {
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem("my_projects");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [projectToRemove, setProjectToRemove] = useState(null);
    const navigate = useNavigate();
    const [isAddModelOpen, setIsAddModelOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("my_projects", JSON.stringify(projects));
    }, [projects]);

    const handleSelectFolder = () => {
        setIsAddModelOpen(true);
    }

    const handleSelectSingle = async () => {

        const path = await ProjectService.selectDirectory();

        if (!path) {
            return;
        }

        if (projects.some(p => p.path === path)) {
            alert("Bu klasör zaten ekli")
            return;
        }

        setLoading(true);

        const projectData = await ProjectService.addProject(path);


        if (projectData) {
            setProjects(prev => [...prev, projectData])
        }

        setLoading(false);


    }

    const handleSelectMulti = async () => {

        const basePath = await ProjectService.selectDirectory();

        if (!basePath) {
            return;
        }

        setLoading(true);

        const discoveredPath = await ProjectService.fetchProjects();

        setProjects(prev => {
            const existing = new Set(prev.map(p => p.path));

            const newOnes = discoveredPath.filter(p => !existing.has(p.path));

            if (newOnes.length === 0) {
                alert("Yeni proje bulunamadı");
                return prev;
            }

            return [...prev, ...newOnes];

        })
        setLoading(false)
    }

    // const handleSelectFolder = async () => {
    //     const path = await ProjectService.selectDirectory();
    //     if (path) {
    //         if (projects.some(p => p.path === path)) {
    //             alert("Bu klasör zaten projelere ekli!");
    //             return;
    //         }

    //         setLoading(true);
    //         const projectData = await ProjectService.addProject(path);
    //         if (projectData) {
    //             setProjects(prev => [...prev, projectData]);
    //         } else {
    //             alert("Klasör okunamadı.");
    //         }
    //         setLoading(false);
    //     }
    // };

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
            <AddProjectModal
                isOpen={isAddModelOpen}
                onClose={() => setIsAddModelOpen(false)}
                onSelectSingle={handleSelectSingle}
                onSelectMulti={handleSelectMulti}
            />
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
