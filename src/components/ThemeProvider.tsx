import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};
type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "dark" | "light";
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);
const systemIsDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ditech-ui-theme",
}: ThemeProviderProps) {
  const [theme, updateTheme] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved === "light" || saved === "dark" || saved === "system") return saved;
    } catch { /* A blocked preference store should not prevent switching themes. */ }
    return defaultTheme;
  });
  const [systemDark, setSystemDark] = useState(systemIsDark);
  const resolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setSystemDark(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
    root.style.colorScheme = resolvedTheme;
  }, [resolvedTheme]);

  const setTheme = (next: Theme) => {
    updateTheme(next);
    try { localStorage.setItem(storageKey, next); } catch { /* Keep working for this visit. */ }
  };

  return (
    <ThemeProviderContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
