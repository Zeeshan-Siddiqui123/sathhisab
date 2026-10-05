import { HeroUIProvider } from "@heroui/react";
import type { PropsWithChildren } from "react";
import { Toast } from "./Toast";

/** App-level HeroUI boundary: wrap the application once. */
export function UIProvider({ children }: PropsWithChildren) {
  return <HeroUIProvider><Toast />{children}</HeroUIProvider>;
}
