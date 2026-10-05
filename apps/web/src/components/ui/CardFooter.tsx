import { CardFooter as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed CardFooter; accepts the underlying accessible control's props. */
export function CardFooter({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("gap-3 p-6", className)} />;
}
