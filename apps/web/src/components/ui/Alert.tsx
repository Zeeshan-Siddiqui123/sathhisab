import { CircleAlert, CircleCheck, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
/** Inline feedback with text and icon, never color alone. */
export function Alert({ tone = "info", title, children, className }: { tone?: "info" | "success" | "warning" | "danger"; title: string; children?: ReactNode; className?: string }) {
 const Icon = tone === "success" ? CircleCheck : tone === "info" ? Info : CircleAlert;
 return <div role={tone === "danger" ? "alert" : "status"} className={cn("flex gap-3 rounded-input border p-4", { info: "border-primary/30 bg-primary/10", success: "border-success/30 bg-success/10", warning: "border-warning/30 bg-warning/10", danger: "border-danger/30 bg-danger/10" }[tone], className)}><Icon size={20} className="shrink-0" aria-hidden="true" /><div className="min-w-0"><p className="font-medium">{title}</p>{children}</div></div>;
}
