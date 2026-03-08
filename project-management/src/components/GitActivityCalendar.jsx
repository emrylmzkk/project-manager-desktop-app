import { GitCommit } from "lucide-react";
import { ActivityCalendar } from "react-activity-calendar";
import { useTheme } from "../context/themeContext";
import { useState, useMemo, useEffect } from "react";

export const GitActivityCalendar = ({ activityData }) => {
    const { theme } = useTheme();

    const availableYears = useMemo(() => {
        if (!activityData || activityData.length === 0) return [new Date().getFullYear()];
        const years = new Set(activityData.map((item) => parseInt(item.date.substring(0, 4))));
        return Array.from(years).sort((a, b) => b - a);
    }, [activityData]);

    const [selectedYear, setSelectedYear] = useState(availableYears[0]);
    const [blockSize, setBlockSize] = useState(12);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) setBlockSize(8);
            else if (window.innerWidth < 1024) setBlockSize(10);
            else setBlockSize(12);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const yearData = useMemo(() => {
        if (!activityData) return [];

        const dataMap = new Map();
        activityData.forEach((item) => dataMap.set(item.date.substring(0, 10), item));

        const result = [];
        const isCurrentYear = selectedYear === new Date().getFullYear();

        let startDate = new Date(selectedYear, 0, 1);
        let endDate = isCurrentYear ? new Date() : new Date(selectedYear, 11, 31);

        const formatDate = (date) => {
            const d = new Date(date);
            let month = "" + (d.getMonth() + 1);
            let day = "" + d.getDate();
            const year = d.getFullYear();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;

            return [year, month, day].join("-");
        };

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = formatDate(d);
            if (dataMap.has(dateStr)) {
                result.push(dataMap.get(dateStr));
            } else {
                result.push({ date: dateStr, count: 0, level: 0 });
            }
        }

        return result;
    }, [activityData, selectedYear]);

    if (!activityData || activityData.length === 0) return null;

    const explicitTheme = {
        light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
        dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
    };

    const totalCommits = yearData.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div className="flex flex-col bg-white dark:bg-[#0d1117] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden w-full h-full text-zinc-900 dark:text-zinc-100">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <GitCommit size={18} className="text-emerald-500" />
                    {selectedYear} Commit Geçmişi
                </h3>
                {availableYears.length > 1 && (
                    <div className="flex gap-2">
                        {availableYears.map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${selectedYear === year
                                        ? "bg-emerald-500 text-white shadow shadow-emerald-500/20"
                                        : "bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Content Segment */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-x-auto mac-scrollbar">
                <div className="scale-[0.9] sm:scale-100 origin-center">
                    <ActivityCalendar
                        className="react-activity-calendar"
                        key={selectedYear}
                        data={yearData}
                        colorScheme={theme === "dark" ? "dark" : "light"}
                        theme={explicitTheme}
                        blockSize={blockSize}
                        blockMargin={3}
                        fontSize={11}
                        hideTotalCount={true}
                        hideColorLegend={true}
                        labels={{
                            months: [
                                "Oca", "Şub", "Mar", "Nis", "May", "Haz",
                                "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
                            ],
                            weekdays: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
                        }}
                    />
                </div>
            </div>

            {/* StatusBar (Footer) */}
            <div className="flex justify-between items-center p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-xs text-zinc-600 dark:text-zinc-400">
                <div>
                    Bu yıl toplam <span className="font-semibold text-zinc-900 dark:text-zinc-200">{totalCommits}</span> commit atıldı
                </div>
                <div className="flex items-center gap-2">
                    <span>Az</span>
                    <div className="flex gap-1">
                        {(theme === "dark" ? explicitTheme.dark : explicitTheme.light).map((color, idx) => (
                            <span key={idx} className="w-3 h-3 rounded-sm border border-zinc-200/50 dark:border-zinc-800/50" style={{ backgroundColor: color }}></span>
                        ))}
                    </div>
                    <span>Çok</span>
                </div>
            </div>
        </div>
    );
};