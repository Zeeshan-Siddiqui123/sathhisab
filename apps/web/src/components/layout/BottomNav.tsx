import { NavLink } from "react-router-dom";
import type { NavItem } from "@/types/ui";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";

/**
 * Mobile floating bottom navigation matching the exact design reference:
 * - Floating rounded bar with margin-bottom (bottom-3.5)
 * - Raised center '+' circular button sticking up with outer ring
 * - All other items (including Settle) are normal: icon on top, text label below
 */
export function BottomNav({ items, className }: { items: NavItem[]; className?: string }) {
  const visible = items.filter((item) => !item.desktopOnly);

  return (
    <div className="md:hidden fixed inset-x-0 bottom-0 z-20 pointer-events-none flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
      <nav
        aria-label={uiStrings.primaryNav}
        className={cn(
          "pointer-events-auto w-full max-w-md bg-nm-bg/95 backdrop-blur-md",
          "rounded-[28px] border border-border-soft shadow-[var(--nm-raised-lg)]",
          "px-2 py-1.5 flex items-center justify-around",
          className
        )}
      >
        {visible.map((item) => {
          const isAddAction = item.label.toLowerCase() === "add";

          if (isAddAction) {
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "relative -top-4 flex items-center justify-center",
                    "h-14 w-14 rounded-full shrink-0",
                    "bg-primary text-white shadow-[var(--nm-raised-md)]",
                    "ring-4 ring-nm-bg",
                    "active:scale-95 active:shadow-[var(--nm-pressed)]",
                    "transition-all duration-150 focus-visible:outline-2 focus-visible:outline-primary",
                    isActive && "ring-primary/30"
                  )
                }
                aria-label={item.label}
              >
                <span className="text-white flex items-center justify-center" aria-hidden="true">
                  {item.icon}
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.href}
              end
              to={item.href}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5",
                  "py-1 px-0.5 rounded-2xl min-h-[44px]",
                  "text-[10px] sm:text-[11px] font-medium transition-all duration-150",
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
