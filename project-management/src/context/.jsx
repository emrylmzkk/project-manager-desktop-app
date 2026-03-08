// src/contexts/ThemeContext.jsx
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Mac/Windows cihazın varsayılan sistem temasını kontrol et
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const [theme, setTheme] = useState(() => {
        // LocalStorage'da daha önce kaydedilmiş bir tema varsa onu al, yoksa sistem temasını kullan
        return localStorage.getItem("theme") || (systemPrefersDark ? "dark" : "light");
    });

    useEffect(() => {
        // Tema değiştiğinde HTML'in en üst (root) etiketine 'dark' class'ını ekle veya çıkar.
        // Tailwind'in 'dark:' sınıfları bu sayede devreye girecek.
        const root = window.document.documentElement;
        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        // Seçimi tarayıcının hafızasına kaydet (Uygulama kapanıp açılınca unutmaması için)
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Temayı tam tersine çeviren fonksiyon
    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Diğer componentlerde rahatça kullanabilmemiz için custom hook:
export const useTheme = () => useContext(ThemeContext);
