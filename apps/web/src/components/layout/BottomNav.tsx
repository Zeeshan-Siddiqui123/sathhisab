import { NavLink } from "react-router-dom";
import type { NavItem } from "@/types/ui";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Five compact mobile destinations; the center item is the primary add action. */
export function BottomNav({ items, className }: { items: NavItem[]; className?: string }) {
 return <nav aria-label={uiStrings.primaryNav} className={cn("md:hidden fixed bottom-0 inset-x-0 z-30 grid grid-cols-5 border-t border-border bg-surface pb-safe", className)}>{items.map((item, index) => <NavLink key={item.href} end to={item.href} className={({ isActive }) => cn("flex min-h-16 flex-col items-center justify-center gap-1 text-xs", isActive && "font-bold bg-primary/10", index === 2 && "text-primary")}><span aria-hidden="true">{item.icon}</span>{item.label}</NavLink>)}</nav>;
}
