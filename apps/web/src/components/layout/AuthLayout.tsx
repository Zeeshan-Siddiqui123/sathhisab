import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
import { strings } from "@/lib/strings";
import { uiStrings } from "@/lib/uiStrings";
/** Branded auth composition; contains no session or submit logic. */
export function AuthLayout({ children, title, className }: { children: ReactNode; title: string; className?: string }) {
 return <div className={cn("grid md:grid-cols-2 gap-8 items-center rounded-card bg-primary/5 p-6 md:p-8", className)}><div className="space-y-4"><Text muted>{strings.app.name}</Text><Heading>{uiStrings.authDescription}</Heading></div><Card><CardBody><Heading level={3}>{title}</Heading>{children}</CardBody></Card></div>;
}
