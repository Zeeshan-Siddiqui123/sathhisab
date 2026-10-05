import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
/** Container primitive; override layout with className. */
export function Container({ className, ...props }: HTMLAttributes<HTMLElement>) { return <div {...props} className={cn("w-full max-w-screen-lg mx-auto px-4 md:px-6 lg:px-8", className)} />; }
