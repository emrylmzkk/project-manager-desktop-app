import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitBranch, Plus, Check, ExternalLink, Github, Terminal, ArrowRight, Loader2 } from "lucide-react";
import { GitService } from "../services/gitService";
import { open } from "@tauri-apps/plugin-shell"; // To open github link 

export const GitSetupWizard = ({ project, onSetupComplete }) => {
    const [step, setStep] = useState(1);
    const [remoteUrl, setRemoteUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInit = async () => {
        setLoading(true);
        setError("");
        try {
            await GitService.gitInit(project.path);
            setStep(2);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenGithub = async () => {
        await open("https://github.com/new");
    };

    const handleRemoteAdd = async () => {
        if (!remoteUrl.trim()) {
            setError("Remote URL girilmelidir!");
            return;
        }
        setLoading(true);
        setError("");
        try {
            await GitService.gitRemoteAdd(project.path, remoteUrl.trim());
            setStep(3);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFinalPush = async () => {
        setLoading(true);
        setError("");
        try {
            // Add All
            await GitService.gitAdd(project.path);
            // Commit
            await GitService.gitCommit(project.path, "Initial commit from Project Navigator");
            // Push
            await GitService.gitPushInitial(project.path);

            // Mark project as Git internally
            project.is_git = true;

            // Tell parent we are done so it reloads details
            onSetupComplete();

        } catch (err) {
            setError("Bir hata oluştu: " + err);
        } finally {
            setLoading(false);
        }
    };

    const animationConfig = {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20, position: 'absolute' },
        transition: { duration: 0.3 }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center">

            <div className="w-full max-w-lg bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-xl relative overflow-hidden">

                {/* Step Indicators */}
                <div className="flex items-center justify-center gap-4 mb-10 w-full relative z-10 px-4">
                    <div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-blue-500 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>

                <div className="relative min-h-[300px]">
                    <AnimatePresence mode="popLayout" initial={false}>

                        {/* ADIM 1: GIT INIT */}
                        {step === 1 && (
                            <motion.div key="step1" {...animationConfig} className="flex flex-col items-center text-center w-full">
                                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 border border-blue-200 dark:border-blue-800/50">
                                    <Terminal size={32} className="text-blue-600 dark:text-blue-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                    Projeyi Git'e Bağla
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm text-sm">
                                    Şu anda bu projede "git" entegrasyonu bulunmuyor. Detaylı takip için bu klasörü bir git repository'si haline getirmeliyiz.
                                </p>

                                <button
                                    onClick={handleInit}
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all font-medium disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <GitBranch size={18} />}
                                    git init (Başlat)
                                </button>
                                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                            </motion.div>
                        )}

                        {/* ADIM 2: GITHUB REMOTE BACKEND */}
                        {step === 2 && (
                            <motion.div key="step2" {...animationConfig} className="flex flex-col items-center text-center w-full">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6 border border-emerald-200 dark:border-emerald-800/50">
                                    <Github size={32} className="text-emerald-600 dark:text-emerald-500" />
                                </div>
                                <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                                    Uzak Sunucu (Remote)
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-sm">
                                    GitHub üzerinde yeni bir boş Repository oluşturun ve size verilen uzak depo bağlantısını (URL) yapıştırın.
                                </p>

                                <button
                                    onClick={handleOpenGithub}
                                    className="flex w-full items-center justify-center gap-2 py-2 mb-6 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm transition-all"
                                >
                                    <ExternalLink size={16} /> GitHub'da Boş Repo Aç
                                </button>

                                <div className="w-full text-left space-y-2 mb-8">
                                    <label className="text-xs font-semibold uppercase text-zinc-500 ml-1">Remote URL (.git)</label>
                                    <input
                                        type="text"
                                        value={remoteUrl}
                                        onChange={(e) => setRemoteUrl(e.target.value)}
                                        placeholder="https://github.com/user/proje.git"
                                        className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-zinc-100 outline-none focus:border-emerald-500 transition-colors"
                                    />
                                </div>

                                <button
                                    onClick={handleRemoteAdd}
                                    disabled={loading || !remoteUrl}
                                    className="flex w-full items-center justify-center gap-2 py-3 px-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all font-medium disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Bağlantıyı Kur"}
                                    {!loading && <ArrowRight size={18} />}
                                </button>
                                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                            </motion.div>
                        )}


                        {/* ADIM 3: ILLK COMMIT VE PUSH */}
                        {step === 3 && (
                            <motion.div key="step3" {...animationConfig} className="flex flex-col items-center text-center w-full">
                                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 border border-purple-200 dark:border-purple-800/50">
                                    <Check size={40} className="text-purple-600 dark:text-purple-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                                    Son Dokunuşlar
                                </h2>
                                <p className="text-zinc-600 dark:text-zinc-400 mb-8 max-w-sm text-sm">
                                    Harika! Tüm altyapı hazır. Şimdi dosyalarınızı otomatik olarak yakalayacağız, ilk commit (kayıt) işlemini yapıp GitHub'a yükleyeceğiz (Push).
                                </p>

                                <div className="w-full space-y-3 mb-8 text-left text-sm font-mono text-zinc-500 bg-zinc-50 dark:bg-zinc-900 rounded-xl p-4 border border-zinc-200 dark:border-zinc-800">
                                    <div className="flex gap-2"><span className="text-purple-500">$</span> git add .</div>
                                    <div className="flex gap-2"><span className="text-purple-500">$</span> git commit -m "Initial commit..."</div>
                                    <div className="flex gap-2"><span className="text-purple-500">$</span> git branch -M main</div>
                                    <div className="flex gap-2"><span className="text-purple-500">$</span> git push -u origin main</div>
                                </div>

                                <button
                                    onClick={handleFinalPush}
                                    disabled={loading}
                                    className="flex w-full items-center justify-center gap-2 py-3 px-6 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-500/20 transition-all font-medium disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : "İşlemleri Tamamla ve Bitir"}
                                </button>
                                {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
};
