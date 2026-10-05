import { Pagination as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed Pagination; accepts the underlying accessible control's props. */
export function Pagination({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base showControls {...props} className={cn("", className)} />;
}
