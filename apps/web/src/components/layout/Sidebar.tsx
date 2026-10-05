import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import type { NavItem } from "@/types/ui";
import { strings } from "@/lib/strings";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/cn";
/** Desktop navigation and group-switcher slot. */
export function Sidebar({ items, groupSwitcher, className }: { items: NavItem[]; groupSwitcher?: ReactNode; className?: string }) {
    return <aside className={cn("hidden md:flex md:fixed md:inset-y-0 w-64 flex-col gap-8 border-r border-border bg-surface p-6", className)}><NavLink to="/" className="font-display text-2xl font-bold">{strings.app.name}</NavLink>{groupSwitcher}<nav aria-label={uiStrings.primaryNav} className="space-y-2">{items.map(item => <NavLink key={item.href} to={item.href} end className={({ isActive }) => cn("flex items-center gap-3 min-h-11 rounded-input px-3 py-3 text-sm", isActive ? "bg-primary/10 font-semibold" : "text-muted hover:bg-default-100")}>{item.icon}{item.label}</NavLink>)}</nav></aside>;
}
