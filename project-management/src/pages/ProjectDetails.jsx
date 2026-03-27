// src/pages/ProjectDetails.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Folder, FolderOpen, File, GitBranch } from "lucide-react";
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

// Recursive olarak Ağaç Yapısını Çizen Component
const FileNodeItem = ({ node }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Dosya türüne göre ikon seçimi (Basit bir mantık)
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

            {/* Eğer klasör açıksa ve içinde child varsa onları kendi kendine (recursive) render et */}
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
    const { theme } = useTheme();

    // React Router navigate state üzerinden projemizi yakalıyoruz
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
        if (!success) {
            setNotFoundIdeName(getIdeDisplayName(ideId));
        }
    };

    const handleOpenExplorer = async () => {
        await ProjectService.openInExplorer(project.path);
    };

    // Component render olunca tetiklenir
    useEffect(() => {
        // Sayfa direk /project url'i ile (proje datasız) açılmışsa geriye at
        if (!project) {
            navigate("/");
            return;
        }

        const loadData = async () => {
            setLoading(true);
            // Backend'den (Rust) klasör ağacını çekiyoruz
            const tree = await ProjectService.getFileTree(project.path);
            setFileTree(tree);

            // Sadece proje bir .git klasörüyse git commit'lerini çekiyoruz
            if (project.is_git) {
                await fetchGitData();
            }

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
                alert("Başarıyla commit atıldı!");
                setIsCommitModalOpen(false);
                fetchGitData(); // Verileri yenile
            } catch (error) {
                alert("Git commit başarısız: " + error);
            }
        }
    };

    const handleSwitchBranch = async (branchName) => {
        if (branchName === gitDetails.current_branch) return;
        setLoading(true);
        try {
            await GitService.gitCheckout(project.path, branchName);
            await fetchGitData(); // Update history and UI after switching branch
        } catch (err) {
            if (err.includes("overwritten by checkout")) {
                setCheckoutErrorData({ targetBranch: branchName });
            } else {
                alert("Branch değiştirilirken hata: " + err);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStashAndCheckout = async () => {
        if (!checkoutErrorData) return;
        setLoading(true);
        try {
            await GitService.gitStash(project.path);
            await GitService.gitCheckout(project.path, checkoutErrorData.targetBranch);
            setCheckoutErrorData(null);
            await fetchGitData();
        } catch (err) {
            alert("İşlem sırasında hata: " + err);
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
            alert("Git status alınamadı: " + error);
        }
    };

    if (!project) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] flex flex-col font-sans transition-colors duration-200">

            <ProjectHeader 
                project={project}
                selectedAvatar={selectedAvatar}
                onBack={() => navigate("/")}
                onOpenExplorer={handleOpenExplorer}
                onOpenWith={() => setIsModalOpen(true)}
                gitDetails={gitDetails}
            />

            {/* Ana Gövde (Sol-Sağ Panel) */}
            <main className="flex-1 flex overflow-hidden">

                {/* SOL PANEL: Dosya Ağacı */}
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

                {/* SAĞ PANEL: Git Detayları (Veya Placeholder) */}
                <ScrollArea as="section" className="flex-1 p-8 bg-white dark:bg-[#09090b]">
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

                            {/* Info Card: Aktif Branch */}
                            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/30 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Şu Anki Branch</h3>
                                    <div className="flex items-center gap-3">
                                        <GitBranch size={24} className="text-blue-500" />
                                        <span className="text-2xl font-mono font-bold text-zinc-800 dark:text-zinc-100">{gitDetails.current_branch}</span>
                                    </div>
                                </div>

                                {/* Son atılan commit kısa özeti (Varsa) */}
                                {gitDetails.recent_commits && gitDetails.recent_commits.length > 0 && (
                                    <div className="hidden md:block text-right">
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase font-bold tracking-wider mb-1">Son Commit</p>
                                        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{gitDetails.recent_commits[0].hash.substring(0, 7)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Aktivite Takvimi (Heatmap) ve Git Komutları */}
                            <GitDashboard
                                project={project}
                                gitDetails={gitDetails}
                                fetchGitData={fetchGitData}
                                onCommitOpen={() => setIsCommitModalOpen(true)}
                                onStatusOpen={handleOpenStatus}
                            />

                            {/* İki Kolonlu Alt Kısım */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

                                {/* Branch'ler (1 Kolon) */}
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
                                                <li
                                                    key={i}
                                                    onClick={() => handleSwitchBranch(b)}
                                                    className={`py-2.5 px-3 rounded-lg flex items-center gap-2 ${isCurrent ? 'cursor-default bg-blue-50/50 dark:bg-blue-900/10' : 'cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-colors'}`}
                                                >
                                                    {isCurrent ? (
                                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                                    ) : (
                                                        <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
                                                    )}
                                                    <span className={`text-sm font-mono ${isCurrent ? 'text-blue-700 dark:text-blue-400 font-medium' : 'text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-300'}`}>
                                                        {b}
                                                    </span>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Commit Akışı (Timeline) (2 Kolon) */}
                                <div className="xl:col-span-2">
                                    <GitCommitTimeline commits={gitDetails.recent_commits} />
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div className="text-center py-20 text-red-500">Git verileri çekilirken bir sorun oluştu.</div>
                    )}
                </ScrollArea>

            </main>

            {/* Birlikte Aç Modalı */}
            <OpenWithModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onOpenIn={handleOpenInIde}
            />

            {/* IDE Bulunamadı Modalı */}
            <IdeNotFoundModal
                isOpen={!!notFoundIdeName}
                ideName={notFoundIdeName}
                onClose={() => setNotFoundIdeName(null)}
            />

            {/* Git Checkout Error Modalı */}
            <GitCheckoutErrorModal
                isOpen={!!checkoutErrorData}
                targetBranch={checkoutErrorData?.targetBranch}
                onClose={() => setCheckoutErrorData(null)}
                onStash={handleStashAndCheckout}
                onOpenIde={handleOpenIdeFromError}
            />

            {/* Git Commit Modalı */}
            <GitCommitModal
                isOpen={isCommitModalOpen}
                onClose={() => setIsCommitModalOpen(false)}
                onCommit={submitCommit}
            />

            {/* Git Status Modalı */}
            <GitStatusModal
                isOpen={isStatusModalOpen}
                statusOutput={statusOutput}
                onClose={() => setIsStatusModalOpen(false)}
            />
        </div>
    );
};
