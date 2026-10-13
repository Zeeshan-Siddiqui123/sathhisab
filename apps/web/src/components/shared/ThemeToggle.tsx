import { Sun, Moon } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme } from "@/app/providers";
import { uiStrings } from "@/lib/uiStrings";
/** Persisted app theme toggle, usable from any shell. */
export function ThemeToggle({ className, "aria-label": ariaLabel }: { className?: string; "aria-label"?: string }) {
  const { theme, toggleTheme } = useTheme();
  return (
    <IconButton
      className={className}
      aria-label={ariaLabel ?? uiStrings.theme}
      aria-pressed={theme === "dark"}
      onPress={toggleTheme}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </IconButton>
  );
}
