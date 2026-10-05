import { Progress as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed ProgressBar; accepts the underlying accessible control's props. */
export function ProgressBar({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("", className)} />;
}
