import { Skeleton as HeroSkeleton } from "@heroui/react";
import { cn } from "@/lib/cn";
/** Loading placeholders for text, avatars or cards. */
export function Skeleton({ variant = "line", className }: { variant?: "line" | "circle" | "card"; className?: string }) {
 return <HeroSkeleton aria-hidden="true" className={cn({ line: "h-4 w-full rounded-input", circle: "h-12 w-12 rounded-full", card: "h-40 w-full rounded-card" }[variant], className)} />;
}
