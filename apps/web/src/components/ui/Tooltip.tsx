import { Tooltip as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Tooltip; accepts the underlying accessible control's props. */
export function Tooltip({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("bg-surface text-foreground", className)} />;
}
