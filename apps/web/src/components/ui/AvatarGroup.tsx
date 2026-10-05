import { AvatarGroup as Base } from "@heroui/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Themed AvatarGroup; accepts the underlying accessible control's props. */
export function AvatarGroup({ className, ...props }: ComponentProps<typeof Base>) {
 return <Base  {...props} className={cn("", className)} />;
}
