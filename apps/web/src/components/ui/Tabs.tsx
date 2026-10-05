import { Tabs as HeroTabs, Tab } from "@heroui/react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
/** Controlled or uncontrolled tabbed content with keyboard navigation. */
export function Tabs({ items, label, value, onValueChange, className }: { items: { key: string; label: string; content: ReactNode }[]; label: string; value?: string; onValueChange?: (key: string) => void; className?: string }) {
 return <HeroTabs aria-label={label} selectedKey={value} onSelectionChange={key => onValueChange?.(String(key))} className={cn("max-w-full", className)}>{items.map(item => <Tab key={item.key} title={item.label}>{item.content}</Tab>)}</HeroTabs>;
}
