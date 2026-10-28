import type { ReactNode } from "react";
import type { NavItem } from "@/types/ui";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Responsive shell; callers own navigation and authenticated data. */
export function AppShell({
  children,
  items,
  search,
  userMenu,
  className,
}: {
  children: ReactNode;
  items: NavItem[];
  groupSwitcher?: ReactNode;
  search?: ReactNode;
  userMenu?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-transparent text-foreground overflow-x-hidden",
        className
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-surface focus:p-4"
      >
        {uiStrings.skipContent}
      </a>
      <Sidebar items={items}  />
      <div className="min-w-0 md:ml-[15.5rem] md:mr-1 md:my-1 md:min-h-[calc(100vh-0.5rem)] md:rounded-lg md:border md:border-border-soft bg-white shadow-[0_8px_24px_rgba(27,48,36,0.08)]">
        <TopBar search={search} userMenu={userMenu} />
        <main id="main-content" tabIndex={-1} className="min-w-0 bg-white pb-28 md:pb-8">
          {children}
        </main>
      </div>
      <BottomNav items={items} />
    </div>
  );
}
