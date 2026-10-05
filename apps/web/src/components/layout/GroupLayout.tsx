import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import type { GroupOption, Loadable } from "@/types/ui";
import { GroupRoute } from "./GroupRoute";
import { PageContainer } from "./PageContainer";
import { Heading } from "@/components/ui/Heading";
import { cn } from "@/lib/cn";
/** Group boundary plus sub-navigation; Phase 2 supplies the loaded group. */
export function GroupLayout({ group, links, children, className }: { group: Loadable<GroupOption | null>; links: { label: string; href: string }[]; children: ReactNode; className?: string }) {
 return <GroupRoute group={group}><PageContainer className={className}><Heading>{group.status === "ready" ? group.data?.name : ""}</Heading><nav className="flex flex-wrap gap-3 py-4">{links.map(link => <NavLink key={link.href} to={link.href} end className={({ isActive }) => cn("min-h-11 flex items-center px-3 rounded-input", isActive && "bg-primary/10")}>{link.label}</NavLink>)}</nav>{children}</PageContainer></GroupRoute>;
}
