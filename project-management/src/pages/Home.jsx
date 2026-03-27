// src/pages/Home.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import { Header } from "../components/header";
import { ProjectList } from "../components/projectList";
import { RemoveProjectModal } from "../components/RemoveProjectModal";
import { AddProjectModal } from "../components/AddProjectModa";
import { Search } from "lucide-react";
import { GitCloneModal } from "../components/GitCloneModal";

export const Home = ({ selectedAvatar, onAvatarSelect, selectedDisk, allDisks = [] }) => {
    const [projects, setProjects] = useState(() => {
        const saved = localStorage.getItem("my_projects");
        return saved ? JSON.parse(saved) : [];
    });
    const [loading, setLoading] = useState(false);
    const [projectToRemove, setProjectToRemove] = useState(null);
    const navigate = useNavigate();
    const [isAddModelOpen, setIsAddModelOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("my_projects", JSON.stringify(projects));
    }, [projects]);

    const handleSelectFolder = () => {
        setIsAddModelOpen(true);
    }

    const handleSelectSingle = async () => {
        const path = await ProjectService.selectDirectory();
        if (!path) return;
        if (projects.some(p => p.path === path)) {
            alert("Bu klasör zaten ekli");
            return;
        }
        setLoading(true);
        const projectData = await ProjectService.addProject(path);
        if (projectData) setProjects(prev => [...prev, projectData]);
        setLoading(false);
        setIsAddModelOpen(false);
    }

    const handleSelectGitClone = async () => {
        setIsAddModelOpen(false);
        setIsCloneModalOpen(true);
    }

    const handleCloneSuccess = async (targetPath) => {
        setLoading(true);
        try {
            const projectData = await ProjectService.addProject(targetPath);
            if (projectData) setProjects(prev => [...prev, projectData]);
        } catch (error) {
            alert("Proje eklenemedi: " + error.message);
        } finally {
            setLoading(false);
            setIsCloneModalOpen(false);
        }
    }

    const handleSelectMulti = async () => {
        const paths = await ProjectService.selectMultipleDirectories();
        if (!paths || paths.length === 0) return;
        setLoading(true);
        const discoveredPath = await ProjectService.getProjectsByPaths(paths);
        setProjects(prev => {
            const existing = new Set(prev.map(p => p.path));
            const newOnes = discoveredPath.filter(p => !existing.has(p.path));
            if (newOnes.length === 0) {
                alert("Seçilen projeler zaten listede");
                return prev;
            }
            return [...prev, ...newOnes];
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
            if (newOnes.length === 0) return prev;
            return [...prev, ...newOnes];
        });
        setLoading(false);
        setIsAddModelOpen(false);
    };

    const handleProjectClick = (project) => {
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

    const handleToggleFavorite = (targetProject) => {
        setProjects(prev => prev.map(p =>
            p.path === targetProject.path ? { ...p, is_favorite: !p.is_favorite } : p
        ));
    };

    const handleReorder = (newOrder) => {
        setProjects(prev => {
            const itemPaths = new Set(newOrder.map(p => p.path));
            const indices = [];
            prev.forEach((p, i) => {
                if (itemPaths.has(p.path)) indices.push(i);
            });

            const next = [...prev];
            indices.forEach((originalIndex, i) => {
                next[originalIndex] = newOrder[i];
            });
            return next;
        });
    };

    const filteredProjects = projects.filter(p => {
        // Arama filtresi
        const query = searchQuery.toLowerCase();
        const searchName = p.custom_name ? p.custom_name.toLowerCase() : p.name.toLowerCase();
        const matchesSearch = !query || searchName.includes(query) || p.path.toLowerCase().includes(query);

        // Disk filtresi (Favoriler muaftır, hep gözükür)
        let matchesDisk = true;
        if (selectedDisk && !p.is_favorite) {
            const projectPath = p.path.toLowerCase();
            const selectedMount = selectedDisk.mount_point.toLowerCase();

            // Sadece bu diskin mount_point'i mi başlıyor? Her disk için kontrol et.
            // Bu projenin aslında hangi diske ait olduğunu bul (en uzun eşleşen mount point)
            const bestDiskMatch = allDisks.reduce((best, current) => {
                const currentMount = current.mount_point.toLowerCase();
                if (projectPath.startsWith(currentMount)) {
                    if (!best || currentMount.length > best.mount_point.toLowerCase().length) {
                        return current;
                    }
                }
                return best;
            }, null);

            matchesDisk = bestDiskMatch?.mount_point.toLowerCase() === selectedMount;
        }

        return matchesSearch && matchesDisk;
    });

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] transition-colors duration-200 font-sans">
            <Header 
                onSelectFolder={handleSelectFolder} 
                selectedAvatar={selectedAvatar} 
                onAvatarSelect={onAvatarSelect} 
            />

            <div className="px-8 pb-8">
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
                    onSelectClone={handleSelectGitClone}
                />

                <GitCloneModal
                    isOpen={isCloneModalOpen}
                    onClose={() => setIsCloneModalOpen(false)}
                    onSuccess={handleCloneSuccess}
                />
                
                <ProjectList
                    projects={filteredProjects}
                    loading={loading}
                    onProjectClick={handleProjectClick}
                    onRename={handleRename}
                    onOpenExplorer={handleOpenExplorer}
                    onRemoveClicked={setProjectToRemove}
                    onToggleFavorite={handleToggleFavorite}
                    onReorder={handleReorder}
                    isSearching={searchQuery.length > 0}
                />

                <RemoveProjectModal
                    isOpen={!!projectToRemove}
                    project={projectToRemove}
                    onClose={() => setProjectToRemove(null)}
                    onConfirm={handleRemoveProject}
                />
            </div>
        </div>
    );
};
