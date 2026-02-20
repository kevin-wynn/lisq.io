import { useEffect, useState } from "react";
import { Check, Moon, Sun } from "lucide-react";

interface ThemeDefinition {
  id: string;
  name: string;
  author: string;
  isDark: boolean;
  surface: string[];
  accent: string[];
}

const themes: ThemeDefinition[] = [
  {
    id: "paper",
    name: "Paper",
    author: "LISQ",
    isDark: false,
    surface: ["#1c1917", "#57534e", "#78716c", "#a8a29e", "#d6d3d1", "#e7e5e4", "#f0efed", "#f5f4f2", "#faf9f7", "#fdfcfb", "#ffffff"],
    accent:  ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b"],
  },
  {
    id: "dracula",
    name: "Dracula",
    author: "Dracula Theme",
    isDark: true,
    surface: ["#f8f8f2", "#d4d4ce", "#b0b0aa", "#8c8c86", "#6272a4", "#44475a", "#3a3d4e", "#313442", "#282a36", "#21222c", "#191a21"],
    accent:  ["#f5eefe", "#e8d8fd", "#d8bffc", "#c8a6fa", "#bd93f9", "#a87cf0", "#8e63d4", "#744cb8", "#5a389c", "#402680", "#281660"],
  },
  {
    id: "catppuccin-latte",
    name: "Catppuccin Latte",
    author: "Catppuccin",
    isDark: false,
    surface: ["#4c4f69", "#6c6f85", "#7c7f93", "#8c8fa3", "#9ca0b0", "#bcc0cc", "#ccd0da", "#dce0e8", "#e6e9ef", "#eff1f5", "#f5f5f8"],
    accent:  ["#f3e8fd", "#e3ccfb", "#cfa8f7", "#b87cf2", "#a558ec", "#8839ef", "#7029d6", "#5a20b8", "#45189a", "#31107c", "#1e0a52"],
  },
  {
    id: "tokyo-night",
    name: "Tokyo Night",
    author: "enkia",
    isDark: true,
    surface: ["#c0caf5", "#a9b1d6", "#9098b8", "#787e9a", "#565a6e", "#414560", "#363b54", "#2c3048", "#24283b", "#1a1b26", "#16161e"],
    accent:  ["#eef0fd", "#d4d9fa", "#b5bdf5", "#9aa4f1", "#8793ed", "#7aa2f7", "#6580e0", "#5068c8", "#3c52b0", "#2a3d98", "#1c2a80"],
  },
  {
    id: "github-light",
    name: "GitHub Light",
    author: "GitHub",
    isDark: false,
    surface: ["#1f2328", "#656d76", "#818b98", "#9ba4af", "#bcc3cb", "#d1d9e0", "#e4e8ec", "#f0f2f4", "#f6f8fa", "#fafbfc", "#ffffff"],
    accent:  ["#ddf4ff", "#b6e3ff", "#80ccff", "#54aeff", "#218bff", "#0969da", "#0550ae", "#033d8b", "#02306a", "#001d4a", "#00112a"],
  },
  {
    id: "rose-pine",
    name: "Rosé Pine",
    author: "Rosé Pine",
    isDark: true,
    surface: ["#e0def4", "#c4c2da", "#908caa", "#6e6a86", "#56526e", "#403d52", "#353245", "#2a2837", "#21202e", "#1f1d2e", "#191724"],
    accent:  ["#fdf0ef", "#f8dcd9", "#f2c4c0", "#ebbcba", "#e0a5a2", "#d4908c", "#b87876", "#9c6260", "#804c4c", "#643838", "#482626"],
  },
  {
    id: "nord",
    name: "Nord",
    author: "Arctic Ice Studio",
    isDark: true,
    surface: ["#eceff4", "#d8dee9", "#b0b8c8", "#8890a0", "#6a7282", "#4c566a", "#434c5e", "#3b4252", "#353c4a", "#2e3440", "#272c36"],
    accent:  ["#e8f4f6", "#c8e5eb", "#a0d0da", "#88c0d0", "#72b0c2", "#5e9fb3", "#4e8da0", "#3e7a8e", "#30687c", "#22566a", "#164558"],
  },
  {
    id: "synthwave",
    name: "Synthwave '84",
    author: "Robb Owen",
    isDark: true,
    surface: ["#ffffff", "#ddd8e8", "#b6b0c8", "#908aa8", "#6e6888", "#504a6e", "#423c5e", "#36304e", "#2a2540", "#262335", "#1e1a2e"],
    accent:  ["#ffe8f8", "#ffc8ee", "#ffa5e2", "#ff88d8", "#ff7edb", "#f564c4", "#dc4aae", "#c23498", "#a82082", "#8e106c", "#740058"],
  },
];

