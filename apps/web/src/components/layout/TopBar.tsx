import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/cn";
import { strings } from "@/lib/strings";
/** Compact mobile header; desktop supports search and user-menu slots. */
export function TopBar({ search, userMenu, className }: { search?: ReactNode; userMenu?: ReactNode; className?: string }) {
 return <header className={cn("flex items-center justify-between gap-3 border-b border-border bg-surface px-4 md:px-8 py-3", className)}><span className="font-display font-semibold md:hidden">{strings.app.name}</span><div className="hidden md:block flex-1 max-w-sm">{search}</div><div className="flex items-center gap-2"><ThemeToggle />{userMenu}</div></header>;
}
