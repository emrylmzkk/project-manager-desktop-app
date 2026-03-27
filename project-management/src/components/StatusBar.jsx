import { useEffect, useState, useRef } from "react";
import { Monitor, User, Cpu, MemoryStick, HardDrive, ChevronUp } from "lucide-react";
import { useTheme } from "../context/themeContext";

const APP_VERSION = "v1.1.7";

export const StatusBar = ({ selectedAvatar, selectedDisk, onDiskSelect, systemInfo }) => {
    const { theme } = useTheme();
    const [showAccounts, setShowAccounts] = useState(false);
    const [showDisks, setShowDisks] = useState(false);
    const accountsRef = useRef(null);
    const disksRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountsRef.current && !accountsRef.current.contains(event.target)) {
                setShowAccounts(false);
            }
            if (disksRef.current && !disksRef.current.contains(event.target)) {
                setShowDisks(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!systemInfo) return null;

    const formatOS = (os) => {
        if (os === "macos") return "macOS";
        if (os === "windows") return "Windows";
        if (os === "linux") return "Linux";
        return os;
    };

    const metrics = systemInfo.metrics;
    const accounts = systemInfo.git_accounts || [];
    const activeAccount = accounts.length > 0 ? accounts[0] : null;

    return (
        <div className={`
            fixed bottom-0 left-0 right-0 h-6 flex items-center justify-between px-3 text-[11px] font-medium z-50 shadow-inner select-none tracking-wide transition-all duration-700 ease-in-out border-t
            ${selectedAvatar
                ? (theme === "light"
                    ? `${selectedAvatar.headerTheme.light} text-zinc-800`
                    : `${selectedAvatar.headerTheme.dark} text-white opacity-100`)
                : "bg-blue-600 dark:bg-blue-700 text-white border-transparent"}
        `}>
            {/* Sol Kısım */}
            <div className="flex items-center gap-4 h-full relative">
                <div className="flex items-center gap-1.5 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors cursor-default">
                    <Monitor size={12} />
                    <span>{formatOS(systemInfo.os)}</span>
                </div>

                {/* Git Hesapları Popover */}
                <div className="relative h-full flex items-center" ref={accountsRef}>
                    <button
                        onClick={() => setShowAccounts(!showAccounts)}
                        className="flex items-center gap-1.5 hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                    >
                        <User size={12} />
                        <span>{activeAccount ? activeAccount.name : "Giriş Yapılmadı"}</span>
                        {accounts.length > 0 && <ChevronUp size={12} className={`transition-transform ${showAccounts ? "rotate-180" : ""}`} />}
                    </button>

                    {showAccounts && accounts.length > 0 && (
                        <div className="absolute left-0 bottom-full mb-2 w-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden py-1 text-zinc-800 dark:text-zinc-200">
                            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                                <span className="font-semibold text-xs">Bağlı Git Hesapları</span>
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {accounts.map((acc, idx) => (
                                    <div key={idx} className="px-3 py-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-default flex flex-col gap-0.5 border-l-2 border-transparent hover:border-blue-500">
                                        <div className="flex justify-between items-center w-full">
                                            <span className="font-semibold text-xs">{acc.name}</span>
                                            <span className="text-[9px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-500">{acc.source}</span>
                                        </div>
                                        <span className="text-[10px] text-zinc-500 truncate">{acc.email}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Orta Kısım - Uygulama Versiyonu */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded cursor-default">
                    <span className="font-mono text-[10px] opacity-70">App Version</span>
                    <span className="font-mono text-[10px] opacity-70">{APP_VERSION}</span>
                </div>
            </div>

            {/* Sağ Kısım - Metrikler */}
            <div className="flex items-center gap-4">

                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded cursor-default" title="CPU Kullanımı">
                    <Cpu size={12} />
                    <span className="font-mono">{metrics.cpu_usage.toFixed(1)}%</span>
                </div>

                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded cursor-default" title="RAM Kullanımı">
                    <MemoryStick size={12} />
                    <span className="font-mono">{metrics.used_ram_gb.toFixed(1)} / {metrics.total_ram_gb.toFixed(1)} GB</span>
                </div>

                {/* Diskler Popover */}
                <div className="relative h-full flex items-center" ref={disksRef}>
                    <button
                        onClick={() => setShowDisks(!showDisks)}
                        className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded transition-colors cursor-pointer ${selectedDisk ? 'bg-white/30 font-bold' : 'hover:bg-white/20'}`}
                        title={selectedDisk ? `Filtrelendi: ${selectedDisk.name || selectedDisk.mount_point}` : "Disk Kullanımları"}
                    >
                        <HardDrive size={12} />
                        <span className="font-mono hidden sm:inline">
                            {selectedDisk ? (selectedDisk.name || selectedDisk.mount_point) : `${metrics.disks.length} Disk`}
                        </span>
                        <ChevronUp size={10} className={`transition-transform ${showDisks ? "rotate-180" : ""}`} />
                    </button>

                    {showDisks && metrics.disks.length > 0 && (
                        <div className="absolute right-0 bottom-full mb-2 w-72 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-xl overflow-hidden py-1 text-zinc-800 dark:text-zinc-200">
                            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 flex justify-between items-center">
                                <span className="font-semibold text-xs">Sistem Sürücüleri</span>
                                {selectedDisk && (
                                    <button
                                        onClick={() => { onDiskSelect(null); setShowDisks(false); }}
                                        className="text-[10px] text-blue-500 hover:underline px-1.5 select-none cursor-pointer"
                                    >
                                        Tümünü Göster
                                    </button>
                                )}
                            </div>
                            <div className="max-h-60 overflow-y-auto">
                                {metrics.disks.map((disk, idx) => {
                                    const usedSpace = disk.total_space_gb - disk.available_space_gb;
                                    const percent = disk.total_space_gb > 0 ? (usedSpace / disk.total_space_gb) * 100 : 0;
                                    const isActive = selectedDisk?.mount_point === disk.mount_point;

                                    return (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                onDiskSelect(isActive ? null : disk);
                                                setShowDisks(false);
                                            }}
                                            className={`px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 border-b last:border-0 border-zinc-100 dark:border-zinc-800/50 flex flex-col gap-1.5 cursor-pointer transition-colors ${isActive ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-2 border-l-blue-500' : ''}`}
                                        >
                                            <div className="flex justify-between items-center w-full">
                                                <div className="flex gap-1.5 items-center">
                                                    <HardDrive size={12} className={disk.is_removable ? "text-orange-500" : "text-blue-500"} />
                                                    <span className="font-semibold text-[11px] truncate max-w-[120px]" title={disk.name || disk.mount_point}>
                                                        {disk.name || disk.mount_point}
                                                    </span>
                                                </div>
                                                <span className="text-[10px] text-zinc-500 font-mono">
                                                    {usedSpace.toFixed(1)} / {disk.total_space_gb.toFixed(0)} GB
                                                </span>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${percent > 90 ? 'bg-red-500' : percent > 75 ? 'bg-yellow-500' : 'bg-emerald-500'}`}
                                                    style={{ width: `${Math.min(percent, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
