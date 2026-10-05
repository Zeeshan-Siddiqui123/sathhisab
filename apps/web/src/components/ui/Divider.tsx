import { Divider as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Divider; accepts the underlying accessible control's props. */
export function Divider({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("bg-border", className)} />;
}
