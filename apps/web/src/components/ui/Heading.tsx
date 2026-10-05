import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
/** Semantic heading level independent of page composition. */
export function Heading({ level = 2, className, ...props }: HTMLAttributes<HTMLHeadingElement> & { level?: 1 | 2 | 3 | 4 }) {
 const Tag = (["h1", "h2", "h3", "h4"] as const)[level - 1];
 return <Tag {...props} className={cn("font-display font-semibold tracking-tight", { 1: "text-3xl sm:text-4xl", 2: "text-2xl", 3: "text-xl", 4: "text-lg" }[level], className)} />;
}
