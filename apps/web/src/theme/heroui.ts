import { tokens } from "./tokens";

export const heroUIThemeConfig = {
  light: {
    colors: {
      primary: {
        DEFAULT: tokens.colors.primary.light,
        foreground: tokens.colors.primary.foreground.light,
      },
      secondary: {
        DEFAULT: tokens.colors.secondary.light,
        foreground: "#FFFFFF",
      },
      success: {
        DEFAULT: tokens.colors.success.light,
        foreground: tokens.colors.success.foreground.light,
      },
      danger: {
        DEFAULT: tokens.colors.danger.light,
        foreground: tokens.colors.danger.foreground.light,
      },
      warning: {
        DEFAULT: tokens.colors.warning.light,
        foreground: tokens.colors.warning.foreground.light,
      },
      background: tokens.colors.nmBg.light,
      foreground: tokens.colors.foreground.light,
      content1: tokens.colors.nmBg.light,
      content2: tokens.colors.nmBg.light,
      content3: tokens.colors.nmBg.light,
      content4: tokens.colors.nmBg.light,
    },
    layout: {
      radius: {
        small: tokens.radii.control,
        medium: tokens.radii.card,
        large: tokens.radii.sheet,
      },
      boxShadow: {
        small: "none",
        medium: "none",
        large: "none",
      },
    },
  },
  dark: {
    colors: {
      primary: {
        DEFAULT: tokens.colors.primary.dark,
        foreground: tokens.colors.primary.foreground.dark,
      },
      secondary: {
        DEFAULT: tokens.colors.secondary.dark,
        foreground: "#0B0F14",
      },
      success: {
        DEFAULT: tokens.colors.success.dark,
        foreground: tokens.colors.success.foreground.dark,
      },
      danger: {
        DEFAULT: tokens.colors.danger.dark,
        foreground: tokens.colors.danger.foreground.dark,
      },
      warning: {
        DEFAULT: tokens.colors.warning.dark,
        foreground: tokens.colors.warning.foreground.dark,
      },
      background: tokens.colors.nmBg.dark,
      foreground: tokens.colors.foreground.dark,
      content1: tokens.colors.nmBg.dark,
      content2: tokens.colors.nmBg.dark,
      content3: tokens.colors.nmBg.dark,
      content4: tokens.colors.nmBg.dark,
    },
    layout: {
      radius: {
        small: tokens.radii.control,
        medium: tokens.radii.card,
        large: tokens.radii.sheet,
      },
      boxShadow: {
        small: "none",
        medium: "none",
        large: "none",
      },
    },
  },
};
