import { ExternalLink } from "lucide-react";
import { SvgIcon } from "./SvgIcon";

export const OpenWithModal = ({ isOpen, onClose, onOpenIn }) => {
    if (!isOpen) return null;

    const IDE_LIST = [
        { id: "vscode", name: "Visual Studio Code", icon: <SvgIcon name="vscode" size={20} className="text-blue-500" /> },
        { id: "cursor", name: "Cursor", icon: <SvgIcon name="cursor" size={18} className="text-zinc-800 dark:text-zinc-200" /> },
        { id: "visualstudio", name: "Visual Studio 2026", icon: <SvgIcon name="visualstudio" size={20} className="text-purple-600" /> },
        { id: "antigravity", name: "AntiGravity", icon: <SvgIcon name="antigravity" size={18} className="text-zinc-800 dark:text-zinc-200" /> }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col relative">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                        <span>Birlikte Aç</span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors p-1"
                    >
                        ✕
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 space-y-2">
                    {IDE_LIST.map((ide) => (
                        <button
                            key={ide.id}
                            onClick={() => {
                                onOpenIn(ide.id);
                                onClose();
                            }}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors group border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700"
                        >
                            <div className="flex items-center gap-3">
                                {ide.icon}
                                <span className="font-medium text-zinc-700 dark:text-zinc-200">{ide.name}</span>
                            </div>
                            <ExternalLink size={16} className="text-zinc-400 group-hover:text-blue-500 transition-colors" />
                        </button>
                    ))}
                </div>

            </div>
        </div>
    );
};
