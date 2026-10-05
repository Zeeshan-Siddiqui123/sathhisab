import { Badge as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Badge; accepts the underlying accessible control's props. */
export function Badge({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("", className)} />;
}
