import { Textarea as HeroTextarea, type TextAreaProps } from "@heroui/react";
import { useState } from "react";
import { cn } from "@/lib/cn";
/** Multiline field with an optional live character counter. */
export function Textarea({ counter = false, error, className, ...props }: TextAreaProps & { counter?: boolean; error?: string }) {
 const [text, setText] = useState(String(props.defaultValue ?? ""));
 const value = String(props.value ?? text);
 return <HeroTextarea variant="bordered" labelPlacement="outside" {...props} className={cn("min-w-0", className)} isInvalid={!!error} errorMessage={error} onValueChange={(next) => { setText(next); props.onValueChange?.(next); }} description={counter ? value.length + (props.maxLength ? " / " + props.maxLength : "") : props.description} />;
}