function ThemeCard({ theme, isVisible }: { theme: ThemeDefinition; isVisible: boolean }) {
  const bg = theme.surface[9];
  const sidebar = theme.surface[8];
  const card = theme.surface[7];
  const border = theme.surface[5];
  const text = theme.surface[0];
  const textMuted = theme.surface[2];
  const accent = theme.accent[5];

  return (
    <div
      className={`absolute inset-0 transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-dark-700" style={{ backgroundColor: bg }}>
        {/* Mini App Preview */}
        <div className="h-64 sm:h-80 flex">
          {/* Sidebar */}
          <div
            className="w-16 sm:w-20 flex flex-col items-center gap-2 py-4 border-r"
            style={{ backgroundColor: sidebar, borderColor: border }}
          >
            <div className="w-8 h-3 rounded-full" style={{ backgroundColor: accent }} />
            <div className="w-10 h-2 rounded-full opacity-60" style={{ backgroundColor: textMuted }} />
            <div className="w-7 h-2 rounded-full opacity-40" style={{ backgroundColor: textMuted }} />
            <div className="w-9 h-2 rounded-full opacity-40" style={{ backgroundColor: textMuted }} />
            <div className="w-6 h-2 rounded-full opacity-30" style={{ backgroundColor: textMuted }} />
            <div className="mt-auto w-10 h-6 rounded-md" style={{ backgroundColor: accent }} />
          </div>

          {/* Content */}
          <div className="flex-1 p-4 sm:p-5 flex flex-col gap-3">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: accent }} />
              <div className="w-24 h-3 rounded-full" style={{ backgroundColor: text, opacity: 0.7 }} />
              <div className="ml-auto w-16 h-5 rounded-md opacity-30" style={{ backgroundColor: textMuted }} />
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: border }}>
              <div className="h-full rounded-full w-3/5" style={{ backgroundColor: accent }} />
            </div>

            {/* List items */}
            <div className="flex-1 space-y-2">
              {[0.9, 0.7, 0.55, 0.4, 0.3].map((opacity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg px-3 py-2"
                  style={{ backgroundColor: card, border: `1px solid ${border}` }}
                >
                  <div
                    className="w-4 h-4 rounded-sm border-2 shrink-0"
                    style={{
                      borderColor: i === 0 ? accent : textMuted,
                      backgroundColor: i === 0 ? accent : "transparent",
                    }}
                  />
                  {i === 0 && (
                    <Check size={10} color={theme.isDark ? "#fff" : "#fff"} className="absolute ml-0.5" />
                  )}
                  <div className="h-2 rounded-full flex-1" style={{ backgroundColor: text, opacity }} />
                  {i === 2 && (
                    <div className="h-4 px-2 rounded text-[8px] flex items-center" style={{ backgroundColor: accent + "22", color: accent }}>
                      HIGH
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Label */}
        <div className="px-4 py-3 border-t flex items-center justify-between" style={{ backgroundColor: sidebar, borderColor: border }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: text }}>{theme.name}</div>
            <div className="text-xs" style={{ color: textMuted }}>{theme.author}</div>
          </div>
          <div className="flex items-center gap-1.5">
            {theme.isDark ? (
              <Moon size={14} style={{ color: textMuted }} />
            ) : (
              <Sun size={14} style={{ color: textMuted }} />
            )}
            <span className="text-[10px] font-mono" style={{ color: textMuted }}>
              {theme.isDark ? "DARK" : "LIGHT"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ThemeShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % themes.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 overflow-hidden" id="themes">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 rounded-full border border-dark-700 bg-dark-900/50 text-xs font-medium text-dark-100">
            <span>🎨</span>
            <span>{themes.length} themes · light & dark</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Make it yours
          </h2>
          <p className="text-dark-100 text-lg max-w-xl mx-auto">
            Choose from {themes.length}+ built-in themes. Switch between light and dark,
            from Paper to Dracula to Synthwave — instantly, anytime.
          </p>
        </div>

        {/* Theme Carousel */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative" style={{ paddingBottom: "65%" }}>
            {themes.map((theme, i) => (
              <ThemeCard key={theme.id} theme={theme} isVisible={i === activeIndex} />
            ))}
          </div>
        </div>

        {/* Theme dots / nav */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {themes.map((theme, i) => (
            <button
              key={theme.id}
              onClick={() => setActiveIndex(i)}
              className={`transition-all duration-300 rounded-full ${
                i === activeIndex
                  ? "w-8 h-2 bg-tactical-500"
                  : "w-2 h-2 bg-dark-400 hover:bg-dark-300"
              }`}
              title={theme.name}
            />
          ))}
        </div>

        {/* Theme names grid */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
          {themes.map((theme, i) => (
            <button
              key={theme.id}
              onClick={() => setActiveIndex(i)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                i === activeIndex
                  ? "border-tactical-500 bg-tactical-500/10 text-tactical-400"
                  : "border-dark-700 bg-dark-900/30 text-dark-200 hover:border-dark-600 hover:text-dark-100"
              }`}
            >
              <div
                className="w-3 h-3 rounded-full shrink-0 border"
                style={{
                  backgroundColor: theme.accent[5],
                  borderColor: theme.accent[6],
                }}
              />
              <span className="truncate">{theme.name}</span>
              {theme.isDark ? (
                <Moon size={10} className="ml-auto shrink-0 opacity-40" />
              ) : (
                <Sun size={10} className="ml-auto shrink-0 opacity-40" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
