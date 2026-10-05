import { tokens } from "./tokens";

export const heroUIThemeConfig = {
  light: {
    colors: {
      primary: {
        DEFAULT: tokens.colors.primary.light,
        foreground: "#FFFFFF",
      },
      secondary: {
        DEFAULT: tokens.colors.secondary.light,
        foreground: "#FFFFFF",
      },
      success: {
        DEFAULT: tokens.colors.success.light,
        foreground: "#FFFFFF",
      },
      danger: {
        DEFAULT: tokens.colors.danger.light,
        foreground: "#FFFFFF",
      },
      warning: {
        DEFAULT: tokens.colors.warning.light,
        foreground: "#FFFFFF",
      },
      background: tokens.colors.background.light,
      foreground: tokens.colors.foreground.light,
    },
  },
  dark: {
    colors: {
      primary: {
        DEFAULT: tokens.colors.primary.dark,
        foreground: "#0B0F14",
      },
      secondary: {
        DEFAULT: tokens.colors.secondary.dark,
        foreground: "#0B0F14",
      },
      success: {
        DEFAULT: tokens.colors.success.dark,
        foreground: "#0B0F14",
      },
      danger: {
        DEFAULT: tokens.colors.danger.dark,
        foreground: "#0B0F14",
      },
      warning: {
        DEFAULT: tokens.colors.warning.dark,
        foreground: "#0B0F14",
      },
      background: tokens.colors.background.dark,
      foreground: tokens.colors.foreground.dark,
    },
  },
};
