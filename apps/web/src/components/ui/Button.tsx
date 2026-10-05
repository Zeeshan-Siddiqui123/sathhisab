import { Button as HeroButton, type ButtonProps as HeroButtonProps } from "@heroui/react";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
export interface ButtonProps extends Omit<HeroButtonProps, "variant" | "ref"> {
    variant?: "primary" | "secondary" | "ghost" | "danger" | "soft";
    leftIcon?: ReactNode; rightIcon?: ReactNode;
}
const variants = { primary: { color: "primary", variant: "solid" }, secondary: { color: "secondary", variant: "bordered" }, ghost: { color: "default", variant: "light" }, danger: { color: "danger", variant: "solid" }, soft: { color: "primary", variant: "flat" } } as const;
/** <Button variant="primary" onPress={save}>Save</Button> */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = "primary", leftIcon, rightIcon, className, ...props }, ref) {
    return <HeroButton ref={ref} type="button" {...variants[variant]} startContent={leftIcon} endContent={rightIcon} {...props} className={cn("min-h-11 rounded-input font-medium", className)} />;
});
