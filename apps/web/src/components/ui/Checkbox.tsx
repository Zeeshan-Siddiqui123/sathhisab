import { Checkbox as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Checkbox; accepts the underlying accessible control's props. */
export function Checkbox({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("min-h-11", className)} />;
}
