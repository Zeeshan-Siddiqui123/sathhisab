import { useState } from "react";
/** Controlled overlay state for a trigger and dialog. */
export function useDisclosureState(initial = false) {
 const [isOpen, setOpen] = useState(initial);
 return { isOpen, onOpenChange: setOpen, open: () => setOpen(true), close: () => setOpen(false) };
}
