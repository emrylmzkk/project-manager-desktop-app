import { useTheme } from "../context/themeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SvgIcon } from "./SvgIcon";

export const Header = ({ onSelectFolder }) => {
    const { theme, toggleTheme } = useTheme();
    const [osName, setOsName] = useState("");

    useEffect(() => {
        invoke("get_system_info")
            .then((info) => {
                if (info && info.os) {
                    setOsName(info.os.toLowerCase());
                }
            })
            .catch(console.error);
    }, []);

    const getOsIcon = () => {
        if (osName.includes("windows")) return <SvgIcon name="windows" size={20} className="text-blue-500" />;
        if (osName.includes("mac")) return <SvgIcon name="macos" size={22} className="text-zinc-800 dark:text-zinc-200" />;
        if (osName.includes("linux")) return <SvgIcon name="linux" size={22} className="text-yellow-500" />;
        return null;
    };

    return (
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-200/50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800">
                    {getOsIcon()}
                </div>
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white flex items-center gap-2">
                        Project Navigator
                    </h1>
                    <p className="text-zinc-500 text-sm">Proje Dosyalarınızı ve Git hareketlerinizi kontrol edin</p>
                </div>
            </div>

            <div className="flex items-center gap-3">

                {/* Klasör Seçme Butonu */}
                <button
                    onClick={onSelectFolder}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm font-medium"
                >
                    Proje Ekle
                </button>

                {/* Tema Değiştirme Butonu */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
                    title="Temayı Değiştir"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>
        </header>
    );
};
