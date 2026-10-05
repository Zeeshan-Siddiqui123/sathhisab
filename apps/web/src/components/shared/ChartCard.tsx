import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { CardHeader } from "@/components/ui/CardHeader";
import { CardBody } from "@/components/ui/CardBody";
import { Heading } from "@/components/ui/Heading";
import { EmptyState } from "./EmptyState";
import { uiStrings } from "@/lib/uiStrings";
/** Chart container with an explicit empty state. */
export function ChartCard({ title, empty = false, children, className }: { title: string; empty?: boolean; children?: ReactNode; className?: string }) { return <Card className={className}><CardHeader><Heading level={3}>{title}</Heading></CardHeader><CardBody>{empty ? <EmptyState title={uiStrings.noChart} /> : children}</CardBody></Card>; }
