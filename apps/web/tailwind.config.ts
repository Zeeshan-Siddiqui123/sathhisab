import type { Config } from "tailwindcss";
import { heroui } from "@heroui/react";
import { tokens } from "./src/theme/tokens";
import { heroUIThemeConfig } from "./src/theme/heroui";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}", "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      maxWidth: { page: "1120px", form: "640px" },
      padding: { safe: "env(safe-area-inset-bottom)" },
      colors: { surface: "var(--surface)", border: "var(--border)", muted: "var(--muted)" },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: tokens.radii,
    },
  },
  plugins: [heroui({ themes: heroUIThemeConfig })],
} satisfies Config;
