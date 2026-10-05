import { Drawer as HeroDrawer, DrawerContent, DrawerHeader, DrawerBody, type DrawerProps } from "@heroui/react";
import { cn } from "@/lib/cn";
/** Side panel with a visible, accessible title. */
export function Drawer({ title, children, className, ...props }: DrawerProps & { title: string }) {
 return <HeroDrawer {...props} className={cn("bg-surface text-foreground", className)}><DrawerContent><DrawerHeader>{title}</DrawerHeader><DrawerBody>{children}</DrawerBody></DrawerContent></HeroDrawer>;
}
