import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import { heroui } from "@heroui/react";
import { tokens } from "./src/theme/tokens";
import { heroUIThemeConfig } from "./src/theme/heroui";

const neumorphismPlugin = plugin(function ({ addUtilities }) {
  addUtilities({
    ".nm-flat": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "none",
    },
    ".nm-raised-xs": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "var(--nm-raised-xs)",
    },
    ".nm-raised-sm": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "var(--nm-raised-sm)",
    },
    ".nm-raised-md": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "var(--nm-raised-md)",
    },
    ".nm-raised-lg": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "var(--nm-raised-lg)",
    },
    ".nm-inset-sm": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "var(--nm-inset-sm)",
    },
    ".nm-inset-md": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "var(--nm-inset-md)",
    },
    ".nm-pressed": {
      backgroundColor: "var(--nm-bg)",
      boxShadow: "var(--nm-pressed)",
    },
    ".nm-hairline": {
      borderColor: "var(--hairline)",
      borderWidth: "1px",
      borderStyle: "solid",
    },
    ".nm-border-soft": {
      borderColor: "var(--border-soft)",
      borderWidth: "1px",
      borderStyle: "solid",
    },
  });
});

export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}",
    "../../node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      maxWidth: { page: "1120px", form: "640px" },
      padding: { safe: "env(safe-area-inset-bottom)" },
      colors: {
        "nm-bg": "var(--nm-bg)",
        background: "var(--nm-bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        "border-soft": "var(--border-soft)",
        hairline: "var(--hairline)",
        foreground: "var(--foreground)",
        muted: "var(--muted)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
          soft: "var(--primary-soft)",
        },
        "primary-soft": "var(--primary-soft)",
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
          soft: "var(--success-soft)",
        },
        "success-soft": "var(--success-soft)",
        danger: {
          DEFAULT: "var(--danger)",
          foreground: "var(--danger-foreground)",
          soft: "var(--danger-soft)",
        },
        "danger-soft": "var(--danger-soft)",
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
          soft: "var(--warning-soft)",
        },
        "warning-soft": "var(--warning-soft)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      borderRadius: tokens.radii,
    },
  },
  plugins: [heroui({ themes: heroUIThemeConfig }), neumorphismPlugin],
} satisfies Config;
