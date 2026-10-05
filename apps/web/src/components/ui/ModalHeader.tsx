import { ModalHeader as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed ModalHeader; accepts the underlying accessible control's props. */
export function ModalHeader({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("font-display text-xl", className)} />;
}
