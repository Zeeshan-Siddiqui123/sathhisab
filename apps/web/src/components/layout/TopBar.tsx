import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/cn";
import { strings } from "@/lib/strings";

/** Compact mobile header; desktop supports search and user-menu slots. */
export function TopBar({
  search,
  userMenu,
  className,
}: {
  search?: ReactNode;
  userMenu?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex items-center justify-between gap-3",
        "border-b border-border-soft bg-nm-bg/75 backdrop-blur-xl",
        "px-4 md:px-8 py-4",
        className
      )}
    >
      {/* App name — full on desktop, short on mobile */}
      <span className="font-display font-semibold text-lg tracking-tight md:hidden">
        {strings.app.name}
      </span>

      {/* Desktop search slot */}
      <div className="hidden md:block flex-1 max-w-sm">{search}</div>

      {/* Right side — theme toggle + user menu */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {userMenu}
      </div>
    </header>
  );
}
