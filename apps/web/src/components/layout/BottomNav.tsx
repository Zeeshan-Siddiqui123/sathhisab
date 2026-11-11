import { NavLink } from "react-router-dom";
import type { NavItem } from "@/types/ui";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";

/**
 * Mobile navigation keeps the primary add action visually distinct.
 */
const isAdd = (item: NavItem) => item.label.toLowerCase() === "add";

export function BottomNav({
  items,
  className,
}: {
  items: NavItem[];
  className?: string;
}) {
  const visible = items.filter((item) => !item.desktopOnly);

  // Columns follow the real item order: "+" gets a fixed slot, the rest share space equally
  const gridTemplateColumns = visible
    .map((item) => (isAdd(item) ? "4.25rem" : "minmax(0,1fr)"))
    .join(" ");

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
      <nav
        aria-label={uiStrings.primaryNav}
        style={{ gridTemplateColumns }}
        className={cn(
          "pointer-events-auto relative grid w-full max-w-md items-center bg-white",
          "rounded-full border border-[#ECEDEF] shadow-[0_2px_8px_rgba(15,15,16,0.08)]",
          "px-2 py-2",
          className
        )}
      >
        {visible.map((item) => {
          if (isAdd(item)) {
            return (
              <div
                key={item.href}
                className="flex h-full min-h-[44px] items-center justify-center"
              >
                <NavLink
                  to={item.href}
                  aria-label="Add expense"
                  className={({ isActive }) =>
                    cn(
                      "flex h-12 w-12 items-center justify-center rounded-full",
                      "bg-[#C8F23A] text-[#0F0F10] transition-colors hover:bg-[#B6E02A]",
                      "active:scale-95 focus-visible:outline-2 focus-visible:outline-[#0F0F10]",
                      isActive && "ring-2 ring-[#0F0F10]"
                    )
                  }
                >
                  <span
                    className="flex items-center justify-center text-[#0F0F10]"
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                </NavLink>
              </div>
            );
          }

          return (
            <NavLink
              key={item.href}
              end
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex min-h-[44px] min-w-0 flex-col items-center justify-center gap-0.5 rounded-full px-0.5 py-1",
                  "text-[9px] font-medium transition-colors duration-150 sm:text-[10px]",
                  isActive
                    ? "bg-[#0B0B0B] font-semibold text-white"
                    : "text-[#71757D] hover:bg-[#F4F5F7] hover:text-[#0F0F10] active:scale-95"
                )
              }
            >
              <span
                className="shrink-0 flex items-center justify-center"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="leading-tight truncate max-w-[56px] text-center">
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
