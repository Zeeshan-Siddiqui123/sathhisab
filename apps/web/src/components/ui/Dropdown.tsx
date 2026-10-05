import { Dropdown as HeroDropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import type { ReactElement } from "react";
import { cn } from "@/lib/cn";
export interface MenuAction { key: string; label: string; danger?: boolean; disabled?: boolean; onAction: () => void }
/** Keyboard-accessible action menu; trigger must forward its ref (Button does). */
export function Dropdown({ trigger, actions, label, className }: { trigger: ReactElement; actions: MenuAction[]; label: string; className?: string }) {
 return <HeroDropdown className={cn("bg-surface text-foreground", className)}><DropdownTrigger>{trigger}</DropdownTrigger><DropdownMenu aria-label={label} disabledKeys={actions.filter(a => a.disabled).map(a => a.key)} onAction={key => actions.find(a => a.key === key)?.onAction()}>
 {actions.map(a => <DropdownItem key={a.key} color={a.danger ? "danger" : "default"}>{a.label}</DropdownItem>)}
 </DropdownMenu></HeroDropdown>;
}
