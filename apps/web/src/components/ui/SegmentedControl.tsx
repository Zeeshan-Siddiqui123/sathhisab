import { RadioGroup } from "./RadioGroup";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";
/** Compact, arrow-key navigable alternative to a radio group. */
export function SegmentedControl({ className, ...props }: ComponentProps<typeof RadioGroup>) {
 return <RadioGroup orientation="horizontal" {...props} className={cn("rounded-input border border-border p-3 bg-surface", className)} />;
}
