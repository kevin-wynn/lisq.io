import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeDefinition } from "../lib/themes";
import { applyTheme, getTheme, themes } from "../lib/themes";

interface ThemeContextValue {
  themeId: string;
  theme: ThemeDefinition;
  setThemeId: (id: string) => void;
  allThemes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId: "paper",
  theme: themes[0],
  setThemeId: () => {},
  allThemes: themes,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("lisq-theme") || "paper";
    }
    return "paper";
  });

  const theme = getTheme(themeId);

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("lisq-theme", themeId);
  }, [themeId, theme]);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, theme, setThemeId, allThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
