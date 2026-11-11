export const tokens = {
  colors: {
    // Shared neutral canvas and flat surfaces
    nmBg: {
      light: "#F4F5F7",
      dark: "#0B0B0B",
    },
    nmLight: {
      light: "#FFFFFF",
      dark: "rgba(255, 255, 255, 0.045)",
    },
    nmDark: {
      light: "rgba(15, 15, 16, 0.04)",
      dark: "rgba(0, 0, 0, 0.55)",
    },
    primary: {
      light: "#C8F23A",
      foreground: {
        light: "#0F0F10",
        dark: "#0F0F10",
      },
      hover: "#B6E02A",
      soft: {
        light: "rgba(200, 242, 58, 0.35)",
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
        dark: "#292321",
      },
      soft: {
        light: "#FEF3C7",
        dark: "#3A2B0C",
      },
      dark: "#FBBF24",
    },
    background: {
      light: "#F4F5F7",
      dark: "#0B0B0B",
    },
    surface: {
      light: "#FFFFFF",
      dark: "#292321",
    },
    hairline: {
      light: "#ECEDEF",
      dark: "#7E9084",
    },
    borderSoft: {
      light: "#ECEDEF",
      dark: "rgba(255, 255, 255, 0.10)",
    },
    border: {
      light: "#ECEDEF",
      dark: "rgba(255, 255, 255, 0.10)",
    },
    foreground: {
      light: "#0F0F10",
      dark: "#EAF2EC",
    },
    muted: {
      light: "#71757D",
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
    control: "14px",
    input: "12px",
    card: "20px",
    modal: "20px",
    sheet: "20px",
    full: "999px",
  },
} as const;
