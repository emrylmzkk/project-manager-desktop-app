import { useTheme } from "../context/themeContext";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SvgIcon } from "./SvgIcon";
//import { AvatarPickerModal, PixelChar } from "./AvatarPickerModal";
import { AvatarPickerModal, PixelChar, ANIMS, CHARACTERS } from "./icons/AvatarPickerModal";

export const Header = ({ onSelectFolder }) => {
    const { theme, toggleTheme } = useTheme();
    const [osName, setOsName] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedChar, setSelectedChar] = useState(null);   // seçili avatar

    useEffect(() => {
        // Sistem bilgisini al
        invoke("get_system_info")
            .then((info) => {
                if (info && info.os) setOsName(info.os.toLowerCase());
            })
            .catch(console.error);

        // Kayıtlı avatarı yükle
        const savedAvatarId = localStorage.getItem("selected_avatar");
        if (savedAvatarId) {
            const char = CHARACTERS.find(c => c.id === savedAvatarId);
            if (char) setSelectedChar(char);
        }
    }, []);

    // Avatar değişince kaydet
    useEffect(() => {
        if (selectedChar) {
            localStorage.setItem("selected_avatar", selectedChar.id);
        }
    }, [selectedChar]);

    const getOsIcon = () => {
        if (osName.includes("windows")) return <SvgIcon name="windows" size={20} className="text-blue-500" />;
        if (osName.includes("mac")) return <SvgIcon name="macos" size={22} className="text-zinc-800 dark:text-zinc-200" />;
        if (osName.includes("linux")) return <SvgIcon name="linux" size={22} className="text-yellow-500" />;
        return null;
    };

    return (
        // ↓ relative şart - modal absolute positioning için buna göre konumlanır
        <header className={`
            sticky top-0 z-30 w-full flex flex-col md:flex-row justify-between items-center mb-10 gap-4
            p-5 rounded-b-[2.5rem] border-b border-x transition-all duration-700 ease-in-out backdrop-blur-md
            ${selectedChar
                ? (theme === "light" ? selectedChar.headerTheme.light : selectedChar.headerTheme.dark)
                : "bg-white/80 dark:bg-zinc-900/80 border-zinc-200 dark:border-zinc-800 shadow-sm"}
        `}>
            <div className="flex items-center gap-4">

                {/* Avatar butonu - tıklayınca modal açılır */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="hidden sm:flex items-center justify-center w-14 h-14 rounded-2xl
                               bg-white/90 dark:bg-zinc-800/90
                               border border-zinc-200 dark:border-zinc-700
                               hover:border-blue-400 dark:hover:border-blue-500
                               hover:scale-105 transition-all cursor-pointer group"
                    title="Avatar Seç"
                    style={selectedChar ? { boxShadow: selectedChar.glow } : {}}
                >
                    <div className="flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        {selectedChar
                            ? (
                                <div style={{ animation: ANIMS[selectedChar.anim] }}>
                                    <PixelChar char={selectedChar} pixelSize={4.5} />
                                </div>
                            )
                            : (
                                <div className="text-zinc-400 dark:text-zinc-500">
                                    {getOsIcon()}
                                </div>
                            )
                        }
                    </div>
                </button>

                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Project Manager
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">
                        Proje Dosyalarınızı ve Git hareketlerinizi kontrol edin
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button
                    onClick={onSelectFolder}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-all shadow-lg shadow-blue-900/20 text-sm font-medium"
                >
                    Proje Ekle
                </button>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center cursor-pointer"
                    title="Temayı Değiştir"
                >
                    {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                </button>
            </div>

            {/* Modal - header'ın sağ üst köşesinden açılır, tüm genişliği kaplar */}
            <AvatarPickerModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSelect={(char) => setSelectedChar(char)}
                currentAvatar={selectedChar?.id}
            />
        </header>
    );
};