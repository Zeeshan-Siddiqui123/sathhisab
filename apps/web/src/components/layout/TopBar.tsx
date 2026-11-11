import type { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import type { NavItem } from "@/types/ui";
import { cn } from "@/lib/cn";
import { strings } from "@/lib/strings";

/** Responsive app header with primary navigation on desktop. */
export function TopBar({
  items,
  groupSwitcher,
  search,
  userMenu,
  className,
}: {
  items: NavItem[];
  groupSwitcher?: ReactNode;
  search?: ReactNode;
  userMenu?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex min-h-16 items-center gap-3 border-b border-[#ECEDEF] bg-white px-4 text-[#0F0F10] sm:px-6 lg:px-8",
        className
      )}
    >
      <Link
        to="/"
        className="flex shrink-0 items-center gap-2 rounded-full font-display text-sm font-semibold tracking-tight sm:text-base"
      >
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0B0B0B] text-sm text-white"
        >
          S
        </span>
        <span>{strings.app.name}</span>
      </Link>

      <nav
        aria-label="Main navigation"
        className="hidden min-w-0 items-center gap-1 md:flex"
      >
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end
            className={({ isActive }) =>
              cn(
                "inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#0B0B0B] text-white"
                  : "text-[#71757D] hover:bg-[#F4F5F7] hover:text-[#0F0F10]"
              )
            }
          >
            <span aria-hidden="true" className="shrink-0">
              {item.icon}
            </span>
            <span className="hidden lg:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="ml-auto flex min-w-0 items-center justify-end gap-2">
        {groupSwitcher ? (
          <div className="hidden max-w-52 xl:block">{groupSwitcher}</div>
        ) : null}
        {search ? <div className="hidden max-w-sm flex-1 md:block">{search}</div> : null}
        {userMenu}
      </div>
    </header>
  );
}
