export const tokens = {
  colors: {
    // Neumorphic background and surfaces
    nmBg: {
      light: "#E6EBF2",
      dark: "#1C222B",
    },
    nmLight: {
      light: "rgba(255, 255, 255, 0.90)",
      dark: "rgba(255, 255, 255, 0.045)",
    },
    nmDark: {
      light: "rgba(163, 177, 198, 0.55)",
      dark: "rgba(0, 0, 0, 0.55)",
    },
    primary: {
      light: "#0B7F70",
      foreground: {
        light: "#FFFFFF",
        dark: "#06201C",
      },
      hover: "#09675B",
      soft: {
        light: "#D5EFEA",
        dark: "#173B37",
      },
      dark: "#2CC5AF",
    },
    secondary: {
      light: "#4F46E5",
      dark: "#818CF8",
    },
    success: {
      light: "#166534",
      foreground: {
        light: "#FFFFFF",
        dark: "#06201C",
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
        dark: "#1C222B",
      },
      soft: {
        light: "#FEF3C7",
        dark: "#3A2B0C",
      },
      dark: "#FBBF24",
    },
    background: {
      light: "#E6EBF2",
      dark: "#1C222B",
    },
    surface: {
      light: "#E6EBF2",
      dark: "#1C222B",
    },
    hairline: {
      light: "#6B7588",
      dark: "#7C8799",
    },
    borderSoft: {
      light: "rgba(15, 23, 42, 0.10)",
      dark: "rgba(255, 255, 255, 0.10)",
    },
    border: {
      light: "rgba(15, 23, 42, 0.10)",
      dark: "rgba(255, 255, 255, 0.10)",
    },
    foreground: {
      light: "#1E293B",
      dark: "#E6EAF0",
    },
    muted: {
      light: "#5B6577",
      dark: "#9AA6B8",
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
