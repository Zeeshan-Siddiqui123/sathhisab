import { Sparkles, Layers } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme } from "@/app/providers";

/** Persisted Neumorphic Effects toggle (Soft / Flat) */
export function EffectsToggle({ className }: { className?: string }) {
  const { effects, toggleEffects } = useTheme();

  return (
    <IconButton
      className={className}
      aria-label={`Switch to ${effects === "soft" ? "Flat" : "Soft"} effects`}
      aria-pressed={effects === "flat"}
      onPress={toggleEffects}
    >
      {effects === "soft" ? <Sparkles size={20} /> : <Layers size={20} />}
    </IconButton>
  );
}
