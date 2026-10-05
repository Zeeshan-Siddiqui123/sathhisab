import { ToastProvider as Base, addToast } from "@heroui/react";
import { uiStrings } from "@/lib/uiStrings";
/** Mount once beside the application; notices use the accessible HeroUI live region. */
export function Toast() { return <Base placement="bottom-right" toastOffset={80} />; }
/** Call after user actions: toast.success("Saved"). */
export function useToast() {
 return {
  success: (description: string) => addToast({ title: uiStrings.success, description, color: "success" }),
  error: (description: string) => addToast({ title: uiStrings.error, description, color: "danger" }),
  info: (description: string) => addToast({ title: uiStrings.info, description, color: "primary" }),
 };
}
