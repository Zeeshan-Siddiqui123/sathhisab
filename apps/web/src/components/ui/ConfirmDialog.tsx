import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { ModalHeader } from "./ModalHeader";
import { ModalBody } from "./ModalBody";
import { ModalFooter } from "./ModalFooter";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { uiStrings } from "@/lib/uiStrings";
export interface ConfirmDialogProps { isOpen: boolean; onOpenChange: (open: boolean) => void; title: string; message: string; confirmLabel?: string; danger?: boolean; onConfirm: () => void | Promise<void>; className?: string }
/** Keeps failures visible and blocks duplicate async confirmations. */
export function ConfirmDialog({ isOpen, onOpenChange, title, message, confirmLabel = uiStrings.confirm, danger, onConfirm, className }: ConfirmDialogProps) {
 const lock = useRef(false);
 const [pending, setPending] = useState(false);
 const [error, setError] = useState("");
 const confirm = async () => {
  if (lock.current) return;
  lock.current = true; setPending(true); setError("");
  try { await onConfirm(); onOpenChange(false); } catch (error) { setError(error instanceof Error ? error.message : uiStrings.actionFailed); }
  finally { lock.current = false; setPending(false); }
 };
 return <Modal isOpen={isOpen} onOpenChange={open => { if (!pending) { setError(""); onOpenChange(open); } }} isDismissable={!pending} isKeyboardDismissDisabled={pending} hideCloseButton={pending} className={className}>
 <ModalHeader>{title}</ModalHeader><ModalBody><p>{message}</p>{error ? <Alert tone="danger" title={error} /> : null}</ModalBody>
 <ModalFooter><Button variant="ghost" isDisabled={pending} onPress={() => onOpenChange(false)}>{uiStrings.cancel}</Button><Button variant={danger ? "danger" : "primary"} isLoading={pending} onPress={() => void confirm()}>{confirmLabel}</Button></ModalFooter></Modal>;
}
