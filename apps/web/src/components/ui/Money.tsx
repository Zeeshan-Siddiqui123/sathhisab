import { formatPKR } from "@/lib/money";
import { cn } from "@/lib/cn";
/** Integer paisa formatted only at the UI boundary. */
export function Money({ amount, tone = "neutral", size = "md", className }: { amount: number | bigint; tone?: "positive" | "negative" | "neutral"; size?: "sm" | "md" | "lg" | "hero"; className?: string }) {
 return <span className={cn("font-display font-bold tabular-nums", { positive: "text-success", negative: "text-danger", neutral: "text-foreground" }[tone], { sm: "text-sm", md: "text-base", lg: "text-2xl", hero: "text-4xl" }[size], className)}>{formatPKR(amount)}</span>;
}
