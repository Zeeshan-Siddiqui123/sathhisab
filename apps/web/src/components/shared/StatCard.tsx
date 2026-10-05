import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { CardBody } from "@/components/ui/CardBody";
import { Text } from "@/components/ui/Text";
/** Labeled metric with optional context or trend. */
export function StatCard({ label, value, icon, hint, className }: { label: string; value: ReactNode; icon?: ReactNode; hint?: string; className?: string }) {
 return <Card className={className}><CardBody><div className="flex items-center justify-between gap-3"><Text muted size="sm">{label}</Text>{icon}</div><div className="text-2xl font-display font-bold">{value}</div>{hint ? <Text size="sm" muted>{hint}</Text> : null}</CardBody></Card>;
}
