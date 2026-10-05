import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
/** Body copy with explicit size and muted tone. */
export function Text({ size = "md", muted, className, ...props }: HTMLAttributes<HTMLParagraphElement> & { size?: "sm" | "md" | "lg"; muted?: boolean }) {
 return <p {...props} className={cn({ sm: "text-sm", md: "text-base", lg: "text-lg" }[size], muted && "text-muted", className)} />;
}
