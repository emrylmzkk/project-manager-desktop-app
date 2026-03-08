// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import { Header } from "../components/header";
import { ProjectList } from "../components/projectList";
import { RemoveProjectModal } from "../components/RemoveProjectModal";
import { AddProjectModal } from "../components/AddProjectModa";
import { Search } from "lucide-react";

export const Home = () => {
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem("my_projects");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [projectToRemove, setProjectToRemove] = useState(null);
    const navigate = useNavigate();
    const [isAddModelOpen, setIsAddModelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

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
        setIsAddModelOpen(false);
    }

    const handleSelectMulti = async () => {

        const paths = await ProjectService.selectMultipleDirectories();

        if (!paths || paths.length === 0) {
            return;
        }

        setLoading(true);

        const discoveredPath = await ProjectService.getProjectsByPaths(paths);

        setProjects(prev => {
            const existing = new Set(prev.map(p => p.path));

            const newOnes = discoveredPath.filter(p => !existing.has(p.path));

            if (newOnes.length === 0) {
                alert("Seçilen projeler zaten listede");
                return prev;
            }

            return [...prev, ...newOnes]


        });

        setLoading(false);
        setIsAddModelOpen(false);
    }

    const handleDrop = async (paths) => {
        if (!paths || paths.length === 0) return;
        setLoading(true);
        const discovered = await ProjectService.getProjectsByPaths(paths);

        setProjects(prev => {
            const existing = new Set(prev.map(p => p.path));
            const newOnes = discovered.filter(p => !existing.has(p.path));

            if (newOnes.length === 0) {
                alert("Sürüklenen klasörler zaten ekli veya geçerli bir proje değil.");
                return prev;
            }
            return [...prev, ...newOnes]
        });

        setLoading(false);
        setIsAddModelOpen(false);
    };

    // const handleSelectMulti = async () => {

    //     const basePath = await ProjectService.selectDirectory();

    //     if (!basePath) {
    //         return;
    //     }

    //     setLoading(true);

    //     const discoveredPath = await ProjectService.fetchProjects();

    //     setProjects(prev => {
    //         const existing = new Set(prev.map(p => p.path));

    //         const newOnes = discoveredPath.filter(p => !existing.has(p.path));

    //         if (newOnes.length === 0) {
    //             alert("Yeni proje bulunamadı");
    //             return prev;
    //         }

    //         return [...prev, ...newOnes];

    //     })
    //     setLoading(false)
    // }

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

    const filteredProjects = projects.filter(p => {
        const query = searchQuery.toLowerCase();
        const searchName = p.custom_name ? p.custom_name.toLowerCase() : p.name.toLowerCase();
        return searchName.includes(query) || p.path.toLowerCase().includes(query);
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] transition-colors duration-200 p-8 font-sans">
            <Header onSelectFolder={handleSelectFolder} />

            <div className="mb-6 flex gap-3 mt-4 justify-center">
                <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                    <input
                        type="text"
                        placeholder="Proje ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-blue-500 transition-colors dark:text-zinc-100 shadow-sm"
                    />
                </div>
            </div>

            <AddProjectModal
                isOpen={isAddModelOpen}
                onClose={() => setIsAddModelOpen(false)}
                onSelectSingle={handleSelectSingle}
                onSelectMulti={handleSelectMulti}
                onDropped={handleDrop}
            />
            <ProjectList
                projects={filteredProjects}
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
