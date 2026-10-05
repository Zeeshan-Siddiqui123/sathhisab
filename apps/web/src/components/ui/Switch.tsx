import { Switch as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Switch; accepts the underlying accessible control's props. */
export function Switch({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("min-h-11", className)} />;
}
