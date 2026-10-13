import { useState } from "react";
import { Sparkles, Layers, CheckCircle2, AlertCircle, Info, HandMetal, Touchpad } from "lucide-react";
import { Surface } from "@/components/ui/Surface";
import { Text } from "@/components/ui/Text";
import { Heading } from "@/components/ui/Heading";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { EffectsToggle } from "@/components/shared/EffectsToggle";
import { useTheme } from "@/app/providers";

export function NeumorphismSection() {
  const { theme, effects } = useTheme();
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner & Controls */}
      <Surface
        variant="raised"
        level="md"
        radius="card"
        className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary-soft text-primary">
            <Sparkles size={14} /> Accessible Hybrid Neumorphism
          </div>
          <Heading level={2}>Surface System & Elevation Tokens</Heading>
          <Text muted size="sm" className="max-w-xl">
            Single light source (top-left). Containers and controls are raised, inputs and tracks are inset,
            dense data remains flat. Accessible fallback switches to flat with zero soft shadows.
          </Text>
        </div>

        <div className="flex items-center gap-4 bg-nm-bg p-3 rounded-control border border-border-soft">
          <div className="flex items-center gap-2">
            <ThemeToggle aria-label="Toggle demo theme" />
            <span className="text-xs font-medium text-muted">
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </div>
          <div className="h-6 w-px bg-border-soft" />
          <div className="flex items-center gap-2">
            <EffectsToggle />
            <span className="text-xs font-medium text-muted">
              {effects === "soft" ? "Soft" : "Flat"}
            </span>
          </div>
        </div>
      </Surface>

      {/* 1. Raised Elevation Levels */}
      <section className="space-y-4">
        <div>
          <Heading level={3}>1. Raised Elevation (Containers & Actionable Shapes)</Heading>
          <Text size="sm" muted>
            Light on top-left, depth shadow on bottom-right. Used for cards, panels, modals, and buttons.
          </Text>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Surface variant="raised" level="xs" radius="card" className="p-6 flex flex-col justify-between h-40">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Level XS</span>
              <Text className="font-semibold text-lg mt-1">Raised XS</Text>
            </div>
            <p className="text-xs text-muted">3px blur · Subtle elevation for small controls & avatars</p>
          </Surface>

          <Surface variant="raised" level="sm" radius="card" className="p-6 flex flex-col justify-between h-40">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Level SM</span>
              <Text className="font-semibold text-lg mt-1">Raised SM</Text>
            </div>
            <p className="text-xs text-muted">5px blur · Buttons, chips & floating badges</p>
          </Surface>

          <Surface variant="raised" level="md" radius="card" className="p-6 flex flex-col justify-between h-40">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Level MD</span>
              <Text className="font-semibold text-lg mt-1">Raised MD (Default)</Text>
            </div>
            <p className="text-xs text-muted">8px blur · Standard cards, hero widgets & groups</p>
          </Surface>

          <Surface variant="raised" level="lg" radius="card" className="p-6 flex flex-col justify-between h-40">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Level LG</span>
              <Text className="font-semibold text-lg mt-1">Raised LG</Text>
            </div>
            <p className="text-xs text-muted">12px blur · Modals, drawers & floating navigation</p>
          </Surface>
        </div>
      </section>

      {/* 2. Inset & Pressed Surfaces */}
      <section className="space-y-4">
        <div>
          <Heading level={3}>2. Inset & Pressed (Inputs, Tracks & Active States)</Heading>
          <Text size="sm" muted>
            Light on bottom-right, shadow on top-left (inverted light). Denotes typing areas, sliders, or pressed states.
          </Text>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Surface variant="inset" level="sm" radius="control" className="p-6 flex flex-col justify-between h-36 nm-hairline">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Inset SM</span>
              <Text className="font-semibold text-base mt-1">Inset SM + Hairline</Text>
            </div>
            <p className="text-xs text-muted">Form inputs, search bars & textareas</p>
          </Surface>

          <Surface variant="inset" level="md" radius="control" className="p-6 flex flex-col justify-between h-36 nm-hairline">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-muted">Inset MD</span>
              <Text className="font-semibold text-base mt-1">Inset MD + Hairline</Text>
            </div>
            <p className="text-xs text-muted">Progress gauge tracks & deep wells</p>
          </Surface>

          <Surface variant="pressed" radius="control" className="p-6 flex flex-col justify-between h-36">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Pressed State</span>
              <Text className="font-semibold text-base mt-1">Pressed / Active</Text>
            </div>
            <p className="text-xs text-muted">Active button state & selected segmented item</p>
          </Surface>
        </div>
      </section>

      {/* 3. Radius Hierarchy */}
      <section className="space-y-4">
        <div>
          <Heading level={3}>3. Radius Hierarchy</Heading>
          <Text size="sm" muted>
            Standardized geometric radii specified in Section 3.4 of the redesign plan.
          </Text>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Surface variant="raised" level="sm" radius="control" className="p-5 text-center">
            <Text className="font-semibold">Control (16px)</Text>
            <p className="text-xs text-muted mt-1">Buttons & inputs</p>
          </Surface>

          <Surface variant="raised" level="sm" radius="card" className="p-5 text-center">
            <Text className="font-semibold">Card (24px)</Text>
            <p className="text-xs text-muted mt-1">Standard cards</p>
          </Surface>

          <Surface variant="raised" level="sm" radius="sheet" className="p-5 text-center">
            <Text className="font-semibold">Sheet (28px)</Text>
            <p className="text-xs text-muted mt-1">Modals & sheets</p>
          </Surface>

          <Surface variant="raised" level="sm" radius="full" className="p-5 text-center">
            <Text className="font-semibold">Full (Pill)</Text>
            <p className="text-xs text-muted mt-1">Avatars & FAB</p>
          </Surface>
        </div>
      </section>

      {/* 4. Interactive Tactile Surfaces */}
      <section className="space-y-4">
        <div>
          <Heading level={3}>4. Interactive Tactile Feedback</Heading>
          <Text size="sm" muted>
            Hover lifts one level up (md → lg). Click depresses into inset shadow with 0.99 scale.
          </Text>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Surface
            variant="raised"
            level="sm"
            radius="control"
            interactive
            onClick={() => setClickCount((c) => c + 1)}
            className="p-6 flex items-center justify-between"
          >
            <div>
              <Text className="font-semibold">Interactive Button</Text>
              <p className="text-xs text-muted">Click to depress ({clickCount} clicks)</p>
            </div>
            <HandMetal className="text-primary" size={24} />
          </Surface>

          <Surface
            variant="raised"
            level="md"
            radius="card"
            interactive
            className="p-6 flex items-center justify-between"
          >
            <div>
              <Text className="font-semibold">Interactive Card</Text>
              <p className="text-xs text-muted">Hover to lift, click to press</p>
            </div>
            <Touchpad className="text-primary" size={24} />
          </Surface>

          <Surface
            variant="flat"
            radius="control"
            className="p-6 flex items-center justify-between border border-border-soft"
          >
            <div>
              <Text className="font-semibold">Flat Surface</Text>
              <p className="text-xs text-muted">For dense data & tables</p>
            </div>
            <Layers className="text-muted" size={24} />
          </Surface>
        </div>
      </section>

      {/* 5. Non-Shadow Cue Affordances */}
      <section className="space-y-4">
        <div>
          <Heading level={3}>5. Non-Shadow Cue Affordance (WCAG Compliance)</Heading>
          <Text size="sm" muted>
            Every interactive control carries a non-shadow cue (hairline border, tinted pill, text, or icon).
          </Text>
        </div>

        <Surface variant="raised" level="md" radius="card" className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-control bg-success-soft text-success border border-border-soft">
              <CheckCircle2 size={18} />
              <div>
                <Text size="sm" className="font-semibold text-success">Positive Balance</Text>
                <p className="text-xs text-success/80">You get back · green tint</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-control bg-danger-soft text-danger border border-border-soft">
              <AlertCircle size={18} />
              <div>
                <Text size="sm" className="font-semibold text-danger">Negative Balance</Text>
                <p className="text-xs text-danger/80">You owe · red tint</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-control bg-warning-soft text-warning border border-border-soft">
              <Info size={18} />
              <div>
                <Text size="sm" className="font-semibold text-warning">Pending Action</Text>
                <p className="text-xs text-warning/80">Settlement awaiting confirmation</p>
              </div>
            </div>
          </div>
        </Surface>
      </section>
    </div>
  );
}
