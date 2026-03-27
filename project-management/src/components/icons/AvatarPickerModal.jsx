import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

// Modal içindeki pixel boyutu
const P = 5;

// Her karakter: colors[0] = transparent, geri kalanlar renk
export const CHARACTERS = [
    {
        id: "ghost",
        name: "Hayalet",
        colors: [null, "#CBD5E1", "#1E293B", "#94A3B8"],
        grid: [
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 2, 1, 1, 2, 1, 1, 1],
            [1, 1, 1, 2, 1, 1, 2, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 3, 1, 1, 3, 1, 1, 1],
            [1, 3, 1, 1, 1, 1, 1, 1, 3, 1],
            [3, 0, 3, 0, 0, 0, 0, 3, 0, 3],
        ],
        anim: "float",
        bg: "from-slate-500/10 to-slate-600/20",
        border: "border-slate-400",
        glow: "0 0 20px rgba(148,163,184,0.3)",
        headerTheme: {
            light: "bg-slate-100/90 border-slate-300/70",
            dark: "bg-slate-900/40 border-slate-800/60"
        }
    },
    {
        id: "vader",
        name: "Darth Vader",
        colors: [null, "#111827", "#374151", "#EF4444", "#94A3B8"],
        grid: [
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 2, 2, 1, 1, 2, 2, 1, 0], // Gözler
            [0, 1, 2, 2, 1, 1, 2, 2, 1, 0],
            [0, 1, 1, 1, 4, 4, 1, 1, 1, 0], // Burun/Ağız bölgesi
            [0, 1, 1, 4, 1, 1, 4, 1, 1, 0], // Izgara detayı
            [0, 1, 3, 1, 1, 1, 1, 3, 1, 0], // Kırmızı ışıklar
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
        ],
        anim: "breath", // Nefes alma efekti için
        bg: "from-red-900/20 to-zinc-900/30",
        border: "border-red-900/50",
        glow: "0 0 20px rgba(239,68,68,0.2)",
        headerTheme: {
            light: "animate-vader-header-light bg-zinc-100/90 border-red-200/70",
            dark: "animate-vader-header-dark bg-red-950/20 border-red-900/40"
        }
    },
    {
        id: "robot",
        name: "Robot",
        colors: [null, "#94A3B8", "#475569", "#FCD34D", "#60A5FA", "#EF4444"],
        grid: [
            [0, 0, 0, 0, 5, 5, 0, 0, 0, 0],
            [0, 0, 0, 0, 2, 2, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 3, 3, 1, 1, 3, 3, 1, 0],
            [0, 1, 3, 3, 1, 1, 3, 3, 1, 0],
            [0, 1, 1, 2, 2, 2, 2, 1, 1, 0],
            [0, 4, 1, 1, 1, 1, 1, 1, 4, 0],
            [0, 4, 1, 1, 1, 1, 1, 1, 4, 0],
            [0, 0, 2, 2, 0, 0, 2, 2, 0, 0],
        ],
        anim: "bob",
        bg: "from-blue-500/10 to-blue-600/20",
        border: "border-blue-400",
        glow: "0 0 20px rgba(96,165,250,0.3)",
        headerTheme: {
            light: "bg-blue-100/90 border-blue-300/70",
            dark: "bg-blue-900/40 border-blue-800/60"
        }
    },
    {
        id: "wizard",
        name: "Büyücü",
        colors: [null, "#7C3AED", "#312E81", "#FDE68A", "#FDA4AF", "#F8FAFC"],
        grid: [
            [0, 0, 0, 0, 2, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 1, 2, 1, 1, 1, 0, 0],
            [3, 4, 4, 4, 4, 4, 4, 4, 4, 3],
            [0, 4, 2, 4, 4, 4, 2, 4, 0, 0],
            [0, 5, 5, 3, 4, 4, 3, 5, 5, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 2, 1, 0, 1, 1, 0, 1, 2, 0],
        ],
        anim: "twinkle",
        bg: "from-purple-500/10 to-purple-600/20",
        border: "border-purple-400",
        glow: "0 0 20px rgba(167,139,250,0.3)",
        headerTheme: {
            light: "bg-purple-100/90 border-purple-300/70",
            dark: "bg-purple-900/40 border-purple-800/60"
        }
    },
    {
        id: "alien",
        name: "Uzaylı",
        colors: [null, "#4ADE80", "#166534", "#FFFFFF", "#1E293B"],
        grid: [
            [0, 2, 0, 0, 0, 0, 0, 0, 2, 0],
            [0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 1, 3, 1, 1, 3, 1, 1, 0],
            [0, 1, 1, 4, 1, 1, 4, 1, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 1, 3, 4, 4, 3, 1, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        ],
        anim: "pulse",
        bg: "from-green-500/10 to-green-600/20",
        border: "border-green-400",
        glow: "0 0 20px rgba(74,222,128,0.3)",
        headerTheme: {
            light: "bg-green-100/90 border-green-300/70",
            dark: "bg-green-900/40 border-green-800/60"
        }
    },
    {
        id: "knight",
        name: "Şövalye",
        colors: [null, "#CBD5E1", "#64748B", "#FCD34D", "#1E293B"],
        grid: [
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 2, 1, 1, 1, 1, 2, 1, 0],
            [0, 1, 1, 3, 3, 3, 3, 1, 1, 0],
            [0, 1, 3, 4, 4, 4, 4, 3, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [3, 3, 2, 1, 1, 1, 1, 2, 3, 3],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 2, 1, 1, 1, 1, 2, 1, 0],
            [0, 0, 2, 2, 0, 0, 2, 2, 0, 0],
        ],
        anim: "bob",
        bg: "from-yellow-500/10 to-amber-600/20",
        border: "border-yellow-400",
        glow: "0 0 20px rgba(253,224,71,0.3)",
        headerTheme: {
            light: "bg-amber-100/90 border-amber-300/70",
            dark: "bg-amber-900/40 border-amber-800/60"
        }
    },
    {
        id: "cat",
        name: "Kedi",
        colors: [null, "#FB923C", "#7C2D12", "#1E293B", "#FDE68A", "#FDA4AF"],
        grid: [
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 3, 1, 1, 1, 1, 3, 1, 0],
            [0, 1, 4, 1, 1, 1, 1, 4, 1, 0],
            [0, 0, 1, 1, 3, 3, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 5, 1, 3, 1, 1, 3, 1, 5, 0],
            [0, 0, 2, 2, 0, 0, 2, 2, 0, 0],
        ],
        anim: "twinkle",
        bg: "from-orange-500/10 to-orange-600/20",
        border: "border-orange-400",
        glow: "0 0 20px rgba(251,146,60,0.3)",
        headerTheme: {
            light: "bg-orange-100/90 border-orange-300/70",
            dark: "bg-orange-900/40 border-orange-800/60"
        }
    },
    {
        id: "unicorn",
        name: "Unicorn",
        // 1: Silver White, 2: Pembe (Yele), 3: Mor (Yele), 4: Altın (Boynuz), 5: Mavi (Göz), 6: Soft Pembe (Yanak)
        colors: [null, "#F8FAFC", "#F472B6", "#A78BFA", "#FDE047", "#60A5FA", "#FECDD3"],
        grid: [
            [0, 0, 0, 0, 4, 0, 0, 0, 0, 0], // Boynuz ucu
            [0, 0, 0, 0, 4, 0, 0, 0, 0, 0], // Boynuz altı
            [0, 0, 1, 1, 1, 1, 1, 0, 0, 0], // Kafa üstü
            [0, 1, 1, 1, 1, 5, 1, 1, 0, 0], // Göz hizası
            [0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 1, 6, 1, 1, 1, 1, 0, 0, 0], // Yanak
            [0, 2, 1, 1, 1, 1, 0, 0, 0, 0], // Yele/Boyun
            [0, 3, 2, 1, 1, 1, 0, 0, 0, 0], // Alt yele
            [0, 0, 3, 2, 2, 2, 0, 0, 0, 0], // Kuyruk başlangıcı
        ],
        anim: "rainbow",
        bg: "bg-gradient-to-br from-pink-400/10 via-purple-400/10 to-sky-400/10",
        border: "border-pink-300/50",
        glow: "0 0 25px rgba(244,114,182,0.4)",
        headerTheme: {
            light: "animate-unicorn-header bg-gradient-to-br from-pink-50/90 to-sky-100/90 border-pink-200",
            dark: "animate-unicorn-header bg-gradient-to-r from-rose-950/30 via-amber-950/30 via-emerald-950/30 via-sky-950/30 via-violet-950/30 border-pink-800/30"
        }
    },
    {
        id: "dino",
        name: "Dinozor",
        // 1: Ana Yeşil, 2: Koyu Yeşil (Gölge), 3: Sarı (Karın), 4: Siyah (Göz), 5: Turuncu (Sırt Dikenleri)
        colors: [null, "#22C55E", "#166534", "#FEF08A", "#1E293B", "#F97316"],
        grid: [
            [0, 0, 0, 1, 1, 1, 1, 5, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 4, 1, 1, 1, 1, 0, 0], // Göz
            [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 0, 0, 0, 0, 0], // Boyun
            [0, 5, 1, 1, 3, 1, 0, 0, 0, 0], // Sırt ve Karın
            [0, 5, 1, 1, 3, 3, 1, 0, 0, 0],
            [0, 1, 1, 1, 3, 3, 1, 0, 0, 0],
            [0, 0, 2, 2, 0, 2, 2, 0, 0, 0], // Ayaklar
        ],
        anim: "bob",
        bg: "from-green-500/10 to-emerald-600/20",
        border: "border-green-500",
        glow: "0 0 20px rgba(34,197,94,0.3)",
        headerTheme: {
            light: "bg-emerald-100/90 border-emerald-300/70",
            dark: "bg-emerald-900/40 border-emerald-800/60"
        }
    },
];

