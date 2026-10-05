import { ModalFooter as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed ModalFooter; accepts the underlying accessible control's props. */
export function ModalFooter({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("gap-3", className)} />;
}
