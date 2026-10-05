import { Button } from "@/components/ui/Button";
import { ConfirmDialog, type ConfirmDialogProps } from "@/components/ui/ConfirmDialog";
import { useDisclosureState } from "@/hooks/useDisclosureState";
/** Pair an action with an async confirmation. */
export function ConfirmActionButton({ label, className, ...props }: Omit<ConfirmDialogProps, "isOpen" | "onOpenChange"> & { label: string }) {
 const state = useDisclosureState();
 return <><Button className={className} variant={props.danger ? "danger" : "secondary"} onPress={state.open}>{label}</Button><ConfirmDialog {...props} isOpen={state.isOpen} onOpenChange={state.onOpenChange} /></>;
}
