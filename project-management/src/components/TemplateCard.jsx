import React from 'react';
import { Terminal, FolderPlus, CheckCircle2 } from 'lucide-react';

export const TemplateCard = ({ template, onSelect, isSelected }) => {
    return (
        <div
            onClick={() => onSelect(template)}
            className={`
                relative p-6 rounded-3xl border-2 transition-all duration-300 cursor-pointer group
                ${isSelected
                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg shadow-blue-500/10'
                    : 'border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md'}
            `}
        >
            <div className="flex items-center justify-center mb-4">
                <div className={`
                    w-14 h-14 rounded-2xl transition-colors flex items-center justify-center overflow-hidden
                    bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:text-blue-500
                `}>
                    {typeof template.icon === 'string' ? (
                        <div className="p-2 w-full h-full flex items-center justify-center">
                            <img
                                src={template.icon}
                                alt={template.name}
                                className="max-w-full max-h-full object-contain"
                            />
                        </div>
                    ) : (
                        template.icon
                    )}
                </div>

            </div>

            <h3 className="text-lg text-center font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {template.name}
            </h3>

            <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                {template.description}
            </p>

            <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, idx) => (
                    <span
                        key={idx}
                        className="px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider"
                    >
                        {tag}
                    </span>
                ))}
            </div>
        </div>
    );
};
