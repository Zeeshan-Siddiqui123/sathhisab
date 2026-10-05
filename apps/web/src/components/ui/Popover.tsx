import { Popover as HeroPopover, PopoverTrigger, PopoverContent } from "@heroui/react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/cn";
/** Anchored disclosure; use an accessible button for trigger. */
export function Popover({ trigger, children, className }: { trigger: ReactElement; children: ReactNode; className?: string }) {
 return <HeroPopover><PopoverTrigger>{trigger}</PopoverTrigger><PopoverContent className={cn("bg-surface text-foreground p-4 max-w-xs", className)}>{children}</PopoverContent></HeroPopover>;
}
