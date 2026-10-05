import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
/** Route heading with optional breadcrumbs and action. */
export function PageHeader({ title, subtitle, breadcrumbs = [], action, className }: { title: string; subtitle?: string; breadcrumbs?: { label: string; href: string }[]; action?: ReactNode; className?: string }) {
 return <header className={cn("flex flex-wrap items-end justify-between gap-4 mb-8", className)}><div className="min-w-0 space-y-2">{breadcrumbs.length ? <nav aria-label="Breadcrumb"><ol className="flex flex-wrap gap-2 text-sm text-muted">{breadcrumbs.map(b => <li key={b.href}><Link to={b.href} className="underline">{b.label}</Link></li>)}</ol></nav> : null}<Heading level={1}>{title}</Heading>{subtitle ? <Text muted>{subtitle}</Text> : null}</div>{action}</header>;
}
