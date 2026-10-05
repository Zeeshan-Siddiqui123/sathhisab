import { forwardRef } from "react";
import { Button, type ButtonProps } from "./Button";
/** Icon-only controls always require an accessible name. */
export const IconButton = forwardRef<HTMLButtonElement, ButtonProps & { "aria-label": string }>(function IconButton(props, ref) {
 return <Button ref={ref} variant="ghost" {...props} isIconOnly />;
});
