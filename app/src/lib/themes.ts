export interface ThemeDefinition {
  id: string;
  name: string;
  author: string;
  isDark: boolean;
  // Surface: [50..950] — 50=primary text, 950=purest background
  surface: string[];
  // Accent: [50..950] — standard scale, 500=base
  accent: string[];
}

const SCALE_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export function hexToRgb(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r} ${g} ${b}`;
}

export function applyTheme(theme: ThemeDefinition) {
  const root = document.documentElement;
  SCALE_KEYS.forEach((key, i) => {
    root.style.setProperty(`--s-${key}`, hexToRgb(theme.surface[i]));
    root.style.setProperty(`--t-${key}`, hexToRgb(theme.accent[i]));
  });
}

export const themes: ThemeDefinition[] = [
  // ─── LIGHT THEMES ────────────────────────────────────────
  {
    id: "paper",
    name: "Paper",
    author: "LISQ",
    isDark: false,
    surface: ["#1c1917", "#57534e", "#78716c", "#a8a29e", "#d6d3d1", "#e7e5e4", "#f0efed", "#f5f4f2", "#faf9f7", "#fdfcfb", "#ffffff"],
    accent:  ["#eef2ff", "#e0e7ff", "#c7d2fe", "#a5b4fc", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81", "#1e1b4b"],
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
    id: "solarized-light",
    name: "Solarized Light",
    author: "Ethan Schoonover",
    isDark: false,
    surface: ["#073642", "#586e75", "#657b83", "#839496", "#93a1a1", "#d3cbb7", "#e6dfcc", "#eee8d5", "#f5efdc", "#faf4e6", "#fdf6e3"],
    accent:  ["#e1f0f8", "#c2e1f0", "#91c8e4", "#5cafd5", "#3999ca", "#268bd2", "#1e73b0", "#165b8e", "#10456d", "#0a304e", "#051c30"],
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
    id: "ayu-light",
    name: "Ayu Light",
    author: "Ayu",
    isDark: false,
    surface: ["#575f66", "#6c7680", "#828c96", "#98a1aa", "#b8bec4", "#d2d6db", "#e7e9ec", "#f0f1f3", "#f5f6f7", "#f8f9fa", "#fafafa"],
    accent:  ["#fff0e0", "#ffddb3", "#ffc580", "#ffad4d", "#ff9f33", "#ff9940", "#e07a20", "#b85e10", "#904508", "#6b3004", "#452000"],
  },
  {
    id: "gruvbox-light",
    name: "Gruvbox Light",
    author: "morhetz",
    isDark: false,
    surface: ["#3c3836", "#504945", "#665c54", "#7c6f64", "#928374", "#bdae93", "#d5c4a1", "#ebdbb2", "#f2e5bc", "#f9f5d7", "#fbf1c7"],
    accent:  ["#fde5cc", "#fccfa0", "#fab474", "#f89748", "#f67c1e", "#d65d0e", "#b84e0a", "#9a4008", "#7c3306", "#5e2604", "#401a02"],
  },
  // ─── DARK THEMES ─────────────────────────────────────────
  {
    id: "one-dark",
    name: "One Dark Pro",
    author: "binaryify",
    isDark: true,
    surface: ["#abb2bf", "#8b919d", "#6b727e", "#5c6370", "#4b5263", "#3e4452", "#353b45", "#2c313a", "#282c34", "#21252b", "#1b1f25"],
    accent:  ["#edf5fd", "#d4e8fb", "#aed2f7", "#88bcf3", "#74b2f1", "#61afef", "#4d96d8", "#3a7dba", "#2c639a", "#1f4a7a", "#13315c"],
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
    id: "github-dark",
    name: "GitHub Dark",
    author: "GitHub",
    isDark: true,
    surface: ["#e6edf3", "#b1bac4", "#8b949e", "#6e7681", "#484f58", "#30363d", "#262b32", "#1c2128", "#161b22", "#0d1117", "#090c10"],
    accent:  ["#ddf4ff", "#b6e3ff", "#80ccff", "#54aeff", "#388bfd", "#1f6feb", "#1a5cc8", "#184ca5", "#143d82", "#102e60", "#0b2040"],
  },
  {
    id: "monokai",
    name: "Monokai Pro",
    author: "Monokai",
    isDark: true,
    surface: ["#fcfcfa", "#d9d6cf", "#b0ada6", "#908e87", "#727068", "#585650", "#484640", "#3a3836", "#2d2a2e", "#252226", "#1d1a1e"],
    accent:  ["#f0fbe4", "#dcf5c1", "#c0ec90", "#a9dc76", "#90d050", "#78c038", "#63a82e", "#4e8f24", "#3b771c", "#285f14", "#18480c"],
  },
  {
    id: "solarized-dark",
    name: "Solarized Dark",
    author: "Ethan Schoonover",
    isDark: true,
    surface: ["#fdf6e3", "#eee8d5", "#c4bfb0", "#93a1a1", "#839496", "#586e75", "#3f5a61", "#073642", "#063340", "#002b36", "#00212a"],
    accent:  ["#e1f0f8", "#c2e1f0", "#91c8e4", "#5cafd5", "#3999ca", "#268bd2", "#1e73b0", "#165b8e", "#10456d", "#0a304e", "#051c30"],
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
    id: "catppuccin-mocha",
    name: "Catppuccin Mocha",
    author: "Catppuccin",
    isDark: true,
    surface: ["#cdd6f4", "#bac2de", "#a6adc8", "#9399b2", "#7f849c", "#6c7086", "#585c70", "#45475a", "#313244", "#1e1e2e", "#181825"],
    accent:  ["#f5eefe", "#e8d8fd", "#d8c0fb", "#cba6f7", "#b78af2", "#a370ec", "#8c58d6", "#7542c0", "#5e30aa", "#482094", "#33127e"],
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
    id: "gruvbox-dark",
    name: "Gruvbox Dark",
    author: "morhetz",
    isDark: true,
    surface: ["#ebdbb2", "#d5c4a1", "#bdae93", "#a89984", "#928374", "#7c6f64", "#665c54", "#504945", "#3c3836", "#282828", "#1d2021"],
    accent:  ["#fde5cc", "#fccfa0", "#fab474", "#f89748", "#f67c1e", "#d65d0e", "#b84e0a", "#9a4008", "#7c3306", "#5e2604", "#401a02"],
  },
  {
    id: "palenight",
    name: "Palenight",
    author: "Palenight",
    isDark: true,
    surface: ["#d6deeb", "#bfc7d5", "#a6b2c4", "#8892a8", "#676e95", "#4e5579", "#434869", "#3a3f58", "#2f3447", "#292d3e", "#222536"],
    accent:  ["#f6edfc", "#ead6f8", "#dcbbf4", "#cea0ee", "#c792ea", "#b878de", "#a060d0", "#884ac0", "#7036b0", "#5824a0", "#401490"],
  },
  {
    id: "ayu-dark",
    name: "Ayu Dark",
    author: "Ayu",
    isDark: true,
    surface: ["#bfbdb6", "#a5a29c", "#8a8882", "#73716c", "#565450", "#3e3e3c", "#2c2c2a", "#1c1c1a", "#151514", "#0b0e14", "#070a10"],
    accent:  ["#fff2e0", "#ffe0b3", "#ffc980", "#ffb454", "#f5a040", "#e08c30", "#c47420", "#a85e14", "#8c480a", "#703504", "#542400"],
  },
  {
    id: "synthwave",
    name: "Synthwave '84",
    author: "Robb Owen",
    isDark: true,
    surface: ["#ffffff", "#ddd8e8", "#b6b0c8", "#908aa8", "#6e6888", "#504a6e", "#423c5e", "#36304e", "#2a2540", "#262335", "#1e1a2e"],
    accent:  ["#ffe8f8", "#ffc8ee", "#ffa5e2", "#ff88d8", "#ff7edb", "#f564c4", "#dc4aae", "#c23498", "#a82082", "#8e106c", "#740058"],
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
    id: "vitesse-dark",
    name: "Vitesse Dark",
    author: "Anthony Fu",
    isDark: true,
    surface: ["#dbd7ca", "#c0bdb0", "#a5a296", "#8a877c", "#6e6c62", "#484744", "#383736", "#282828", "#1e1e1e", "#181818", "#121212"],
    accent:  ["#e5f2ec", "#c0e0d2", "#90c8b0", "#6ab494", "#549e80", "#4d9375", "#3f7d62", "#326750", "#265140", "#1b3c30", "#122820"],
  },
];

export function getTheme(id: string): ThemeDefinition {
  return themes.find((t) => t.id === id) || themes[0];
}
