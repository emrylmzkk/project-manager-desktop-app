// src/pages/ProjectDetails.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Folder, FolderOpen, File, GitBranch, GitMerge as GitMergeIcon, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "../context/themeContext";
import { ProjectService } from "../services/projectService";
import { GitService } from "../services/gitService";
import { OpenWithModal } from "../components/openWithModal";
import { GitDashboard } from "../components/GitDashboard";
import { GitCommitTimeline } from "../components/GitCommitTimeline";
import { GitCommitModal } from "../components/GitCommitModal";
import { ScrollArea } from "../components/ScrollArea";
import { IdeNotFoundModal } from "../components/IdeNotFoundModal";
import { GitCheckoutErrorModal } from "../components/GitCheckoutErrorModal";
import { GitSetupWizard } from "../components/GitSetupWizard";
import { GitStatusModal } from "../components/GitStatusModal";
import { ProjectHeader } from "../components/ProjectHeader";
import { GitMergeModal } from "../components/GitMergeModal";
import { AlertModal } from "../components/AlertModal";
import { ProjectSidebar } from "../components/ProjectSidebar";

// Recursive olarak Ağaç Yapısını Çizen Component
const FileNodeItem = ({ node }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isCode = node.name.match(/\.(js|jsx|ts|tsx|rs|py|go|java|css|html|json|md)$/i);

    if (!node.is_dir) {
        return (
            <div className="flex items-center gap-2 py-1 pl-4 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-default">
                <File size={16} className={isCode ? "text-blue-500" : "text-zinc-400"} />
                <span className="truncate">{node.name}</span>
            </div>
        );
    }

    return (
        <div className="pl-4">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 py-1.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer select-none"
            >
                {isOpen ? <FolderOpen size={18} className="text-yellow-500" /> : <Folder size={18} className="text-yellow-500" />}
                <span className="truncate">{node.name}</span>
            </div>
            {isOpen && node.children && (
                <div className="border-l border-zinc-200 dark:border-zinc-800 ml-2">
                    {node.children.map((childNode, i) => (
                        <FileNodeItem key={i} node={childNode} />
                    ))}
                </div>
            )}
        </div>
    );
};

