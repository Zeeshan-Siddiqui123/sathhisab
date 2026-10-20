import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import type { NavItem } from "@/types/ui";
import { strings } from "@/lib/strings";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/cn";
/** Desktop navigation and group-switcher slot. */
export function Sidebar({ items, groupSwitcher, className }: { items: NavItem[]; groupSwitcher?: ReactNode; className?: string }) {
    return (
        <aside className={cn("hidden md:flex md:fixed md:inset-y-0 w-64 flex-col gap-8 border-r border-border-soft bg-nm-bg/85 p-5 backdrop-blur-xl", className)}>
            <NavLink to="/" className="flex items-center gap-3 rounded-2xl px-1 py-2 font-display text-xl font-bold tracking-tight">
                <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--nm-raised-sm)]">S</span>
                {strings.app.name}
            </NavLink>
            {groupSwitcher}
            <nav aria-label={uiStrings.primaryNav} className="space-y-1.5">
                {items.map(item => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 min-h-12 rounded-2xl px-3.5 py-3 text-sm font-medium transition-colors",
                            isActive
                                ? "bg-primary text-primary-foreground shadow-[var(--nm-raised-sm)]"
                                : "text-muted hover:bg-primary/5 hover:text-foreground"
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
