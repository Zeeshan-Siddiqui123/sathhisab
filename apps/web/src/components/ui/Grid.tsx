import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
/** Grid primitive; override layout with className. */
export function Grid({ className, ...props }: HTMLAttributes<HTMLElement>) { return <div {...props} className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)} />; }
