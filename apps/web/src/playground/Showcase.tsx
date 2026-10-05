import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { CardBody } from "@/components/ui/CardBody";
import { Heading } from "@/components/ui/Heading";
/** Isolated, labeled component example. */
export function Showcase({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
 return <Card className={className}><CardHeader><Heading level={3}>{title}</Heading></CardHeader><CardBody>{children}</CardBody></Card>;
}
