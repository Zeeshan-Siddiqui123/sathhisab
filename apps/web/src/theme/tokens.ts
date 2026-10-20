export const tokens = {
  colors: {
    // Neumorphic background and surfaces
    nmBg: {
      light: "#F4F6F1",
      dark: "#18211C",
    },
    nmLight: {
      light: "rgba(255, 255, 255, 0.90)",
      dark: "rgba(255, 255, 255, 0.045)",
    },
    nmDark: {
      light: "rgba(157, 174, 160, 0.50)",
      dark: "rgba(0, 0, 0, 0.55)",
    },
    primary: {
      light: "#176B52",
      foreground: {
        light: "#FFFFFF",
        dark: "#10291E",
      },
      hover: "#125640",
      soft: {
        light: "#DCEDE3",
        dark: "#19372A",
      },
      dark: "#62CFA2",
    },
    secondary: {
      light: "#4F46E5",
      dark: "#818CF8",
    },
    success: {
      light: "#166534",
      foreground: {
        light: "#FFFFFF",
        dark: "#10291E",
      },
      soft: {
        light: "#DCFCE7",
        dark: "#12301E",
      },
      dark: "#4ADE80",
    },
    danger: {
      light: "#B91C1C",
      foreground: {
        light: "#FFFFFF",
        dark: "#FFFFFF",
      },
      soft: {
        light: "#FEE2E2",
        dark: "#3A1717",
      },
      dark: "#F87171",
    },
    warning: {
      light: "#92400E",
      foreground: {
        light: "#FFFFFF",
        dark: "#18211C",
      },
      soft: {
        light: "#FEF3C7",
        dark: "#3A2B0C",
      },
      dark: "#FBBF24",
    },
    background: {
      light: "#F4F6F1",
      dark: "#18211C",
    },
    surface: {
      light: "#F4F6F1",
      dark: "#18211C",
    },
    hairline: {
      light: "#6C7B71",
      dark: "#7E9084",
    },
    borderSoft: {
      light: "rgba(27, 48, 36, 0.12)",
      dark: "rgba(255, 255, 255, 0.10)",
    },
    border: {
      light: "rgba(27, 48, 36, 0.12)",
      dark: "rgba(255, 255, 255, 0.10)",
    },
    foreground: {
      light: "#1D2A23",
      dark: "#EAF2EC",
    },
    muted: {
      light: "#53665B",
      dark: "#A5B4AA",
    },
  },
  categories: {
    GROCERY: "#16A34A",
    RENT: "#4F46E5",
    UTILITIES: "#F59E0B",
    INTERNET: "#0EA5E9",
    FOOD: "#EF4444",
    TRANSPORT: "#8B5CF6",
    HOUSEHOLD: "#14B8A6",
    ENTERTAINMENT: "#EC4899",
    OTHER: "#64748B",
  },
  radii: {
    control: "16px",
    input: "16px",
    card: "24px",
    modal: "28px",
    sheet: "28px",
    full: "9999px",
  },
} as const;
