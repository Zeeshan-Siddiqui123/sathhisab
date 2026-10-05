import type { ReactNode } from "react";
import { Text } from "@/components/ui/Text";
import { cn } from "@/lib/cn";
/** Related form controls with a semantic legend. */
export function FormSection({ title, description, children, className }: { title: string; description?: string; children: ReactNode; className?: string }) { return <fieldset className={cn("space-y-4 min-w-0", className)}><legend className="text-lg font-semibold font-display mb-2">{title}</legend>{description ? <Text muted size="sm">{description}</Text> : null}{children}</fieldset>; }
