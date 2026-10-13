import React, { createContext, useContext, useEffect, useState } from "react";
import { UIProvider } from "../components/ui/UIProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { tokens } from "../theme/tokens";

export type Theme = "light" | "dark";
export type EffectsMode = "soft" | "flat";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  effects: EffectsMode;
  toggleEffects: () => void;
  setEffects: (effects: EffectsMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("saathhisab_theme") as Theme;
        if (saved === "light" || saved === "dark") return saved;
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
      } catch {
        // ignore localStorage access errors
      }
    }
    return "light";
  });

  const [effects, setEffectsState] = useState<EffectsMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("saathhisab_effects");
        if (saved === "flat" || saved === "off") return "flat";
      } catch {
        // ignore localStorage access errors
      }
    }
    return "soft";
  });

  useEffect(() => {
    const root = document.documentElement;
    try {
      for (const name of ["surface", "border", "muted"] as const) {
        root.style.setProperty(`--${name}`, tokens.colors[name][theme]);
      }
    } catch {
      // fallback
    }
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    try {
      localStorage.setItem("saathhisab_theme", theme);
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    if (effects === "flat") {
      root.setAttribute("data-nm", "off");
    } else {
      root.setAttribute("data-nm", "on");
    }
    try {
      localStorage.setItem("saathhisab_effects", effects);
    } catch {
      // ignore
    }
  }, [effects]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === "light" ? "dark" : "light"));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleEffects = () => {
    setEffectsState((prev) => (prev === "soft" ? "flat" : "soft"));
  };

  const setEffects = (newEffects: EffectsMode) => {
    setEffectsState(newEffects);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        effects,
        toggleEffects,
        setEffects,
      }}
    >
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

export function useEffects() {
  const { effects, toggleEffects, setEffects } = useTheme();
  return { effects, toggleEffects, setEffects };
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
