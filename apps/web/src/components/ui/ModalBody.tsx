import { ModalBody as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed ModalBody; accepts the underlying accessible control's props. */
export function ModalBody({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("gap-4", className)} />;
}