// pixelSize prop'u ile hem modal'da (P=5) hem button'da (P=4) kullanılabilir
export const PixelChar = ({ char, pixelSize = P }) => {
    const { colors, grid } = char;
    return (
        <svg
            width={grid[0].length * pixelSize}
            height={grid.length * pixelSize}
            style={{ imageRendering: "pixelated", display: "block" }}
        >
            {grid.map((row, y) =>
                row.map((ci, x) =>
                    ci !== 0 ? (
                        <rect
                            key={`${x}-${y}`}
                            x={x * pixelSize}
                            y={y * pixelSize}
                            width={pixelSize}
                            height={pixelSize}
                            fill={colors[ci]}
                        />
                    ) : null
                )
            )}
        </svg>
    );
};

export const ANIMS = {
    float: "pixelFloat 3s ease-in-out infinite",
    bob: "pixelBob 2s ease-in-out infinite",
    twinkle: "pixelTwinkle 2.5s ease-in-out infinite",
    pulse: "pixelPulse 2s ease-in-out infinite",
    modalDropIn: "modalDropIn 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) forwards",
    backdropFade: "backdropFade 0.2s ease forwards",
    rainbow: "pixelRainbow 4s linear infinite",
    breath: "pixelBreath 4s ease-in-out infinite",
};

