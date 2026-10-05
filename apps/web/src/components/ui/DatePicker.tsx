import { DateInput as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed DatePicker; accepts the underlying accessible control's props. */
export function DatePicker({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base variant="bordered" labelPlacement="outside" {...props} className={cn("min-w-0", className)} />;
}
