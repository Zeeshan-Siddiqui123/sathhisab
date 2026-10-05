import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
/** VisuallyHidden primitive; override layout with className. */
export function VisuallyHidden({ className, ...props }: HTMLAttributes<HTMLElement>) { return <span {...props} className={cn("sr-only", className)} />; }
