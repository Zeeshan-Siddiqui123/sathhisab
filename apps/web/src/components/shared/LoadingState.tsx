import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/cn";
import { uiStrings } from "@/lib/uiStrings";
/** Accessible busy state with list, card or page placeholders. */
export function LoadingState({ layout = "list", className }: { layout?: "list" | "card" | "page"; className?: string }) {
 return <div role="status" aria-label={uiStrings.loading} aria-busy="true" className={cn("space-y-4", className)}>{layout === "page" ? <Skeleton className="w-1/2 h-8" /> : null}{[0,1,2].map(i => <Skeleton key={i} variant={layout === "list" ? "line" : "card"} />)}</div>;
}
