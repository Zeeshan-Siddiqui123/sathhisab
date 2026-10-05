import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
/** Stack primitive; override layout with className. */
export function Stack({ className, ...props }: HTMLAttributes<HTMLElement>) { return <div {...props} className={cn("flex flex-col gap-4", className)} />; }