export const AvatarPickerModal = ({ isOpen, onClose, onSelect, currentAvatar }) => {
    const [selected, setSelected] = useState(currentAvatar || CHARACTERS[0].id);
    const [hoveredId, setHoveredId] = useState(null);

    // Modal her açıldığında mevcut seçimi senkronize et
    useEffect(() => {
        if (isOpen && currentAvatar) setSelected(currentAvatar);
    }, [isOpen, currentAvatar]);

    if (!isOpen) return null;

    const selectedChar = CHARACTERS.find((c) => c.id === selected);

    return (
        <>
            <style>{`
        @keyframes modalDropIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes backdropFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>

            {/* Backdrop - tıklanınca kapanır */}
            <div
                className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px]"
                style={{ animation: "backdropFade 0.2s ease forwards" }}
                onClick={onClose}
            />

            {/* Modal panel - header'ın tam genişliğinde, yukarıdan açılır */}
            <div
                className="absolute top-0 inset-x-0 z-50"
                style={{ animation: "modalDropIn 0.35s cubic-bezier(0.34, 1.4, 0.64, 1) forwards" }}
            >
                <div className="bg-white/96 dark:bg-zinc-900/97 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-700/80 rounded-2xl shadow-2xl p-5">

                    {/* Üst bar */}
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-0.5">
                                KARAKTER SEÇ
                            </p>
                            <h2 className="text-sm font-bold text-zinc-900 dark:text-white">
                                <span className="text-zinc-400 font-normal">Seçili: </span>
                                {selectedChar?.name ?? "—"}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Avatar grid */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {CHARACTERS.map((char) => {
                            const isSelected = selected === char.id;
                            const isHovered = hoveredId === char.id;
                            return (
                                <button
                                    key={char.id}
                                    onClick={() => setSelected(char.id)}
                                    onMouseEnter={() => setHoveredId(char.id)}
                                    onMouseLeave={() => setHoveredId(null)}
                                    className={`
                    relative flex flex-col items-center justify-end gap-2.5 pt-4 pb-3 px-2
                    rounded-xl border-2 bg-gradient-to-b transition-all duration-200 ease-out
                    ${char.bg}
                    ${isSelected
                                            ? `${char.border} scale-[1.05]`
                                            : "border-zinc-200/70 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:scale-[1.02]"
                                        }
                  `}
                                    style={isSelected ? { boxShadow: char.glow } : {}}
                                >
                                    {isSelected && (
                                        <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center shadow">
                                            <Check size={9} strokeWidth={3} className="text-white" />
                                        </span>
                                    )}

                                    {/* Animasyon sadece hover veya seçili olduğunda çalışır */}
                                    <div style={{ animation: isSelected || isHovered ? ANIMS[char.anim] : undefined }}>
                                        <PixelChar char={char} pixelSize={P} />
                                    </div>

                                    <span className="text-[10px] font-semibold tracking-tight text-zinc-500 dark:text-zinc-400">
                                        {char.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-center mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                        {/* <p className="text-xs text-zinc-400 dark:text-zinc-500">
                            Seçim profil ikonuna yansıyacak
                        </p> */}
                        <div className="flex gap-2">
                            <button
                                onClick={onClose}
                                className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                            >
                                İptal
                            </button>
                            <button
                                onClick={() => { onSelect(selectedChar); onClose(); }}
                                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors shadow shadow-blue-900/20"
                            >
                                Kaydet
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};