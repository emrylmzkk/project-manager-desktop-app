import React, { useState } from 'react';
import { X, Code, Terminal, Layout, Plus, Folder, AlertCircle, Loader2 } from 'lucide-react';
import { ProjectService } from '../services/projectService';
import { TemplateCard } from './TemplateCard';
import pythonLogo from "../assets/icons/python_logo.png";
import fastapiLogo from "../assets/icons/fastapi_logo.png";

const TEMPLATES = [
    {
        id: 'python',
        name: 'Python (Basic)',
        description: 'Venv, requirements.txt, .gitignore ve src klasörü ile hazır bir Python çalışma alanı oluşturur.',
        icon: pythonLogo,
        tags: []
    },
    {
        id: 'fastapi',
        name: 'Python (FastAPI)',
        description: 'Uvicorn ve FastAPI kütüphaneleriyle hazır web uygulaması şablonu.',
        icon: fastapiLogo,
        tags: []
    },
    // {
    //     id: 'nextjs',
    //     name: 'Next.js App',
    //     description: 'Modern fullstack web uygulaması için Next.js şablonu (TypeScript & Tailwind).',
    //     icon: <Layout size={32} />,
    //     tags: ['Frontend', 'Fullstack', 'Soon'],
    //     disabled: true
    // },
    //  {
    //     id: 'rust',
    //     name: 'Rust Tool',
    //     description: 'Güçlü ve hızlı sistem araçları için Cargo tabanlı Rust binary projesi.',
    //     icon: <Code size={32} />,
    //     tags: ['Backend', 'System', 'Soon'],
    //     disabled: true
    // }
];

export const ProjectTemplatesModal = ({ isOpen, onClose, onSuccess }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [projectName, setProjectName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleCreate = async () => {
        if (!selectedTemplate || !projectName.trim()) {
            setError("Lütfen bir template ve proje adı seçin.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            // Önce nereye oluşturacağımızı seçelim (Parent Path)
            const parentPath = await ProjectService.selectDirectory();
            if (!parentPath) {
                setLoading(false);
                return;
            }

            const response = await ProjectService.createProjectFromTemplate(
                selectedTemplate.id,
                parentPath,
                projectName.trim()
            );

            if (response.success) {
                onSuccess(response.path);
                onClose();
                // Reset state
                setSelectedTemplate(null);
                setProjectName("");
            } else {
                setError(response.message || "Bir hata oluştu.");
            }
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-900/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="relative w-full max-w-4xl bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-8 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div>
                        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Proje Şablonları</h2>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                            Hazır şablonlarla saniyeler içinde yeni proje başlatın.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    {error && (
                        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/50 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-1 duration-300">
                            <AlertCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 ml-1">
                            Proje Adı
                        </label>
                        <div className="relative group">
                            <Plus className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                placeholder="my-awesome-project"
                                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-base outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-zinc-900 dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-3 ml-1">
                            Bir Şablon Seçin
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {TEMPLATES.map(template => (
                                <TemplateCard
                                    key={template.id}
                                    template={template}
                                    isSelected={selectedTemplate?.id === template.id}
                                    onSelect={(t) => {
                                        if (t.disabled) return;
                                        setSelectedTemplate(t);
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/20 flex gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-sm"
                    >
                        Vazgeç
                    </button>
                    <button
                        onClick={handleCreate}
                        disabled={loading || !selectedTemplate || !projectName.trim()}
                        className={`
                            flex-[2] py-4 rounded-2xl font-bold transition-all shadow-lg text-sm flex items-center justify-center gap-2
                            ${loading || !selectedTemplate || !projectName.trim()
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed shadow-none'
                                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 hover:scale-[1.02] active:scale-95'}
                        `}
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                <span>Oluşturuluyor...</span>
                            </>
                        ) : (
                            <>
                                <Folder size={20} />
                                <span>Proje Oluştur</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};
