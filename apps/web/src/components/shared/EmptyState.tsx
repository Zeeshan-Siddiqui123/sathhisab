import { Inbox } from "lucide-react";
import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
/** First-use or empty collection state with an optional action. */
export function EmptyState({ title, description, icon = <Inbox aria-hidden="true" />, action, className }: { title: string; description?: string; icon?: ReactNode; action?: ReactNode; className?: string }) {
 return <div className={cn("flex flex-col items-center gap-3 p-8 text-center", className)}><div className="p-4 rounded-full bg-primary/10 text-primary">{icon}</div><Heading level={3}>{title}</Heading>{description ? <Text muted size="sm">{description}</Text> : null}{action}</div>;
}
