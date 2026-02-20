import { Check, PanelLeftOpen } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeSelector({
  onToggleSidebar,
  sidebarOpen,
}: {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}) {
  const { themeId, setThemeId, allThemes } = useTheme();

  const lightThemes = allThemes.filter((t) => !t.isDark);
  const darkThemes = allThemes.filter((t) => t.isDark);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 h-14 px-4 border-b border-dark-500 bg-dark-800/50 shrink-0">
        {!sidebarOpen && (
          <button
            onClick={onToggleSidebar}
            className="p-1.5 text-dark-100 hover:text-dark-50 hover:bg-dark-600 rounded-lg transition-colors"
          >
            <PanelLeftOpen size={18} />
          </button>
        )}
        <span className="text-base">🎨</span>
        <h1 className="text-sm font-semibold">Themes</h1>
        <span className="text-xs text-dark-200">{allThemes.length} themes</span>
      </div>

      {/* Theme Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
          {/* Light Themes */}
          <div>
            <h2 className="text-xs font-medium text-dark-200 uppercase tracking-wider mb-4">
              Light Themes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lightThemes.map((t) => (
                <ThemeCard
                  key={t.id}
                  theme={t}
                  isActive={themeId === t.id}
                  onSelect={() => setThemeId(t.id)}
                />
              ))}
            </div>
          </div>

          {/* Dark Themes */}
          <div>
            <h2 className="text-xs font-medium text-dark-200 uppercase tracking-wider mb-4">
              Dark Themes
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {darkThemes.map((t) => (
                <ThemeCard
                  key={t.id}
                  theme={t}
                  isActive={themeId === t.id}
                  onSelect={() => setThemeId(t.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeCard({
  theme,
  isActive,
  onSelect,
}: {
  theme: {
    id: string;
    name: string;
    author: string;
    isDark: boolean;
    surface: string[];
    accent: string[];
  };
  isActive: boolean;
  onSelect: () => void;
}) {
  // surface: [0]=text, [5]=border, [7]=card, [8]=sidebar, [9]=bg, [10]=pureBg
  // accent: [4]=mid, [5]=base, [6]=dark
  const bg = theme.surface[9];
  const sidebar = theme.surface[8];
  const card = theme.surface[7];
  const border = theme.surface[5];
  const text = theme.surface[0];
  const textMuted = theme.surface[2];
  const accent = theme.accent[5];
  const accentLight = theme.accent[1];

  return (
    <button
      onClick={onSelect}
      className={`relative group text-left rounded-xl border-2 overflow-hidden transition-all duration-200 hover:scale-[1.02] ${
        isActive
          ? "border-tactical-500 shadow-lg shadow-tactical-500/10"
          : "border-dark-500 hover:border-dark-400"
      }`}
    >
      {/* Mini Preview */}
      <div className="h-36 flex" style={{ backgroundColor: bg }}>
        {/* Sidebar preview */}
        <div
          className="w-14 flex flex-col items-center gap-1.5 py-3 border-r"
          style={{ backgroundColor: sidebar, borderColor: border }}
        >
          <div
            className="w-6 h-1.5 rounded-full"
            style={{ backgroundColor: accent }}
          />
          <div
            className="w-7 h-1.5 rounded-full opacity-60"
            style={{ backgroundColor: textMuted }}
          />
          <div
            className="w-5 h-1.5 rounded-full opacity-40"
            style={{ backgroundColor: textMuted }}
          />
          <div
            className="w-6 h-1.5 rounded-full opacity-40"
            style={{ backgroundColor: textMuted }}
          />
        </div>

        {/* Content area */}
        <div className="flex-1 p-3 flex flex-col gap-2">
          {/* Header bar */}
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <div
              className="w-16 h-1.5 rounded-full"
              style={{ backgroundColor: text, opacity: 0.7 }}
            />
          </div>

          {/* List items */}
          <div className="flex-1 space-y-1.5">
            {[0.8, 0.6, 0.5, 0.4].map((opacity, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-md px-2 py-1.5"
                style={{
                  backgroundColor: card,
                  borderColor: border,
                  border: "1px solid",
                }}
              >
                <div
                  className="w-3 h-3 rounded-sm border-2 shrink-0"
                  style={{
                    borderColor: i === 0 ? accent : textMuted,
                    backgroundColor: i === 0 ? accent : "transparent",
                  }}
                />
                <div
                  className="h-1.5 rounded-full flex-1"
                  style={{ backgroundColor: text, opacity }}
                />
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex items-center gap-2">
            <div
              className="h-5 flex-1 rounded-md"
              style={{ backgroundColor: card, border: `1px solid ${border}` }}
            />
            <div
              className="h-5 px-3 rounded-md flex items-center"
              style={{ backgroundColor: accent }}
            >
              <div
                className="w-3 h-1 rounded-full"
                style={{ backgroundColor: theme.isDark ? "#fff" : "#fff" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        className="px-3 py-2.5 border-t flex items-center justify-between"
        style={{ backgroundColor: sidebar, borderColor: border }}
      >
        <div>
          <div className="text-xs font-semibold" style={{ color: text }}>
            {theme.name}
          </div>
          <div className="text-[10px]" style={{ color: textMuted }}>
            {theme.author}
          </div>
        </div>
        {isActive && (
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: accent }}
          >
            <Check size={12} color="#fff" />
          </div>
        )}
      </div>
    </button>
  );
}
