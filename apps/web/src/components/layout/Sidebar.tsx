import { NavLink } from "react-router-dom";
import type { NavItem } from "@/types/ui";
import { strings } from "@/lib/strings";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/cn";
/** Desktop navigation and group-switcher slot. */
export function Sidebar({ items, className }: { items: NavItem[]; className?: string }) {
    return (
        <aside className={cn("hidden md:flex md:fixed md:inset-y-1 md:left-1 md:w-60 flex-col gap-8 rounded-lg border border-white/15 bg-primary p-5 text-white shadow-[0_12px_28px_rgba(27,48,36,0.18)]", className)}>
            <NavLink to="/" className="flex items-center gap-3 rounded-2xl px-1 py-2 font-display text-xl font-bold tracking-tight">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-[var(--nm-raised-sm)]">S</span>
                {strings.app.name}
            </NavLink>
         
            <nav aria-label={uiStrings.primaryNav} className="space-y-1.5">
                {items.map(item => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 min-h-12 rounded-xl px-3.5 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-0.5",
                            isActive
                                ? "bg-white text-primary shadow-md"
                                : "text-white/85 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        {item.icon}
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
}
