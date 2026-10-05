import { CardHeader as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed CardHeader; accepts the underlying accessible control's props. */
export function CardHeader({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("gap-3 p-6", className)} />;
}
