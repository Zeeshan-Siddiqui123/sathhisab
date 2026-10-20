import { NavLink } from "react-router-dom";
import type { NavItem } from "@/types/ui";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";

/**
 * Mobile floating bottom navigation:
 * - Floating rounded bar with margin-bottom
 * - Raised center '+' button floats slightly above the navigation bar
 * - All other items: icon on top, text label below
 */
const isAdd = (item: NavItem) => item.label.toLowerCase() === "add";

export function BottomNav({ items, className }: { items: NavItem[]; className?: string }) {
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
          "pointer-events-auto relative grid w-full max-w-md items-center bg-nm-bg/95 backdrop-blur-md",
          "rounded-[28px] border border-border-soft shadow-[var(--nm-raised-lg)]",
          "px-1.5 py-1.5",
          className
        )}
      >
        {visible.map((item) => {
          if (isAdd(item)) {
            return (
              <div key={item.href} className="flex h-full min-h-[44px] items-center justify-center">
                <NavLink
                  to={item.href}
                  aria-label="Add expense"
                  className={({ isActive }) =>
                    cn(
                      "relative -top-3 flex h-14 w-14 items-center justify-center rounded-full",
                      "bg-primary text-primary-foreground shadow-[var(--nm-raised-md)] ring-4 ring-nm-bg",
                      "active:scale-95 active:shadow-[var(--nm-pressed)]",
                      "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary",
                      isActive && "ring-primary/30"
                    )
                  }
                >
                  <span className="flex items-center justify-center text-primary-foreground" aria-hidden="true">
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
                  "flex min-w-0 flex-col items-center justify-center gap-0.5",
                  "py-1 px-0.5 rounded-2xl min-h-[44px]",
                  "text-[9px] sm:text-[10px] font-medium transition-all duration-150",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted hover:text-foreground active:scale-95"
                )
              }
            >
              <span className="shrink-0 flex items-center justify-center" aria-hidden="true">
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