import { CardBody as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed CardBody; accepts the underlying accessible control's props. */
export function CardBody({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("gap-4 p-6", className)} />;
}
