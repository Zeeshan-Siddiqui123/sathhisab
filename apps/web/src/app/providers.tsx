import React, { createContext, useContext, useEffect, useState } from "react";
import { UIProvider } from "../components/ui/UIProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export type EffectsMode = "soft" | "flat";

interface EffectsContextType {
  effects: EffectsMode;
  toggleEffects: () => void;
  setEffects: (effects: EffectsMode) => void;
}

const EffectsContext = createContext<EffectsContextType | undefined>(undefined);

export function EffectsProvider({ children }: { children: React.ReactNode }) {
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
    root.classList.remove("dark");
    root.style.colorScheme = "light";
    try {
      localStorage.removeItem("saathhisab_theme");
    } catch {
      // ignore localStorage access errors
    }
  }, []);

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

  const toggleEffects = () => {
    setEffectsState((prev) => (prev === "soft" ? "flat" : "soft"));
  };

  const setEffects = (newEffects: EffectsMode) => {
    setEffectsState(newEffects);
  };

  return (
    <EffectsContext.Provider
      value={{
        effects,
        toggleEffects,
        setEffects,
      }}
    >
      {children}
    </EffectsContext.Provider>
  );
}

export function useEffects() {
  const context = useContext(EffectsContext);
  if (!context) {
    throw new Error("useEffects must be used within an EffectsProvider");
  }
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <EffectsProvider>
        <UIProvider>{children}</UIProvider>
      </EffectsProvider>
    </QueryClientProvider>
  );
}
