import { NavLink } from "react-router-dom";
import type { NavItem } from "@/types/ui";
import { strings } from "@/lib/strings";
import { uiStrings } from "@/lib/uiStrings";
import { cn } from "@/lib/cn";
/** Desktop navigation and group-switcher slot. */
export function Sidebar({ items, className }: { items: NavItem[]; className?: string }) {
  return (
    <aside
      className={cn(
        "hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-60 flex-col gap-8 border-r border-[#ECEDEF] bg-white p-5 text-[#0F0F10]",
        className
      )}
    >
      <NavLink
        to="/"
        className="flex items-center gap-3 rounded-2xl px-1 py-2 font-display text-xl font-bold tracking-tight"
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0B0B0B] text-white"
        >
          S
        </span>
        {strings.app.name}
      </NavLink>

      <nav aria-label={uiStrings.primaryNav} className="space-y-1.5">
        {items.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end
            className={({ isActive }) =>
              cn(
                "flex min-h-12 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-colors duration-150",
                isActive
                  ? "bg-[#0B0B0B] text-white"
                  : "text-[#71757D] hover:bg-[#F4F5F7] hover:text-[#0F0F10]"
              )
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
