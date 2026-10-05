import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ModalHeader } from "@/components/ui/ModalHeader";
import { ModalBody } from "@/components/ui/ModalBody";
import { Alert } from "@/components/ui/Alert";
import { uiStrings } from "@/lib/uiStrings";
/** Receipt viewer with a recoverable broken-image state. */
export function ImagePreviewModal({ src, isOpen, onOpenChange, className }: { src: string; isOpen: boolean; onOpenChange: (open: boolean) => void; className?: string }) {
 const [failedSrc, setFailedSrc] = useState<string | null>(null);
 return <Modal className={className} isOpen={isOpen} onOpenChange={onOpenChange} size="3xl"><ModalHeader>{uiStrings.preview}</ModalHeader><ModalBody>{failedSrc === src ? <Alert tone="danger" title={uiStrings.imageError} /> : <img src={src} alt={uiStrings.preview} onError={() => setFailedSrc(src)} className="w-full max-h-screen object-contain pb-6" />}</ModalBody></Modal>;
}
