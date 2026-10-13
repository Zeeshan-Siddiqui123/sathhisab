import React, { forwardRef } from "react";
import { cn } from "@/lib/cn";

export type SurfaceVariant = "raised" | "inset" | "pressed" | "flat";
export type SurfaceLevel = "xs" | "sm" | "md" | "lg";
export type SurfaceRadius = "control" | "card" | "sheet" | "full";

export interface SurfaceProps extends React.HTMLAttributes<HTMLElement> {
  variant?: SurfaceVariant;
  level?: SurfaceLevel;
  radius?: SurfaceRadius;
  interactive?: boolean;
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}

const variantLevelClasses: Record<SurfaceVariant, Record<SurfaceLevel, string>> = {
  raised: {
    xs: "nm-raised-xs",
    sm: "nm-raised-sm",
    md: "nm-raised-md",
    lg: "nm-raised-lg",
  },
  inset: {
    xs: "nm-inset-sm",
    sm: "nm-inset-sm",
    md: "nm-inset-md",
    lg: "nm-inset-md",
  },
  pressed: {
    xs: "nm-pressed",
    sm: "nm-pressed",
    md: "nm-pressed",
    lg: "nm-pressed",
  },
  flat: {
    xs: "nm-flat",
    sm: "nm-flat",
    md: "nm-flat",
    lg: "nm-flat",
  },
};

const radiusClasses: Record<SurfaceRadius, string> = {
  control: "rounded-[16px]",
  card: "rounded-[24px]",
  sheet: "rounded-[28px]",
  full: "rounded-full",
};

const interactiveHoverClasses: Record<SurfaceLevel, string> = {
  xs: "hover:shadow-[var(--nm-raised-sm)]",
  sm: "hover:shadow-[var(--nm-raised-md)]",
  md: "hover:shadow-[var(--nm-raised-lg)]",
  lg: "hover:shadow-[var(--nm-raised-lg)]",
};

export const Surface = forwardRef<HTMLElement, SurfaceProps>(function Surface(
  {
    variant = "raised",
    level = "md",
    radius = "card",
    interactive = false,
    as: Component = "div",
    className,
    children,
    ...props
  },
  ref
) {
  const variantClass = variantLevelClasses[variant]?.[level] ?? "nm-raised-md";
  const radiusClass = radiusClasses[radius] ?? "rounded-[24px]";

  const interactiveClass = interactive
    ? cn(
        "cursor-pointer transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[3px]",
        variant === "raised" && interactiveHoverClasses[level],
        "active:shadow-[var(--nm-pressed)] active:scale-[0.99]"
      )
    : "";

  return (
    <Component
      ref={ref as any}
      className={cn(
        "bg-nm-bg text-foreground",
        variantClass,
        radiusClass,
        interactiveClass,
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
