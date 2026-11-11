import type { ReactNode } from "react";
import type { NavItem } from "@/types/ui";
import { TopBar } from "./TopBar";
import { BottomNav } from "./BottomNav";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Responsive shell; callers own navigation and authenticated data. */
export function AppShell({
  children,
  items,
  groupSwitcher,
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
        "min-h-screen overflow-x-hidden bg-[#F4F5F7] text-[#0F0F10]",
        className
      )}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:bg-surface focus:p-4"
      >
        {uiStrings.skipContent}
      </a>
      <div className="min-w-0 bg-white md:min-h-screen">
        <TopBar
          items={items}
          groupSwitcher={groupSwitcher}
          search={search}
          userMenu={userMenu}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="min-w-0 bg-[#F4F5F7] pb-28 md:pb-8"
        >
          {children}
        </main>
      </div>
      <BottomNav items={items} />
    </div>
  );
}
