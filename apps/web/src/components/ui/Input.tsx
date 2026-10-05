import { Input as HeroInput, type InputProps as HeroInputProps } from "@heroui/react";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";
export interface InputProps extends HeroInputProps { helper?: string; error?: string }
/** Labeled input; pass error from the form resolver. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ helper, error, className, ...props }, ref) {
 return <HeroInput ref={ref} variant="bordered" labelPlacement="outside" description={helper} isInvalid={!!error} errorMessage={error} {...props} className={cn("min-w-0", className)} />;
});
