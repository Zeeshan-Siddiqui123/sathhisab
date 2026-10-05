import { Spinner as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Spinner; accepts the underlying accessible control's props. */
export function Spinner({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("", className)} />;
}
