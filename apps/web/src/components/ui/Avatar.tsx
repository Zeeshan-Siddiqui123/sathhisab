import { Avatar as HeroAvatar, type AvatarProps } from "@heroui/react";
import { cn } from "@/lib/cn";
const colors = ["primary", "secondary", "success", "warning", "danger"] as const;
/** Deterministic name color and initials fallback, including broken image URLs. */
export function Avatar({ name = "", className, ...props }: AvatarProps) {
 const hash = [...name].reduce((sum, c) => sum + c.charCodeAt(0), 0);
 const initials = name.trim().split(/\s+/).slice(0, 2).map(p => p[0]).join("").toUpperCase();
 return <HeroAvatar name={name} showFallback fallback={initials || "?"} color={colors[hash % colors.length]} {...props} className={cn("shrink-0", className)} />;
}
