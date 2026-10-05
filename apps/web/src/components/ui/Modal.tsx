import { Modal as HeroModal, ModalContent, type ModalProps } from "@heroui/react";
import { cn } from "@/lib/cn";
/** Modal children compose ModalHeader/Body/Footer; mobile presentation is a bottom sheet. */
export function Modal({ children, className, ...props }: ModalProps) {
 return <HeroModal placement="bottom-center" scrollBehavior="inside" {...props} classNames={{ wrapper: "items-end sm:items-center", base: "m-0 sm:m-4 w-full rounded-b-none sm:rounded-b-modal", ...props.classNames }} className={cn("bg-surface text-foreground rounded-t-modal sm:rounded-modal", className)}><ModalContent>{children}</ModalContent></HeroModal>;
}
