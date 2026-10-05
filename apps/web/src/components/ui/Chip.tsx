import { Chip as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Chip; accepts the underlying accessible control's props. */
export function Chip({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base variant="flat" {...props} className={cn("font-medium", className)} />;
}
