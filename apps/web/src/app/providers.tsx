import React, { createContext, useContext, useEffect, useState } from "react";
import { UIProvider } from "../components/ui/UIProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { tokens } from "../theme/tokens";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("saathhisab_theme") as Theme;
      if (saved === "light" || saved === "dark") return saved;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    for (const name of ["surface", "border", "muted"] as const) {
      root.style.setProperty(`--${name}`, tokens.colors[name][theme]);
    }
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("saathhisab_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UIProvider>{children}</UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
