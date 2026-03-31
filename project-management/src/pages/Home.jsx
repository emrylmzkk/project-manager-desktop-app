// src/pages/Home.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ProjectService } from "../services/projectService";
import { Header } from "../components/header";
import { ProjectList } from "../components/projectList";
import { RemoveProjectModal } from "../components/RemoveProjectModal";
import { AddProjectModal } from "../components/AddProjectModa";
import { Search, X } from "lucide-react";
import { GitCloneModal } from "../components/GitCloneModal";
import { AlertModal } from "../components/AlertModal";
import { ProjectTemplatesModal } from "../components/ProjectTemplatesModal";

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
    const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);

    // Alert Modal State
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
    const showAlert = (message, title = "", type = "info") => {
        setAlertConfig({ isOpen: true, title, message, type });
    };

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
            showAlert("Bu klasör zaten listenizde bulunuyor.", "Zaten Ekli", "warning");
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
            showAlert("Proje listeye eklenirken bir hata oluştu: " + error.message, "Hata", "error");
        } finally {
            setLoading(false);
            setIsCloneModalOpen(false);
        }
    }

    const handleTemplateSuccess = async (newProjectPath) => {
        setLoading(true);
        try {
            // Yeni oluşturulan projeyi listeye ekle
            const projectData = await ProjectService.addProject(newProjectPath);
            if (projectData) {
                setProjects(prev => {
                    if (prev.some(p => p.path === projectData.path)) return prev;
                    return [...prev, projectData];
                });
                showAlert("Proje başarıyla oluşturuldu ve listeye eklendi.", "Başarılı", "success");
            }
        } catch (error) {
            showAlert("Proje listeye eklenirken bir hata oluştu: " + error.message, "Hata", "error");
        } finally {
            setLoading(false);
            setIsTemplatesModalOpen(false);
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
                showAlert("Seçilen projeler zaten listede bulunuyor.", "Zaten Ekli", "info");
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
        if (!newOrder || newOrder.length === 0) return;

        setProjects(prev => {
            const itemPaths = new Set(newOrder.map(p => p.path));
            const indices = []; // Orijinal listedeki pozisyonları

            prev.forEach((p, i) => {
                if (itemPaths.has(p.path)) indices.push(i);
            });

            if (indices.length === 0) return prev;

            const next = [...prev];
            // Yeni sıralamadaki her bir öğeyi orijinal indekslerine sırayla yerleştir
            indices.forEach((originalIndex, i) => {
                next[originalIndex] = newOrder[i];
            });
            return next;
        });
    };

    // Filtreleme Mantığı
    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            // Text Filtreleme
            const query = searchQuery.toLowerCase().trim();
            const projectName = (p.custom_name || p.name).toLowerCase();
            const projectPath = p.path.toLowerCase();
            const matchesSearch = !query || projectName.includes(query) || projectPath.includes(query);

            // Disk Filtreleme
            let matchesDisk = true;
            if (selectedDisk && !p.is_favorite) {
                const selectedMount = selectedDisk.mount_point.toLowerCase();

                // Projenin en iyi eşleşen diskini bul
                const bestDiskMatch = allDisks.reduce((best, disk) => {
                    const mount = disk.mount_point.toLowerCase();
                    if (projectPath.startsWith(mount)) {
                        if (!best || mount.length > best.mount_point.toLowerCase().length) {
                            return disk;
                        }
                    }
                    return best;
                }, null);

                if (bestDiskMatch) {
                    matchesDisk = bestDiskMatch.mount_point.toLowerCase() === selectedMount;
                } else if (selectedMount !== "/" && selectedMount !== "/Volumes/Macintosh HD") {
                    matchesDisk = false;
                }
            }

            return matchesSearch && matchesDisk;
        });
    }, [projects, searchQuery, selectedDisk, allDisks]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#121212] transition-colors duration-200 font-sans">
            <Header
                onSelectFolder={handleSelectFolder}
                selectedAvatar={selectedAvatar}
                onAvatarSelect={onAvatarSelect}
                onOpenTemplates={() => setIsTemplatesModalOpen(true)}
            />

            <div className="px-8 pb-8">
                <div className="mb-6 flex gap-3 mt-4 justify-center">
                    <div className="relative flex-1 max-w-lg group">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchQuery ? "text-blue-500" : "text-zinc-400"}`} size={18} />
                        <input
                            type="text"
                            placeholder="Proje ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-3 pl-11 pr-4 text-sm outline-none focus:border-blue-500 transition-all dark:text-zinc-100 shadow-sm"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                                <X size={14} />
                            </button>
                        )}
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

                <ProjectTemplatesModal
                    isOpen={isTemplatesModalOpen}
                    onClose={() => setIsTemplatesModalOpen(false)}
                    onSuccess={handleTemplateSuccess}
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

                <AlertModal
                    isOpen={alertConfig.isOpen}
                    onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                />
            </div>
        </div>
    );
};
