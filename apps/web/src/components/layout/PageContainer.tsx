import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";
/** Bounded page or form content with responsive gutters. */
export function PageContainer({ form = false, className, ...props }: HTMLAttributes<HTMLDivElement> & { form?: boolean }) { return <div {...props} className={cn("mx-auto w-full p-4 md:p-6 lg:p-8", form ? "max-w-form" : "max-w-page", className)} />; }
