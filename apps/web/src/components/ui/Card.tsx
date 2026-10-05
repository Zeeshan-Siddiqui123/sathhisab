import { Card as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Card; accepts the underlying accessible control's props. */
export function Card({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base shadow="none" {...props} className={cn("bg-surface border border-border rounded-card shadow-sm", className)} />;
}