export const ProjectDetails = ({ selectedAvatar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const project = location.state?.project;

    const [fileTree, setFileTree] = useState([]);
    const [gitDetails, setGitDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
    const [notFoundIdeName, setNotFoundIdeName] = useState(null);
    const [checkoutErrorData, setCheckoutErrorData] = useState(null);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [statusOutput, setStatusOutput] = useState("");
    const [mergeResult, setMergeResult] = useState(null);

    // Alert Modal State
    const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "", type: "info" });
    const showAlert = (message, title = "", type = "info") => {
        setAlertConfig({ isOpen: true, title, message, type });
    };

    const getIdeDisplayName = (ideId) => {
        const ides = {
            "vscode": "Visual Studio Code",
            "cursor": "Cursor",
            "visualstudio": "Visual Studio 2026",
            "antigravity": "AntiGravity"
        };
        return ides[ideId] || ideId;
    };

    const handleOpenInIde = async (ideId) => {
        const success = await ProjectService.openInIde(project.path, ideId);
        if (!success) setNotFoundIdeName(getIdeDisplayName(ideId));
    };

    const handleOpenExplorer = async () => {
        await ProjectService.openInExplorer(project.path);
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!project) {
            navigate("/");
            return;
        }
        const loadData = async () => {
            setLoading(true);
            const tree = await ProjectService.getFileTree(project.path);
            setFileTree(tree);
            if (project.is_git) await fetchGitData();
            setLoading(false);
        };
        loadData();
    }, [project, navigate]);

    const fetchGitData = async () => {
        const details = await GitService.fetchGitDetails(project.path);
        setGitDetails(details);
    };

    const submitCommit = async (message) => {
        if (message) {
            try {
                await GitService.gitCommit(project.path, message);
                showAlert("Değişiklikler başarıyla commitlendi.", "Başarılı", "success");
                setIsCommitModalOpen(false);
                fetchGitData();
            } catch (error) {
                showAlert("Git commit işlemi sırasında bir hata oluştu: " + error, "Hata", "error");
            }
        }
    };

    const handleSwitchBranch = async (branchName) => {
        if (branchName === gitDetails.current_branch) return;
        setLoading(true);
        try {
            await GitService.gitCheckout(project.path, branchName);
            await fetchGitData();
        } catch (err) {
            if (err.includes("overwritten by checkout")) {
                setCheckoutErrorData({ targetBranch: branchName });
            } else {
                showAlert("Branch değiştirme sırasında bir hata oluştu: " + err, "Hata", "error");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGitMerge = async (branchName) => {
        if (branchName === gitDetails?.current_branch) return;
        setLoading(true);
        try {
            const result = await GitService.gitMerge(project.path, branchName);
            setMergeResult(result);
            if (result.type === "Success") {
                await fetchGitData();
            }
        } catch (error) {
            showAlert("Merge işlemi sırasında bir hata oluştu: " + error, "Hata", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleStashAndCheckout = async (targetBranch) => {
        if (!targetBranch) return;
        setLoading(true);
        try {
            await GitService.gitStash(project.path);
            await GitService.gitCheckout(project.path, targetBranch);
            setCheckoutErrorData(null);
            await fetchGitData();
        } catch (err) {
            showAlert("Stash/Checkout işlemi sırasında hata: " + err, "Hata", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenIdeFromError = () => {
        setCheckoutErrorData(null);
        setIsModalOpen(true);
    };

    const handleOpenStatus = async () => {
        try {
            const output = await GitService.gitStatus(project.path);
            setStatusOutput(output);
            setIsStatusModalOpen(true);
        } catch (error) {
            showAlert("Git status alınırken bir hata oluştu: " + error, "Hata", "error");
        }
    };

    if (!project) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex flex-col font-sans transition-colors duration-200 overflow-hidden relative">
            <ProjectHeader
                project={project}
                selectedAvatar={selectedAvatar}
                onBack={() => navigate("/")}
                onOpenExplorer={handleOpenExplorer}
                onOpenWith={() => setIsModalOpen(true)}
                gitDetails={gitDetails}
            />

            <main className="flex-1 flex overflow-hidden">
                <ScrollArea as="aside" className="w-1/3 min-w-[300px] max-w-sm border-r border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30 p-4">
                    <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <Folder size={16} /> Proje Dosyaları
                    </h2>
                    {loading ? (
                        <div className="text-center py-10 animate-pulse text-zinc-500">Ağaç yükleniyor...</div>
                    ) : (
                        <div className="pr-2">
                            {fileTree.length > 0 ? (
                                fileTree.map((node, i) => <FileNodeItem key={i} node={node} />)
                            ) : (
                                <p className="text-xs text-zinc-500">Dosya bulunamadı veya erişilemiyor.</p>
                            )}
                        </div>
                    )}
                </ScrollArea>

                <ScrollArea as="section" className="flex-1 p-8 bg-white dark:bg-[#09090b]">
                    {/* Fixed Toggle Tab for Side Panel on the Right Edge */}
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="fixed right-0 top-1/2 -translate-y-1/2 z-30 p-2 pr-1 bg-zinc-900 dark:bg-zinc-800 text-white dark:text-zinc-100 rounded-l-2xl shadow-2xl hover:translate-x-[-4px] active:scale-95 transition-all flex items-center border-y border-l border-white/10 group"
                        title="Proje Panosunu Aç"
                    >
                        <ChevronLeft size={24} className="group-hover:scale-110 transition-transform" />
                    </button>

                    {!project.is_git ? (
                        <GitSetupWizard
                            project={project}
                            onSetupComplete={() => {
                                setLoading(true);
                                fetchGitData().then(() => setLoading(false));
                            }}
                        />
                    ) : loading ? (
                        <div className="text-center py-20 text-zinc-500 animate-pulse">Git verileri yükleniyor...</div>
                    ) : gitDetails ? (
                        <div className="max-w-4xl mx-auto space-y-8">
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Şu Anki Branch</h3>
                                    <div className="flex items-center gap-3">
                                        <GitBranch size={24} className="text-blue-500" />
                                        <span className="text-2xl font-mono font-bold text-zinc-800 dark:text-zinc-100">{gitDetails.current_branch}</span>
                                    </div>
                                </div>
                                {gitDetails.recent_commits && gitDetails.recent_commits.length > 0 && (
                                    <div className="hidden md:block text-right">
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-1">Son Commit</p>
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{gitDetails.recent_commits[0].hash.substring(0, 7)}</p>
                                    </div>
                                )}
                            </div>

                            <GitDashboard
                                project={project}
                                gitDetails={gitDetails}
                                fetchGitData={fetchGitData}
                                onCommitOpen={() => setIsCommitModalOpen(true)}
                                onStatusOpen={handleOpenStatus}
                                onMerge={handleGitMerge}
                                showAlert={showAlert}
                            />

                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                <div className="xl:col-span-1 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-white dark:bg-zinc-900/50">
                                    <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                                        <h3 className="text-sm font-semibold flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                                            <GitBranch size={16} /> Bütün Branch'ler
                                        </h3>
                                    </div>
                                    <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/60 p-2">
                                        {gitDetails.branches.map((b, i) => {
                                            const isCurrent = b === gitDetails.current_branch;
                                            return (
                                                <li key={i} className={`group py-2 px-3 rounded-lg flex items-center justify-between ${isCurrent ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all'}`}>
                                                    <div className="flex items-center gap-2 truncate flex-1 cursor-pointer" onClick={() => handleSwitchBranch(b)}>
                                                        {isCurrent ? <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></span> : <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 shrink-0"></span>}
                                                        <span className={`text-sm font-mono truncate ${isCurrent ? 'text-blue-700 dark:text-blue-400 font-bold' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                                            {b}
                                                        </span>
                                                    </div>
                                                    {!isCurrent && (
                                                        <button
                                                            onClick={() => handleGitMerge(b)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md transition-all cursor-pointer flex items-center gap-1 text-[10px] font-bold uppercase tracking-tighter"
                                                            title="Bu dalı şu anki dal içine birleştir (Merge)"
                                                        >
                                                            <GitMergeIcon size={14} /> Merge
                                                        </button>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div className="xl:col-span-2">
                                    <GitCommitTimeline commits={gitDetails.recent_commits} />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 text-red-500">Git verileri çekilirken bir sorun oluştu.</div>
                    )}
                </ScrollArea>

                {/* Side Panel (Drawer) Dashboard */}
                <ProjectSidebar
                    projectPath={project.path}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </main>

            <OpenWithModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onOpenIn={handleOpenInIde} />
            <IdeNotFoundModal isOpen={!!notFoundIdeName} ideName={notFoundIdeName} onClose={() => setNotFoundIdeName(null)} />
            <GitCheckoutErrorModal isOpen={!!checkoutErrorData} targetBranch={checkoutErrorData?.targetBranch} onClose={() => setCheckoutErrorData(null)} onStash={handleStashAndCheckout} onOpenIde={handleOpenIdeFromError} />
            <GitCommitModal isOpen={isCommitModalOpen} onClose={() => setIsCommitModalOpen(false)} onCommit={submitCommit} />
            <GitStatusModal isOpen={isStatusModalOpen} statusOutput={statusOutput} onClose={() => setIsStatusModalOpen(false)} />
            <GitMergeModal
                isOpen={!!mergeResult}
                onClose={() => setMergeResult(null)}
                result={mergeResult}
                onOpenWith={() => setIsModalOpen(true)}
            />
            <AlertModal
                isOpen={alertConfig.isOpen}
                onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </div>
    );
};
