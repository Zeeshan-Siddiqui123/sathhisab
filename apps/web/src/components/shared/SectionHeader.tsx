import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Section title with an optional navigation link. */
export function SectionHeader({ title, href, action, className }: { title: string; href?: string; action?: ReactNode; className?: string }) {
 return <header className={cn("flex flex-wrap items-center justify-between gap-3 mb-4", className)}><Heading level={2}>{title}</Heading>{href ? <Link to={href} className="underline text-sm">{uiStrings.viewAll}</Link> : action}</header>;
}
