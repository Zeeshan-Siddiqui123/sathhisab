import type { ReactNode } from "react";
import { formatRelativeTime, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/cn";
/** Activity row receives its localized sentence from the feature. */
export function ActivityItem({ icon, children, date, className }: { icon: ReactNode; children: ReactNode; date: string; className?: string }) { return <div className={cn("flex gap-3 py-4", className)}><span className="p-3 rounded-full bg-primary/10 self-start" aria-hidden="true">{icon}</span><div className="space-y-1"><p>{children}</p><time dateTime={date} title={formatDateTime(date)} className="text-sm text-muted">{formatRelativeTime(date)}</time></div></div>; }
