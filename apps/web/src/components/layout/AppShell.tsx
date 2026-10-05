import type { ReactNode } from "react";
import type { NavItem } from "@/types/ui";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Responsive shell; callers own navigation and authenticated data. */
export function AppShell({ children, items, groupSwitcher, search, userMenu, className }: { children: ReactNode; items: NavItem[]; groupSwitcher?: ReactNode; search?: ReactNode; userMenu?: ReactNode; className?: string }) {
 return <div className={cn("min-h-screen bg-background", className)}><a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-surface focus:p-4">{uiStrings.skipContent}</a><Sidebar items={items} groupSwitcher={groupSwitcher} /><div className="md:ml-64"><TopBar search={search} userMenu={userMenu} /><main id="main-content" tabIndex={-1} className="pb-24 md:pb-0 min-w-0">{children}</main></div><BottomNav items={items} /></div>;
}
